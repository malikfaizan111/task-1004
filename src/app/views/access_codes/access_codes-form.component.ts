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
	selector: 'app-access_codes-form',
	templateUrl: './access_codes-form.component.html'
})
export class AccessCodesFormComponent implements OnInit 
{
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
	
	constructor(protected router: Router,
		protected _route: ActivatedRoute,
		protected mainApiService: MainService,
		protected formbuilder: FormBuilder, protected dialog: MatDialog)	
	{
		this.Form = this.formbuilder.group({
			title: [null, [Validators.required, Validators.maxLength(50)]],
			code: [null, [Validators.maxLength(6), Validators.minLength(6)]],
			days: [null, [Validators.required, Validators.maxLength(50)]],
			expiry_datetime: [null, [Validators.required]],
			redemptions: [null, [Validators.required, Validators.maxLength(50)]],
		});

		this.isLoading = false;
		this.isEditing = false;
		this.isMultiple = false;
		this.codeGet = '';
	}

	ngOnInit() 
	{
		this.sub = this._route.params.subscribe(params => {
			this.id = params['id'];
			
			if (this.id != 'add') 
			{
				this.isEditing = true;
				this.Form.addControl('id', new FormControl(this.id));
				let abc = localStorage.getItem('PromoCode') as string;
				this.codeGet = JSON.parse(abc);
				this.Form.patchValue(this.codeGet);
				this.expiryDatetime = new Date(this.codeGet.expiry_datetime);
			}
			else 
			{
				this.isEditing = false;
				// this.Form.addControl('user_app_id', new FormControl(1, [Validators.required]));
				this.Form.reset();
			}
			
		});

	}

	onSelectDate(): void
	{
		let abc = moment(this.expiryDatetime).format('YYYY-MM-DD HH:mm:ss');
		this.Form.get('expiry_datetime')?.setValue(abc);
	}

	onChangeMultiple(event : any): void
	{
		// log here(event);
		if(this.isMultiple)
		{
			this.Form.removeControl('code');
			this.Form.addControl('number', new FormControl(null, [Validators.required]));
		}
		else
		{
			this.Form.removeControl('number');
			this.Form.addControl('code', new FormControl(null, [Validators.maxLength(6), Validators.minLength(6)]));
		}
	}

	getValue(name : any) 
    { 
        return this.Form.get(name); 
	}

	getImage(item : any): any
	{
		if (this.id != 'add') 
		{
			// this.isEditing = true;
			// this.Form.addControl('id', new FormControl(this.id));
			// this.menuItem = JSON.parse(localStorage.getItem('MenuItem'));
			// this.Form.patchValue(this.menuItem);
			// // log here(this.menuItem);
			// return this.file_url + this.menuItem[item];
			return
		}
		else 
		{
			// this.isEditing = false;
			// this.Form.reset();
			// localStorage.removeItem('MenuItem');

			return '';
		}

		
	}

	onLocationBack(): void
	{
		window.history.back();
	}

	doSubmit(): void 
	{
		this.isLoading = true;
		let method = '';
		
		if (this.id == 'add') 
		{
			method = 'addAccessCode';
		}
		else 
		{
			method = 'updateAccessCode';
			// this.router.navigateByUrl('/main/admins/' + this.type );
		}
		// this.Form.get('type').setValue(this.type);

		this.mainApiService.postData(appConfig.base_url_slug + method, this.Form.value).then(response => {
			if (response.status == 200 || response.status == 201) 
			{
				this.router.navigateByUrl('/main/access_codes' );
				this.isLoading = false;
			}
			else 
			{
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

		let dialogRef = this.dialog.open(AlertDialog, { autoFocus: false });
		let cm = dialogRef.componentInstance;
		cm.heading = 'Success';
		cm.message = "Your Request has been send.";
		cm.cancelButtonText = 'Ok';
		cm.type = 'success';
		dialogRef.afterClosed().subscribe(result => {
			// this.router.navigateByUrl('/main/sms/list');
		})
	}

}