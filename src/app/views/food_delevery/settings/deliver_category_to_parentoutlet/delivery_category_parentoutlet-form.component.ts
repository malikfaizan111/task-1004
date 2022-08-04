import { Component, OnInit } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { MainService } from '../../../../services';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { AlertDialog } from '../../../../lib';
import { MatDialog } from '@angular/material/dialog';
import { appConfig } from '../../../../../config';
import { map, startWith } from 'rxjs/operators';

@Component({
	selector: 'app-delivery_category_parentoutlet',
	templateUrl: './delivery_category_parentoutlet-form.component.html'
})
export class DeliveryCategoryParentOutletFormComponent implements OnInit {
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
	filteredParentOptions: Observable<string[]> = new Observable;
	Parents: any;
	parentId: any = [];
	data: any = [];
	errorMsg: string = '';
	PlaylistOnly: any;
	playlist: any;
	datasce: { delivery_category_id: any; } = {delivery_category_id : null};
	outlet: any;
	items: any = [];
	constructor(protected router: Router,
		protected _route: ActivatedRoute,
		protected mainApiService: MainService,
		protected formbuilder: FormBuilder, protected dialog: MatDialog) {
		this.Form = this.formbuilder.group({
			delivery_category_id: [null],
			// parent_outlet_id: ['',],
		});
		this.isLoading = false;
		this.isEditing = false;
		this.Parents = [];
		this.RestaurantMenu = '';
	}

	ngOnInit() {
		this.viewPlaylistOnly();
		this.sub = this._route.params.subscribe(params => {
			this.id = params['parentid'];
			if (this.id != 'add') {
				this.Form.addControl('id', new FormControl(this.id));
				let abc = localStorage.getItem('RestaurantParentOutlet') as string;
				this.outlet = JSON.parse(abc);
				this.items = this.outlet.delivery_categories.categories;
				var x: any[] = [];

				this.items.forEach((element: any, idx: any) => {
					x.push(element.delivery_category_id);

				});
				console.log(x);
				this.Form.get('delivery_category_id')?.setValue(x);

				// this.Form.get('delivery_category_id').valueChanges.subscribe(res =>
				// {
				// 	console.log(res);
				// })

			}
			else {
				this.isEditing = false;
				this.Form.reset();
			}
		});
	}

	getValue(name: any) {
		return this.Form.get(name);
	}

	onLocationBack(): void {
		window.history.back();
	}


	doSubmit(): void {
		this.data = [];

		this.Form.get('delivery_category_id')?.value.forEach((element: any) => {
			this.datasce = {
				"delivery_category_id": parseInt(element)
			}
			this.data.push(this.datasce)
		});

		this.isLoading = true;
		let method = '';
		var x = { "data": this.data, "parent_outlet_id": parseInt(this.id) }

		if (this.outlet.delivery_categories.categories.length > 0) {
			method = 'updateDeliveryCategoryInOutletParent';
		}
		else {
			method = 'addDeliveryCategoriesToOutletParent';
		}

		this.mainApiService.postData(appConfig.base_url_slug + method, x, 2).then(response => {
			if (response.status == 200 || response.status == 201) {
				this.isLoading = false;
				this.router.navigateByUrl('/main/restaurants');
				this.Form.reset();
			}
			else {
				this.isLoading = false;
				let dialogRef = this.dialog.open(AlertDialog, { autoFocus: false });
				let cm = dialogRef.componentInstance;
				cm.heading = 'Error';
				cm.message = "Already Assigned";
				// cm.message = response.error.message;
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
				cm.message = "Already Assigned";
				// cm.message = "Internal Server Error.";
				cm.cancelButtonText = 'Ok';
				cm.type = 'error';
			})
	}

	viewPlaylistOnly(): void {
		let url = 'viewDeliveryCategories?parent_outler_id' + this.id;
		this.mainApiService.getList(appConfig.base_url_slug + url, true, 2)
			.then(result => {
				if (result.status == 200 && result.data) {
					this.PlaylistOnly = result.data;
					this.PlaylistOnly.forEach((element: any) => {
						element.id = element.id.toString();
					});
				}
				else {
					this.PlaylistOnly = [];
				}
			});
	}
}