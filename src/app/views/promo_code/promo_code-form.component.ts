import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { AlertDialog } from '../../lib';
import { MainService } from '../../services';
import * as moment from 'moment';
import { appConfig } from '../../../config';

@Component({
	selector: 'app-promo_code-form',
	templateUrl: './promo_code-form.component.html'
})
export class PromoCodesFormComponent implements OnInit {
	id: any;
	// type: any;
	sub: Subscription = new Subscription();
	Form: FormGroup;
	isLoading: boolean;
	isEditing: boolean;
	promoCode: any;
	isMultiple: boolean;
	expiryDatetime: any;
	currentDate: Date = new Date();
	codeGet: any;
	discount_type: Date = new Date();
	days: any;
	isDiscountType: boolean = false;
	CreditCardPackagesItem: any[];
	scenario: any;
	search: string;

	constructor(protected router: Router,
		protected _route: ActivatedRoute,
		protected mainApiService: MainService,
		protected formbuilder: FormBuilder, protected dialog: MatDialog) {
		this.Form = this.formbuilder.group({
			title: [null, [Validators.required, Validators.maxLength(50)]],
			code: [null, [Validators.maxLength(6), Validators.minLength(6)]],
			// days: [null, [Validators.required, Validators.maxLength(50)]],
			discount_type: [null, [Validators.required]],

			discount_value: [null, [Validators.required, Validators.maxLength(50)]],
			expiry_datetime: [null, [Validators.required]],
			redemptions: [null, [Validators.required, Validators.maxLength(50)]],
			// outletObject:[null, [Validators.required, Validators.maxLength(50)]],
			creditcard_packages_id: [null, [Validators.required]],

		});
		console.log("discount type", this.discount_type);

		this.isLoading = false;
		this.isEditing = false;
		this.isMultiple = false;
		this.codeGet = '';
		this.search = '';
		this.CreditCardPackagesItem = [];
	}

	ngOnInit() {
		this.sub = this._route.params.subscribe(params => {
			this.id = params['id'];

			if (this.id != 'add') {
				this.isEditing = true;
				this.Form.addControl('id', new FormControl(this.id));
				let abc = localStorage.getItem('PromoCode') as string;
				this.codeGet = JSON.parse(abc);
				this.Form.patchValue(this.codeGet);
				this.expiryDatetime = new Date(this.codeGet.expiry_datetime);

			}
			else {
				this.isEditing = false;
				// this.Form.addControl('user_app_id', new FormControl(1, [Validators.required]));
				this.Form.reset();
			}
		});
		this.gerCreditCardPackagesList(1);
		this.onChanges();
	}
	onChanges(): void {
		this.Form.valueChanges.subscribe(val => {
			//console.log(`newValue: `, val)
			if (val.discount_type == '0') {
				if (val.discount_value > 100) {
					this.isDiscountType = true;
					let dialogRef = this.dialog.open(AlertDialog, { autoFocus: false });
					let cm = dialogRef.componentInstance;
					cm.heading = 'Error';
					cm.message = "Please enter a value between 0-100.";
					cm.cancelButtonText = 'Ok';
					cm.type = 'error';
				}
				else {

					this.isDiscountType = false;
				}
			}
			else if (val.discount_type == '1') {
				if (val.discount_value > 999) {
					this.isDiscountType = true;
					let dialogRef = this.dialog.open(AlertDialog, { autoFocus: false });
					let cm = dialogRef.componentInstance;
					cm.heading = 'Error';
					cm.message = "Please enter a value between 0-999.";
					cm.cancelButtonText = 'Ok';
					cm.type = 'error';
				}
				else {
					this.isDiscountType = false;
				}
			}

		})

	}
	onSelectDate(): void {
		let abc = moment(this.expiryDatetime).format('YYYY-MM-DD HH:mm:ss');
		this.Form.get('expiry_datetime')?.setValue(abc);
	}

	onChangeMultiple(event: any): void {
		// log here(event);
		if (this.isMultiple) {
			this.Form.removeControl('code');
			this.Form.addControl('number', new FormControl(null, [Validators.required]));
		}
		else {
			this.Form.removeControl('number');
			this.Form.addControl('code', new FormControl(null, [Validators.maxLength(6), Validators.minLength(6)]));
		}
	}

	getValue(name: any) {
		return this.Form.get(name);
	}

	getImage(item: any): any {
		if (this.id != 'add') {
			// this.isEditing = true;
			// this.Form.addControl('id', new FormControl(this.id));
			// this.menuItem = JSON.parse(localStorage.getItem('MenuItem'));
			// this.Form.patchValue(this.menuItem);
			// // log here(this.menuItem);
			// return this.file_url + this.menuItem[item];
			return
		}
		else {
			// this.isEditing = false;
			// this.Form.reset();
			// localStorage.removeItem('MenuItem');

			return '';
		}
	}

	onLocationBack(): void {
		window.history.back();
	}

	doSubmit(): void {
		this.isLoading = true;
		let method = '';

		if (this.id == 'add') {
			method = 'addDiscountCode';
		}
		else {
			method = 'updateDiscountCode';
			// this.router.navigateByUrl('/main/admins/' + this.type );
		}

		this.mainApiService.postData(appConfig.base_url_slug + method, this.Form.value).then(response => {
			if (response.status == 200 || response.status == 201) {
				this.router.navigateByUrl('/main/promo_codes');
				this.isLoading = false;
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
				// log here(Error)
				this.isLoading = false;
				let dialogRef = this.dialog.open(AlertDialog, { autoFocus: false });
				let cm = dialogRef.componentInstance;
				cm.heading = 'Error';
				cm.message = "Internal Server Error.";
				cm.cancelButtonText = 'Ok';
				cm.type = 'error';
			})
	}

	// modo(event: any)
	// 	 {
	// 	if(event.value=="percentage")
	// 	{
	// 		this.Form.get('number').setErrors(null);
	// 	}
	// 	if(event.value=="number")
	// 	{
	// 		this.Form.get('percentage').setErrors(null);

	// 	}
	// 	}

	gerCreditCardPackagesList(index: any, isLoaderHidden?: boolean): void {
		let url = 'getCreditcardPackages';

		if (this.search != '') {
			url = url + '&search=' + this.search;
		}
		else {
			this.search = '';
		}

		this.mainApiService.getList(appConfig.base_url_slug + url).then(result => {

			if (result.status == 200 && result.data) {
				let tempArr: any[] = [];
				let Items = result.data;
				Items.forEach((element: any) => {

					if (element.scenario == "ooredooUsers" || element.scenario == "nonOoredooUsers") {
						tempArr.push(element);
					}
				});
				//  if(tempArr.length>0)
				//  {
				this.CreditCardPackagesItem = tempArr;

				//  }
				//  else
				//  {
				// 	 this.CreditCardPackagesItem=[]
				//  }
			}
			else {
				this.CreditCardPackagesItem = [];
			}
		});
	}
}