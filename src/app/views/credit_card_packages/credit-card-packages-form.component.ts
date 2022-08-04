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
	selector: 'app-credit-card-packages-form',
	templateUrl: './credit-card-packages-form.component.html'
})
export class CreditCardPackagesFormComponent implements OnInit {
	id: any;
	sub: Subscription = new Subscription();
	Form: FormGroup;
	isLoading: boolean;
	isEditing: boolean;
	admin: any;
	showLess: any = null;
	showGreater: any = null;
	greaterDate: any;
	lessDate: any;
	csvFile: any;
	csvJSON: any;
	select_opt?: number;
	specificUsers: string = '';
	push: any;
	Notification: any;
	isTypeDays: any = false;
	scenario: any;
	appSelectorSubscription: Subscription;
	selectedApp: any;

	constructor(protected router: Router,
		protected _route: ActivatedRoute,
		protected mainApiService: MainService,
		protected formbuilder: FormBuilder, protected dialog: MatDialog, protected appSelectorService: UserAppSelectorService) {
		this.Form = this.formbuilder.group({
			name: [null, [Validators.required, Validators.maxLength(50)]],
			type: [null, [Validators.required]],
			qatar_value: [null, [Validators.required]],
			// kuwait_value: [null, [Validators.required]],
			doller_value: [null, [Validators.required]],
			// savings: [null, [Validators.required]],
			duration: [null, [Validators.required]],
			scenario: [null, [Validators.required]],
			sub_text: [null],
			name_ar: [null, [Validators.required]],
			sub_text_ar: [null],
		});

		this.isLoading = false;
		this.isEditing = false;

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
			this.Form.get('scenario')?.setValue(this.scenario);

			if (this.id != 'add') {
				this.isEditing = true;
				let abc = localStorage.getItem('CreditCardPackages') as string;
				var data = JSON.parse(abc);
				this.Form.patchValue(data);
				this.Form.addControl('id', new FormControl(data.id));
			}
			else {
				this.isEditing = false;
			}
		});
	}

	ngOnDestroy() {
		this.sub.unsubscribe();
		this.appSelectorSubscription.unsubscribe();
	}

	onChange(event: any): void {
		if (event.checked) {
			this.Form.get('push')?.setValue(1);
		}
		else {
			this.Form.get('push')?.setValue(0);
		}
	}

	onChangeType(event: any) {

		this.isTypeDays = false;
		this.Form.get('duration')?.setValue(null);

		if (event.value == '1 month') {
			this.Form.get('duration')?.setValue(30);
		}
		else if (event.value == '3 months') {
			this.Form.get('duration')?.setValue(90);
		}
		else if (event.value == '6 months') {
			this.Form.get('duration')?.setValue(180);
		}
		else if (event.value == '1 year') {
			this.Form.get('duration')?.setValue(365);
		}
		else if (event.value == 'days') {
			this.isTypeDays = true;
		}
	}

	onLessDate(): void {
		let abc = moment(this.lessDate).format('YYYY-MM-DD HH:mm:ss');
		this.Form.get('less_than')?.setValue(abc);
	}

	onGreaterDate(): void {
		let abc = moment(this.greaterDate).format('YYYY-MM-DD HH:mm:ss');
		this.Form.get('greater_than')?.setValue(abc);
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

		if (this.id == 'add') {
			method = 'addCreditcardPackages';
		}
		else {
			method = 'updateCreditcardPackages';
		}

		this.mainApiService.postData(appConfig.base_url_slug + method, this.Form.value).then(response => {
			if (response.status == 200 || response.status == 201) {
				this.router.navigateByUrl('/main/credit-card-packages/' + this.scenario);
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