import { Component, OnInit } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { MainService } from '../../../services';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { AlertDialog } from '../../../lib';
import { MatDialog } from '@angular/material/dialog';
import { appConfig } from '../../../../config';

@Component({
	selector: 'app-restaurants',
	templateUrl: './restaurants-form.component.html'
})
export class RestaurantsFormComponent implements OnInit {
	id: any;
	sub: Subscription = new Subscription();
	Form: FormGroup;
	isLoading: boolean;
	isEditing: boolean;
	deliveryOutletId: any;
	errorMsg: string = '';
	errorMsgimage: string = '';
	errorMsglogo: string = '';

	constructor(protected router: Router,
		protected _route: ActivatedRoute,
		protected mainApiService: MainService,
		protected formbuilder: FormBuilder, protected dialog: MatDialog) {
		this.Form = this.formbuilder.group({
			name: [null, [Validators.required]],
			title: [null, [Validators.required]],
			image: [null],
			logo: [null],
			delivery_charges: [null, [Validators.required]],
			commission_charges: [null, [Validators.required]],
			opening_time: [null, [Validators.required]],
			closing_time: [null, [Validators.required]],
			min_order_charges: [null, [Validators.required]],
			approx_delivery_time: [null, [Validators.required]],
			special: [null, [Validators.required]],
			delivery_status: [null, [Validators.required]],
			delivery_featured: [null, [Validators.required]],
			contratually_agreed_delivery_charges: [null],
			credit_card_fee: [null],
			contract_commission_standard: [null],
			contract_commission_up_driver: [null],
			contract_merchant_driver_fee: [null, [Validators.required]],
		});

		this.isLoading = false;
		this.isEditing = false;
		this.deliveryOutletId = '';
	}

	ngOnInit() {
		this.sub = this._route.params.subscribe(params => {
			this.id = params['id'];
			if (this.id != 'add') {
				this.isEditing = true;
				this.Form.addControl('id', new FormControl(this.id));
				let abc = localStorage.getItem('RestaurantParentOutlet') as string;
				this.deliveryOutletId = JSON.parse(abc);
				this.Form.patchValue(this.deliveryOutletId);

			}
			else {
				this.isEditing = false;
				this.Form.reset();
			}
		});
		this.onChanges();
	}

	getValue(name: any) {
		return this.Form.get(name);
	}

	onLocationBack(): void {
		window.history.back();
	}
	onChanges(): void {
		this.Form.valueChanges.subscribe(val => {
			console.log(`newValue: `, val.image.name)
		})
	}

	doSubmit(): void {
		this.isLoading = true;
		console.log(this.Form.get('credit_card_fee')?.value);
		let method = '';
		let formData = new FormData();
		for (var key in this.Form.value) {
			formData.append(key, this.Form.value[key]);
		}

		if (this.id == 'add') {
			method = 'addParent';
		}
		else {
			method = 'updateParent';
		}

		this.mainApiService.postData(appConfig.base_url_slug + method, formData).then(response => {
			if (response.status == 200 || response.status == 201) {
				this.router.navigateByUrl('/main/restaurants');
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


	onFileSelect(event: any) {
		if (event.controlName == 'image') {

			if (event.valid) {
				this.Form.get(event.controlName)?.patchValue(event.file);
				this.errorMsgimage = '';
			}
			else {
				this.errorMsgimage = 'Please select image'
			}
		}
		if (event.controlName == 'logo') {
			if (event.valid) {
				this.Form.get(event.controlName)?.patchValue(event.file);
				this.errorMsglogo = '';
			}
			else {
				this.errorMsglogo = 'Please select  logo'
			}

		}
		else {
			this.errorMsglogo = 'Please select  logo'
		}
	}

	getImage(item: any): any {
		if (this.id != 'add') {
			return appConfig.file_urlV2 + this.deliveryOutletId[item];
		}
		else {
			return '';
		}
	}

	isNumberKey(controlName: any, evt: any) {
		let text = this.Form.get(controlName)?.value;
		var charCode = (evt.which) ? evt.which : evt.keyCode;
		if (charCode == 46) {
			//Check if the text already contains the . character
			if (text.indexOf('.') == -1) {
				return true;
			} else {
				return false;
			}
		} else {
			if (charCode > 31 &&
				(charCode < 48 || charCode > 57))
				return false;
		}
		return true;
	}
}