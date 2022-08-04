import { Component, OnInit } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { MainService } from '../../../services';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { AlertDialog } from '../../../lib';
import { MatDialog } from '@angular/material/dialog';
import { appConfig } from '../../../../config';
import { map, startWith } from 'rxjs/operators';

@Component({
	selector: 'app-main_menu',
	templateUrl: './main_menu-form.component.html'
})
export class MainMenuFormComponent implements OnInit {
	id: any;
	// type: any;
	sub: Subscription = new Subscription();
	Form: FormGroup;
	isLoading: boolean;
	isEditing: boolean;
	merchantccount: any;
	filteredOptions: Observable<string[]> = new Observable();
	Merchants: any[] = [];
	RestaurantMenu: any;
	RestaurantsParentOutlets: any;
	filteredParentOptions: Observable<string[]> = new Observable();
	Parents: any;
	parentId: any = [];
	Parentid: any;

	constructor(protected router: Router,
		protected _route: ActivatedRoute,
		protected mainApiService: MainService,
		protected formbuilder: FormBuilder, protected dialog: MatDialog) {
		this.Form = this.formbuilder.group({
			name: [null, [Validators.required]],
			name_ar: [null, [Validators.required]],
			parent_outlet_id: ['',],
			id_csv: ['']
		});

		this.isLoading = false;
		this.isEditing = false;
		this.Parents = [];
		this.RestaurantMenu = '';
	}

	ngOnInit() {

		this.sub = this._route.params.subscribe(params => {
			this.id = params['MainMenuId'];
			this.Parentid = params['parentid'];
			console.log("menu iddddd", this.id)

			if (this.id != 'add') {
				this.isEditing = true;
				this.Form.addControl('id', new FormControl(this.id));
				let abc = localStorage.getItem('MainMenuItem') as string;
				this.RestaurantMenu = JSON.parse(abc);
				this.Form.patchValue(this.RestaurantMenu);

			}
			else {
				this.isEditing = false;
				this.Form.reset();
			}

			// Parent Data

			// 	this.Form.get('parentObject').valueChanges.subscribe(response =>
			// 	{

			// 		if (response == null)
			// 		{
			// 			return
			// 		}
			// 		if (typeof response != 'object')
			// 		{
			// 			this.Form.get('parentObject').setErrors(Validators.requiredTrue);
			// 		}
			// 		else
			// 		{
			// 			this.Form.get('parent_outlet_id').setValue(response.id);
			// 			this.parentId==response.id;
			// 			// this.parentId==this.Form.get('parent_outlet_id').value;
			// 			console.log("parentidddd",this.parentId)
			// 		}
			// 	})

			// 	this.filteredParentOptions = this.Form.get('parentObject').valueChanges.pipe(
			// 		startWith<any>(''),
			// 		map(value => typeof value == 'string' ? value : value.name),
			// 		map(name => name ? this._filterParent(name) : this.Parents.slice())
			// 	);
		});
		// this.gerParentsList();

	}

	getValue(name: any) {
		return this.Form.get(name);
	}

	onLocationBack(): void {
		window.history.back();
	}


	// displayFnParent(user?: any): string | undefined
	// {
	// 	return user ? user.name : undefined;
	// }

	// private _filterParent(name: string): any[]
	// {
	// 	const filterValue = name.toLowerCase();
	// 	return this.Parents.filter(option => option.name.toLowerCase().indexOf(filterValue) == 0);
	// }

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
		this.Form.get('parent_outlet_id')?.setValue(this.Parentid);

		this.isLoading = true;
		let method = '';

		if (this.id == 'add') {
			method = 'addMainMenuItem';
		}
		else {
			method = 'updateMainMenuItem/' + this.id;
		}

		this.mainApiService.postData(appConfig.base_url_slug + method, this.Form.value, 2).then(response => {
			if (response.status == 200 || response.status == 201) {

				this.router.navigateByUrl('/main/restaurants/mainMenuItem/' + this.Parentid);
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
}