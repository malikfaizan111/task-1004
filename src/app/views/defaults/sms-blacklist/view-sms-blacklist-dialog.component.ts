import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { appConfig } from '../../../../config';
import { MainService } from '../../../services';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { AlertDialog } from '../../../lib';


@Component({
  selector: 'app-sms-blacklist-dialog',
  templateUrl: './view-sms-blacklist-dialog.component.html',
  styleUrls: ['./view-sms-blacklist-dialog.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class SmsBlacklistDialogComponent implements OnInit {

  token: any;
  isEdit = false;
  isLoading = false;
  Form: FormGroup;
  title_heading = 'Add a number to SMS Blacklist:';
  is_sms_blacklist: boolean = true;
  showMessage: boolean = false;
  showAddMessage: boolean = false;
  showAddErrorMessage: boolean = false;
  showDeleteDialog: boolean = false;
  showDeleteMessage: boolean = false;
  phoneNumber: any;
  data: any;
  adderrormessage: any;

  constructor(protected formbuilder: FormBuilder, protected dialog: MatDialog, private mainService: MainService, protected dialogRef: MatDialogRef<SmsBlacklistDialogComponent>) {

    this.Form = this.formbuilder.group({
      phone: [null, [Validators.required]],
    });

  }

  ngOnInit() {
    if (this.data) {
      this.phoneNumber = this.data.phone;
    }
  }

  postToken() {


    this.isLoading = true;
    let url = `updatePromotionalSmsStatus`;

    this.phoneNumber = this.Form.value.phone;

    let data = { phone: parseInt(this.Form.value.phone), is_sms_blacklist: this.is_sms_blacklist };
    this.mainService.postData(appConfig.base_url_slug + url, data, 2).then((res) => {
      if (res.status == 200) {
        this.isLoading = false;
        this.showMessage = false;
        this.phoneNumber = this.Form.value.phone;
        this.showAddMessage = true;
        // this.dialogRef.close(true);
      }
      else if (res.status == 404) {
        this.isLoading = false;
        this.showMessage = false;
        this.showAddErrorMessage = true;
        this.adderrormessage = res.error.message;
        console.log(res);
      }
      console.log(res);
    })
      .catch((err) => {
        this.isLoading = false;
        this.showMessage = false;
        this.showAddErrorMessage = true;
        this.adderrormessage = err.error.message;
        console.log(err);
      });
  }

  delete() {
    let url = `updatePromotionalSmsStatus`;

    this.phoneNumber = parseInt(this.data.phone);
    this.showDeleteDialog = false;
    let data = { phone: this.data.phone, is_sms_blacklist: false };
    this.mainService.postData(appConfig.base_url_slug + url, data, 2).then((res) => {
      if (res.status == 200) {
        this.isLoading = false;
        this.showDeleteDialog = false;
        this.showDeleteMessage = true;
        // this.dialogRef.close(true);
      }
    });
  }
  closedialog() {
    this.dialogRef.close();
  }
}