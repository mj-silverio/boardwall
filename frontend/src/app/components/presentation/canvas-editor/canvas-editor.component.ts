import { Component, OnInit, Renderer2, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdkDrag } from '@angular/cdk/drag-drop';
import { BoardService } from '../../../services/board.service';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IBoard } from '../../../models/board.model';
import { IStickyNote, StickyNote } from '../../../models/sticky-note.model';
import { StickyNoteService } from '../../../services/sticky-note.service';
import { StickyNoteComponent } from "../../core/sticky-note/sticky-note.component";
import { ColorEnum } from '../../../utils/ColorService.util';
import { CustomZonedDateTimeUtil } from '../../../utils/CustomZonedDateTime.util';
import { Constants } from '../../../../environments/app.constants';
import { SizeEnum } from '../../../utils/SizeService.util';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';


@Component({
  selector: 'app-canvas-editor',
  standalone: true,
  imports: [CdkDrag, FormsModule, ReactiveFormsModule, CommonModule, StickyNoteComponent],
  templateUrl: './canvas-editor.component.html',
  styleUrl: './canvas-editor.component.css'
})
export class CanvasEditorComponent implements OnInit {
  @ViewChild('myNote') myNote: any;

  editMode: boolean = true;
  buttonMessage: string = "";

  boards: any[] = [];
  activeBoard: IBoard;
  activeBoardId: string;
  stickyNotes: any[] = [];
  stickyNoteIds: any;
  activeNote: StickyNote;
  activeNoteId: string;
  activeColor: string;
  activeSize: string;

  colors: any;
  sizes: any;
  viewDisabled: boolean = true;

  myForm = new FormGroup({
    textAreaTitle: new FormControl(''),
    textAreaContent: new FormControl(''),
    textAreaColor: new FormControl(''),
    textAreaSize: new FormControl(''),
  });

  constructor(private renderer: Renderer2,
    private boardService: BoardService,
    private stickyNoteService: StickyNoteService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) { }

  editModeFunc() {
    this.editMode = !this.editMode;
  }

  createModeFunc() {
    this.editMode = !this.editMode;
    this.resetValues();
    this.myForm.enable();
  }

  splitStringToList(input: string): string[] {
    return input.split(',').map(item => item.trim());
  }

  ngOnInit() {
    this.myForm.disable();
    this.boardService.getBoards().subscribe((data: any) => {
      this.boards = data;

      this.activatedRoute.queryParams.subscribe((params: { [x: string]: string; }) => {
        let boardId = params["boardId"] || '';
        console.log('boardId: ', boardId)
        this.populateCanvas(data, boardId);
      });
    })

    this.colors = Object.keys(ColorEnum).map(key => ({ key, value: ColorEnum[key] }));
    this.sizes = Object.keys(SizeEnum).map(key => ({ key, value: SizeEnum[key] }));

  }

  routeToBoard(activeBoardId) {
    console.log('here4: ', activeBoardId)
    this.router.navigateByUrl(`/canvas-editor?boardId=${activeBoardId}`);

    this.activatedRoute.queryParams.subscribe((params: { [x: string]: string; }) => {
      let boardId = params["boardId"] || '';
      // console.log('here: ', boardId)
    });

    // this.router.navigate(['canvas-editor'], { 
    //   // queryParams: { category: category, sort: sortBy } 
    //   queryParams: { boardId: boardId} 
    // });
  }

  changeColor(event: any) {
    const selectedColor = event.target.value;
    // console.log("selected color: ", selectedColor);
    this.myForm.patchValue({ textAreaColor: selectedColor });
    // console.log('editmode: ', this.editMode)
    if (this.editMode) {
      this.onSubmit();
    }
  }

  changeSize(event: any) {
    const selectedSize = event.target.value;
    // console.log("selected size: ", selectedSize);
    this.myForm.patchValue({ textAreaSize: selectedSize });
    // console.log('editmode: ', this.editMode)
    if (this.editMode) {
      this.onSubmit();
    }
  }

  changeBoard(event: any) {
    const selectedBoardName = event.target.value;
    const newBoard = this.boards.find((board: IBoard) => board.name === selectedBoardName);
    this.activeBoard = newBoard;
    this.activeBoardId = this.activeBoard.id;
    // console.log("active board id: ", this.activeBoardId);
    this.routeToBoard(this.activeBoardId);
  }

