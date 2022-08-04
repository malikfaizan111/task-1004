// import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
// import { Router, ActivatedRoute } from '@angular/router';
// import { Subscription } from 'rxjs';
// import { MainService, BaseLoaderService, PaginationService } from '../../../services';
// import { AlertDialog } from '../../../lib';
// import { MatDialog } from '@angular/material/dialog';
// import { appConfig } from '../../../../config';
// import { UserAppSelectorService } from '../../../lib/app-selector/app-selector.service';
// import { ImportCSVComponent } from '../../../lib/import_csv.component';
// import { TimingMenusDialogComponent } from '../timing-menus-dialog/timing-menus-dialog.component';
// declare var $: any;
// @Component({
// 	selector: 'app-main_menu',
// 	templateUrl: './main_menu-list.component.html'
// })
// export class MainMenuListComponent extends ImportCSVComponent implements OnInit {
// 	search: string;
// 	sub: Subscription = new Subscription();
// 	index: any = 1;
// 	totalPages: number = 1;
// 	pages: any;
// 	totalItems: any;
// 	currentPage: any = 1;
// 	searchTimer: any;
// 	isEditing : boolean = true;
// 	perPage: any;
// 	is_child: any;
// 	componentSettings: any = {
// 		name: null,
// 		paggination: null,
// 		search: null
// 	};
// 	appSelectorSubscription: Subscription;
// 	ParentOutlets: any;
// 	parentOutletsCount: any;
// 	RestaurantsParentOutlets: any[] = [];
// 	RestaurantsparentOutletsCount: any;
// 	type: any;
// 	codeGet: any = [];
// 	id: any;
// 	Parentid: any;
// 	menuStatus = false;
// 	formData: FormData = new FormData();

// 	constructor(protected router: Router,
// 		protected _route: ActivatedRoute,
// 		protected mainApiService: MainService,
// 		protected paginationService: PaginationService,
// 		protected loaderService: BaseLoaderService, protected appSelectorService: UserAppSelectorService, protected dialog: MatDialog) {

// 		super(mainApiService, dialog);
// 		this.errorMessageForCSV = 'Invalid CSV File. <br>';
// 		this.methodOfCsv = 'addMenuItemsCSV';
// 		this.search = '';
// 		this.perPage = 20;
// 		this.appSelectorSubscription = this.appSelectorService.selectedApp.subscribe((response: any) => {
// 			this.gerParentOutletsList(1);
// 		});
// 	}

// 	ngOnDestroy(): void {
// 		this.appSelectorSubscription.unsubscribe();
// 	}


// 	ngOnInit() {
// 		this.sub = this._route.params.subscribe(params => {
// 			this.id = params['parentid'];

// 			console.log("ParentId in params", this.id)

// 			this.gerParentOutletsList(1);

// 		})
// 		$('tbody').sortable();
// 		let abc = localStorage.getItem('componentSettings') as string;
// 		this.componentSettings = JSON.parse(abc);
// 		if (this.componentSettings) {
// 			if (this.componentSettings.name != null && this.componentSettings.name == 'MainMenuItem') {
// 				this.currentPage = this.componentSettings.paggination;
// 				this.index = this.componentSettings.paggination;
// 				this.search = this.componentSettings.search;
// 			}
// 		}

// 	}

// 	addNew() {
// 		this.router.navigateByUrl('main/restaurants/mainMenuItem/' + this.id + '/menuForm/add');
// 	}
// 	onSearchParentOutlet(): void {
// 		clearTimeout(this.searchTimer);
// 		this.searchTimer = setTimeout(() => {

// 			this.gerParentOutletsList(1);

// 		}, 700);

// 	}
// 	onDelete(parentOutlet: any): void {
// 		let url = 'deleteMainMenuItem/' + parentOutlet.id + '?';

// 		this.mainApiService.getList(appConfig.base_url_slug + url, false, 2)
// 			.then(result => {
// 				console.log("result", result)
// 				if (result.status == 200 && result.data) {
// 					this.gerParentOutletsList(1);

// 				}
// 				else {


// 				}
// 			});
// 	}
// 	gerParentOutletsList(index: any, isLoaderHidden?: boolean): void {
// 		this.loaderService.setLoading(true);
// 		let url = 'viewMainMenuItem?parent_outlet_id=' + this.id + '&per_page=' + this.perPage + '&page=' + index + '&sort_by=id_csv' + '&sort_order=ASC' + '&pagination_type=true';
// 		if (this.search != '') {
// 			url = url + '&search=' + this.search;
// 		}

