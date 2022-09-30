import { Component, OnInit } from '@angular/core';
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
	selector: 'app-sub_menu',
	templateUrl: './sub_menu-form.component.html'
})
export class SubMenuFormComponent extends ImportCSVComponent implements OnInit {
	id: any;
	is_child: any;
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
	SubMenuid: any;
	Menuid: any;
	formData: FormData = new FormData();

	constructor(protected router: Router,
		protected _route: ActivatedRoute,
		protected mainApiService: MainService,
		protected formbuilder: FormBuilder, protected dialog: MatDialog) {
		super(mainApiService, dialog);
		this.Form = this.formbuilder.group({
			heading: [null, [Validators.required]],
			title: [null, [Validators.required]],
			heading_ar: [null, [Validators.required]],
			title_ar: [null, [Validators.required]],
			menu_type: [null, [Validators.required]],
			selection_type: [null, [Validators.required]],
			menu_item_id: ['',],
			parent_outlet_id: ['',],
			// id_csv: ['']

		});

		this.isLoading = false;
		this.isEditing = false;
		this.Parents = [];
		this.RestaurantMenu = '';
	}

	ngOnInit() {

		this.sub = this._route.params.subscribe(params => {
			this.id = params['id'];
			this.Parentid = params['parentid'];
			this.Menuid = params['Menuid'];
			this.SubMenuid = params['Submenu'];


			if (this.id != 'add') {
				this.isEditing = true;
				this.Form.addControl('id', new FormControl(this.id));
				let abc = localStorage.getItem('RestaurantSubMenu') as string;
				this.RestaurantMenu = JSON.parse(abc);
				this.Form.patchValue(this.RestaurantMenu);

			}
			else {
				this.isEditing = false;
				this.Form.reset();
			}

			this.errorMessageForCSV = 'Invalid CSV File. <br>';
			this.methodOfCsv = 'addSubMenuItemsCSV';
		});


	}

	getValue(name: any) {
		return this.Form.get(name);
	}

	onLocationBack(): void {
		window.history.back();
	}



