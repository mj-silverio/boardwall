import { Component, Input } from '@angular/core';
import { StickyNoteComponent } from '../sticky-note/sticky-note.component';
import { CommonModule } from '@angular/common';

import { StickyNoteService } from '../../../services/sticky-note.service';
import { UserAccountService } from '../../../services/user-account.service';
import { BoardWallService } from '../../../services/board-wall.service';
import { BoardService } from '../../../services/board.service';
import { CategoryService } from '../../../services/category.service';
import { ColorService } from '../../../utils/ColorService.util';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [],
  templateUrl: './board.component.html',
  styleUrl: './board.component.css'
})
export class BoardComponent {






}