// 		localStorage.setItem('componentSettings', JSON.stringify(
// 			{
// 				name: 'RestaurantParentOutlet',
// 				paggination: this.index,
// 				search: this.search
// 			}
// 		));

// 		this.mainApiService.getList(appConfig.base_url_slug + url, false, 2)
// 			.then(result => {
// 				if (result.status == 200 && result.data) {
// 					this.RestaurantsParentOutlets = result.data;
// 					this.RestaurantsParentOutlets.forEach(menu => {
// 						menu.slide = menu.status == '1' ? true : false;
// 					});
// 					this.RestaurantsparentOutletsCount = result.pagination.count;
// 					this.currentPage = index;
// 					// setTimeout(()=>{
// 					//   let x = this.row.nativeElement.children[0].children[1].innerText;
// 					//   console.log(x);
// 					// },10000)

// 					// let n = Array.prototype.slice.call(x);
// 					this.pages = this.paginationService.setPagination(this.RestaurantsparentOutletsCount, index, this.perPage);
// 					this.totalPages = this.pages.totalPages;
// 					console.log(this.pages);
// 					this.loaderService.setLoading(false);
// 				}
// 				else {
// 					this.RestaurantsParentOutlets = [];
// 					this.RestaurantsparentOutletsCount = 0;
// 					this.currentPage = 1;
// 					this.pages = this.paginationService.setPagination(this.RestaurantsparentOutletsCount, index, this.perPage);
// 					this.totalPages = this.pages.totalPages;
// 					this.loaderService.setLoading(false);
// 				}
// 			});
// 	}

// 	onLocationBack(): void {
// 		window.history.back();
// 	}
// 	setPage(pageDate: any) {
// 		this.currentPage = pageDate.page;
// 		this.perPage = pageDate.perPage;
// 		this.index = this.currentPage;
// 		this.gerParentOutletsList(pageDate.page);
// 	}

