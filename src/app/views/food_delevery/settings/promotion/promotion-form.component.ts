import { Component, OnInit } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { MainService } from '../../../../services';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { AlertDialog } from '../../../../lib';
import { MatDialog } from '@angular/material/dialog';
import { appConfig } from '../../../../../config';
import { map, startWith } from 'rxjs/operators';
import * as moment from 'moment';
import { NgIf } from '@angular/common';

@Component({
	selector: 'app-promotion',
	templateUrl: './promotion-form.component.html'
})
export class PromotionFormComponent implements OnInit {
	id: any;
	// type: any;
	sub: Subscription = new Subscription();
	Form: FormGroup;
	currentDate = new Date();

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
	errorMsg: string = '';
	parentOutletId: any = [];
	MenuType: any = [];
	MainMenuItem: any = [];
	firstarr: any = [];
	secoundarr: any = [];
	thirdarr: any = [];
	menuItemId: any;
	SubMenuOpen: any = null;
	SubmenuId: any;
	StartDate: any;
	EndDate: any;
	MenuItem: any;
	MultiDropDown: boolean = false;
	MultiDropDownFree: boolean = false;
	ExclusionDropDown: boolean = false;
	ids: any;
	menuItemsForPurchaseEdit: any[] = [];
	mainMenuItemsForPurchaseEdit: any[] = [];
	menuItemsForFreeEdit: any[] = [];
	mainMenuItemsForFreeEdit: any[] = [];
	freeTypeForEdit = '';
	purchasedTypeForEdit = '';
	exclusionItemsForEdit: any[] = [];

	arrlength: any;
	promotiondetail: any[] = [];
	constructor(protected router: Router,
		protected _route: ActivatedRoute,
		protected mainApiService: MainService,
		protected formbuilder: FormBuilder, protected dialog: MatDialog) {

		this.Form = this.formbuilder.group({
			purchase_type: [null, [Validators.required]],
			main_menu_item_id_for_purchase: ['',],
			menu_item_id_for_purchase: ['',],
			free_item_type: [null, [Validators.required]],
			main_menu_item_id_for_free: ['',],
			promotion_details: ['',],
			menu_item_id_for_free: ['',],
			main_menu_item_id_for_exclusions: ['',],
			name: [null, [Validators.required]],
			price: [null, [Validators.required]],
			name_ar: [null, [Validators.required]],
			type: [null, [Validators.required]],
			availability_type: [null, [Validators.required]],
			availability_duration: [null, [Validators.required]],
			exclusion_status: [null, [Validators.required]],
			from_date: [null, [Validators.required]],
			to_date: [null, [Validators.required]],
			from_time: ['',],
			to_time: ['',],
			parent_outlet_id: ['',],
			per_user: ['1', [Validators.required, Validators.maxLength(50)]],
			renew: ['1', [Validators.required]],
			calculation_type: ['', [Validators.required]],
		});
		console.log("form values", this.Form.value)

		this.isLoading = false;
		this.isEditing = false;
		this.Parents = [];
		this.RestaurantMenu = '';
		this.getMainMenuItem();


	}
	onStartDate(): void {
		let abc = moment(this.StartDate).format('YYYY-MM-DD');
		let starttime = moment(this.StartDate).format('HH:mm:ss');

		this.Form.get('from_date')?.setValue(abc);
		this.Form.get('from_time')?.setValue(starttime);
	}

