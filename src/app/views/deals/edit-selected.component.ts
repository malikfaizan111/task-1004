import { Component, OnInit, ElementRef, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';


import { MainService, BaseLoaderService } from '../../services';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import * as moment from 'moment';
import { AlertDialog } from '../../lib';
import { appConfig } from '../../../config';


@Component({
    selector: 'app-edit-selected',
    templateUrl: './edit-selected.component.html'
})
export class EditSelectedComponent implements OnInit, AfterViewInit {
    Deals: any;
    Form: FormGroup;
    status: any;
    StartDate: any;
    EndDate: any;
    isLoading: boolean;
    currentDate: Date = new Date();

    constructor(private elRef: ElementRef, protected router: Router,
        protected mainApiService: MainService,
        protected dialog: MatDialog,
        protected formbuilder: FormBuilder,
        protected loaderService: BaseLoaderService, protected dialogRef: MatDialogRef<EditSelectedComponent>) {
        this.Deals = [];
        this.isLoading = false;
        this.Form = this.formbuilder.group({
            start_datetime: [null],
            end_datetime: [null],
            active: [null]
        });
    }

    ngOnInit() {
    }

    ngAfterViewInit() {
        this.elRef.nativeElement.parentElement.classList.add("mat-dialog-changes-1");
    }

    onSubmit(): void {
        if (this.status) {
            this.Form.get('active')?.setValue(1);
        }
        else {
            this.Form.get('active')?.setValue(0);
        }

        let Data = this.Form.value;
        let ids = '';
        this.Deals.forEach((element: any) => {
            ids += element.id + ',';
        });
        Data['ids'] = ids;

        this.mainApiService.postData(appConfig.base_url_slug + 'updateMultipleOffer', Data).then(result => {
            if (result.status == 200 && result.data) {
                this.dialogRef.close(true);
            }
            else {
                this.isLoading = false;
                let dialogRef = this.dialog.open(AlertDialog, { autoFocus: false });
                let cm = dialogRef.componentInstance;
                cm.heading = 'Error';
                cm.message = 'Error while updating multiple deals.';
                cm.cancelButtonText = 'Ok';
                cm.type = 'error';
            }
        });
    }

    getValue(name: any) {
        return this.Form.get(name);
    }

    onCloseClick(): void {
        this.dialogRef.close(false);
    }

    onChangeStatus(): void {
        if (this.status) {
            this.Form.get('active')?.setValue(1);
        }
        else {
            this.Form.get('active')?.setValue(0);
        }
    }

    onStartDate(): void {
        let abc = moment(this.StartDate).format('YYYY-MM-DD HH:mm:ss');
        this.Form.get('start_datetime')?.setValue(abc);
    }

    onEndDate(): void {
        let abc = moment(this.EndDate).format('YYYY-MM-DD HH:mm:ss');
        this.Form.get('end_datetime')?.setValue(abc);
    }
}