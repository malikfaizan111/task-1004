import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveryKillSwitchComponent } from './delivery-kill-switch.component';

describe('DeliveryKillSwitchComponent', () => {
  let component: DeliveryKillSwitchComponent;
  let fixture: ComponentFixture<DeliveryKillSwitchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeliveryKillSwitchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeliveryKillSwitchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
