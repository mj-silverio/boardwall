import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoardDisplayComponent } from './board-display.component';

describe('BoardDisplayComponent', () => {
  let component: BoardDisplayComponent;
  let fixture: ComponentFixture<BoardDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BoardDisplayComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BoardDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
