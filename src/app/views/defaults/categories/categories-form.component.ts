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
	selector: 'app-categories-form',
	templateUrl: './categories-form.component.html'
})
export class CategoriesFormComponent implements OnInit {
	id: any;
	name: any;
	sub: Subscription = new Subscription();
	Form: FormGroup;
	isLoading: boolean;
	bulk_data: any = null;
	isEditing: boolean;
	promoCode: any;
	isMultiple: boolean;
	expiryDatetime: any;
	currentDate: Date = new Date();
	codeGet: any;
	discount_type: Date = new Date();
	image: any;
	isDiscountType: boolean = false;
	CreditCardPackagesItem: any[] = [];
	scenario: any;
	logo: string = '';
	errorMsg: string = '';
	categories: any = '';  // ambigous change 	categories: { [key: string]: any; };
	catArray: any = [];
	errorMsgimage: string = '';
	errorMsglogo: string = '';
	constructor(protected router: Router,
		protected _route: ActivatedRoute,
		protected mainApiService: MainService,
		protected formbuilder: FormBuilder, protected dialog: MatDialog) {
		this.Form = this.formbuilder.group({
			id: [null, [Validators.required]],
			name: [null, [Validators.required]],
			description: [null, [Validators.required]],
			image: [null, [Validators.required]],
			logo: [null, [Validators.required]],
			status: [null, [Validators.required]],
			orderby: [null, [Validators.required]],
			name_ar: [null, [Validators.required]],
			// app_access: [null, [Validators.required]],

		});


		this.isLoading = false;
		this.isEditing = false;
		this.isMultiple = false;
		this.codeGet = '';


	}

	ngOnInit() {
		this.sub = this._route.params.subscribe(params => {
			this.id = params['id'];

			if (this.id != 'add') {
				this.isEditing = true;
				this.Form.addControl('id', new FormControl(this.id));
				this.Form.removeControl('orderby');
				let abc = localStorage.getItem('categories') as string;
				this.codeGet = JSON.parse(abc);
				this.Form.patchValue(this.codeGet);

			}
			else {
				this.isEditing = false;
				this.Form.reset();
			}
		});

		this.onChanges();
	}
	onChanges(): void {
		this.Form.valueChanges.subscribe(val => {
			console.log(`newValue: `, val.image)
		})
	}

	onChangeMultiple(event: any): void {
		// log here(event);
		// if (this.isMultiple) {
		// 	this.Form.removeControl('code');
		// 	this.Form.addControl('number', new FormControl(null, [Validators.required]));
		// }
		// else {
		// 	this.Form.removeControl('number');
		// 	this.Form.addControl('code', new FormControl(null, [Validators.maxLength(6), Validators.minLength(6)]));
		// }
	}

	getValue(name: any) {
		return this.Form.get(name);
	}

	onLocationBack(): void {
		window.history.back();
	}

	doSubmit(): void {
		this.isLoading = true;
		let method = '';
		let formData = new FormData();
		for (var key in this.Form.value) {
			formData.append(key, this.Form.value[key]);
		};

		if (this.id == 'add') {
			method = 'addCategory';

		}
		else {
			method = 'updateCategory';
			formData.append('bulk_data', 'false');
		}

		this.mainApiService.postData(appConfig.base_url_slug + method, formData).then(response => {
			if (response.status == 200 || response.status == 201) {

				this.router.navigateByUrl('/main/categories');
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

	getImage1(item: any): any {
		if (this.id != 'add') {
			console.log("getimage", this.codeGet[item])
			return appConfig.file_url + this.codeGet[item];
		}
		else {
			return '';
		}
	}
}