import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveryPlaylistComponent } from './delivery_playlist.component';

describe('DeliveryPlaylistComponent', () => {
  let component: DeliveryPlaylistComponent;
  let fixture: ComponentFixture<DeliveryPlaylistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeliveryPlaylistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeliveryPlaylistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
