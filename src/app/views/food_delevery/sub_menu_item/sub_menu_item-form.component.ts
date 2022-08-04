import { Component, OnInit } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { MainService } from '../../../services';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { AlertDialog } from '../../../lib';
import { MatDialog } from '@angular/material/dialog';
import { appConfig } from '../../../../config';


@Component({
	selector: 'app-sub_menu_item',
	templateUrl: './sub_menu_item-form.component.html'
})
export class SubMenuItemFormComponent implements OnInit {
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
	RestaurantsParentOutlets: any[] = [];
	filteredParentOptions: Observable<string[]> = new Observable();
	Parents: any;
	parentId: any = [];
	Parentid: any;
	SubMenuid: any;
	Menuid: any;
	SubmenuItemForm: string = '';
	data: any = [];
	//x: { names: any; parent_outlet_id: number; menu_item_id: number; sub_menu_id: number; };
	x : any ={ names: null, parent_outlet_id: null, menu_item_id: null, sub_menu_id: null };

	constructor(protected router: Router,
		protected _route: ActivatedRoute,
		protected mainApiService: MainService,
		protected formbuilder: FormBuilder, protected dialog: MatDialog) {
		this.Form = this.formbuilder.group({

			menu_item_id: ['',],
			sub_menu_id: ['',],
			parent_outlet_id: ['',],
			// names: this.formbuilder.array([]),
			name: [null, [Validators.required]],
			name_ar: [null, [Validators.required]],
			description: [null],
			description_ar: [null],
			price: [null],
			multi_choice: [null, [Validators.required]],
			is_base_price: [null, [Validators.required]],
			// id_csv: ['']

		});

		this.isLoading = false;
		this.isEditing = false;
		this.Parents = [];
		this.RestaurantMenu = '';
		// this.onAddMoreSubMenuItem();
	}

	ngOnInit() {

		this.sub = this._route.params.subscribe(params => {
			this.id = params['parentid'];
			this.Menuid = params['Menuid'];
			this.SubMenuid = params['subMenuItem'];
			this.SubmenuItemForm = params['submenuItemid'];

			console.log("id in params", this.id)
			console.log("Menuid in params", this.Menuid)
			console.log("SubMenuid in params", this.SubMenuid)
			console.log("SubMenuitemid in params", this.SubmenuItemForm)

			if (this.SubmenuItemForm != 'add') {
				this.isEditing = true;
				this.Form.addControl('id', new FormControl(this.SubmenuItemForm));
				let abcd = localStorage.getItem('RestaurantSubMenuItem') as string;
				this.RestaurantMenu = JSON.parse(abcd);
				this.Form.patchValue(this.RestaurantMenu);
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

	get names(): FormArray {
		return this.Form.get('names') as FormArray;
	}

	// onAddMoreSubMenuItem()
	// {
	// 	let fdForm = this.formbuilder.group({

	// 		name: new FormControl('', Validators.required),
	// 		name_ar: new FormControl('', Validators.required),
	// 	});

	// 	this.names.push(fdForm);
	// };

	onDeleteSubMenuItem(i: any, item: any): void {
		if (this.isEditing) {
			let dialogRef = this.dialog.open(AlertDialog, { autoFocus: false });
			let cm = dialogRef.componentInstance;
			cm.heading = 'Delete Freezer';
			cm.message = 'Are you sure to Delete Freezer?';
			cm.submitButtonText = 'Yes';
			cm.cancelButtonText = 'No';
			cm.type = 'ask';
			cm.methodType = 'get';
			cm.methodName = appConfig.base_url_slug + '/delete-freezer?freezer_id=' + item.value.freezer_id;
			cm.showLoading = true;
			dialogRef.afterClosed().subscribe(result => {
				if (result) {
					this.names.removeAt(i);
				}
			})
		}
		else {
			this.names.removeAt(i);
		}
	}

	doSubmit(): void {
		this.data = [];
		// this.Form.get('menu_item_id').setValue(this.Menuid);
		// this.Form.get('sub_menu_id').setValue(this.SubMenuid);
		// this.Form.get('parent_outlet_id').setValue(this.id);

		this.isLoading = true;
		let method = '';

		if (this.SubmenuItemForm == 'add') {
			method = 'addSubMenuItem';
			let dist =
			{
				"name": this.Form.get('name')?.value,
				"name_ar": this.Form.get('name_ar')?.value,
				"price": this.Form.get('price')?.value,
				"description": this.Form.get('description')?.value,
				"description_ar": this.Form.get('description_ar')?.value,
				"multi_choice": this.Form.get('multi_choice')?.value,
				"is_base_price": this.Form.get('is_base_price')?.value,
				"id_csv": this.Form.get('id_csv')?.value
			}
			this.data.push(dist)
			this.x = { "names": this.data, "parent_outlet_id": parseInt(this.id), "menu_item_id": parseInt(this.Menuid), "sub_menu_id": parseInt(this.SubMenuid) }

		}
		else {
			method = 'updateSubMenuItem/' + this.SubmenuItemForm;
			this.Form.get('menu_item_id')?.setValue(this.Menuid);
			this.Form.get('sub_menu_id')?.setValue(this.SubMenuid);
			this.Form.get('parent_outlet_id')?.setValue(this.id);
			this.x = this.Form.value
		}
		this.mainApiService.postData(appConfig.base_url_slug + method, this.x, 2).then(response => {
			if (response.status == 200 || response.status == 201) {
				this.isLoading = false;
				window.history.back();
				// this.router.navigateByUrl('/main/restaurants/mainMenuItem/restaurantMenuList/' + this.Menuid);

			}
			else {
				this.isLoading = false;
				let dialogRef = this.dialog.open(AlertDialog, { autoFocus: false });
				let cm = dialogRef.componentInstance;
				cm.heading = 'Error';
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
				// cm.message = "Internal Server Error.";
				cm.cancelButtonText = 'Ok';
				cm.type = 'error';
			})
	}
}