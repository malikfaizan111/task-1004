import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { AlertDialog } from '../../../lib';
import { MainService } from '../../../services';
import * as moment from 'moment';
import { appConfig } from '../../../../config';

@Component({
	selector: 'app_promo_codes_form_new',
	templateUrl: './promo_code_form_new.component.html',
	styleUrls: ['./promo_code_form_new.component.scss']
})
export class PromoCodesFormNewComponent implements OnInit {
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
	creditcarditem : any;

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
		// console.log("discount type", this.discount_type);

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
				let collect_ids: any = [];
				if (this.codeGet.creditcard_packages_id) {
					console.log(this.codeGet.creditcard_packages_id);
					collect_ids = this.codeGet.creditcard_packages_id.split(',');
					collect_ids = collect_ids.map(Number);
				}
				console.log(collect_ids);
				this.Form.get('creditcard_packages_id')?.setValue(collect_ids);
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

		let Allpackages = this.Form.get('creditcard_packages_id')?.value.join();
		// this.Form.get('creditcard_packages_id').setValue(Allpackages);
		// console.log(this.Form.get('creditcard_packages_id').value);
		let formData = new FormData();
		formData.append('title', this.Form.get('title')?.value);
		formData.append('code',this.Form.get('code')?.value);
		formData.append('discount_type',this.Form.get('discount_type')?.value);
		formData.append('discount_value',this.Form.get('discount_value')?.value);
		formData.append('expiry_datetime',this.Form.get('expiry_datetime')?.value);
		formData.append('redemptions',this.Form.get('redemptions')?.value);
		formData.append('creditcard_packages_id', Allpackages);


		this.isLoading = true;
		let method = '';

		if (this.id == 'add') {
			method = 'addDiscountCode';
		}
		else {
			formData.append('id',this.Form.get('id')?.value);
			method = 'updateDiscountCode';
			// this.router.navigateByUrl('/main/admins/' + this.type );
		}

		this.mainApiService.postData(appConfig.base_url_slug + method, formData).then(response => {
			if (response.status == 200 || response.status == 201) {
				this.router.navigateByUrl('/main/promo_codesNew');
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
		// let url = 'getCreditCardPackages?search = package_name';
		let url = 'viewPackages';

		this.mainApiService.getCreditCardPackages(appConfig.base_url_slug + url, true , 2).then(result => {

			if (result.status == 200 && result.data) {
				let Items = result.data;
				if (this.codeGet.creditcard_packages_id) {
					for (let i = 0; i < Items.length; i++) {
						if (Items[i].id == this.codeGet.creditcard_packages_id) {
							// this.creditcarditem = Items[i].name + Items[i].sub_text;
							this.creditcarditem = Items[i].id;
						}
					}
				}
			
					this.CreditCardPackagesItem = Items;
				
			}
			else {
				this.CreditCardPackagesItem = [];
			}
		});
	}
}