	doSubmit(): void {
		this.Form.get('menu_item_id')?.setValue(this.Menuid);
		this.Form.get('parent_outlet_id')?.setValue(this.Parentid);

		this.isLoading = true;
		let method = '';

		if (this.id == 'add') {
			method = 'addSubMenu';
		}
		else {
			method = 'updateSubMenu/' + this.id;
		}

		this.mainApiService.postData(appConfig.base_url_slug + method, this.Form.value, 2).then(response => {
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


	//cvs data////
	afterSelectionCsv(result: any, headersObj: any, objTemp: any): void {
		for (let key in headersObj) {

			//adding header object which is shown on the top of the list
			if (!headersObj.hasOwnProperty('parent_id') && !objTemp.hasOwnProperty('parent_id')) {
				objTemp['parent_id'] = null;
				this.errorMessageForCSV = this.errorMessageForCSV + '<b>parent_id</b> is missing,<br> ';
				this.errorCounter++;
			}
			else if (!headersObj.hasOwnProperty('menu_id') && !objTemp.hasOwnProperty('menu_id')) {
				objTemp['menu_id'] = null;
				this.errorMessageForCSV = this.errorMessageForCSV + '<b>menu_id</b> is missing,<br> ';
				this.errorCounter++;
			}
			else if (!headersObj.hasOwnProperty('category_id') && !objTemp.hasOwnProperty('category_id')) {
				objTemp['category_id'] = null;
				this.errorMessageForCSV = this.errorMessageForCSV + '<b>category_id</b> is missing,<br> ';
				this.errorCounter++;
			}
			else if (!headersObj.hasOwnProperty('exclude_menu_id') && !objTemp.hasOwnProperty('exclude_menu_id')) {
				objTemp['exclude_menu_id'] = null;
				this.errorMessageForCSV = this.errorMessageForCSV + '<b>exclude_menu_id</b> is missing,<br> ';
				this.errorCounter++;
			}
			else if (!headersObj.hasOwnProperty('option_category_id') && !objTemp.hasOwnProperty('option_category_id')) {
				objTemp['option_category_id'] = null;
				this.errorMessageForCSV = this.errorMessageForCSV + '<b>option_category_id</b> is missing,<br> ';
				this.errorCounter++;
			}
			else if (!headersObj.hasOwnProperty('option_category_name_english') && !objTemp.hasOwnProperty('option_category_name_english')) {
				objTemp['option_category_name_english'] = null;
				this.errorMessageForCSV = this.errorMessageForCSV + '<b>option_category_name_english</b> is missing,<br> ';
				this.errorCounter++;
			}
			else if (!headersObj.hasOwnProperty('option_category_name_arabic') && !objTemp.hasOwnProperty('option_category_name_arabic')) {
				objTemp['option_category_name_arabic'] = null;
				this.errorMessageForCSV = this.errorMessageForCSV + '<b>option_category_name_arabic</b> is missing,<br> ';
				this.errorCounter++;
			}
			else if (!headersObj.hasOwnProperty('option_name_english') && !objTemp.hasOwnProperty('option_name_english')) {
				objTemp['option_name_english'] = null;
				this.errorMessageForCSV = this.errorMessageForCSV + '<b>option_name_english</b> is missing,<br> ';
				this.errorCounter++;
			}
			else if (!headersObj.hasOwnProperty('option_name_arabic') && !objTemp.hasOwnProperty('option_name_arabic')) {
				objTemp['option_name_arabic'] = null;
				this.errorMessageForCSV = this.errorMessageForCSV + '<b>option_name_arabic</b> is missing,<br> ';
				this.errorCounter++;
			}
			else if (!headersObj.hasOwnProperty('option_description_english') && !objTemp.hasOwnProperty('option_description_english')) {
				objTemp['option_description_english'] = null;
				this.errorMessageForCSV = this.errorMessageForCSV + '<b>option_description_english</b> is missing,<br> ';
				this.errorCounter++;
			}
			else if (!headersObj.hasOwnProperty('option_description_arabic') && !objTemp.hasOwnProperty('option_description_arabic')) {
				objTemp['option_description_arabic'] = null;
				this.errorMessageForCSV = this.errorMessageForCSV + '<b>option_description_arabic</b> is missing,<br> ';
				this.errorCounter++;
			}
			else if (!headersObj.hasOwnProperty('option_price') && !objTemp.hasOwnProperty('option_price')) {
				objTemp['option_price'] = null;
				this.errorMessageForCSV = this.errorMessageForCSV + '<b>option_price</b> is missing,<br> ';
				this.errorCounter++;
			}
			else if (!headersObj.hasOwnProperty('multi_choice') && !objTemp.hasOwnProperty('multi_choice')) {
				objTemp['multi_choice'] = null;
				this.errorMessageForCSV = this.errorMessageForCSV + '<b>multi_choice</b> is missing,<br> ';
				this.errorCounter++;
			}
			else if (!headersObj.hasOwnProperty('is_base_price') && !objTemp.hasOwnProperty('is_base_price')) {
				objTemp['is_base_price'] = null;
				this.errorMessageForCSV = this.errorMessageForCSV + '<b>is_base_price</b> is missing,<br> ';
				this.errorCounter++;
			}

		}

		if (this.errorCounter == 0) {
			result.forEach((element: any, index: any) => {
				// adding parent outlet id
				if (element['parent_id'] == null || element['parent_id'] == '') {
					this.errorMessageForCSV = this.errorMessageForCSV + '<b>parent_id</b> is empty on line number ' + (index + 1) + ',<br> ';
					this.errorCounter++;
				}
				if (element['menu_id'] == null || element['menu_id'] == '') {
					this.errorMessageForCSV = this.errorMessageForCSV + '<b>menu_id</b> is empty on line number ' + (index + 1) + ',<br> ';
					this.errorCounter++;
				}
				if (element['category_id'] == null || element['category_id'] == '') {
					this.errorMessageForCSV = this.errorMessageForCSV + '<b>category_id</b> is empty on line number ' + (index + 1) + ',<br> ';
					this.errorCounter++;
				}
				if (element['exclude_menu_id'] == null || element['exclude_menu_id'] == '') {
					this.errorMessageForCSV = this.errorMessageForCSV + '<b>exclude_menu_id</b> is empty on line number ' + (index + 1) + ',<br> ';
					this.errorCounter++;
				}
				if (element['option_category_id'] == null || element['option_category_id'] == '') {
					this.errorMessageForCSV = this.errorMessageForCSV + '<b>option_category_id</b> is empty on line number ' + (index + 1) + ',<br> ';
					this.errorCounter++;
				}
				if (element['option_category_name_english'] == null || element['option_category_name_english'] == '') {
					this.errorMessageForCSV = this.errorMessageForCSV + '<b>option_category_name_english</b> is empty on line number ' + (index + 1) + ',<br> ';
					this.errorCounter++;
				}
				if (element['option_category_name_arabic'] == null || element['option_category_name_arabic'] == '') {
					this.errorMessageForCSV = this.errorMessageForCSV + '<b>option_category_name_arabic</b> is empty on line number ' + (index + 1) + ',<br> ';
					this.errorCounter++;
				}
				if (element['option_name_english'] == null || element['option_name_english'] == '') {
					this.errorMessageForCSV = this.errorMessageForCSV + '<b>option_name_english</b> is empty on line number ' + (index + 1) + ',<br> ';
					this.errorCounter++;
				}
				if (element['option_name_arabic'] == null || element['option_name_arabic'] == '') {
					this.errorMessageForCSV = this.errorMessageForCSV + '<b>option_name_arabic</b> is empty on line number ' + (index + 1) + ',<br> ';
					this.errorCounter++;
				}
				if (element['option_description_english'] == null) {
					this.errorMessageForCSV = this.errorMessageForCSV + '<b>option_description_english</b> is empty on line number ' + (index + 1) + ',<br> ';
					this.errorCounter++;
				}
				if (element['option_description_arabic'] == null) {
					this.errorMessageForCSV = this.errorMessageForCSV + '<b>option_description_arabic</b> is empty on line number ' + (index + 1) + ',<br> ';
					this.errorCounter++;
				}

				if (element['option_price'] == null || element['option_price'] == '') {
					this.errorMessageForCSV = this.errorMessageForCSV + '<b>option_price</b> is empty on line number ' + (index + 1) + ',<br> ';
					this.errorCounter++;
				}
				if (element['multi_choice'] == null || element['multi_choice'] == '') {
					this.errorMessageForCSV = this.errorMessageForCSV + '<b>multi_choice</b> is empty on line number ' + (index + 1) + ',<br> ';
					this.errorCounter++;
				}
				if (element['is_base_price'] == null || element['is_base_price'] == '') {
					this.errorMessageForCSV = this.errorMessageForCSV + '<b>is_base_price</b> is empty on line number ' + (index + 1) + ',<br> ';
					this.errorCounter++;
				}

			});
		}
		// this.afterJSON = JSON.parse(JSON.stringify(result));

		// (500 error thats why did not use stringify)
		this.afterJSON = result;
		console.log("jesonnn", this.afterJSON)
	}

	onUploadCSV(): void {
		this.afterSelectionCsv(this.result, this.headersObj, this.objTemp);
		this.JsonToServer = { "data": this.afterJSON };
		this.urlVersion = 2;
		super.onUploadCSV();
		this.isCsv = true;
	}

	afterSuccess(): void {
		this.router.navigateByUrl('/main/restaurants');
		this.isLoading = false;
	}
	directSuccess(): void {
		this.router.navigateByUrl('/main/restaurants');
		this.isLoading = false;
	}

	//------ New Implementation CSV upload Submenu ------//

	getFile(event: any) {
		this.csvFile = event.target.files[0];
	}

	onUploadSubMenuCSV(): void {
		this.isLoading = true;
		this.formData = new FormData();
		this.formData.append('file', this.csvFile);
		this.JsonToServer = this.formData;
		this.urlVersion = 2;

		this.mainApiService.postData(appConfig.base_url_slug + this.methodOfCsv, this.JsonToServer, this.urlVersion).then(response => {
			if (response.status == 200 || response.status == 201) {
				let dialogRef = this.dialog.open(AlertDialog, { autoFocus: false });
				let cm = dialogRef.componentInstance;
				cm.heading = 'Message';
				cm.message = 'File Uploaded Successfully';
				cm.cancelButtonText = 'Ok';
				cm.type = 'success';
				dialogRef.afterClosed().subscribe(result => {
					// this.router.navigateByUrl('/main/merchants');
					this.isLoading = false;
				})
			} else {
				this.errorCsvDialog();
			}
		})
			.catch((err) => {
				this.errorCsvDialog();
			})
		// this.afterJSON = '-';
		// super.onUploadCSV();
		// this.isCsv =true;
	}

	errorCsvDialog() {
		let dialogRef = this.dialog.open(AlertDialog, { autoFocus: false });
		let cm = dialogRef.componentInstance;
		cm.heading = 'Error';
		cm.message = 'Data in CSV file is inconsistent';
		cm.cancelButtonText = 'Ok';
		cm.type = 'error';
		this.isLoading = false;
	}
}