// 	onEditRestaurantMenuid(parentOutlet: any): void {
// 		localStorage.setItem('MainMenuItem', JSON.stringify(parentOutlet));
// 		this.router.navigateByUrl('main/restaurants/mainMenuItem/' + this.id + '/menuForm/' + parentOutlet.id);
// 	}
// 	onMenu(parentOutlet: any): void {
// 		localStorage.setItem('RestaurantParentOutlet', JSON.stringify(parentOutlet));
// 		this.router.navigateByUrl('/main/restaurants/mainMenuItem/' + this.id + '/restaurantMenuList/' + parentOutlet.id);
// 	}
// 	//cvs data////
// 	afterSelectionCsv(result: any, headersObj: any, objTemp: any): void {
// 		for (let key in headersObj) {
// 			console.log("header", headersObj)
// 			//adding header object which is shown on the top of the list
// 			if (!headersObj.hasOwnProperty('parent_id') && !objTemp.hasOwnProperty('parent_id')) {
// 				objTemp['parent_id'] = null;
// 				this.errorMessageForCSV = this.errorMessageForCSV + '<b>parent_id</b> is missing,<br> ';
// 				this.errorCounter++;
// 			}
// 			else if (!headersObj.hasOwnProperty('menu_category_id') && !objTemp.hasOwnProperty('menu_category_id')) {
// 				objTemp['menu_category_id'] = null;
// 				this.errorMessageForCSV = this.errorMessageForCSV + '<b>menu_category_id</b> is missing,<br> ';
// 				this.errorCounter++;
// 			}
// 			else if (!headersObj.hasOwnProperty('menu_category_name_english') && !objTemp.hasOwnProperty('menu_category_name_english')) {
// 				objTemp['menu_category_name_english'] = null;
// 				this.errorMessageForCSV = this.errorMessageForCSV + '<b>menu_category_name_english</b> is missing,<br> ';
// 				this.errorCounter++;
// 			}
// 			else if (!headersObj.hasOwnProperty('menu_category_name_arabic') && !objTemp.hasOwnProperty('menu_category_name_arabic')) {
// 				objTemp['menu_category_name_arabic'] = null;
// 				this.errorMessageForCSV = this.errorMessageForCSV + '<b>menu_category_name_arabic</b> is missing,<br> ';
// 				this.errorCounter++;
// 			}
// 			else if (!headersObj.hasOwnProperty('menu_item_id') && !objTemp.hasOwnProperty('menu_item_id')) {
// 				objTemp['menu_item_id'] = null;
// 				this.errorMessageForCSV = this.errorMessageForCSV + '<b>menu_item_id</b> is missing,<br> ';
// 				this.errorCounter++;
// 			}
// 			else if (!headersObj.hasOwnProperty('menu_item_name_english') && !objTemp.hasOwnProperty('menu_item_name_english')) {
// 				objTemp['menu_item_name_english'] = null;
// 				this.errorMessageForCSV = this.errorMessageForCSV + '<b>menu_item_name_english</b> is missing,<br> ';
// 				this.errorCounter++;
// 			}
// 			else if (!headersObj.hasOwnProperty('menu_item_name_arabic') && !objTemp.hasOwnProperty('menu_item_name_arabic')) {
// 				objTemp['menu_item_name_arabic'] = null;
// 				this.errorMessageForCSV = this.errorMessageForCSV + '<b>menu_item_name_arabic</b> is missing,<br> ';
// 				this.errorCounter++;
// 			}
// 			else if (!headersObj.hasOwnProperty('menu_item_description_english') && !objTemp.hasOwnProperty('menu_item_description_english')) {
// 				objTemp['menu_item_description_english'] = null;
// 				this.errorMessageForCSV = this.errorMessageForCSV + '<b>menu_item_description_english</b> is missing,<br> ';
// 				this.errorCounter++;
// 			}
// 			else if (!headersObj.hasOwnProperty('menu_item_description_arabic') && !objTemp.hasOwnProperty('menu_item_description_arabic')) {
// 				objTemp['menu_item_description_arabic'] = null;
// 				this.errorMessageForCSV = this.errorMessageForCSV + '<b>menu_item_description_arabic</b> is missing,<br> ';
// 				this.errorCounter++;
// 			}
// 			else if (!headersObj.hasOwnProperty('menu_item_price') && !objTemp.hasOwnProperty('menu_item_price')) {
// 				objTemp['menu_item_price'] = null;
// 				this.errorMessageForCSV = this.errorMessageForCSV + '<b>menu_item_price</b> is missing,<br> ';
// 				this.errorCounter++;
// 			}
// 			else if (!headersObj.hasOwnProperty('preparation_time') && !objTemp.hasOwnProperty('preparation_time')) {
// 				objTemp['preparation_time'] = null;
// 				this.errorMessageForCSV = this.errorMessageForCSV + '<b>preparation_time</b> is missing,<br> ';
// 				this.errorCounter++;
// 			}
// 			else if (!headersObj.hasOwnProperty('allergens') && !objTemp.hasOwnProperty('allergens')) {
// 				objTemp['allergens'] = null;
// 				this.errorMessageForCSV = this.errorMessageForCSV + '<b>allergens</b> is missing,<br> ';
// 				this.errorCounter++;
// 			}
// 			else if (!headersObj.hasOwnProperty('kcal') && !objTemp.hasOwnProperty('kcal')) {
// 				objTemp['kcal'] = null;
// 				this.errorMessageForCSV = this.errorMessageForCSV + '<b>kcal</b> is missing,<br> ';
// 				this.errorCounter++;
// 			}
// 			else if (!headersObj.hasOwnProperty('size') && !objTemp.hasOwnProperty('size')) {
// 				objTemp['size'] = null;
// 				this.errorMessageForCSV = this.errorMessageForCSV + '<b>size</b> is missing,<br> ';
// 				this.errorCounter++;
// 			}
// 			else if (!headersObj.hasOwnProperty('image_name') && !objTemp.hasOwnProperty('image_name')) {
// 				objTemp['image_name'] = null;
// 				this.errorMessageForCSV = this.errorMessageForCSV + '<b>image_name</b> is missing,<br> ';
// 				this.errorCounter++;
// 			}
// 			else if (!headersObj.hasOwnProperty('is_base_price') && !objTemp.hasOwnProperty('is_base_price')) {
// 				objTemp['is_base_price'] = null;
// 				this.errorMessageForCSV = this.errorMessageForCSV + '<b>is_base_price</b> is missing,<br> ';
// 				this.errorCounter++;
// 			}

