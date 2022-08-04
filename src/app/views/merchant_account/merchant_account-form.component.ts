import { Component, OnInit } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { MainService } from '../../services';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { AlertDialog } from '../../lib';
import { MatDialog } from '@angular/material/dialog';
import { appConfig } from '../../../config';
import { map, startWith } from 'rxjs/operators';

@Component({
	selector: 'app-merchant_account-form',
	templateUrl: './merchant_account-form.component.html'
})
export class MerchantAccountFormComponent implements OnInit {
	id: any;
	// type: any;
	sub: Subscription = new Subscription();
	Form: FormGroup;
	isLoading: boolean;
	isEditing: boolean;
	merchantccount: any;
	filteredOptions: Observable<string[]> = new Observable();
	Merchants: any[];

	constructor(protected router: Router,
		protected _route: ActivatedRoute,
		protected mainApiService: MainService,
		protected formbuilder: FormBuilder, protected dialog: MatDialog) {
		this.Form = this.formbuilder.group({
			name: [null, [Validators.required, Validators.maxLength(50)]],
			email: [null, [Validators.required, Validators.email, Validators.maxLength(50)]],
			username: [null, [Validators.required, Validators.maxLength(50)]],
			password: [null, [Validators.required, Validators.maxLength(50)]],
			merchant_id: [null, [Validators.required]],
			merchantObject: ['', [Validators.required, Validators.maxLength(50)]],
		});
		this.isLoading = false;
		this.isEditing = false;
		this.Merchants = [];
	}

	ngOnInit() {
		this.Form.get('merchantObject')?.valueChanges.subscribe(response => {
			if (response == null) {
				return
			}
			if (typeof response != 'object') {
				this.Form.get('merchantObject')?.setErrors(Validators.requiredTrue);
			}
			else {
				this.Form.get('merchant_id')?.setValue(response.id);
			}
		})

		this.filteredOptions = this.Form.get('merchantObject')!.valueChanges.pipe(
			startWith<any>(''),
			map(value => typeof value == 'string' ? value : value.name),
			map(name => name ? this._filter(name) : this.Merchants.slice())
		);
		this.sub = this._route.params.subscribe(params => {
			this.id = params['id'];
			if (this.id != 'add') {
				this.isEditing = true;
				// this.Form.addControl('id', new FormControl(this.id));
				// this.Form.addControl('password', new FormControl(null));
				// this.merchantaccount = JSON.parse(localStorage.getItem('Admin'));
				// this.Form.patchValue(this.merchantaccount);

				// this.Form.get('password').valueChanges.subscribe(response => {
				// 	if((response.length != 0 && response.length < 6) || response.length > 50)
				// 	{
				// 		this.Form.get('password').setErrors(Validators.required);
				// 	}
				// 	if (response.length == 0)
				// 	{
				// 		this.Form.get('password').setErrors(null);
				// 	}
				// })
			}
			else {
				// this.Form.addControl('password', new FormControl(null, [Validators.required, Validators.minLength(6), Validators.maxLength(50)]));
				// this.isEditing = false;
				// this.Form.reset();
				// localStorage.removeItem('Admin');
			}
			// log here(params);
		});
		this.gerMerchantsList();
	}

	getValue(name: any) {
		return this.Form.get(name);
	}

	onLocationBack(): void {
		window.history.back();
	}
	displayFn(user?: any): string {
		return user ? user.name : undefined;
	}

	private _filter(name: string): any[] {
		const filterValue = name.toLowerCase();
		return this.Merchants.filter(option => option.name.toLowerCase().indexOf(filterValue) == 0);
	}

	doSubmit(): void {
		this.isLoading = true;
		let method = '';

		if (this.id == 'add') {
			method = 'merchantDashboard/merchantSignup';
		}
		else {
			method = 'merchantDashboard/merchantSignup';
		}

		this.mainApiService.postData(method, this.Form.value).then(response => {
			if (response.status == 200 || response.status == 201) {
				this.router.navigateByUrl('/main/merchant_account');
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
	gerMerchantsList(): void {
		let url = 'getAllMerchants';

		this.mainApiService.getList(appConfig.base_url_slug + url).then(result => {
			if (result.status == 200 && result.data) {
				// this.Outlets = result.data;

				result.data.forEach((element: any) => {
					if (element.id != null && element.name != null) {
						this.Merchants.push(element);
					}
				});

				this.filteredOptions = this.Form.get('merchantObject')!.valueChanges.pipe(
					startWith<any>(''),
					map(value => typeof value == 'string' ? value : value.name),
					map(name => name ? this._filter(name) : this.Merchants.slice())
				);
			}
			else {
				this.Merchants = [];
				this.filteredOptions = this.Form.get('merchantObject')!.valueChanges.pipe(
					startWith<any>(''),
					map(value => typeof value == 'string' ? value : value.name),
					map(name => name ? this._filter(name) : this.Merchants.slice())
				);
			}
		});
	}
}