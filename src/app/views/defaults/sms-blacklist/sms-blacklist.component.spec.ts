import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SmsBlacklistComponent } from './sms-blacklist.component';

describe('SmsBlacklistComponent', () => {
  let component: SmsBlacklistComponent;
  let fixture: ComponentFixture<SmsBlacklistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SmsBlacklistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmsBlacklistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
