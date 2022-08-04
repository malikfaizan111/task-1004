import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import {MatAccordion} from '@angular/material/expansion';
import { MainService, BaseLoaderService, PaginationService } from '../../services';
import { AlertDialog } from '../../lib';

import { appConfig } from '../../../config';
import { UserAppSelectorService } from '../../lib/app-selector/app-selector.service';
import { EligibleTestComponent } from './eligible-test.component';


@Component({
	selector: 'app-eligible',
	templateUrl: './eligible.component.html',
	styleUrls: ['./eligible.component.css']
})
export class EligibleComponent implements OnInit, OnDestroy {
	@ViewChild(MatAccordion) accordion: MatAccordion;
	sub: Subscription;
	index: any;
	isLoading: boolean;
	totalPages: number;
	Form: FormGroup;
	pages: any;
	totalItems: any;
	currentPage: any;
	dataCount: number = 0;
	notificationsCount: any;
	CreditCardPackagesItem: any;
	operator: string;
	searchTimer: any;
	subs_status: any;
	perPage: number;
	appSelectorSubscription: Subscription;
	scenario: any;
	selectedApp: any;
	mainArray: any[] = [];
	panelHeaderArray: any = [];
	arrayOfForms: any = [];
	UpAdmin = JSON.parse(localStorage.getItem('UrbanpointAdmin'));

	constructor(protected router: Router,
		protected _route: ActivatedRoute,
		private mainService: MainService,
		protected formbuilder: FormBuilder,
		protected mainApiService: MainService,
		protected paginationService: PaginationService,
		protected appSelectorService: UserAppSelectorService,
		protected loaderService: BaseLoaderService, protected dialog: MatDialog) {
			this.Form = new FormGroup({
				id:  new FormControl([null]),
				name: new FormControl([null, [Validators.required, Validators.maxLength(28)]]) ,
				name_ar: new FormControl([[null, [Validators.required, Validators.maxLength(28)]]]),
				sub_text: new FormControl([null, Validators.required]),
				sub_text_ar: new FormControl([[null]]),
				duration: new FormControl([null]),
				standard_value: new FormControl([null]),
				qatar_value: new FormControl([null]),
				doller_value: new FormControl([null]),
				standard_doller_value: new FormControl([null]),
				type: new FormControl([null, [Validators.required]]),
				// kuwait_value: [null, [Validators.required]],			
				// savings: [null, [Validators.required]],			
				scenario: new FormControl([null]),
			});

		this.CreditCardPackagesItem = [];
		this.operator = 'All';
		this.perPage = 20;

		let resp = this.appSelectorService.getApp();
		this.selectedApp = parseInt(resp.user_app_id);

		// this.appSelectorSubscription = this.appSelectorService.selectedApp.subscribe((response: any) =>
		// {
		// 	this.gerCreditCardPackagesList(1);

		// 	this.selectedApp = parseInt(response.user_app_id);
		// });
	}

	// ngOnDestroy(): void 
	// {
	// 	this.appSelectorSubscription.unsubscribe();	
	// }	

	ngOnInit() {
		this.hr = false;
		this.sub = this._route.params.subscribe(params => {
			this.scenario = params['scenario'];
			if (this.scenario) {
				this.getHeaderList(1);
			}
		});
	}
	ngOnDestroy(): void {
		this.hr = false;
	}

	hr= false;
	togglePanel(item){
		this.Form.patchValue(item);
		if(item.type == 'free_subscription'){
			this.Form.get('sub_text').setValidators([Validators.maxLength(112)]);
			this.Form.get('sub_text').updateValueAndValidity();
			this.Form.get('sub_text_ar').setValidators([Validators.maxLength(112)]);
			this.Form.get('sub_text_ar').updateValueAndValidity();
			this.Form.get('name').setValidators([Validators.maxLength(112)]);
			this.Form.get('name').updateValueAndValidity();
			this.Form.get('name_ar').setValidators([Validators.maxLength(112)]);
			this.Form.get('name_ar').updateValueAndValidity();
		}
		else{
			this.Form.get('sub_text').setValidators([Validators.maxLength(56)]);
			this.Form.get('sub_text').updateValueAndValidity();
			this.Form.get('sub_text_ar').setValidators([Validators.maxLength(56)]);
			this.Form.get('sub_text_ar').updateValueAndValidity();
			this.Form.get('name').setValidators([Validators.maxLength(56)]);
			this.Form.get('name').updateValueAndValidity();
			this.Form.get('name_ar').setValidators([Validators.maxLength(56)]);
			this.Form.get('name_ar').updateValueAndValidity();
		}
	}

