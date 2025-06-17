import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BoardService } from '../../../../services/board.service';

@Component({
  selector: 'app-board-display',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './board-display.component.html',
  styleUrl: './board-display.component.css'
})
export class BoardDisplayComponent {

  @Input() boardName: string = "";
  @Input() boardDescription: string = "";
  @Input() board: any;
  @Input() myBoards: any;
  @Input() isBackupMode: boolean = false;
  @Input() isDeleteModeEnabled: boolean = false;

  @Output() updateBoardEvent = new EventEmitter<any>();
  @Output() updateBoardIdEvent = new EventEmitter<any>();
  @Output() deleteBoardEvent = new EventEmitter<any>();
  @Output() chosenBoardIdEvent = new EventEmitter<any>();

  chosenBoardId: any;
  editViewDisabled: boolean = true;
  chooseBoardButtonViewDisabled: boolean = false;

  formEdit = new FormGroup({
    boardAreaName: new FormControl(''),
    boardAreaDescription: new FormControl(''),
  });

  constructor(private boardService: BoardService) { }

  updatingBoardId(boardId) {
    // console.log('here0', boardId)
    this.updateBoardIdEvent.emit(boardId);
  }

  forRouting(boardId) {
    // console.log('here0', boardId)
    this.updateBoardEvent.emit(boardId);
  }

  chooseBoard(boardId) {
    // console.log('here0', boardId)
    this.chooseBoardButtonViewDisabled = true;
    this.chosenBoardIdEvent.emit(boardId);
  }
  
  editingMode(boardId) {
    console.log(boardId)
    this.editViewDisabled = false;
    this.chosenBoardId = boardId;
    // console.log(this.chosenBoardId)
    this.formEdit.setValue({
      boardAreaName: this.boardName,
      boardAreaDescription: this.boardDescription
    });
  }

  onSubmitUpdate(chosenBoardId) {
    // console.log(chosenBoardId)
    // console.log('boardAreaName', this.formEdit.value.boardAreaName)
    // console.log('boardAreaDescription', this.formEdit.value.boardAreaDescription)
    this.editViewDisabled = true;
    this.boardService.patchBoard(chosenBoardId, {
      name: this.formEdit.value.boardAreaName,
      description: this.formEdit.value.boardAreaDescription
    }).subscribe({
      next: (response) => {
        // console.log('Board updated successfully:', response);
        this.boardName = response.name;
        this.boardDescription = response.description;
      },
      error: (error) => {
        console.error('Error updating board:', error);
      }
    });

  }

  deleteBoard(boardId) {
    // console.log('delete', boardId)
    // const boardId = this.myBoards.find(b => b.id === board.id)?.id;
    this.deleteBoardEvent.emit(boardId);
    this.boardService.deleteBoard(boardId).subscribe({
      next: (response) => {
        // console.log('Board deleted successfully:', response);
        // this.deleteBoardEvent.emit(this.myBoards);
        // this.deleteBoardEvent.emit(response.id);
      },
      error: (error) => {
        console.error('Error deleting board:', error);
      }
    });
  }

}
