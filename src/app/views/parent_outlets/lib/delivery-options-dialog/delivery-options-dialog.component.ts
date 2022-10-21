import { MainService } from './../../services/main.service';
import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { appConfig } from '../../../config';

@Component({
  selector: 'app-delivery-options-dialog',
  templateUrl: './delivery-options-dialog.component.html',
  styleUrls: ['./delivery-options-dialog.component.css']
})
export class DeliveryOptionsDialogComponent implements OnInit {

  selectValue: any;
  deliveryType: any;
  OutletId = '';
  isLoading = false;
  constructor(private mainService: MainService, protected dialogRef: MatDialogRef<DeliveryOptionsDialogComponent>) { }

  ngOnInit() {
  }

  updateDeliveryOptions() {
    this.isLoading = true;
    let url = `updateDeliveryOptions/${this.OutletId}`;
    let data = {delivery_options: this.selectValue}
    this.mainService.patch(appConfig.base_url_slug +  url, data).then((res) => {
      if (res.status == 200) {
        if (this.selectValue == 'urbanpoint' || this.selectValue == 'both') {
          this.updateDeliveryType();
        } else {
          this.isLoading = false;
          this.dialogRef.close(true);
        }
      }
    });
  }

  updateDeliveryType() {
    let url = `enableDeliveryFor?outlet_id=${this.OutletId}&enable_delivery_for=${this.deliveryType}`;
    this.mainService.postData(appConfig.base_url_slug +  url, {}, 2).then((res) => {
       if (res.status == 200) {
        this.isLoading = false;
        this.dialogRef.close(true);
       }
    });
  }
}
