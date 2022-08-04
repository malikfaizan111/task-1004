import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditHistoryListComponent } from './edit-history-list.component';

describe('EditHistoryListComponent', () => {
  let component: EditHistoryListComponent;
  let fixture: ComponentFixture<EditHistoryListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditHistoryListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditHistoryListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
