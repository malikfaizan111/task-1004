import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, FormControl, ControlContainer } from '@angular/forms';
import { AlertDialog } from '../../../lib';
import { MainService } from '../../../services';
import { appConfig } from '../../../../config';
import { AddOutletDialogWebComponent } from './add-outlet-dialog.component';
import * as moment from 'moment';

@Component({
	selector: 'app-web_redemption-form',
	templateUrl: './web_redemption-form.component.html',
	styleUrls: ['./add-outlet-dialog.component.css'],
})
export class WebRedemptionFormComponent implements OnInit {
	id: any;
	sub: Subscription = new Subscription();
	Form: FormGroup;
	isLoading: boolean;
	// isEditing: boolean;
	isMultiple: boolean;
	expiryDatetime: any;
	currentDate: Date = new Date();
	// codeGet: any;
	errorMsg: string = '';
	outletid: any[] = [];
	getoutletname: any;
	getoutletid: any[] = [];
	selectedOutletId: any;
	selectedPackage: any;
	constructor(protected router: Router,
		protected _route: ActivatedRoute,
		protected mainApiService: MainService,
		protected formbuilder: FormBuilder, protected dialog: MatDialog) {
		this.Form = this.formbuilder.group({
			parent_outlet_id: [null, [Validators.required]],
			type: [null, [Validators.required,]],
			voucher_name: [null, [Validators.required,]],
			offer_name: [null, [Validators.required,]],
			expiry_date: [null, [Validators.required]],
			links: [null, [Validators.required, Validators.min(1), Validators.max(50000)]],
			saving_amount: [null, [Validators.required]],
			sub_text: [null, [Validators.required]],
			details_exclusions: [null, [Validators.required]],
		});

		this.isLoading = false;
		// this.isEditing = false;
		this.isMultiple = false;
		// this.codeGet = '';
	}

	ngOnInit() {
		this.Form.get('links').clearValidators();
		this.Form.get('links').updateValueAndValidity();
		// this.sub = this._route.params.subscribe(params => {
		// 	this.id = params['id'];

		// 	if (this.id) {
		// 		// this.isEditing = true;
		// 		this.Form.addControl('id', new FormControl(this.id));
		// 		let abc = localStorage.getItem('Interest_Tag') as string;
		// 		this.codeGet = JSON.parse(abc);

		// 		this.getoutletname = this.codeGet.outlet_interest_tags;
		// 		this.getoutletname.forEach((element: any) => {
		// 			// this.getoutletname1.push(element.outlets.name);
		// 			this.getoutletid.push({
		// 				id: element.outlets.id,
		// 				name: element.outlets.name
		// 			});
		// 		});
		// 		this.Form.patchValue(this.codeGet);
		// 		//this.Form.get('outlet_ids').setValue(this.getoutletname1);
		// 		// this.expiryDatetime = new Date(this.codeGet.expiry_datetime);
		// 	}
		// 	else {
		// 		// this.isEditing = false;
		// 		// this.Form.reset();
		// 	}
		// });
	}

	onSelectDate(): void {
		let oD = moment(this.expiryDatetime).format('YYYY-MM-DD');
		this.Form.get('expiry_date').setValue(oD);
	}

	getValue(name: any) {
		return this.Form.get(name);
	}

	onAddOutlets() {
		let dialogRef = this.dialog.open(AddOutletDialogWebComponent, { autoFocus: false });

		dialogRef.afterClosed().subscribe(result => {
			if (result) {
				this.Form.get('parent_outlet_id').setValue(result.name);
				this.selectedOutletId = result.id;
			}
			else {

			}
		});
	}

	onOptionChange(selectVariable) {
		this.Form.get('type').setValue(selectVariable);
		if (selectVariable == 'paid') {
			this.Form.get('links').setValidators([Validators.required, Validators.min(1), Validators.max(50000)]);
			this.Form.get('links').updateValueAndValidity();
		}
		else {
			this.Form.get('links').clearValidators();
			this.Form.get('links').updateValueAndValidity();
		}
	}

	onLocationBack(): void {
		window.history.back();
	}

	doSubmit(): void {
		this.isLoading = true;
		let method = '';
		this.Form.get('parent_outlet_id').setValue(this.selectedOutletId);

		method = 'generateVoucher';

		this.mainApiService.postData(appConfig.base_url_slug + method, this.Form.value, 2).then(response => {
			if (response.status == 200 || response.status == 201) {
				// this.router.navigateByUrl('/main/web_redemption');
				localStorage.setItem('Voucher', JSON.stringify(response.data));
				if (response.data.voucher_type == 'paid') {
					let dialogRef = this.dialog.open(AlertDialog, { autoFocus: false });
					let cm = dialogRef.componentInstance;
					cm.heading = 'Message';
					cm.message = response.message;
					cm.cancelButtonText = 'Ok';
					cm.type = 'success';
					dialogRef.afterClosed().subscribe(result => {
						this.router.navigateByUrl('main/web_redemption/' + response.data.id);
						this.isLoading = false;
					})
				}
				else {
					this.router.navigateByUrl('main/web_redemption/' + response.data.id);
					this.isLoading = false;
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
		})
	}
}