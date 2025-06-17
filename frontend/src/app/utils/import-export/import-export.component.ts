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

  importedData: boolean = false;
  exportedData: boolean = false;
  boards: any[] = [];
  boardsLength: any;
  newBoardId: string = '';
  chosenBoardIdsForExport: any[] = [];

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



  importBoardData() {
    // this.myForm.patchValue({
    //   textAreaBoardInfo: this.myForm.value.textAreaBoardInfo,
    //   textAreaStickyNotesByBoardId: this.myForm.value.textAreaStickyNotesByBoardId,
    // });
    try {
      const boardInfo = JSON.parse(this.myForm.value.textAreaBoardInfo || '{}');
      const importedStickyNotes = JSON.parse(this.myForm.value.textAreaStickyNotesByBoardId || '{}');
      console.log('Parsed board info:', boardInfo);
      console.log('Parsed sticky notes:', importedStickyNotes);

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
        console.log('Sticky notes saved successfully:', savedStickyNote);
      },
      error: (err) => {
        console.error('Error saving sticky note:', err);
      }
    });
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
