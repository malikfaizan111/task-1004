import { Component, OnInit } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { MainService, BaseLoaderService } from '../../../../services';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { AlertDialog } from '../../../../lib';
import { MatDialog } from '@angular/material/dialog';
import { appConfig } from '../../../../../config';
import { map, startWith } from 'rxjs/operators';
export interface User {
	name: string;
}
@Component({
	selector: 'app-outlet_account-form',
	templateUrl: './outlet_account-form.component.html'
})
export class OutletAccountFormComponent implements OnInit {
	myControl = new FormControl();
	options: User[] = [
		{ name: 'Mary' },
		{ name: 'Shelley' },
		{ name: 'Igor' }
	];
	filteredOptions: Observable<User[]> = new Observable();
	id: any;
	// type: any;
	sub: Subscription = new Subscription();
	Form: FormGroup;
	isLoading: boolean;
	isEditing: boolean;
	merchantccount: any;
	Merchants: any[] = [];
	Parents: any;
	filteredParentOptions: Observable<string[]> = new Observable();
	filteredParentOptionsOne: Observable<string[]> = new Observable();
	parentId: any = [];
	parentIdOne: any = [];
	Outlets: any;
	outletAccount: any = [];
	ParentsOutlet: any;
	parentOutletId: any;
	parentid: any;
	searchData: any = null;
	data: any = [];
	searchTimer: any;
	search: string;
	parentsList: any;
	constructor(protected router: Router,
		protected _route: ActivatedRoute,
		protected mainApiService: MainService,
		protected formbuilder: FormBuilder, protected loaderService: BaseLoaderService, protected dialog: MatDialog) {
		this.Form = this.formbuilder.group({
			name: [null, [Validators.required, Validators.maxLength(50)]],
			// email: [null, [Validators.required, Validators.email, Validators.maxLength(50)]],
			username: [null, [Validators.required, Validators.maxLength(50)]],
			password: [null, [Validators.required, Validators.maxLength(50)]],
			outlets_parent_id: [''],
			outlets_parent_name: ['', Validators.required],
			// outlets_parent_name: ['Select Restaurant'],
			outlet_id: [''],
			// parentObject: ['',],
			// outletParentObject: ['',],
		});
		this.search = '';
		this.isLoading = false;
		this.isEditing = false;

		this.Parents = [];
		this.ParentsOutlet = [];


	}

	ngOnInit() {
		this.sub = this._route.params.subscribe(params => {
			this.id = params['id'];
			if (this.id != 'add') {
				this.isEditing = true;
				this.Form.get('password')?.clearValidators();
				this.Form.addControl('id', new FormControl(this.id));
				this.Form.addControl('password', new FormControl(null));
				let abc = localStorage.getItem('OutletAccount') as string;
				this.outletAccount = JSON.parse(abc);
				console.log(this.outletAccount);

				console.log('this.outletAccount', this.outletAccount);
				this.Form.patchValue(this.outletAccount);
				this.Form.get('outlets_parent_id')?.setValue(this.outletAccount.outlets_parent_id);
				this.Form.get('outlets_parent_name')?.setValue(this.outletAccount.outlets_parents.name);

				// this.Form.get('outlets_parent_name').setValue(this.outletAccount.name-jo-b);

				this.Form.get('outlet_id')?.setValue(this.outletAccount.outlet_id.toString());
				this.getOutletsList(this.outletAccount.outlets_parent_id);
			}
			else {

			}
			;
		});
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
			method = 'addUserForOutlet';
		}
		else {
			method = 'updateUserForOutlet/' + this.id;
		}

		this.mainApiService.postData(appConfig.base_url_slug + method, this.Form.value, 2).then(response => {
			if (response.status == 200 || response.status == 201) {
				this.router.navigateByUrl('/main/outlet_account');
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

	getOutletsList(id: any): void {
		let status = id == 1460 ? '2' : '1';
		let url = 'getOutlets?index2=500&parent_id=' + id;

		this.mainApiService.getList(appConfig.base_url_slug + url)
			.then(result => {
				if (result.status == 200 && result.data) {
					this.ParentsOutlet = result.data.outlets;
					console.log(result);
				}
				else {
					this.ParentsOutlet = [];
				}
			});
	}

	selectEvent(item: any) {
		console.log('selectEvent', item);
		if (item) {
			this.Form.get('outlets_parent_id')?.setValue(item.id);
			this.getOutletsList(item.id);
		}
	}

	onCleared(item: any) {
		console.log('onCleared', item);
		this.Form.get('outlets_parent_id')?.setValue(null);
	}

	onChangeSearch(val: string) {
		var url = "getParents?search=" + val + '&per_page=500';

		clearTimeout(this.searchTimer);
		this.searchTimer = setTimeout(() => {
			this.mainApiService.getList(appConfig.base_url_slug + url).then(response => {
				console.log('onChangeSearch', response);

				this.parentsList = response.data.parents;
			})
		}, 700);
	}
}