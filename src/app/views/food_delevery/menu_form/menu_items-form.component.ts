import { Component, OnInit, ViewChild, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { MainService } from '../../../services';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { AlertDialog } from '../../../lib';
import { MatDialog } from '@angular/material/dialog';
import { appConfig } from '../../../../config';
import { map, startWith } from 'rxjs/operators';
import { ImportCSVComponent } from '../../../lib/import_csv.component';


@Component({
	selector: 'app-menu_items',
	templateUrl: './menu_items-form.component.html'
})
export class MenuItemsFormComponent extends ImportCSVComponent implements OnInit
{
	id: any;
	// type: any;
	sub: Subscription = new Subscription();
	Form: FormGroup;
	// Form1: FormGroup;
	// Form2: FormGroup;
	isLoading: boolean = false;
	isLoading1: boolean = false;
	isLoading2: any= null;
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
	menuItemId: any;
	SubMenuOpen: boolean;
	SubmenuId: any;
	MainMenuId: any;
	ids: string = '';

	constructor(protected router: Router,
		protected _route: ActivatedRoute,
		protected mainApiService: MainService,
		protected formbuilder: FormBuilder, protected dialog: MatDialog)
	{
		super(mainApiService, dialog);
		this.Form = this.formbuilder.group({
			description: [null, [Validators.required]],
			name: [null, [Validators.required]],
			name_ar: [null, [Validators.required]],
			price: [null, [Validators.required]],
			// delivery_category_id: [null],
			image: [null, [Validators.required]],
			preparation_time: [null],
			allergens: [null],
			kcal: [null],
			size: [null],
			special_instruction: [null],
      parent_id: [null],
      id_csv: [''],
      description_ar: [''],
      is_base_price: [null, [Validators.required]],
		});

		// this.Form1 = this.formbuilder.group({
		// 	heading: [null, [Validators.required]],
		// 	title: [null, [Validators.required]],
		// 	heading_ar: [null, [Validators.required]],
		// 	title_ar: [null, [Validators.required]],
		// 	menu_type: [null, [Validators.required]],
		// 	selection_type: [null, [Validators.required]],
		// 	menu_item_id: ['',],

		// });
		// this.Form2 = this.formbuilder.group({
		// 	name: [null, [Validators.required]],
		// 	name_ar: [null, [Validators.required]],
		// 	menu_item_id: ['',],
		// 	sub_menu_id: ['',],
		// });
		this.SubMenuOpen = false;
		this.isLoading = false;
		this.isLoading1 = false;
		this.isEditing = false;
		this.Parents = [];
		this.RestaurantMenu = '';
		this.errorMessageForCSV = 'Invalid CSV File. <br>';
		this.methodOfCsv = 'addMenuItems';
	}
	equals(objOne : any, objTwo : any)
	{
		if (typeof objOne != 'undefined' && typeof objTwo != 'undefined')
		{
			return objOne.id == objTwo.id;
		}
		return;
	}

	openSubMenu()
	{
		this.SubMenuOpen = true;
	}
	ngOnInit()
	{

		this.sub = this._route.params.subscribe(params =>
		{
			this.id = params['parentid'];
			this.ids = params['ids'];
			this.MainMenuId = params['MainMenuId'];
			this.Form.get('parent_id')?.setValue(this.id);


			if (this.ids != 'add')
			{
				this.SubMenuOpen = true;
				this.isEditing = true;
				this.Form.addControl('id', new FormControl(this.id));
				let abc = localStorage.getItem('RestaurantMenudetail') as string;
				this.RestaurantMenu = JSON.parse(abc);
				this.Form.patchValue(this.RestaurantMenu);
				// this.RestaurantMenu = JSON.parse(localStorage.getItem('RestaurantMenudetail'));
				// this.Form.patchValue(this.RestaurantMenu);

			}
			else
			{
				this.SubMenuOpen = false;
				this.isEditing = false;
				this.Form.reset();
			}
			this.getMenuType();
		});



	}


	getValue(name : any)
	{
		return this.Form.get(name);
	}

	onLocationBack(): void
	{
		window.history.back();
	}



	getMenuType(): void
	{
		let url = 'viewDeliveryCategories?parent_outlet_id=' + this.id;

		this.mainApiService.getList(appConfig.base_url_slug + url, false, 2)
			.then(result =>
			{
				if (result.status == 200 && result.data)
				{
					this.MenuType = result.data;
					this.MenuType.forEach((element : any) =>
					{
						element.id = element.id.toString();
					});
				}
				else
				{
					this.MenuType = [];
				}
			});;
	}



	doSubmit(): void
	{
		this.isLoading = true;
		this.isLoading1 = false;

		let method = '';
		let formData = new FormData();
		for (var key in this.Form.value)
		{
			formData.append(key, this.Form.value[key]);
		}

		formData.append('main_menu_item_id', this.MainMenuId);
		formData.append('parent_outlet_id', this.id);

		if (this.ids == 'add')
		{
			method = 'addMenuItem';
		}
		else
		{
			method = 'updateMenuItem/' + this.ids;
		}

		this.mainApiService.postData(appConfig.base_url_slug + method, formData, 2).then(response =>
		{
			if (response.status == 200 || response.status == 201)
			{

				this.menuItemId = response.data.id;
				if (method == 'addMenuItem')
				{
					let dialogRef = this.dialog.open(AlertDialog, { autoFocus: false });
					let cm = dialogRef.componentInstance;
					cm.heading = 'SUCCESS';
					cm.message = "MENU ADDED";
					cm.cancelButtonText = 'Ok';
					cm.type = 'success';
					this.Form.reset();
					window.history.back();
					this.isLoading = false;
				}
				else
				{
					let dialogRef = this.dialog.open(AlertDialog, { autoFocus: false });
					let cm = dialogRef.componentInstance;
					cm.heading = 'SUCCESS';
					cm.message = "MENU UPDATED";
					cm.cancelButtonText = 'Ok';
					cm.type = 'success';
					window.history.back();
					this.Form.reset();
					this.isLoading = false;
				}

			}
			else
			{
				this.isLoading = false;
				this.isLoading1 = true;
				let dialogRef = this.dialog.open(AlertDialog, { autoFocus: false });
				let cm = dialogRef.componentInstance;
				cm.heading = 'Error';
				cm.message = response.error.message;
				cm.cancelButtonText = 'Ok';
				cm.type = 'error';
			}
		},
			Error =>
			{
				// log here(Error)
				this.isLoading = false;
				this.isLoading1 = true;
				let dialogRef = this.dialog.open(AlertDialog, { autoFocus: false });
				let cm = dialogRef.componentInstance;
				cm.heading = 'Error';
				cm.message = "Internal Server Error.";
				cm.cancelButtonText = 'Ok';
				cm.type = 'error';
			})
	}

	onFileSelect(event : any)
	{
		if (event.controlName == 'image')
		{
			if (event.valid)
			{
				this.Form.get(event.controlName)?.patchValue(event.file);
				this.errorMsg = '';
			}
			else
			{
				if (event.controlName == 'icon')
				{
					this.errorMsg = 'Please select 600*900 image.'
				}
				if (event.controlName == 'image')
				{
					this.errorMsg = 'Please select 600*900 image.'
				}
			}
		}


	}

	getImage(item : any): any
	{
		if (this.id != 'add')
		{
			return appConfig.file_urlV2 + this.RestaurantMenu[item];
		}
		else
		{
			return '';
		}
	}

	//sub menu
	// doSubmit1(): void
	// {
	// 	this.isLoading1 = true;
	// 	let method = '';

	// 	this.Form1.get('menu_item_id').setValue(this.menuItemId)
	// 	method = 'addSubMenu';

	// 	this.mainApiService.postData(appConfig.base_url_slug + method, this.Form1.value, 2).then(response =>
	// 	{
	// 		if (response.status == 200 || response.status == 201)
	// 		{


	// 			this.SubmenuId = response.data.id;
	// 			let dialogRef = this.dialog.open(AlertDialog, { autoFocus: false });
	// 			let cm = dialogRef.componentInstance;
	// 			cm.heading = 'SUCCESS';
	// 			cm.message = "YOU CAN ADD SUB-MENU";
	// 			cm.cancelButtonText = 'Ok';
	// 			cm.type = 'success';
	// 			this.Form.reset();
	// 			this.isLoading1 = false;
	// 			// this.router.navigateByUrl('/main/menuType/menuValue/' + this.Form.get('parent_outlet_id').value);

	// 		}
	// 		else
	// 		{
	// 			this.isLoading1 = false;
	// 			let dialogRef = this.dialog.open(AlertDialog, { autoFocus: false });
	// 			let cm = dialogRef.componentInstance;
	// 			cm.heading = 'Error';
	// 			cm.message = response.error.message;
	// 			cm.cancelButtonText = 'Ok';
	// 			cm.type = 'error';
	// 		}
	// 	},
	// 		Error =>
	// 		{
	// 			// log here(Error)
	// 			this.isLoading1 = false;
	// 			let dialogRef = this.dialog.open(AlertDialog, { autoFocus: false });
	// 			let cm = dialogRef.componentInstance;
	// 			cm.heading = 'Error';
	// 			cm.message = "Internal Server Error.";
	// 			cm.cancelButtonText = 'Ok';
	// 			cm.type = 'error';
	// 		})
	// }
	// doSubmit2(): void
	// {
	// 	this.isLoading2 = true;
	// 	let method = '';

	// 	this.Form2.get('menu_item_id').setValue(this.menuItemId)
	// 	this.Form2.get('sub_menu_id').setValue(this.SubmenuId)
	// 	method = 'addSubMenuItem';

	// 	this.mainApiService.postData(appConfig.base_url_slug + method, this.Form2.value, 2).then(response =>
	// 	{
	// 		if (response.status == 200 || response.status == 201)
	// 		{
	// 			let dialogRef = this.dialog.open(AlertDialog, { autoFocus: false });
	// 			let cm = dialogRef.componentInstance;
	// 			cm.heading = 'SUCCESS';
	// 			cm.message = "YOU CAN ADD SUB-MENU-ITEM";
	// 			cm.cancelButtonText = 'Ok';
	// 			cm.type = 'success';
	// 			this.Form.reset();
	// 			this.isLoading2 = false;
	// 			this.router.navigateByUrl('/main/restaurants');

	// 		}
	// 		else
	// 		{
	// 			this.isLoading2 = false;
	// 			let dialogRef = this.dialog.open(AlertDialog, { autoFocus: false });
	// 			let cm = dialogRef.componentInstance;
	// 			cm.heading = 'Error';
	// 			cm.message = response.error.message;
	// 			cm.cancelButtonText = 'Ok';
	// 			cm.type = 'error';
	// 		}
	// 	},
	// 		Error =>
	// 		{
	// 			// log here(Error)
	// 			this.isLoading2 = false;
	// 			let dialogRef = this.dialog.open(AlertDialog, { autoFocus: false });
	// 			let cm = dialogRef.componentInstance;
	// 			cm.heading = 'Error';
	// 			cm.message = "Internal Server Error.";
	// 			cm.cancelButtonText = 'Ok';
	// 			cm.type = 'error';
	// 		})
	// }

	//cvs data////
	afterSelectionCsv(result : any, headersObj : any, objTemp : any): void
	{
		for (let key in headersObj)
		{

			//adding header object which is shown on the top of the list
			if (!headersObj.hasOwnProperty('parent_id') && !objTemp.hasOwnProperty('parent_id'))
			{
				objTemp['parent_id'] = null;
				this.errorMessageForCSV = this.errorMessageForCSV + '<b>parents_id</b> is missing,<br> ';
				this.errorCounter++;
			}
			else if (!headersObj.hasOwnProperty('menu_category_id') && !objTemp.hasOwnProperty('menu_category_id'))
			{
				objTemp['menu_category_id'] = null;
				this.errorMessageForCSV = this.errorMessageForCSV + '<b>menu_category_id</b> is missing,<br> ';
				this.errorCounter++;
			}
			else if (!headersObj.hasOwnProperty('menu_category_name_english') && !objTemp.hasOwnProperty('menu_category_name_english'))
			{
				objTemp['menu_category_name_english'] = null;
				this.errorMessageForCSV = this.errorMessageForCSV + '<b>menu_category_name_english</b> is missing,<br> ';
				this.errorCounter++;
			}
			else if (!headersObj.hasOwnProperty('menu_category_name_arabic') && !objTemp.hasOwnProperty('menu_category_name_arabic'))
			{
				objTemp['menu_category_name_arabic'] = null;
				this.errorMessageForCSV = this.errorMessageForCSV + '<b>menu_category_name_arabic</b> is missing,<br> ';
				this.errorCounter++;
			}
			else if (!headersObj.hasOwnProperty('menu_item_id') && !objTemp.hasOwnProperty('menu_item_id'))
			{
				objTemp['menu_item_id'] = null;
				this.errorMessageForCSV = this.errorMessageForCSV + '<b>menu_item_id</b> is missing,<br> ';
				this.errorCounter++;
			}
			else if (!headersObj.hasOwnProperty('menu_item_name_english') && !objTemp.hasOwnProperty('menu_item_name_english'))
			{
				objTemp['menu_item_name_english'] = null;
				this.errorMessageForCSV = this.errorMessageForCSV + '<b>menu_item_name_english</b> is missing,<br> ';
				this.errorCounter++;
			}
			else if (!headersObj.hasOwnProperty('menu_item_name_arabic') && !objTemp.hasOwnProperty('menu_item_name_arabic'))
			{
				objTemp['menu_item_name_arabic'] = null;
				this.errorMessageForCSV = this.errorMessageForCSV + '<b>menu_item_name_arabic</b> is missing,<br> ';
				this.errorCounter++;
			}
			else if (!headersObj.hasOwnProperty('menu_item_description_english') && !objTemp.hasOwnProperty('menu_item_description_english'))
			{
				objTemp['menu_item_description_english'] = null;
				this.errorMessageForCSV = this.errorMessageForCSV + '<b>menu_item_description_english</b> is missing,<br> ';
				this.errorCounter++;
			}
			else if (!headersObj.hasOwnProperty('menu_item_description_arabic') && !objTemp.hasOwnProperty('menu_item_description_arabic'))
			{
				objTemp['menu_item_description_arabic'] = null;
				this.errorMessageForCSV = this.errorMessageForCSV + '<b>menu_item_description_arabic</b> is missing,<br> ';
				this.errorCounter++;
			}
			else if (!headersObj.hasOwnProperty('menu_item_price') && !objTemp.hasOwnProperty('menu_item_price'))
			{
				objTemp['menu_item_price'] = null;
				this.errorMessageForCSV = this.errorMessageForCSV + '<b>menu_item_price</b> is missing,<br> ';
				this.errorCounter++;
			}
			else if (!headersObj.hasOwnProperty('preparation_time') && !objTemp.hasOwnProperty('preparation_time'))
			{
				objTemp['preparation_time'] = null;
				this.errorMessageForCSV = this.errorMessageForCSV + '<b>preparation_time</b> is missing,<br> ';
				this.errorCounter++;
			}
			else if (!headersObj.hasOwnProperty('allergens') && !objTemp.hasOwnProperty('allergens'))
			{
				objTemp['allergens'] = null;
				this.errorMessageForCSV = this.errorMessageForCSV + '<b>allergens</b> is missing,<br> ';
				this.errorCounter++;
			}
			else if (!headersObj.hasOwnProperty('kcal') && !objTemp.hasOwnProperty('kcal'))
			{
				objTemp['kcal'] = null;
				this.errorMessageForCSV = this.errorMessageForCSV + '<b>kcal</b> is missing,<br> ';
				this.errorCounter++;
			}
			else if (!headersObj.hasOwnProperty('size') && !objTemp.hasOwnProperty('size'))
			{
				objTemp['size'] = null;
				this.errorMessageForCSV = this.errorMessageForCSV + '<b>size</b> is missing,<br> ';
				this.errorCounter++;
			}
			else if (!headersObj.hasOwnProperty('image_name') && !objTemp.hasOwnProperty('image_name'))
			{
				objTemp['image_name'] = null;
				this.errorMessageForCSV = this.errorMessageForCSV + '<b>image_name</b> is missing,<br> ';
				this.errorCounter++;
			}
			else if (!headersObj.hasOwnProperty('is_base_price') && !objTemp.hasOwnProperty('is_base_price'))
			{
				objTemp['is_base_price'] = null;
				this.errorMessageForCSV = this.errorMessageForCSV + '<b>is_base_price</b> is missing,<br> ';
				this.errorCounter++;
			}

		}

		if (this.errorCounter == 0)
		{
			result.forEach((element : any, index : any) =>
			{
				// adding parent outlet id
				if (element['parent_id'] == null || element['parent_id'] == '')
				{
					this.errorMessageForCSV = this.errorMessageForCSV + '<b>parent_id</b> is empty on line number ' + (index + 1) + ',<br> ';
					this.errorCounter++;
				}
				if (element['menu_category_id'] == null || element['menu_category_id'] == '')
				{
					this.errorMessageForCSV = this.errorMessageForCSV + '<b>menu_category_id</b> is empty on line number ' + (index + 1) + ',<br> ';
					this.errorCounter++;
				}
				if (element['menu_category_name_english'] == null || element['menu_category_name_english'] == '')
				{
					this.errorMessageForCSV = this.errorMessageForCSV + '<b>menu_category_name_english</b> is empty on line number ' + (index + 1) + ',<br> ';
					this.errorCounter++;
				}
				if (element['menu_category_name_arabic'] == null || element['menu_category_name_arabic'] == '')
				{
					this.errorMessageForCSV = this.errorMessageForCSV + '<b>menu_category_name_arabic</b> is empty on line number ' + (index + 1) + ',<br> ';
					this.errorCounter++;
				}
				if (element['menu_item_id'] == null || element['menu_item_id'] == '')
				{
					this.errorMessageForCSV = this.errorMessageForCSV + '<b>menu_item_id</b> is empty on line number ' + (index + 1) + ',<br> ';
					this.errorCounter++;
				}
				if (element['menu_item_name_english'] == null || element['menu_item_name_english'] == '')
				{
					this.errorMessageForCSV = this.errorMessageForCSV + '<b>menu_item_name_english</b> is empty on line number ' + (index + 1) + ',<br> ';
					this.errorCounter++;
				}
				if (element['menu_item_name_arabic'] == null || element['menu_item_name_arabic'] == '')
				{
					this.errorMessageForCSV = this.errorMessageForCSV + '<b>menu_item_name_arabic</b> is empty on line number ' + (index + 1) + ',<br> ';
					this.errorCounter++;
				}
				if (element['menu_item_description_english'] == null)
				{
					this.errorMessageForCSV = this.errorMessageForCSV + '<b>menu_item_description_english</b> is empty on line number ' + (index + 1) + ',<br> ';
					this.errorCounter++;
				}
				if (element['menu_item_description_arabic'] == null)
				{
					this.errorMessageForCSV = this.errorMessageForCSV + '<b>menu_item_description_arabic</b> is empty on line number ' + (index + 1) + ',<br> ';
					this.errorCounter++;
				}
				if (element['menu_item_price'] == null || element['menu_item_price'] == '')
				{
					this.errorMessageForCSV = this.errorMessageForCSV + '<b>menu_item_price</b> is empty on line number ' + (index + 1) + ',<br> ';
					this.errorCounter++;
				}
				if (element['preparation_time'] == null || element['preparation_time'] == '')
				{
					this.errorMessageForCSV = this.errorMessageForCSV + '<b>preparation_time</b> is empty on line number ' + (index + 1) + ',<br> ';
					this.errorCounter++;
				}
				if (element['allergens'] == null || element['allergens'] == '')
				{
					this.errorMessageForCSV = this.errorMessageForCSV + '<b>allergens</b> is empty on line number ' + (index + 1) + ',<br> ';
					this.errorCounter++;
				}
				if (element['kcal'] == null || element['kcal'] == '')
				{
					this.errorMessageForCSV = this.errorMessageForCSV + '<b>kcal</b> is empty on line number ' + (index + 1) + ',<br> ';
					this.errorCounter++;
				}
				if (element['size'] == null || element['size'] == '')
				{
					this.errorMessageForCSV = this.errorMessageForCSV + '<b>size</b> is empty on line number ' + (index + 1) + ',<br> ';
					this.errorCounter++;
				}

				if (element['image_name'] == null || element['image_name'] == '')
				{
					this.errorMessageForCSV = this.errorMessageForCSV + '<b>image_name</b> is empty on line number ' + (index + 1) + ',<br> ';
					this.errorCounter++;
				}
				if (element['is_base_price'] == null || element['is_base_price'] == '')
				{
					this.errorMessageForCSV = this.errorMessageForCSV + '<b>is_base_price</b> is empty on line number ' + (index + 1) + ',<br> ';
					this.errorCounter++;
				}

			});
		}
		// this.afterJSON = JSON.stringify(result);
		//(no error but remove according to hanif )
		this.afterJSON = result;
		console.log("csv", this.afterJSON)
	}

	onUploadCSV(): void
	{
		this.JsonToServer = { data: this.afterJSON };
		this.urlVersion = 2;
		super.onUploadCSV();
	}

	afterSuccess(): void
	{
		this.router.navigateByUrl('/main/restaurants');
		this.isLoading = false;
	}
}





