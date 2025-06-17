import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
import { CdkDrag, CdkDragMove, CdkDragRelease } from '@angular/cdk/drag-drop';
import { LimitWordsPipe } from '../../../utils/pipes/limit-words.pipe';
import { StickyNoteService } from '../../../services/sticky-note.service';
import { IStickyNote, StickyNote } from '../../../models/sticky-note.model';
import { Constants } from '../../../../environments/app.constants';
import { CustomZonedDateTimeUtil } from '../../../utils/CustomZonedDateTime.util';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sticky-note',
  standalone: true,
  imports: [CdkDrag, LimitWordsPipe, CommonModule],
  templateUrl: './sticky-note.component.html',
  styleUrl: './sticky-note.component.css'
})
export class StickyNoteComponent implements OnInit, AfterViewInit {
  @Input() noteId: string = ""; // Default id
  @Input() noteColor: string = '#ffeb3b'; // Default color
  @Input() noteTitle: string = 'Untitled'; // Default color
  @Input() noteContent: string = 'Write content here'; // Default color
  @Input() notePosition: { x: number, y: number } = { x: 0, y: 0 }; // Default color
  @Input() noteSize: string = 'Write size here'; // Default color
  @Input() noteBoardId: string = ""; // Default color
  @Input() noteCreatedAt: Date = new Date(); // Default color
  @Input() noteUpdatedAt: Date = new Date(); // Default color
  @Input() note: StickyNote = null; // Default color

  @Output() updateNoteEvent = new EventEmitter<any>();

  @ViewChild('myNote') myNote: any;

  freeDragPosition: { x: number, y: number } = { x: 0, y: 0 };

  constructor(private renderer: Renderer2,
    private stickyNoteService: StickyNoteService,
  ) { }

  ngOnInit() {
    this.freeDragPosition = this.notePosition;

    let offsetY = 0;
    let offsetX = 0;
    if (this.noteSize === 'small') {
      offsetX = 0;
      offsetY = -97;
    } else if (this.noteSize === 'medium') {
      offsetX = 0;
      offsetY = -95;
    }
    else if (this.noteSize === 'large') {
      offsetX = 0;
      offsetY = -92;
    }

    let x = this.freeDragPosition.x + offsetX;
    let y = this.freeDragPosition.y + offsetY;
    this.freeDragPosition = { x: x, y: y };
    // console.log('Initial position set:', this.freeDragPosition);
  }

  ngAfterViewInit() {
    this.rendererSetColor(this.noteColor);
    this.rendererSetSize(this.noteSize)
  }

  onDragMoved(event: CdkDragMove) {
    this.getPosition();
  }

  onDragRelease(event: CdkDragRelease) {
    console.log(this.note.id);
    this.updatePosition();
    this.updateNoteEmitter(this.note);
  }

  getPosition() {
    const rectY = this.myNote.nativeElement.getBoundingClientRect().top;
    const rectX = this.myNote.nativeElement.getBoundingClientRect().left;
    // console.log('Position:', rectX, rectY);
    return { x: rectX, y: rectY };
  }

  updatePosition() {
    let x = this.getPosition().x;
    let y = this.getPosition().y;
    // console.log('Updated position:', x, y);

    let updatedNote = new StickyNote(
      this.noteTitle,
      this.noteContent,
      this.noteColor,
      this.noteSize,
      this.noteBoardId,
      this.noteCreatedAt,
      CustomZonedDateTimeUtil.nowInZone(Constants.TIME_ZONE),
      { x: x, y: y },
      this.noteId
    );
    // console.log('Updated note:', updatedNote);
    // TODO
    this.stickyNoteService.updateStickyNoteById(this.noteId, updatedNote)
      .subscribe({
        next: (response) => {
          // console.log('Sticky note updated successfully:', response);
        },
        error: (error) => {
          // console.error('Error updating sticky note:', error);
        }
      });
  }

  rendererSetColor(color: string) {
    this.renderer.setStyle(this.myNote.nativeElement, 'background-color', color);
  }

  rendererSetSize(dimSize: string) {
    if (dimSize === 'small') {
      this.renderer.setStyle(this.myNote.nativeElement, 'width', '100px');
      this.renderer.setStyle(this.myNote.nativeElement, 'height', '100px');
    }
    else if (dimSize === 'medium') {
      this.renderer.setStyle(this.myNote.nativeElement, 'width', '125px');
      this.renderer.setStyle(this.myNote.nativeElement, 'height', '125px');
    }
    else if (dimSize === 'large') {
      this.renderer.setStyle(this.myNote.nativeElement, 'width', '150px');
      this.renderer.setStyle(this.myNote.nativeElement, 'height', '150px');
    }
  }

  updateNoteEmitter(val: IStickyNote) {
    // console.log('Update note emitter:', val);
    this.updateNoteEvent.emit(val);
  }

}
