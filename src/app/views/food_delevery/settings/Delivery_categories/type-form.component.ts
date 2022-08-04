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
	selector: 'app-type',
	templateUrl: './type-form.component.html'
})
export class TypeFormComponent implements OnInit {
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
	RestaurantMenu: any;
	RestaurantsParentOutlets: any;
	Parents: any;
	parentId: any = [];
	errorMsg: string = '';
	keyword = 'parent_outlet_id';
	searchData: any = null;
	data: any = [];
	searchTimer: any;
	search: string;

	constructor(protected router: Router,
		protected _route: ActivatedRoute,
		protected mainApiService: MainService,
		protected formbuilder: FormBuilder, protected loaderService: BaseLoaderService, protected dialog: MatDialog) {
		this.Form = this.formbuilder.group({
			name: [null, [Validators.required]],
			name_ar: [null, [Validators.required]],
			// parent_outlet_id: [null],
			// parentObject: ['',],
			image: [null, [Validators.required]],

		});

		this.search = '';
		this.isLoading = false;
		this.isEditing = false;
		this.Parents = [];
		this.RestaurantMenu = '';
	}

	ngOnInit() {

		this.sub = this._route.params.subscribe(params => {
			this.id = params['id'];
			console.log("menu iddddd", this.id)

			if (this.id != 'add') {
				this.isEditing = true;
				this.Form.addControl('id', new FormControl(this.id));
				let abc = localStorage.getItem('MainMenuItem') as string
				this.RestaurantMenu = JSON.parse(abc);
				this.Form.patchValue(this.RestaurantMenu);
				this.Form.get('parentObject')?.setValue({
					id: this.RestaurantMenu.outletParent.id, name: this.RestaurantMenu.outletParent.name
				})
			}
			else {
				this.isEditing = false;
				this.Form.reset();
			}

			// Parent Data

			this.Form.get('parentObject')?.valueChanges.subscribe(response => {

				if (response == null) {
					return
				}
				if (typeof response != 'object') {
					this.Form.get('parentObject')?.setErrors(Validators.requiredTrue);
				}
				else {
					this.Form.get('parent_outlet_id')?.setValue(response.id);
					this.parentId == response.id;
					// this.parentId==this.Form.get('parent_outlet_id').value;
					console.log("parentidddd", this.parentId)
				}
			})

			// this.filteredParentOptions = this.Form.get('parentObject').valueChanges.pipe(
			// 	startWith<any>(''),
			// 	map(value => typeof value == 'string' ? value : value.name),
			// 	map(name => name ? this._filterParent(name) : this.Parents.slice())
			// );
		});
		// this.gerParentsList();

	}
	displayFn(user?: any): string | undefined {
		return user && user.name ? user.name : '';
	}
	private _filter(name: string): User[] {
		const filterValue = name.toLowerCase();
		return this.options.filter(option => option.name.toLowerCase().indexOf(filterValue) == 0);
	}
	onSelectionChange(e: any) {
		this.searchData = e.option.value;
	}
	onSearch() {

		clearTimeout(this.searchTimer);
		this.searchTimer = setTimeout(() => {

			if (this.search) {
				this.loaderService.setLoading(true);
				var data = {
					search: this.search
				}
				var url = "getParents?search=" + this.search;
				this.mainApiService.getList(appConfig.base_url_slug + url)
					.then(result => {
						if (result.status == 200 && result.data) {
							// this.searchData = result.data;
							this.options = result.data.parents;
							// this.Promotion.push(this.searchData)
							this.loaderService.setLoading(false);
							this.filteredOptions = this.myControl.valueChanges
								.pipe(
									startWith<any>(''),
									map(value => typeof value == 'string' ? value : value.name),
									map(name => name ? this._filter(name) : this.options.slice())
								);
						}
						else {
							this.searchData = null;
							this.loaderService.setLoading(false);
						}
					});
			}

		}, 800);
	}

	// selectEvent(item)
	// {
	// 	if (item)
	// 	{
	// 		this.Form.get('parent_outlet_id').setValue(item.id);
	// 	}
	// }
	// onCleared(item)
	// {
	// 	this.Form.get('parent_outlet_id').setValue(null);
	// }
	// onChangeSearch(val: string)
	// {
	// 	clearTimeout(this.searchTimer);
	// 	this.searchTimer = setTimeout(() =>
	// 	{
	// 		let method = 'getParents' + val;

	// 		this.mainApiService.getList(method).then(response =>
	// 		{
	// 			this.data = response.data.listing;
	// 		})
	// 	}, 700);
	// }
	getValue(name: any) {
		return this.Form.get(name);
	}

	onLocationBack(): void {
		window.history.back();
	}






	// gerParentsList(): void
	// {
	// 	let url = 'getParents';

	// 	this.mainApiService.getList(appConfig.base_url_slug + url).then(result =>
	// 	{
	// 		if (result.status == 200 && result.data)
	// 		{

	// 			result.data.parents.forEach(element =>
	// 			{
	// 				if (element.id != null && element.name != null)
	// 				{
	// 					this.Parents.push(element);
	// 				}
	// 			});

	// 			this.filteredParentOptions = this.Form.get('parentObject').valueChanges.pipe(
	// 				startWith<any>(''),
	// 				map(value => typeof value == 'string' ? value : value.name),
	// 				map(name => name ? this._filterParent(name) : this.Parents.slice())
	// 			);
	// 		}
	// 		else
	// 		{
	// 			this.Parents = [];
	// 			this.filteredParentOptions = this.Form.get('parentObject').valueChanges.pipe(
	// 				startWith<any>(''),
	// 				map(value => typeof value == 'string' ? value : value.name),
	// 				map(name => name ? this._filterParent(name) : this.Parents.slice())
	// 			);

	// 		}
	// 	});
	// }

	doSubmit(): void {
		this.isLoading = true;
		let method = '';
		let formData = new FormData();
		for (var key in this.Form.value) {
			formData.append(key, this.Form.value[key]);
		}

		if (this.id == 'add') {
			method = 'addDeliveryCategories';
		}
		else {
			method = 'updateDeliveryCategories/' + this.id;
		}

		this.mainApiService.postData(appConfig.base_url_slug + method, formData, 2).then(response => {
			if (response.status == 200 || response.status == 201) {
				window.history.back();
				// this.router.navigateByUrl('/main/Delivery_categories/menuValue/' + this.Form.get('parent_outlet_id').value);
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
				this.errorMsg = '';
			}
			else {
				if (event.controlName == 'icon') {
					this.errorMsg = 'Please select 600*900 image.'
				}
				if (event.controlName == 'image') {
					this.errorMsg = 'Please select 600*900 image.'
				}
			}
		}
	}

	getImage(item: any): any {
		if (this.id != 'add') {
			return appConfig.file_urlV2 + this.RestaurantMenu[item];
		}
		else {
			return '';
		}
	}
}