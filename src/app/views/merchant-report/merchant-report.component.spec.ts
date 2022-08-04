import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MerchantReportComponent } from './merchant-report.component';

describe('MerchantReportComponent', () => {
  let component: MerchantReportComponent;
  let fixture: ComponentFixture<MerchantReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MerchantReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MerchantReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