	onEndDate(): void {
		let abc = moment(this.EndDate).format('YYYY-MM-DD');
		let Endtime = moment(this.EndDate).format('HH:mm:ss');

		this.Form.get('to_date')?.setValue(abc);
		this.Form.get('to_time')?.setValue(Endtime);
	}
	onSelectChange(event: any): void {
		if (event.value == 0) {
			this.Form.addControl('redemptions', new FormControl(null, [Validators.required]));
		}
		else {
			this.Form.removeControl('redemptions');
		}
	}
	ngOnInit() {
		this.sub = this._route.params.subscribe(params => {
			this.ids = params['parentid'];
			this.id = params['promotionid'];
			console.log("parent", this.ids)
			console.log("parent prootion", this.id)

			if (this.id != 'add') {
				this.isEditing = true;
				this.Form.addControl('id', new FormControl(this.id));
				let abc = localStorage.getItem('Promotion') as string;
				this.RestaurantMenu = JSON.parse(abc);

				//-----  AVAILABLITY & DURATION Data Populate for Edit -----//

				this.StartDate = moment(this.RestaurantMenu.from_date + ' ' + this.RestaurantMenu.from_time).toDate();
				this.EndDate = moment(this.RestaurantMenu.to_date + ' ' + this.RestaurantMenu.to_time).toDate();

				//------ MENU Data Populate for Edit ------//
				if (this.RestaurantMenu.promotion_details.length != 0) {
					this.purchasedTypeForEdit = this.RestaurantMenu.promotion_details[0].purchase_type;
					this.freeTypeForEdit = this.RestaurantMenu.promotion_details[0].free_item_type;
					this.RestaurantMenu.promotion_details.forEach((element: any) => {
						if (element.purchase_type == 'menu_item') {
							this.menuItemsForPurchaseEdit.push(element.menu_item_id_for_purchase)
						} else {
							this.mainMenuItemsForPurchaseEdit.push(element.main_menu_item_id_for_purchase);
							console.log('main menu item for purchase ', this.mainMenuItemsForPurchaseEdit);
						}

						if (element.free_item_type == 'menu_item') {
							this.menuItemsForFreeEdit.push(element.main_menu_item_id_for_free)
						} else {
							this.mainMenuItemsForFreeEdit.push(element.main_menu_item_id_for_free);
							console.log('main menu item for Free ', this.mainMenuItemsForFreeEdit);
						}

						if (element.main_menu_item_id_for_exclusions) {
							this.exclusionItemsForEdit.push(element.main_menu_item_id_for_exclusions);
						}

					});

					if (this.purchasedTypeForEdit) {
						if (this.purchasedTypeForEdit == 'menu_item') {
							this.MultiDropDown = false;
							this.getMenuItem();
							this.Form.get('menu_item_id_for_purchase')?.setValue(this.menuItemsForPurchaseEdit);
						} else {
							this.MultiDropDown = true;
							this.getMainMenuItem();
							this.Form.get('main_menu_item_id_for_purchase')?.setValue(this.mainMenuItemsForPurchaseEdit);
						}
						this.Form.get('purchase_type')?.setValue(this.purchasedTypeForEdit);
					}

					if (this.freeTypeForEdit) {
						if (this.freeTypeForEdit == 'menu_item') {
							this.MultiDropDownFree = false;
							this.getMenuItem();
							this.Form.get('menu_item_id_for_free')?.setValue(this.menuItemsForFreeEdit);
						} else {
							this.MultiDropDownFree = true;
							this.getMainMenuItem();
							this.Form.get('main_menu_item_id_for_free')?.setValue(this.mainMenuItemsForFreeEdit);
						}
						this.Form.get('free_item_type')?.setValue(this.purchasedTypeForEdit);
					}

					if (this.RestaurantMenu.exclusion_status == '1') {
						this.ExclusionDropDown = true;
						this.getMainMenuItem();
						this.Form.get('main_menu_item_id_for_exclusions')?.setValue(this.exclusionItemsForEdit);
					}
				}

				this.Form.patchValue(this.RestaurantMenu);

				if (this.RestaurantMenu.renew == 0) {
					this.Form.addControl('redemptions', new FormControl(null, [Validators.required]));
					this.Form.get('redemptions')?.setValue(this.RestaurantMenu.redemptions);
				}
				let collect_ids: any;
				// if (this.RestaurantMenu.main_menu_item_id_for_exclusions)
				// {
				// 	collect_ids = this.RestaurantMenu.main_menu_item_id_for_exclusions.split(',');
				// }
				// this.Form.get('main_menu_item_id_for_exclusions').setValue(collect_ids);
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

	onChangeType(event: any) {
		console.log("event", event)
		if (event.value == 'main_menu_item') {
			this.MultiDropDown = true;
			this.getMainMenuItem();
			this.Form.get('menu_item_id_for_purchase')?.setValue(null);
		}
		else if (event.value == 'menu_item') {
			this.MultiDropDown = false;
			this.getMenuItem();
			this.Form.get('main_menu_item_id_for_purchase')?.setValue(null);
		}
		else {
			alert("need help")
		}

	}

	check() {
		console.log(this.Form.get('main_menu_item_id_for_purchase')?.value);
	}
	onChangeTypeFree(event: any) {

		if (event.value == 'main_menu_item') {
			this.MultiDropDownFree = true;
			this.getMainMenuItem();
			this.Form.get('menu_item_id_for_free')?.setValue(null);
		}
		else if (event.value == 'menu_item') {
			this.MultiDropDownFree = false;
			this.getMenuItem();
			this.Form.get('main_menu_item_id_for_free')?.setValue(null);
		}
		else {
			alert("need help")
		}

	}
	onChangeExclusions(event: any) {

		if (event.value == '1') {
			this.ExclusionDropDown = true;
			this.getMainMenuItem();

		}
		else {
			this.ExclusionDropDown = false;
			this.Form.get('main_menu_item_id_for_exclusions')?.setValue(null);
		}


	}
	getMainMenuItem(): void {
		let url = 'viewMainMenuItem?parent_outlet_id=' + this.ids;

		this.mainApiService.getList(appConfig.base_url_slug + url, false, 2)
			.then(result => {
				if (result.status == 200 && result.data) {
					this.MainMenuItem = result.data.filter((data: any) => data.status == '1');
				}
				else {
					this.MainMenuItem = [];
				}
			});;

	}
	getMenuItem(): void {
		let url = 'viewMenuItem?parent_outlet_id=' + this.ids;

		this.mainApiService.getList(appConfig.base_url_slug + url, false, 2)
			.then(result => {
				if (result.status == 200 && result.data) {
					this.MenuItem = result.data.filter((data: any) => data.status == '1');
					console.log(this.MenuItem.length);
				}
				else {
					this.MenuItem = [];
				}
			});;

	}


	testcase(): void {
		if (this.Form.get('purchase_type')?.value == 'main_menu_item') {
			this.firstarr = this.Form.get('main_menu_item_id_for_purchase')?.value;
		}
		if (this.Form.get('purchase_type')?.value == 'menu_item') {
			this.firstarr = this.Form.get('menu_item_id_for_purchase')?.value;
		}
		if (this.Form.get('free_item_type')?.value == 'main_menu_item') {
			this.secoundarr = this.Form.get('main_menu_item_id_for_free')?.value;
		}
		if (this.Form.get('free_item_type')?.value == 'menu_item') {
			this.secoundarr = this.Form.get('menu_item_id_for_free')?.value;
		}
		if (this.Form.get('exclusion_status')?.value == '1') {
			this.thirdarr = this.Form.get('main_menu_item_id_for_exclusions')?.value;
		}

		console.log("firstarr", this.firstarr)
		console.log("secoundarr", this.secoundarr)
		console.log("thirdarr", this.thirdarr)

		this.checkArrayLength()
	}

	checkArrayLength(): void {
		if (this.firstarr.length > this.secoundarr.length && this.firstarr.length > this.thirdarr.length) {
			this.arrlength = this.firstarr.length;
			console.log("largestttt length of array one")
		}
		else if (this.secoundarr.length > this.firstarr.length && this.secoundarr.length > this.thirdarr.length) {
			this.arrlength = this.secoundarr.length;
			console.log("largestttt length of array 2")
		}
		else if (this.thirdarr.length > this.firstarr.length && this.thirdarr.length > this.secoundarr.length) {
			this.arrlength = this.thirdarr.length;
			console.log("largestttt length of array 3")
		}
		else if (this.firstarr.length == this.secoundarr.length && this.secoundarr.length == this.thirdarr.length) {
			this.arrlength = this.firstarr.length;
			console.log("largestttt length of array  are sameeee")
		}
		else if (this.firstarr.length == this.secoundarr.length) {
			this.arrlength = this.firstarr.length;
			console.log(" length of array one and two are sameeee")
		}
		else if (this.firstarr.length == this.thirdarr.length) {
			this.arrlength = this.firstarr.length;
			console.log(" length of array one and 3 are sameeee")
		}
		else if (this.secoundarr.length == this.thirdarr.length) {
			this.arrlength = this.secoundarr.length;
			console.log(" length of array 2 and 3 are sameeee");
		}
		else {
			console.log("kindly chekc your cose again")
		}
		console.log("arrlength totallll", this.arrlength)
		this.test();
	}

	test(): void {
		console.log(this.Form.get('free_item_type')?.value);

		for (let i = 0; i < this.arrlength; i++) {
			let dict = {
				purchase_type: this.Form.get('purchase_type')?.value,
				free_item_type: this.Form.get('free_item_type')?.value,
				menu_item_id_for_purchase: null,
				main_menu_item_id_for_purchase: null,
				main_menu_item_id_for_free: null,
				menu_item_id_for_free: null,
				main_menu_item_id_for_exclusions: null,
			}
			// let firstRefinedData = {};

			if (this.Form.get('purchase_type')?.value == 'main_menu_item') {
				if (this.firstarr[i] != undefined) {
					dict['main_menu_item_id_for_purchase'] = this.firstarr[i]
				}
				else {
					dict['main_menu_item_id_for_purchase'] = null;
				};
			}
			if (this.Form.get('purchase_type')?.value == 'menu_item') {
				if (this.firstarr[i] != undefined) {
					dict['menu_item_id_for_purchase'] = this.firstarr[i];
				}
				else {
					dict['menu_item_id_for_purchase'] = null;
				}
			}

			if (this.Form.get('free_item_type')?.value == 'main_menu_item') {
				if (this.secoundarr[i] != undefined) {
					dict['main_menu_item_id_for_free'] = this.secoundarr[i];
				}
				else {
					dict['main_menu_item_id_for_free'] = null;
				}
			}
			if (this.Form.get('free_item_type')?.value == 'menu_item') {
				if (this.secoundarr[i] != undefined) {
					dict['menu_item_id_for_free'] = this.secoundarr[i];
				}
				else {
					dict['menu_item_id_for_free'] = null;
				}
			}

			if (this.Form.get('exclusion_status')?.value == '1') {
				if (this.thirdarr[i] != undefined) {
					dict['main_menu_item_id_for_exclusions'] = this.thirdarr[i];
				}
				else {
					dict['main_menu_item_id_for_exclusions'] = null;
				}
			}
			else {
				console.log("check your code")
			}
			console.log("promotion detail dist", dict)
			this.promotiondetail.push(dict)

		}
		// this.doSubmit();
	}

	doSubmit(): void {
		this.testcase();
		this.Form.get('promotion_details')?.setValue(this.promotiondetail);
		this.Form.get('parent_outlet_id')?.setValue(this.ids);
		let data = this.Form.value;
		this.removeKeys(data);

		this.isLoading = true;
		let method = '';

		if (this.id == 'add') {
			method = 'addPromotion';
		}
		else {
			method = 'updatePromotion/' + this.id;
		}

		this.mainApiService.postDataOld(appConfig.base_url_slug + method, data, 2).then(response => {
			if (response.status == 200 || response.status == 201) {
				this.menuItemId = response.data.id;
				this.isLoading = false;
				this.router.navigateByUrl('main/restaurants');
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
				this.isLoading = false;
				let dialogRef = this.dialog.open(AlertDialog, { autoFocus: false });
				let cm = dialogRef.componentInstance;
				cm.heading = 'Error';
				cm.message = "Internal Server Error.";
				cm.cancelButtonText = 'Ok';
				cm.type = 'error';
			})
	}

	removeKeys(data: any) {
		delete data['purchase_type'];
		delete data['free_item_type'];
		delete data['menu_item_id_for_purchase'];
		delete data['menu_item_id_for_free'];
		delete data['main_menu_item_id_for_purchase'];
		delete data['main_menu_item_id_for_free'];
		delete data['main_menu_item_id_for_exclusions'];
		delete data['purchase_type'];
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