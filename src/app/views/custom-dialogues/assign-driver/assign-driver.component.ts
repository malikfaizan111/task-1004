import { DeliveryOrdersListComponent } from './../../food_delevery/settings/Delivery_orders/delivery_orders-list.component';
import { MainService } from './../../../services/main.service';
import { Component, OnInit } from '@angular/core';
import { appConfig } from '../../../../config';
import { AlertDialog } from '../../../lib';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-assign-driver',
  templateUrl: './assign-driver.component.html',
  styleUrls: ['./assign-driver.component.css']
})
export class AssignDriverComponent implements OnInit {

  driver_type: any;
  isLoading = false;
  orderId: any;
  constructor(private mainApiService: MainService,
    protected dialog: MatDialog,
    protected dialogRef: MatDialogRef<AssignDriverComponent>) { }

  ngOnInit() {
  }

  onDriverSelect(driver: any) {
    this.driver_type = driver;
  }

  assignDriver() {
    this.isLoading = true;
    let url = `acceptOrder/${this.orderId}/${this.driver_type}`;

    this.mainApiService.getList(appConfig.base_url_slug + url, true, 2)
      .then(result => {
        console.log(result);
        if (result.status == 200 && result.data) {
          this.dialogRef.close(true);
        }
        else if (result.status == 412) {
          this.isLoading = false;
          let dialogRef = this.dialog.open(AlertDialog, { autoFocus: false });
          let cm = dialogRef.componentInstance;
          cm.heading = 'Error';
          cm.message = 'Driver has already been assigned';
          cm.cancelButtonText = 'Ok';
          cm.type = 'error';
        }
        else {

        }
        this.isLoading = false;
      });
  }
}