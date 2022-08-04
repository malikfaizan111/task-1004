import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TimingMenusDialogComponent } from './timing-menus-dialog.component';

describe('TimingMenusDialogComponent', () => {
  let component: TimingMenusDialogComponent;
  let fixture: ComponentFixture<TimingMenusDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TimingMenusDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimingMenusDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
