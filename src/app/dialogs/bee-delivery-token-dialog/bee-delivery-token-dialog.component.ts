import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { appConfig } from '../../../config';
import { DeliveryOptionsDialogComponent } from '../../lib/delivery-options-dialog/delivery-options-dialog.component';
import { MainService } from '../../services';

@Component({
  selector: 'app-bee-delivery-token-dialog',
  templateUrl: './bee-delivery-token-dialog.component.html',
  styleUrls: ['./bee-delivery-token-dialog.component.css']
})
export class BeeDeliveryTokenDialogComponent implements OnInit {

  token: any;
  OutletId = '';
  isEdit = false;
  isLoading = false;
  constructor(private mainService: MainService, protected dialogRef: MatDialogRef<BeeDeliveryTokenDialogComponent>) { }

  ngOnInit() {
  }

  postToken() {
    this.isLoading = true;
    let url = `addBeeDeliveryToken/${this.OutletId}`;
    let data = {bee_delivery_token: this.token};
    this.mainService.postData(appConfig.base_url_slug +  url, data, 2).then((res) => {
      if (res.status == 200) {
        this.isLoading = false;
        this.dialogRef.close(true);
      }
    });
  }

}
