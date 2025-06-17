import { Component, OnInit } from '@angular/core';
import { BoardService } from '../../../services/board.service';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Board } from '../../../models/board.model';
import { Constants } from '../../../../environments/app.constants';
import { CustomZonedDateTimeUtil } from '../../../utils/CustomZonedDateTime.util';
import { BoardDisplayComponent } from './board-display/board-display.component';
import { Router } from '@angular/router';
import { SettingsService } from '../../../services/settings.service';


@Component({
  selector: 'app-main-menu',
  standalone: true,
  imports: [BoardDisplayComponent, FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './main-menu.component.html',
  styleUrl: './main-menu.component.css'
})
export class MainMenuComponent implements OnInit {

  settings = {
    deleteModeEnabled: false,
  };

  boards: any;
  boardsLength: any;
  activeBoardId: any;

  myForm = new FormGroup({
    textAreaName: new FormControl(''),
    textAreaDescription: new FormControl(''),
  });

  constructor(
    private boardService: BoardService,
    private router: Router,
    private settingsService: SettingsService
  ) {

  }

  ngOnInit(): void {
    this.boardService.getBoards().subscribe(boards => {
      this.boards = boards.sort((a, b) => a.name.localeCompare(b.name));
      // console.log(this.boards);
      this.boardsLength = this.boards.length;
      this.load();
    });
  }

  routeToBoard(activeBoardId) {
    // console.log('here1: ', activeBoardId)
    this.router.navigateByUrl(`/canvas-editor?boardId=${activeBoardId}`);
  }


  createNewBoard() {
    const newBoardData =
      new Board(
        this.myForm.value.textAreaName,
        this.myForm.value.textAreaDescription,
        1,
        CustomZonedDateTimeUtil.nowInZone(Constants.TIME_ZONE),
        CustomZonedDateTimeUtil.nowInZone(Constants.TIME_ZONE)
      )

    // console.log(newBoardData);

    this.boardService.createBoard(newBoardData).subscribe(response => {
      // console.log('Board created:', response);
      this.boards.push(newBoardData);
      this.ngOnInit();
    });

    this.resetValues();
  }

  updateBoardId(event: any) {
    let boardId = event;
    // console.log(boardId);
    this.activeBoardId = boardId;
  }

  updateBoardsUI(event: any) {
    let boardId = event;
    // console.log(boardId);
    this.routeToBoard(boardId);
  }

  deleteBoardsUI(event: any) {
    // console.log('event', event)
    const boardId = event;
    this.boards = this.boards.filter(board => board.id !== boardId);
    this.boardsLength = this.boards.length;
  }

  onSubmit(): void {
    this.createNewBoard();
  }

  resetValues() {
    this.myForm.patchValue({
      textAreaName: '',
      textAreaDescription: ''
    });
  }


  load() {
    const storedSettings = this.settingsService.getSettings();
    if (storedSettings) {
      this.settings = storedSettings;
      // console.log('Loaded settings:', this.settings);
    }
  }

}