// 		}

// 		if (this.errorCounter == 0) {
// 			result.forEach((element: any, index: any) => {
// 				// adding parent outlet id
// 				if (element['parent_id'] == null || element['parent_id'] == '') {
// 					this.errorMessageForCSV = this.errorMessageForCSV + '<b>parent_id</b> is empty on line number ' + (index + 1) + ',<br> ';
// 					this.errorCounter++;
// 				}
// 				if (element['menu_category_id'] == null || element['menu_category_id'] == '') {
// 					this.errorMessageForCSV = this.errorMessageForCSV + '<b>menu_category_id</b> is empty on line number ' + (index + 1) + ',<br> ';
// 					this.errorCounter++;
// 				}
// 				if (element['menu_category_name_english'] == null || element['menu_category_name_english'] == '') {
// 					this.errorMessageForCSV = this.errorMessageForCSV + '<b>menu_category_name_english</b> is empty on line number ' + (index + 1) + ',<br> ';
// 					this.errorCounter++;
// 				}
// 				if (element['menu_category_name_arabic'] == null || element['menu_category_name_arabic'] == '') {
// 					this.errorMessageForCSV = this.errorMessageForCSV + '<b>menu_category_name_arabic</b> is empty on line number ' + (index + 1) + ',<br> ';
// 					this.errorCounter++;
// 				}
// 				if (element['menu_item_id'] == null || element['menu_item_id'] == '') {
// 					this.errorMessageForCSV = this.errorMessageForCSV + '<b>menu_item_id</b> is empty on line number ' + (index + 1) + ',<br> ';
// 					this.errorCounter++;
// 				}
// 				if (element['menu_item_name_english'] == null || element['menu_item_name_english'] == '') {
// 					this.errorMessageForCSV = this.errorMessageForCSV + '<b>menu_item_name_english</b> is empty on line number ' + (index + 1) + ',<br> ';
// 					this.errorCounter++;
// 				}
// 				if (element['menu_item_name_arabic'] == null || element['menu_item_name_arabic'] == '') {
// 					this.errorMessageForCSV = this.errorMessageForCSV + '<b>menu_item_name_arabic</b> is empty on line number ' + (index + 1) + ',<br> ';
// 					this.errorCounter++;
// 				}
// 				if (element['menu_item_description_english'] == null || element['menu_item_description_english'] == '') {
// 					this.errorMessageForCSV = this.errorMessageForCSV + '<b>menu_item_description_english</b> is empty on line number ' + (index + 1) + ',<br> ';
// 					this.errorCounter++;
// 				}
// 				if (element['menu_item_description_arabic'] == null || element['menu_item_description_arabic'] == '') {
// 					this.errorMessageForCSV = this.errorMessageForCSV + '<b>menu_item_description_arabic</b> is empty on line number ' + (index + 1) + ',<br> ';
// 					this.errorCounter++;
// 				}
// 				if (element['menu_item_price'] == null || element['menu_item_price'] == '') {
// 					this.errorMessageForCSV = this.errorMessageForCSV + '<b>menu_item_price</b> is empty on line number ' + (index + 1) + ',<br> ';
// 					this.errorCounter++;
// 				}
// 				if (element['preparation_time'] == null || element['preparation_time'] == '') {
// 					this.errorMessageForCSV = this.errorMessageForCSV + '<b>preparation_time</b> is empty on line number ' + (index + 1) + ',<br> ';
// 					this.errorCounter++;
// 				}
// 				if (element['allergens'] == null || element['allergens'] == '') {
// 					this.errorMessageForCSV = this.errorMessageForCSV + '<b>allergens</b> is empty on line number ' + (index + 1) + ',<br> ';
// 					this.errorCounter++;
// 				}
// 				if (element['kcal'] == null || element['kcal'] == '') {
// 					this.errorMessageForCSV = this.errorMessageForCSV + '<b>kcal</b> is empty on line number ' + (index + 1) + ',<br> ';
// 					this.errorCounter++;
// 				}
// 				if (element['size'] == null || element['size'] == '') {
// 					this.errorMessageForCSV = this.errorMessageForCSV + '<b>size</b> is empty on line number ' + (index + 1) + ',<br> ';
// 					this.errorCounter++;
// 				}