  populateCanvas(boards, activeBoardId) {
    this.stickyNotes = [];
    this.stickyNoteService.getStickyNotes().subscribe((stickyNotesData: any) => {
      // console.log(stickyNotesData)
      for (let note of stickyNotesData) {
        if (note.boardId === activeBoardId) {
          // console.log('noteBoardId: ', `'${note.boardId}'`);
          // console.log('note: ', note)
          this.stickyNotes.push(note);
        }
      }
      // console.log("sticky notes: ", this.stickyNotes);
        this.activeBoard = boards.find((board: IBoard) => board.name === 'default');
        this.activeBoardId = activeBoardId;
    });

  }

  populateForm(note: IStickyNote) {
    this.viewDisabled = false;
    this.myForm.enable();
    if (this.editMode) {
      this.myForm.patchValue({
        textAreaTitle: note.title,
        textAreaContent: note.content,
        textAreaColor: note.color,
        textAreaSize: note.size
      });
      this.activeNote = note;
      this.activeNoteId = note.id;
      this.activeColor = Object.keys(ColorEnum).find(key => ColorEnum[key] === note.color) || '';
      this.activeSize = Object.keys(SizeEnum).find(key => SizeEnum[key] === note.size) || '';
    }
  }

  updateStickyNotesUI(note: IStickyNote) {
    // console.log("update sticky notes UI: ", note);
    this.stickyNotes = this.stickyNotes.map((stickyNote) =>
      stickyNote.id === note.id ? note : stickyNote
    );
    // console.log("updated sticky notes: ", this.stickyNotes);
  }

  onSubmit(): void {
    if (this.editMode) {
      const noteId = this.activeNote.id;
      console.log('noteId: ', noteId)
      const newNoteData =
        new StickyNote(
          this.myForm.value.textAreaTitle,
          this.myForm.value.textAreaContent,
          this.myForm.value.textAreaColor,
          this.myForm.value.textAreaSize,
          this.activeNote.boardId,
          this.activeNote.createdAt,
          CustomZonedDateTimeUtil.nowInZone(Constants.TIME_ZONE),
          this.activeNote.position,
          noteId,
        );
      // console.log("new note data: ", newNoteData);
      // TODO
      this.stickyNoteService.updateStickyNoteById(noteId, newNoteData)
        .subscribe({
          next: (response) => {
            // console.log('Sticky note updated successfully:', response);
          },
          error: (error) => {
            // console.error('Error updating sticky note:', error);
          }
        });

      this.updateStickyNotesUI(newNoteData);
    } else {
      // console.log('creating here');
      const newNoteData =
        new StickyNote(
          this.myForm.value.textAreaTitle,
          this.myForm.value.textAreaContent,
          this.myForm.value.textAreaColor,
          this.myForm.value.textAreaSize,
          this.activeBoardId,
          CustomZonedDateTimeUtil.nowInZone(Constants.TIME_ZONE),
          CustomZonedDateTimeUtil.nowInZone(Constants.TIME_ZONE),
          { x: 0, y: 94 }
        );
      // console.log('newNoteData: ', newNoteData)
      this.stickyNoteService.createStickyNote(newNoteData)
        .subscribe({
          next: (response) => {
            // console.log('Sticky note created successfully:', response);
            this.stickyNotes.push(response);
          },
          error: (error) => {
            console.error('Error creating sticky note:', error);
          }
        });

      // this.ngOnInit();
      this.resetValues();
    }


  }

  resetValues() {
    this.myForm.patchValue({
      textAreaTitle: '',
      textAreaContent: '',
      textAreaColor: '',
      textAreaSize: ''
    });
    this.activeNote = null;
    this.activeColor = '';
    this.activeSize = '';
  }

  deleteStickyNote() {
    console.log(this.activeNoteId)
    this.stickyNoteService.deleteStickyNote(this.activeNoteId)
      .subscribe({
        next: () => {
          console.log('Sticky note deleted successfully.');
          this.stickyNotes = this.stickyNotes.filter(note => note.id !== this.activeNoteId);
        },
        error: (error) => {
          console.error('Error deleting sticky note:', error);
        }
      });
  }


}
