import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OoredoBillingComponent } from './ooredo-billing.component';

describe('OoredoBillingComponent', () => {
  let component: OoredoBillingComponent;
  let fixture: ComponentFixture<OoredoBillingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OoredoBillingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OoredoBillingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