// 				if (element['image_name'] == null || element['image_name'] == '') {
// 					this.errorMessageForCSV = this.errorMessageForCSV + '<b>image_name</b> is empty on line number ' + (index + 1) + ',<br> ';
// 					this.errorCounter++;
// 				}
// 				if (element['is_base_price'] == null || element['is_base_price'] == '') {
// 					this.errorMessageForCSV = this.errorMessageForCSV + '<b>is_base_price</b> is empty on line number ' + (index + 1) + ',<br> ';
// 					this.errorCounter++;
// 				}

// 			});
// 		}
// 		// this.afterJSON = JSON.stringify(result);
// 		//(no error but remove according to hanif )
// 		this.afterJSON = result;
// 		console.log("csv", this.afterJSON)
// 	}

// 	onUploadCSV(): void {
// 		this.JsonToServer = { data: this.afterJSON };
// 		this.urlVersion = 2;
// 		super.onUploadCSV();
// 	}

// 	afterSuccess(): void {
// 		this.router.navigateByUrl('/main/restaurants');
// 		this.isLoading = false;
// 	}

// 	onAssignTiming(menu: any, event: any): void {
// 		let dialogRef = this.dialog.open(TimingMenusDialogComponent, { autoFocus: false });
// 		let compInstance = dialogRef.componentInstance;
// 		compInstance.menuId = menu.id;
// 		compInstance.menuType = 'main_menu_item';
// 		dialogRef.afterClosed().subscribe(result => {
// 			if (result) {
// 				this.gerParentOutletsList(1);
// 			}
// 		});
// 		event.stopPropagation();
// 	}

// 	changeMenuStatus(menu: any) {
// 		this.isLoading = true;
// 		let method = 'updateMainMenuItem/' + menu.id;
// 		let data = {
// 			status: menu.slide ? '1' : '0',
// 			parent_outlet_id: menu.parent_outlet_id,
// 			name: menu.name,
// 			name_ar: menu.name_ar
// 		}
// 		this.mainApiService.postData(appConfig.base_url_slug + method, data, 2).then(response => {
// 			if (response.status == 200) {
// 				this.isLoading = false;
// 			}
// 		})
// 	}

// 	//------- Upload Main Menu Csv New Implementation --------//


// 	getFile(event: any) {
// 		this.csvFile = event.target.files[0];
// 	}

// 	onUploadMenuCSV(): void {
// 		this.isLoading = true;
// 		this.formData = new FormData();
// 		this.formData.append('file', this.csvFile);
// 		this.JsonToServer = this.formData;
// 		this.urlVersion = 2;

// 		this.mainApiService.postData(appConfig.base_url_slug + this.methodOfCsv, this.JsonToServer, this.urlVersion).then(response => {
// 			if (response.status == 200 || response.status == 201) {
// 				let dialogRef = this.dialog.open(AlertDialog, { autoFocus: false });
// 				let cm = dialogRef.componentInstance;
// 				cm.heading = 'Message';
// 				cm.message = 'File Uploaded Successfully';
// 				cm.cancelButtonText = 'Ok';
// 				cm.type = 'success';
// 				dialogRef.afterClosed().subscribe(result => {
// 					// this.router.navigateByUrl('/main/merchants');
// 					this.isLoading = false;
// 				})
// 			} else {
// 				this.errorCsvDialog();
// 			}
// 		})
// 			.catch((err) => {
// 				this.errorCsvDialog();
// 			})
// 		// this.afterJSON = '-';
// 		// super.onUploadCSV();
// 		// this.isCsv =true;
// 	}

// 	errorCsvDialog() {
// 		let dialogRef = this.dialog.open(AlertDialog, { autoFocus: false });
// 		let cm = dialogRef.componentInstance;
// 		cm.heading = 'Error';
// 		cm.message = 'Data in CSV file is inconsistent';
// 		cm.cancelButtonText = 'Ok';
// 		cm.type = 'error';
// 		this.isLoading = false;
// 	}
// }