	addNew() {
		this.router.navigateByUrl('main/subscription-packages/' + this.scenario + '/add');
	}

	// onEdit(item)
	// {
	// 	localStorage.setItem('CreditCardPackages',JSON.stringify(item));
	// 	this.router.navigateByUrl('main/credit-card-packages/' + this.scenario + '/edit');
	// }

	getValue(name) {
		return this.Form.get(name);
	}

	onTypeChange(type) {
		return type.toString().replace('_', ' ');
	}

	getHeaderList(index, isLoaderHidden?: boolean): void {

		this.loaderService.setLoading(true);
		let url = 'viewPackages';
		url = url + '?scenario=' + this.scenario;

		this.mainApiService.getList(appConfig.base_url_slug + url, false, 2).then(result => {
			if (result.status == 200 && result.data) {

				this.mainArray = result.data;
				this.loaderService.setLoading(false);
				this.dataCount = result.pagination.count;
				if (this.dataCount != 0) {

					this.mainArray.forEach((element: any) => {
						if (element.status == 1) {
							element.status = true;
						}
						else if (element.status == 0) {
							element.status = false;
						}
						element.panel = false;
					});

					for (let i = 0; i < this.mainArray.length; i++) {
						this.panelHeaderArray[i] = this.mainArray[i].type;
						// this.Form.patchValue(this.mainArray[i]);
						// this.panelHeaderArray[i] = this.onTypeChange(this.panelHeaderArray[i]);
					}
				}
				else {
					this.panelHeaderArray = [];
				}
			}
			else {
				this.CreditCardPackagesItem = [];
				this.panelHeaderArray = [];
				this.notificationsCount = 0;
				this.currentPage = 1;
				this.pages = this.paginationService.setPagination(this.notificationsCount, index, this.perPage);
				this.totalPages = this.pages.totalPages;
				this.loaderService.setLoading(false);
			}
		});
	}

	setPage(pageDate: any) {
		this.currentPage = pageDate.page;
		this.perPage = pageDate.perPage;
		this.index = this.currentPage;
		this.getHeaderList(pageDate.page);
	}

	onChangeStatus(item, event): void {
		let archive: any;

		if (item.status == "0") {
			archive = 1;
		}
		else {
			archive = 0;
		}

		let Data = {
			id: item.id,
			status: archive,
			scenario: this.scenario
		};

		let dialogRef = this.dialog.open(AlertDialog, { autoFocus: false });
		let cm = dialogRef.componentInstance;

		cm.heading = 'Update Status';
		cm.message = 'Are you sure you want to update status?';
		cm.submitButtonText = 'Yes';
		cm.cancelButtonText = 'No';
		cm.type = 'ask';
		cm.methodName = appConfig.base_url_slug + 'updateCreditcardPackages';
		cm.dataToSubmit = Data;
		cm.urlVersion = 2;
		cm.showLoading = true;

		dialogRef.afterClosed().subscribe(result => {
			if (result) {
				this.getHeaderList(this.currentPage, false);
			}
			else {
				item.slide = !item.slide;
			}
		})
	}

	// new function
	onViewDetails(item): void {
		let dialogRef = this.dialog.open(EligibleTestComponent);
		dialogRef.componentInstance.CreditCard = item;
	}

	onAppImage(panelid): void {
		// localStorage.setItem('popularcategories', JSON.stringify(popularcategorie));
		this.router.navigateByUrl('main/subscription-packages/' + this.scenario + '/in-app-image');
	}

