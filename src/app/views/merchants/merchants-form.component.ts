import { Component, OnInit, AfterViewChecked, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';


import { AlertDialog, GetLocationDialog } from '../../lib';
import { MainService } from '../../services';
import { appConfig } from '../../../config';
declare var $: any;

import * as moment from 'moment'
import { ImportCSVComponent } from '../../lib/import_csv.component';

@Component({
    selector: 'app-merchants-form',
    templateUrl: './merchants-form.component.html'
})
export class MerchantsFormComponent extends ImportCSVComponent implements OnInit {
    id: any;
    // type: any;
    sub: Subscription = new Subscription();
    Form: FormGroup;
    // isLoading: boolean;
    isEditing: boolean;
    addOutlet: any = null;
    Merchant: any;
    ContractStartDate: any;
    ContractEndDate: any;
    file_url: any = appConfig.file_url;

    // OutletForm: FormGroup;
    // Categories: any[];
    status: any;
    Outlets: any;
    errorMsglogo: string = '';
    errorMsgimage: string = '';
    currentDate: Date = new Date();

    isFormValid: boolean = true;
    merchant_id: any;
    // errorMessageForCSV: string;
    // errorCounter: any;
    // merchantsJSON: string;
    // csvFile: any;
    // @ViewChild('selectTo') selectTo: any;
    patternEmail: string = '[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]+';

    constructor(protected router: Router,
        protected _route: ActivatedRoute,
        protected mainApiService: MainService,
        protected formbuilder: FormBuilder, protected dialog: MatDialog) {
        super(mainApiService, dialog);

        this.Form = this.formbuilder.group({
            name: [null, [Validators.required, Validators.maxLength(50)]],
            point_of_contact: [null],
            email: [null],
            phone: [null, [Validators.maxLength(20), Validators.minLength(7)]],
            gender: [null],
            up_account_manager: [null],
            title: [null],
            contract_start_date: [null],
            contract_expiry_date: [null],
            TAC_accepted: [null],
            notes: [null],
        });

        this.isLoading = false;
        this.isEditing = false;
        this.ContractStartDate = '';
        this.ContractEndDate = '';
        this.Outlets = [];
        this.methodOfCsv = 'addMerchants';

        // this.merchantsJSON = '';
        this.errorMessageForCSV = 'Invalid CSV File. <br>';
        this.currentDate.setHours(-1, 0, 0);
    }

    ngOnInit() {
        this.sub = this._route.params.subscribe(params => {
            this.id = params['id'];
            if (this.id != 'add') {
                this.Form.addControl('id', new FormControl(this.id));
                let abc = localStorage.getItem('Merchant') as string;
                this.Merchant = JSON.parse(abc);
                this.Form.patchValue(this.Merchant);
                this.isEditing = true;

                this.ContractStartDate = this.Merchant.contract_start_date;
                this.ContractEndDate = this.Merchant.contract_expiry_date;

            }
            else {
                this.isEditing = false;
                this.Form.reset();
            }
        });
        this.getOutlets();
    }

    onTagAdd(event: any): void {
        this.Form.get('email')?.setValue(event);
    }

    onAddOutlet(ev: any): void {
        console.log('implement this function');
    }

    onOutletFormChanges(event: any): void {
        console.log("___________________=> ", event);
        if (event == false) {
            this.isFormValid = true;
        }
        else {
            this.isFormValid = false;
        }
    }

    onContractStartDate(): void {
        let abc = moment(this.ContractStartDate).format('YYYY-MM-DD');
        this.Form.get('contract_start_date')?.setValue(abc);
    }

    onContractEndDate(): void {
        let abc = moment(this.ContractEndDate).format('YYYY-MM-DD');
        this.Form.get('contract_expiry_date')?.setValue(abc);
    }

    getValue(name: any) {
        return this.Form.get(name);
    }

    getImage(item: any): any {
        if (this.id != 'add') {
            return this.file_url + this.Merchant[item];
        }
        else {
            return '';
        }
    }

    onLocationBack(): void {
        window.history.back();
    }

    doSubmit(multi?: any): void {
        this.isLoading = true;
        let method = '';

        if (this.id == 'add') {
            method = 'addMerchant';
        }
        else {
            method = 'updateMerchant';
        }

        this.mainApiService.postData(appConfig.base_url_slug + method, this.Form.value).then(response => {
            if (response.status == 200 || response.status == 201) {
                if (multi == 'multi') {
                    this.router.navigateByUrl('/main/parent_companies/multiple_outlets/' + response.data.id);
                }
                else {
                    if (this.addOutlet) {
                        this.merchant_id = response.data.id;
                    }
                    else {
                        this.router.navigateByUrl('/main/parent_companies');
                        this.isLoading = false;
                    }
                }
            }
            else {
                this.isLoading = false;
                let dialogRef = this.dialog.open(AlertDialog, { autoFocus: false });
                let cm = dialogRef.componentInstance;
                cm.heading = 'Error';
                cm.message = response.error.message;
                cm.cancelButtonText = 'Ok';
                cm.type = 'error';
            }
        },
            Error => {
                this.isLoading = false;
                let dialogRef = this.dialog.open(AlertDialog, { autoFocus: false });
                let cm = dialogRef.componentInstance;
                cm.heading = 'Error';
                cm.message = "Internal Server Error.";
                cm.cancelButtonText = 'Ok';
                cm.type = 'error';
            })
    }

    getOutlets(): void {
        if (this.isEditing == false) {
            return;
        }
        this.mainApiService.getList(appConfig.base_url_slug + 'getOutlets?merchant_id=' + this.Merchant.id)
            .then(result => {
                if (result.status == 200 && result.data) {
                    let Outlets: any = result.data.outlets;
                    Outlets.forEach((element: any) => {
                        if (element.active == 1) {
                            element['slide'] = true;
                        }
                        else if (element.active == 0) {
                            element['slide'] = false;
                        }
                    });
                    this.Outlets = Outlets;
                }
                else {
                    this.Outlets = [];
                }
            });
    }

    onOutletNameClick(outlet: any): void {
        localStorage.setItem('Outlet', JSON.stringify(outlet));
        this.router.navigateByUrl('main/outlets/' + outlet.id);
    }

    onChangeOutletStatus(outlet: any): void {
        let active: any;
        if (outlet.slide) {
            active = 1;
        }
        else {
            active = 0;
        }
        let Data = {
            id: outlet.id,
            active: active
        };

        let dialogRef = this.dialog.open(AlertDialog, { autoFocus: false });
        let cm = dialogRef.componentInstance;
        cm.heading = 'Change Outlet';
        cm.message = 'Are you sure to Update Outlet';
        cm.submitButtonText = 'Yes';
        cm.cancelButtonText = 'No';
        cm.type = 'ask';
        cm.methodName = appConfig.base_url_slug + 'ADOutlet';
        cm.dataToSubmit = Data;
        cm.showLoading = true;

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.getOutlets();
            }
            else {
                this.status = !this.status;
            }
        })
    }


    afterSelectionCsv(result: any, headersObj: any, objTemp: any): void {
        for (let key in headersObj) {
            if (!headersObj.hasOwnProperty('name') && !objTemp.hasOwnProperty('name')) {
                objTemp['name'] = null;
                this.errorMessageForCSV = this.errorMessageForCSV + '<b>name</b> is missing,<br> ';
                this.errorCounter++;
            }
        }

        if (this.errorCounter == 0) {
            result.forEach((element: any, index: any) => {
                if (element['name'] == null || element['name'] == '') {
                    this.errorMessageForCSV = this.errorMessageForCSV + '<b>name</b> is empty on line number ' + (index + 1) + ',<br> ';
                    this.errorCounter++;
                }
                if (element['email'] != null || element['email'] != '') {
                    element['email'] = element['email'].split(';').join(',');
                }
            });
        }
        this.afterJSON = JSON.stringify(result);
    }

    onUploadCSV(): void {
        this.JsonToServer = { merchants: this.afterJSON };
        super.onUploadCSV();
    }

    afterSuccess(): void {
      this.router.navigateByUrl('/main/parent_companies');
        this.isLoading = false;
    }
}