import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { MainService, BaseLoaderService, PaginationService } from '../../../services';
import { AlertDialog } from '../../../lib';
import { MatDialog } from '@angular/material/dialog';
import { appConfig } from '../../../../config';
import { UserAppSelectorService } from '../../../lib/app-selector/app-selector.service';
import { ImportCSVComponent } from '../../../lib/import_csv.component';
import { TimingMenusDialogComponent } from '../timing-menus-dialog/timing-menus-dialog.component';
declare var $: any;
@Component({
	selector: 'app-main_menu',
	templateUrl: './main_menu-list.component.html'
})
export class MainMenuListComponent extends ImportCSVComponent implements OnInit {
	search: string;
	sub: Subscription;
	index: any = 1;
	totalPages: number;
	pages: any;
	totalItems: any;
	currentPage: any = 1;
	searchTimer: any;
  perPage: any;
  is_child: any;
	componentSettings: any = {
		name: null,
		paggination: null,
		search: null
	};
	appSelectorSubscription: Subscription;
	ParentOutlets: any;
	parentOutletsCount: any;
	RestaurantsParentOutlets: any[] = [];
	RestaurantsparentOutletsCount: any;
	type: any;
	codeGet: any = [];
	id: any;
  Parentid: any;
  menuStatus = false;
  formData: FormData;
	constructor(protected router: Router,
		protected _route: ActivatedRoute,
		protected mainApiService: MainService,
		protected paginationService: PaginationService,
		protected loaderService: BaseLoaderService, protected appSelectorService: UserAppSelectorService, protected dialog: MatDialog)
	{
		super(mainApiService, dialog);
		this.errorMessageForCSV = 'Invalid CSV File. <br>';
		this.methodOfCsv = 'addMenuItemsCSV';
		this.search = '';
		this.perPage = 20;
		this.appSelectorSubscription = this.appSelectorService.selectedApp.subscribe((response: any) =>
		{
			this.gerParentOutletsList(1);
		});
	}
	ngOnDestroy(): void
	{
		this.appSelectorSubscription.unsubscribe();
	}
	ngOnInit()
	{
		this.sub = this._route.params.subscribe(params => {
			this.id = params['parentid'];
			console.log("ParentId in params",this.id)
				this.gerParentOutletsList(1);
    })
    // $('tbody').sortable();
		this.componentSettings = JSON.parse(localStorage.getItem('componentSettings'))
		if (this.componentSettings)
		{
			if (this.componentSettings.name != null && this.componentSettings.name == 'MainMenuItem')
			{
				this.currentPage = this.componentSettings.paggination;
				this.index = this.componentSettings.paggination;
				this.search = this.componentSettings.search;
			}
		}
  }
	addNew()
	{
		this.router.navigateByUrl('main/restaurants/mainMenuItem/'+this.id+'/menuForm/add');
	}
	onSearchParentOutlet(): void
	{
		clearTimeout(this.searchTimer);
		this.searchTimer = setTimeout(() =>
		{
			this.gerParentOutletsList(1);
		}, 700);
	}
	onDelete(parentOutlet):void
	{
		let url = 'deleteMainMenuItem/'+parentOutlet.id+'?' ;
		this.mainApiService.getList(appConfig.base_url_slug + url, false, 2)
			.then(result =>
			{
				console.log("result",result)
				if (result.status === 200 && result.data)
				{
					this.gerParentOutletsList(1);
				}
				else
				{
				}
			});
	}
	gerParentOutletsList(index, isLoaderHidden?: boolean): void
	{
		this.loaderService.setLoading(true);
		let url = 'viewMainMenuItem?parent_outlet_id='+this.id + '&per_page=' + this.perPage + '&page=' + index + '&sort_by=id_csv' + '&sort_order=ASC' + '&pagination_type=true';
		if (this.search != '')
		{
			url = url + '&search=' + this.search;
		}
		localStorage.setItem('componentSettings', JSON.stringify(
			{
				name: 'RestaurantParentOutlet',
				paggination: this.index,
				search: this.search
			}
		));
		this.mainApiService.getList(appConfig.base_url_slug + url, false, 2)
			.then(result =>
			{
				if (result.status === 200 && result.data)
				{
          this.RestaurantsParentOutlets = result.data;
          this.RestaurantsParentOutlets.forEach(menu => {
            menu.slide = menu.status === '1' ? true: false;
          });
					this.RestaurantsparentOutletsCount = result.pagination.count;
          this.currentPage = index;
          // setTimeout(()=>{
          //   let x = this.row.nativeElement.children[0].children[1].innerText;
          //   console.log(x);
          // },10000)
          // let n = Array.prototype.slice.call(x);
					this.pages = this.paginationService.setPagination(this.RestaurantsparentOutletsCount, index, this.perPage);
          this.totalPages = this.pages.totalPages;
          console.log(this.pages);
					this.loaderService.setLoading(false);
				}
				else
				{
					this.RestaurantsParentOutlets = [];
					this.RestaurantsparentOutletsCount = 0;
					this.currentPage = 1;
					this.pages = this.paginationService.setPagination(this.RestaurantsparentOutletsCount, index, this.perPage);
					this.totalPages = this.pages.totalPages;
					this.loaderService.setLoading(false);
				}
			});
  }
	onLocationBack(): void
	{
		window.history.back();
	}
	setPage(pageDate: any)
	{
		this.currentPage = pageDate.page;
		this.perPage = pageDate.perPage;
		this.index = this.currentPage;
		this.gerParentOutletsList(pageDate.page);
	}
	onEditRestaurantMenuid(parentOutlet): void
	{
		localStorage.setItem('MainMenuItem', JSON.stringify(parentOutlet));
		this.router.navigateByUrl('main/restaurants/mainMenuItem/'+this.id+'/menuForm/'+parentOutlet.id);
	}
	onMenu(parentOutlet): void
	{
		localStorage.setItem('RestaurantParentOutlet', JSON.stringify(parentOutlet));
		this.router.navigateByUrl('/main/restaurants/mainMenuItem/'+this.id+'/restaurantMenuList/'+ parentOutlet.id);
	}
	//cvs data////
	afterSelectionCsv(result, headersObj, objTemp): void
	{
		for (let key in headersObj)
		{
		console.log("header",headersObj)
			//adding header object which is shown on the top of the list
			if (!headersObj.hasOwnProperty('parent_id') && !objTemp.hasOwnProperty('parent_id'))
			{
				objTemp['parent_id'] = null;
				this.errorMessageForCSV = this.errorMessageForCSV + '<b>parent_id</b> is missing,<br> ';
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
			result.forEach((element, index) =>
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
				if (element['menu_item_description_english'] == null || element['menu_item_description_english'] == '')
				{
					this.errorMessageForCSV = this.errorMessageForCSV + '<b>menu_item_description_english</b> is empty on line number ' + (index + 1) + ',<br> ';
					this.errorCounter++;
				}
				if (element['menu_item_description_arabic'] == null || element['menu_item_description_arabic'] == '')
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
		console.log("csv",this.afterJSON)
	}
	onUploadCSV(): void
	{
		this.JsonToServer = { data: this.afterJSON };
		this.urlVersion=2;
		super.onUploadCSV();
	}
	afterSuccess(): void
	{
		this.router.navigateByUrl('/main/restaurants');
		this.isLoading = false;
  }
  onAssignTiming(menu, event): void
	{
		let dialogRef = this.dialog.open(TimingMenusDialogComponent, {autoFocus: false});
		let compInstance = dialogRef.componentInstance;
    compInstance.menuId = menu.id;
    compInstance.menuType = 'main_menu_item';
		dialogRef.afterClosed().subscribe(result => {
			if(result)
			{
				this.gerParentOutletsList(1);
			}
		});
		event.stopPropagation();
	}
  changeMenuStatus(menu) {
    this.isLoading = true;
    let method = 'updateMainMenuItem/' + menu.id;
    let data = {
      status: menu.slide ? '1': '0',
      parent_outlet_id: menu.parent_outlet_id,
      name: menu.name,
      name_ar: menu.name_ar
    }
    this.mainApiService.postData(appConfig.base_url_slug + method, data, 2).then(response => {
      if (response.status === 200) {
        this.isLoading = false;
      }
    })
  }
  //------- Upload Main Menu Csv New Implementation --------//
  getFile(event) {
    this.csvFile = event.target.files[0];
  }
  onUploadMenuCSV(): void {
    this.isLoading = true;
    this.formData = new FormData();
    this.formData.append('file', this.csvFile);
		this.JsonToServer = this.formData;
		this.urlVersion=2;
    this.mainApiService.postData(appConfig.base_url_slug + this.methodOfCsv, this.JsonToServer, this.urlVersion).then(response => {
      if (response.status == 200 || response.status == 201 ) {
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
    .catch((err)=> {
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