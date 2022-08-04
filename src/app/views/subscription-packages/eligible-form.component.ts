import { Component, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';

import { AlertDialog } from '../../lib';
import { MainService } from '../../services';
import * as moment from 'moment';
import { appConfig } from '../../../config';
import { UserAppSelectorService } from '../../lib/app-selector/app-selector.service';

declare var $: any;

@Component({
	selector: 'app-eligible-form',
	templateUrl: './eligible-form.component.html',
	styleUrls: ['./eligible-form.component.scss']
})
export class EligibleFormComponent implements OnInit {
	id: any;
	sub: Subscription;
	Form: FormGroup;
	isLoading: boolean;
	// isEditing: boolean;
	// admin: any;
	showLess: boolean;
	showGreater: boolean;
	// greaterDate: any;
	// lessDate: any;
	// csvFile: any;
	// csvJSON: any;
	select_opt: number;
	// specificUsers: string;
	push: any;
	Notification: any;
	isTypeDays: any = false;
	scenario: any;
	appSelectorSubscription: Subscription;
	selectedApp: any;
	selectVariable: any;

	constructor(protected router: Router,
		protected _route: ActivatedRoute,
		protected mainApiService: MainService,
		protected formbuilder: FormBuilder, protected dialog: MatDialog, protected appSelectorService: UserAppSelectorService) {
		this.Form = this.formbuilder.group({
			name: [null, [Validators.required]],
			name_ar: [null, [Validators.required]],
			sub_text: [null, [Validators.required]],
			sub_text_ar: [null, [Validators.required]],
			duration: [null],
			standard_value: [null],
			qatar_value: [null],
			doller_value: [null],
			standard_doller_value: [null],
			type: [null, [Validators.required]],

			// kuwait_value: [null, [Validators.required]],			
			// savings: [null, [Validators.required]],			
			scenario: [null],
		});

		// this.Form.get('type').setValidators([Validators.required]);
		// this.Form.get('type').clearValidators();
		this.isLoading = false;
		// this.isEditing = false;

		let resp = this.appSelectorService.getApp();
		this.selectedApp = parseInt(resp.user_app_id);

		this.appSelectorSubscription = this.appSelectorService.selectedApp.subscribe((response: any) => {
			this.selectedApp = parseInt(response.user_app_id);
		});
	}



	ngOnInit() {
		this.sub = this._route.params.subscribe(params => {
			this.id = params['id'];
			this.scenario = params['scenario'];
			this.Form.get('scenario').setValue(this.scenario);

			// if (this.id != 'add')
			// {
			// 	this.isEditing = true;
			//     var data = JSON.parse(localStorage.getItem('CreditCardPackages'));
			// 	this.Form.patchValue(data);
			// 	this.Form.addControl('id', new FormControl(data.id));
			// }
			// else
			// {
			// 	this.isEditing = false;
			// }
		});
		this.Form.get('sub_text').setValidators([Validators.maxLength(56)]);
		this.Form.get('sub_text').updateValueAndValidity();
		this.Form.get('sub_text_ar').setValidators([Validators.maxLength(56)]);
		this.Form.get('sub_text_ar').updateValueAndValidity();
		this.Form.get('name').setValidators([Validators.maxLength(56)]);
		this.Form.get('name').updateValueAndValidity();
		this.Form.get('name_ar').setValidators([Validators.maxLength(56)]);
		this.Form.get('name_ar').updateValueAndValidity();
	}

	onOptionChange(selectVariable) {
		if (selectVariable == 'free_subscription') {
			this.Form.get('type').clearValidators();
			this.Form.get('type').updateValueAndValidity();
			this.Form.get('sub_text').setValidators([Validators.maxLength(112)]);
			this.Form.get('sub_text').updateValueAndValidity();
			this.Form.get('sub_text_ar').setValidators([Validators.maxLength(112)]);
			this.Form.get('sub_text_ar').updateValueAndValidity();
			this.Form.get('name').setValidators([Validators.maxLength(112)]);
			this.Form.get('name').updateValueAndValidity();
			this.Form.get('name_ar').setValidators([Validators.maxLength(112)]);
			this.Form.get('name_ar').updateValueAndValidity();
		}
		else if (selectVariable == 'card_package') {
			this.Form.get('type').clearValidators();
			this.Form.get('type').updateValueAndValidity();
			this.Form.get('duration').setValidators([Validators.required]);
			this.Form.get('duration').updateValueAndValidity();
			this.Form.get('qatar_value').setValidators([Validators.required]);
			this.Form.get('qatar_value').updateValueAndValidity();
			this.Form.get('doller_value').setValidators([Validators.required]);
			this.Form.get('doller_value').updateValueAndValidity();
			this.Form.get('sub_text').setValidators([Validators.maxLength(56)]);
			this.Form.get('sub_text').updateValueAndValidity();
			this.Form.get('sub_text_ar').setValidators([Validators.maxLength(56)]);
			this.Form.get('sub_text_ar').updateValueAndValidity();
			this.Form.get('name').setValidators([Validators.maxLength(56)]);
			this.Form.get('name').updateValueAndValidity();
			this.Form.get('name_ar').setValidators([Validators.maxLength(56)]);
			this.Form.get('name_ar').updateValueAndValidity();
		}
		else if (selectVariable == 'special_package') {
			this.Form.get('type').clearValidators();
			this.Form.get('type').updateValueAndValidity();
			this.Form.get('duration').setValidators([Validators.required]);
			this.Form.get('duration').updateValueAndValidity();
			this.Form.get('qatar_value').setValidators([Validators.required]);
			this.Form.get('qatar_value').updateValueAndValidity();
			this.Form.get('doller_value').setValidators([Validators.required]);
			this.Form.get('doller_value').updateValueAndValidity();
			this.Form.get('standard_value').setValidators([Validators.required]);
			this.Form.get('standard_value').updateValueAndValidity();
			this.Form.get('standard_doller_value').setValidators([Validators.required]);
			this.Form.get('standard_doller_value').updateValueAndValidity();
			this.Form.get('sub_text').setValidators([Validators.maxLength(56)]);
			this.Form.get('sub_text').updateValueAndValidity();
			this.Form.get('sub_text_ar').setValidators([Validators.maxLength(56)]);
			this.Form.get('sub_text_ar').updateValueAndValidity();
			this.Form.get('name').setValidators([Validators.maxLength(56)]);
			this.Form.get('name').updateValueAndValidity();
			this.Form.get('name_ar').setValidators([Validators.maxLength(56)]);
			this.Form.get('name_ar').updateValueAndValidity();
		}
		else if (selectVariable == 'monthly_renewing') {
			this.Form.get('type').clearValidators();
			this.Form.get('type').updateValueAndValidity();
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

	ngOnDestroy() {
		this.sub.unsubscribe();
		// this.appSelectorSubscription.unsubscribe();
	}

	onChange(event): void {
		if (event.checked) {
			this.Form.get('push').setValue(1);
		}
		else {
			this.Form.get('push').setValue(0);
		}
	}

	getValue(name) {
		return this.Form.get(name);
	}

	onLocationBack(): void {
		window.history.back();
	}

	doSubmit(): void {
		this.isLoading = true;
		let method = '';

		// if (this.id == 'add')
		// {
		method = 'createPackage';
		// }
		// else
		// {
		// 	method = 'updateCreditcardPackages';
		// }
		// this.Form.get('scenario').setValue(this.scenario);
		this.Form.get('type').setValue(this.selectVariable);
		this.mainApiService.postData(appConfig.base_url_slug + method, this.Form.value, 2).then(response => {
			if (response.status == 200 || response.status == 201) {
				this.router.navigateByUrl('/main/subscription-packages/' + this.scenario);
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