	onDeletePackage(item) {
		// let url = `deletePackage`;

		let data = { id: item.id, type: item.type ,scenario: item.scenario};

		let dialogRef = this.dialog.open(AlertDialog, { autoFocus: false });
		let cm = dialogRef.componentInstance;
		cm.heading = 'Delete Package';
		cm.message = 'Are you sure to delete?';
		cm.submitButtonText = 'Yes';
		cm.cancelButtonText = 'No';
		cm.type = 'ask';
		cm.methodName = appConfig.base_url_slug + 'deletePackage';
		cm.dataToSubmit = data;
		cm.urlVersion = 2;
		cm.showLoading = true;

		dialogRef.afterClosed().subscribe(result => {
			if (result) {
				let dialogRef = this.dialog.open(AlertDialog, { autoFocus: false });
				let cm = dialogRef.componentInstance;
				cm.heading = 'Successful!';
				cm.message = 'Package has been deleted successfully';
				cm.cancelButtonText = 'Close';
				cm.type = 'success';
				this.getHeaderList(1);
			}
		})

		// this.mainService.postData(appConfig.base_url_slug + url, data, 2).then((res) => {
		// 	if (res.status == 200) {
		// 		let dialogRef = this.dialog.open(AlertDialog, { autoFocus: false });
		// 		let cm = dialogRef.componentInstance;
		// 		cm.heading = 'Successful!';
		// 		cm.message = 'Package has been deleted successfully';
		// 		cm.cancelButtonText = 'Close';
		// 		cm.type = 'success';
		// 		this.getHeaderList(1);
		// 	}
		// 	else if (res.status == 400) {
		// 		console.log("400 bad request console", res)
		// 		let dialogRef = this.dialog.open(AlertDialog, { autoFocus: false });
		// 		let cm = dialogRef.componentInstance;
		// 		cm.heading = 'Warning!';
		// 		cm.message = res.error.message;
		// 		cm.cancelButtonText = 'Close';
		// 		cm.type = 'error';
		// 	}
		// });
	}
   show_label: boolean;
	toggleView(item){
        // console.log(item.status);
		if(item.status == true){
			this.subs_status = 'active';
			this.show_label = true;
		}
		else{
			this.subs_status = 'not_active';
			this.show_label = false;
		}
        var data = {
            status : this.subs_status,
            id : item.id
        }
		// let status: any;
		// if(item.slide)
		// {
		// 	status = 1;
		// }
		// else
		// {
		// 	status = 0;
		// }
        // var data = {
        //     status : status,
        //     id : item.id
        // }

        var url = 'editPackage';
            this.mainApiService.postData(appConfig.base_url_slug + url, data,2).then(response => {
                    if (response.status == 200 || response.status == 201) {
                    //   this.ngOnInit();
                    }
                    // else {
                    //     item.status = !item.status;
					// 	let dialogRef = this.dialog.open(AlertDialog, {autoFocus: false});
					// 	let cm = dialogRef.componentInstance;
					// 	cm.heading = 'Error';
					// 	cm.message = 'There has to be at least one Outlet linked with an interest tag  before it gets enabled';
					// 	cm.cancelButtonText = 'Close';
					// 	cm.type = 'error';
                    // }
                },
                Error => {
                    let dialogRef = this.dialog.open(AlertDialog, {autoFocus: false});
                    let cm = dialogRef.componentInstance;
                    cm.heading = 'Error';
                    cm.message = 'Internal Server Error';
                    cm.cancelButtonText = 'Close';
                    cm.type = 'error';
                });

    }

	doSubmit(item): void {
		this.isLoading = true;
		let method = '';

		method = 'editPackage';
		// this.Form.get('status')?.setValue(item.status);

		// this.Form.get('type').setValue(this.selectVariable);
		this.mainApiService.postData(appConfig.base_url_slug + method, this.Form.value, 2).then(response => {
			if (response.status == 200 || response.status == 201) {
				// this.router.navigateByUrl('/main/subscription-packages/' + this.scenario);
				this.getHeaderList(1);
				this.isLoading = false;
			}
			else {
				this.isLoading = false;
				let dialogRef = this.dialog.open(AlertDialog, { autoFocus: false });
				let cm = dialogRef.componentInstance;
				cm.heading = 'Error';
				cm.message = 'Error while saving data.';
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
}