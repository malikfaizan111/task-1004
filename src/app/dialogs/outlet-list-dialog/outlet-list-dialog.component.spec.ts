import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OutletListDialogComponent } from './outlet-list-dialog.component';

describe('OutletListDialogComponent', () => {
  let component: OutletListDialogComponent;
  let fixture: ComponentFixture<OutletListDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OutletListDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OutletListDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
