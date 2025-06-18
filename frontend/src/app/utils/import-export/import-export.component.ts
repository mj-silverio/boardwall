import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { BackupService } from '../../services/backup.service';
import { BoardDisplayComponent } from '../../components/presentation/main-menu/board-display/board-display.component';
import { BoardService } from '../../services/board.service';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { Constants } from '../../../environments/app.constants';
import { CustomZonedDateTimeUtil } from '../../utils/CustomZonedDateTime.util';

@Component({
  selector: 'app-import-export',
  standalone: true,
  imports: [CommonModule, BoardDisplayComponent, FormsModule, ReactiveFormsModule],
  templateUrl: './import-export.component.html',
  styleUrl: './import-export.component.css'
})
export class ImportExportComponent {

  boards: any[] = [];
  boardsLength: any;
  newBoardId: string = '';
  chosenBoardIdsForExport: any[] = [];
  isSelectedZip: boolean = false;
  selectedZipFileName: string = '';
  zipFile: File | null = null;

  myForm = new FormGroup({
    textAreaBoardInfo: new FormControl(''),
    textAreaStickyNotesByBoardId: new FormControl(''),
  });

  constructor(private backupService: BackupService,
    private boardService: BoardService,
  ) { }

  ngOnInit(): void {
    this.boardService.getBoards().subscribe(boards => {
      this.boards = boards.sort((a, b) => a.name.localeCompare(b.name));
      // console.log(this.boards);
      this.boardsLength = this.boards.length;
    });
  }

  onFileSelected(event: Event) {
    console.log('File selected:', event);
  }

  chosenBoard(event: any) {
    let boardId = event;
    // console.log(boardId);
    this.chosenBoardIdsForExport.push(boardId);
  }

  updateBoardId(event: any) {
    console.log('event', event);
  }

  getMyStickyNotesByBoardId(boardId: string): any {
    this.backupService.getStickyNotesByBoardId(boardId).subscribe({
      next: (data) => {
        console.log('Sticky notes data:', data);
        return data;
      },
      error: (err) => {
        console.error('Error fetching sticky notes:', err);
      }
    });
  }



  importBoardData(option: string) {
    let boardInfo = null;
    let importedStickyNotes = null;
    try {
      if (option === 'manual') {
        console.log('Importing board data manually...');
        boardInfo = JSON.parse(this.myForm.value.textAreaBoardInfo || '{}');
        importedStickyNotes = JSON.parse(this.myForm.value.textAreaStickyNotesByBoardId || '{}');
      } else if (option === 'program') {
        console.log('Importing board data from local storage...');
        // Retrieve data from local storage
        boardInfo = JSON.parse(localStorage.getItem('importedBoardInfo'));
        importedStickyNotes = JSON.parse(localStorage.getItem('importedStickyNotes'));
      }

      console.log('Parsed board info:', `here: ${boardInfo}`);
      console.log('Parsed sticky notes:', importedStickyNotes);

      this.myForm.setValue({
        textAreaBoardInfo: this.myForm.value.textAreaBoardInfo,
        textAreaStickyNotesByBoardId: this.myForm.value.textAreaStickyNotesByBoardId,
      });

      this.backupService.importNewBoard(boardInfo).subscribe({
        next: (createdBoard) => {
          console.log('Board saved successfully:', createdBoard);
          console.log('Created board ID:', createdBoard.id);
          this.newBoardId = createdBoard.id;
          this.importStickyNotesData(createdBoard.id, importedStickyNotes);

        },
        error: (err) => {
          console.error('Error saving board:', err);
        }
      });
    } catch (error) {
      console.error('Error parsing board info JSON:', error);
    }
  }

  importStickyNotesData(createdBoardId, importedStickyNotes) {
    this.backupService.importNewStickyNotesByBoardId(createdBoardId, importedStickyNotes).subscribe({
      next: (savedStickyNote) => {
        console.log('Sticky note saved successfully:', savedStickyNote);
      },
      error: (err) => {
        console.error('Error saving sticky note:', err);
      }
    });
  }


  onZipFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) {
      console.error('No file selected.');
      return;
    }
    const file = input.files[0];
    this.zipFile = file as File; // Cast to File
    this.selectedZipFileName = file.name;
    console.log('Selected file:', this.selectedZipFileName);
    this.isSelectedZip = true;
  }

  importZipFile() {
    console.log('Importing zip file:', this.selectedZipFileName);
    if (!this.zipFile) {
      console.error('No zip file selected.');
      return;
    } else {
      console.log('Zip file is selected:', this.zipFile.name);
    }
    const reader = new FileReader();
    reader.onload = async (e: any) => {
      try {
        const jszip = new JSZip();
        const zip = await jszip.loadAsync(e.target.result);

        // Find files in the mother zip
        let subZipFiles: { name: string, file: JSZip.JSZipObject }[] = [];
        zip.forEach((relativePath, zipEntry) => {
          if (relativePath.endsWith('.zip')) {
            subZipFiles.push({ name: relativePath, file: zipEntry });
            console.log('Found zip inside zip:', relativePath);
          }
        });
        if (subZipFiles.length === 0) {
          console.error('No zip files found inside the selected zip file.');
          return;
        }
        console.log('Sub zip files found:', subZipFiles.map(f => f.name));

        // Process each sub zip file
        let boardInfoJson = '';
        let stickyNotesJson = '';
        for (const subZipFile of subZipFiles) {
          console.log('Processing sub zip file:', subZipFile.name);
          let jsoncounter = 0;
          let zipcounter = 0;
          const subZipContent = await subZipFile.file.async('arraybuffer');
          const subZip = await jszip.loadAsync(subZipContent);

          try {
            subZip.forEach((relativePath, zipEntry) => {
              // console.log('Processing sub zip file:', subZipFile.name);
              if (relativePath.endsWith('.json')) {
                console.log('Processing file:', relativePath);

                if (relativePath.endsWith('_info.json')) {
                  // console.log('Processing file:', relativePath);
                  boardInfoJson = relativePath;
                  console.log('Processing info JSON:', boardInfoJson);
                  zipEntry.async('string').then((infoFileContents) => {
                    console.log('Board info file contents:', infoFileContents);
                    localStorage.setItem('importedBoardInfo', infoFileContents);
                  });
                }
                if (relativePath.endsWith('_stickynotes.json')) {
                  // console.log('Processing file:', relativePath);
                  stickyNotesJson = relativePath;
                  console.log('Processing sticky notes JSON:', stickyNotesJson);
                  zipEntry.async('string').then((stickyNotesContents) => {
                    // console.log('Sticky notes file contents:', stickyNotesContents);
                    localStorage.setItem('importedStickyNotes', stickyNotesContents);
                  });
                }

                jsoncounter++;
                console.log('JSON counter: ', jsoncounter);


              }
              if (relativePath.endsWith('.zip')) {
                zipcounter++;
                console.log('Zip counter: ', zipcounter);
              }
            });
          } catch (error) {
            console.error('Error processing sub zip file:', error);
          } finally {
            if (jsoncounter % 2 === 0) {
              console.log('Importing board data...');
              // console.log("Here3a:", localStorage.getItem('importedBoardInfo'));
              // console.log("Here3b:", localStorage.getItem('importedStickyNotes'));
              this.importBoardData('program');
            }
          }

        }

      } catch (error) {
        console.error('Error importing zip file:', error);
      } finally {
        localStorage.removeItem('importedBoardInfo');
        localStorage.removeItem('importedStickyNotes');
        this.isSelectedZip = false;
      }
    };
    reader.readAsArrayBuffer(this.zipFile);
  }


  exportData() {
    // const currentDateTime = new Date().toISOString().split('.')[0].replace(/[:]/g, '-');
    const currentDateTime = CustomZonedDateTimeUtil.nowInZone(Constants.TIME_ZONE).split('.')[0].replace(/[:]/g, '-');
    let zipfiles = [];

    const zipPromises = this.chosenBoardIdsForExport.map((boardId) => {
      return new Promise<void>((resolve, reject) => {
        this.boardService.getBoardById(boardId).subscribe({
          next: (board) => {
            const zip = new JSZip();
            const boardFileName = `${board.name}_${currentDateTime}_info.json`;
            zip.file(boardFileName, JSON.stringify(board, null, 2));


            this.backupService.getStickyNotesByBoardId(boardId).subscribe({
              next: (stickyNotes) => {
                const stickyNotesFileName = `${board.name}_${currentDateTime}_stickynotes.json`;
                zip.file(stickyNotesFileName, JSON.stringify(stickyNotes, null, 2));

                zip.generateAsync({ type: 'blob' }).then((content) => {
                  const zipFileName = `board_${board.name}_${currentDateTime}.zip`;
                  zipfiles.push({ name: zipFileName, content: content });
                  resolve();
                }).catch((err) => {
                  console.error(`Error generating zip for board ${boardId}, ${board.name}:`, err);
                });
              },
              error: (err) => {
                console.error(`Error fetching sticky notes for board ${boardId}, ${board.name}:`, err);
              }
            });


          }
        });

      });

    });

    Promise.all(zipPromises).then(() => {
      const allBoardsZip = new JSZip();
      zipfiles.forEach((zipFile) => {
        allBoardsZip.file(zipFile.name, zipFile.content);
      });

      allBoardsZip.generateAsync({ type: 'blob' }).then((content) => {
        const allBoardsZipFileName = `all_boards_${currentDateTime}.zip`;
        saveAs(content, allBoardsZipFileName);
        console.log(`Exported all boards successfully.`);

      }).catch((err) => {
        console.error(`Error generating zip for all boards:`, err);
      });
    }).catch((err) => {
      console.error(`Error exporting boards:`, err);
    });

  }

}
