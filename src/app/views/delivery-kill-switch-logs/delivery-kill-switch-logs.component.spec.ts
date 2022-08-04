import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveryKillSwitchLogsComponent } from './delivery-kill-switch-logs.component';

describe('DeliveryKillSwitchLogsComponent', () => {
  let component: DeliveryKillSwitchLogsComponent;
  let fixture: ComponentFixture<DeliveryKillSwitchLogsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeliveryKillSwitchLogsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeliveryKillSwitchLogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
