import { BeeDeliveryTokenDialogComponent } from './../../dialogs/bee-delivery-token-dialog/bee-delivery-token-dialog.component';
import { DeliveryOptionsDialogComponent } from './../../lib/delivery-options-dialog/delivery-options-dialog.component';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { MainService, BaseLoaderService, PaginationService } from '../../services';
import { AlertDialog, ExportCSVDialog } from '../../lib';
import { OutletDetailsComponent } from './outlet-details.component';
import { AppLoaderService } from '../../lib/app-loader/app-loader.service';
import { ExportCSVComponent } from '../../lib/export_csv.component';
import { appConfig } from '../../../config';
import { UserAppSelectorService } from '../../lib/app-selector/app-selector.service';
import { AssignParentOutletDialog } from './assign_parent.dialog';
import { TimingOutletDialog } from './timing.dialog';


@Component({
	selector: 'app-outlets-list',
	templateUrl: './outlets-list.component.html'
})
export class OutletsListComponent extends ExportCSVComponent implements OnInit {
	search: string;
	sub: Subscription = new Subscription();
	index: any = 1;
	totalPages: number = 1;
	pages: any;
	totalItems: any;
	currentPage: any = 1;
	mainArray: any = [];
	outletsCount: any;
	Outlets: any;
	Categories: any;
	category_id: string;
	searchTimer: any;
	orderby: string;
	sortby: string;
	active: any;
	perPage: number;
	componentSettings: any;
	appSelectorSubscription: Subscription;
	role: any;
	PopularCategories: any[] = [];
	userApp: any;
	userAppId: boolean = true;

	constructor(protected router: Router,
		protected _route: ActivatedRoute,
		protected mainApiService: MainService,
		protected appSelectorService: UserAppSelectorService,
		protected paginationService: PaginationService,
		protected loaderService: BaseLoaderService, protected appLoaderService: AppLoaderService, protected dialog: MatDialog) {
		super(mainApiService, appLoaderService, dialog);
		this.method = 'getOutlets';
		this.search = '';
		this.Outlets = [];
		this.category_id = '';
		this.sortby = '';
		this.orderby = 'ASC';
		this.active = '';
		this.perPage = 20;
		this.UrlVersion = 2;

		this.componentSettings = {
			name: null,
			paggination: null,
			search: null
		}
		this.appSelectorSubscription = this.appSelectorService.selectedApp.subscribe((response: any) => {
			this.userApp = response.user_app_id;
			this.gerOutletsList(1);
		});
	}

	ngOnDestroy(): void {
		this.appSelectorSubscription.unsubscribe();
	}


	ngOnInit() {
		this.userApp = this.mainApiService.user_app.user_app_id.toString();
		let abc = localStorage.getItem('componentSettings') as string;
		this.componentSettings = JSON.parse(abc);
		if (this.componentSettings) {
			if (this.componentSettings.name != null && this.componentSettings.name == 'Outlets') {
				this.currentPage = this.componentSettings.paggination;
				this.index = this.componentSettings.paggination;
				this.search = this.componentSettings.search;
			}
		}

		this.method = 'getOutletsNew';
		this.gerOutletsList(this.currentPage);
		this.getCategoriesList();
		this.viewPopularCategoryOnly();
		let abcd = localStorage.getItem('UrbanpointAdmin') as string;
		this.Roles = JSON.parse(abcd);
		this.role = this.Roles.role;

	}

	addNew() {
		this.router.navigateByUrl('main/outlets/add');
	}

	onSearchOutlet(): void {
		clearTimeout(this.searchTimer);
		this.searchTimer = setTimeout(() => {
			this.gerOutletsList(1);
		}, 800);
	}

	onViewDetails(outlet: any): void {
		if (this.role == '1') {
			let dialogRef = this.dialog.open(OutletDetailsComponent, { autoFocus: false });
			let compInstance = dialogRef.componentInstance;
			compInstance.Outlet = outlet;
			dialogRef.afterClosed().subscribe(result => {
				if (result != 'cancel') {
					this.gerOutletsList(this.currentPage);
				}
			})
		}
	}

	onAssignParent(outlet: any, event: any): void {
		let dialogRef = this.dialog.open(AssignParentOutletDialog, { autoFocus: false });
		let compInstance = dialogRef.componentInstance;
		compInstance.OutletID = outlet.id;
		dialogRef.afterClosed().subscribe(result => {
			if (result) {
				this.gerOutletsList(this.currentPage);
			}
		});
		event.stopPropagation();
	}
	onAssignTiming(outlet: any, event: any): void {
		let dialogRef = this.dialog.open(TimingOutletDialog, { autoFocus: false });
		let compInstance = dialogRef.componentInstance;
		compInstance.OutletID = outlet.id;
		dialogRef.afterClosed().subscribe(result => {
			if (result) {
				this.gerOutletsList(this.currentPage);
			}
		});
		event.stopPropagation();
	}

	onDeliveryOptions(outlet: any, event: any): void {
		let dialogRef = this.dialog.open(DeliveryOptionsDialogComponent, { autoFocus: false });
		let compInstance = dialogRef.componentInstance;
		compInstance.OutletId = outlet.id;
		compInstance.selectValue = outlet.delivery_options;
		compInstance.deliveryType = outlet.enable_delivery_for;
		dialogRef.afterClosed().subscribe(result => {
			if (result) {
				this.gerOutletsList(this.currentPage);
			}
		});
		event.stopPropagation();
	}

	getCategoriesList(): void {
		this.mainApiService.getList(appConfig.base_url_slug + 'getCategories', true)
			.then(result => {
				if (result.status == 200 && result.data) {
					this.Categories = result.data.categories;
				}
				else {
					this.Categories = [];
				}
			});
	}
	viewPopularCategoryOnly(): void {
		this.mainApiService.getList(appConfig.base_url_slug + 'viewPopularCategoryOnly', true, 2)
			.then(result => {
				if (result.status == 200 && result.data) {
					this.PopularCategories = result.data.categories;
				}
				else {
					this.PopularCategories = [];
				}
			});
	}

	gerOutletsList(index: any, isLoaderHidden?: boolean): void {

		this.url_values = [
			{ key: 'sortby', value: this.sortby, title: 'Sort By' },
			{ key: 'category_id', value: this.category_id, title: 'Categories' },
			{ key: 'active', value: this.active, title: 'Status' },
			{ key: 'orderby', value: this.orderby, title: 'Order By' }
		];

		if (isLoaderHidden) {
			this.loaderService.setLoading(false);
		}
		else {
			this.loaderService.setLoading(true);
		}

		let url = 'getOutletsNew?page=' + index + '&per_page=' + this.perPage + '&orderby=' + this.orderby;

		if (this.search != '') {
			url = url + '&search=' + this.search;
		}
		if (this.sortby != '') {
			url = url + '&sortby=' + this.sortby;
		}

		if (this.active != '') {
			url = url + '&active=' + this.active;
		}

		if (this.category_id != '') {
			url = url + '&category_id=' + this.category_id;
		}

		localStorage.setItem('componentSettings', JSON.stringify(
			{
				name: 'Outlets',
				paggination: this.index,
				search: this.search
			}
		));

		this.mainApiService.getList(appConfig.base_url_slug + url,false, 2)
			.then(result => {
				if (result.status == 200 && result.data) {
					this.Outlets = result.data.outlets;
					this.outletsCount = result.data.outletsCount;
					this.currentPage = index;
					this.pages = this.paginationService.setPagination(this.outletsCount, index, this.perPage);
					this.totalPages = this.pages.totalPages;
					this.loaderService.setLoading(false);
				}
				else {
					this.Outlets = [];
					this.outletsCount = 0;
					this.currentPage = 1;
					this.pages = this.paginationService.setPagination(this.outletsCount, index, this.perPage);
					this.totalPages = this.pages.totalPages;
					this.loaderService.setLoading(false);
				}
			});
	}

	beeDeliveryToken(outlet: any, event: any) {
		let dialogRef = this.dialog.open(BeeDeliveryTokenDialogComponent, { autoFocus: false });
		console.log(outlet);
		dialogRef.componentInstance.OutletId = outlet.id;
		dialogRef.componentInstance.token = outlet.access_token_for_bee_delivery || '';
		dialogRef.componentInstance.isEdit = outlet.access_token_for_bee_delivery ? true : false;

		dialogRef.afterClosed().subscribe(result => {
			if (result) {
				this.gerOutletsList(this.currentPage, true);
			}
		});

		event.stopPropagation();
	}

	setPage(pageDate: any) {
		this.currentPage = pageDate.page;
		this.perPage = pageDate.perPage;
		this.index = this.currentPage;
		this.gerOutletsList(pageDate.page);
	}

	onAddMultiple(item: any, event: any): void {
		this.router.navigateByUrl('main/outlets/multiple_deals/' + item.id);
		event.stopPropagation();
	}

	onEditOutlet(outlet: any, event: any): void {
		localStorage.setItem('Outlet', JSON.stringify(outlet));
		this.router.navigateByUrl('main/outlets/' + outlet.id);
		event.stopPropagation();
	}

	onDeleteOutlet(outlet: any): void {
		let merchantData = {
			id: outlet.id
		};

		let dialogRef = this.dialog.open(AlertDialog, { autoFocus: false });
		let cm = dialogRef.componentInstance;
		cm.heading = 'Delete Outlet';
		cm.message = 'Are you sure to delete Outlet';
		cm.submitButtonText = 'Yes';
		cm.cancelButtonText = 'No';
		cm.type = 'ask';
		cm.methodName = appConfig.base_url_slug + 'deleteOutlet';
		cm.dataToSubmit = merchantData;
		cm.showLoading = true;

		dialogRef.afterClosed().subscribe(result => {
			if (result) {
				this.gerOutletsList(this.currentPage, true);
			}
		})
	}

	onSelectDate() {
		if (this.isNeededDate) {
			let dialogRef = this.dialog.open(ExportCSVDialog, { autoFocus: false });
			dialogRef.componentInstance.filter_values = this.url_values;
			dialogRef.afterClosed().subscribe(result => {
				if (result != false && result != void 0) {
					this.start_date = result.start_date;
					this.end_date = result.end_date;
					this.onDownloadReports();
				}
			})
		}
	}
	onDownloadReports() {

		let url = ''
		url = appConfig.base_url_slug + this.method + '&start_date=' + this.start_date + '&end_date=' + this.end_date + '&export=csv';
		let version = 1;

		this.mainApiService.getList(url, this.IsSingle, version)
			.then(result => {
				//this.loaderService.setLoading(false);
				//console.log(result);
				if (result.status === 200) {
					let csvContent;
					let tempArray = result.data.outlets;
					console.log('checking the data being fetched', tempArray);
					this.mainArray = [];
					let checkdata: boolean = true;
					if (tempArray.length != 0) {
						checkdata = true;
					}
					if (checkdata) {

						if (tempArray.length != 0) {
							tempArray.forEach(outlet => {
								if (outlet.Country == 'Urban Point') {
									outlet['Country'] = 'Qatar';
								}
								else {
								}
								if (outlet.length != 0) {
									this.mainArray.push({
										id: outlet.id,
										merchant_id: outlet.merchant_id,
										parents_id: outlet.parents_id,
										collection_id: outlet.collection_id,
										playlist_id: outlet.playlist_id,
										name: outlet.name,
										emails: outlet.emails,
										phone: outlet.phone,
										phones: outlet.phones,
										SKU: outlet.SKU,
										pin: outlet.pin,
										search_tags: outlet.search_tags,
										logo: outlet.logo,
										image: outlet.image,
										location_image: outlet.location_image,
										address: outlet.address,
										latitude: outlet.latitude,
										longitude: outlet.longitude,
										neighborhood: outlet.neighborhood,
										timings: outlet.timings,
										description: outlet.description,
										access_token_for_bee_delivery: outlet.access_token_for_bee_delivery,
										pending_emails_body: outlet.pending_emails_body,
										type: outlet.type,
										special: outlet.special,
										active: outlet.active,
										delivery_status: outlet.delivery_status,
										delivery_operate_status: outlet.delivery_operate_status,
										busy_closed_until: outlet.busy_closed_until,
										delivery_radius: outlet.delivery_radius,
										enable_delivery_for: outlet.enable_delivery_for,
										delivery_options: outlet.delivery_options,
										menu_card: outlet.menu_card,
										menu_type: outlet.menu_type,
										isnew_brand: outlet.isnew_brand,
										isnewbrand_expiry: outlet.isnewbrand_expiry,
										created_at: outlet.created_at,
										updated_at: outlet.updated_at,
										branch: outlet.branch,
										merchant_name: outlet.merchant_name,
										app_id: outlet.app_id,
										category_ids: outlet.category_ids,
										popular_category_ids: outlet.popular_category_ids,
										collection_ids: outlet.collection_ids,
										image_name: outlet.image_name,
										logo_name: outlet.logo_name,
										outletMenu: outlet.outletMenu,
										total_delivery_orders: outlet.total_delivery_orders,
										no_of_offers_redeemed: outlet.no_of_offers_redeemed,
										Country: outlet.Country,
										brand: outlet.outletParent.name,
										outletParent: '[object object]'
									})
								}
							});
						}
						// console.log("Download Report : ", this.mainArray);
						let td = '<td style="border:1px solid #CCCCCC">';
						csvContent = '<head><meta charset="UTF-8"></head><table style="font-size:14px; width: 700px">';

						csvContent = csvContent + '<tr>' + td + '</td>' + td + '</td></tr>';

						for (let i = 0; i < 1; i++) {
							var header = '<tr style="font-weight:bold;">' + td;

							header = header + 'id' + '</td>' + td + 'merchant_id' + '</td>' + td + 'parents_id' + '</td>' + td + 'collection_id' + '</td>' + td + 'playlist_id' + '</td>' + td + 'name'
								+ '</td>' + td + 'emails' + '</td>' + td + 'phone' + '</td>' + td + 'phones' + '</td>' + td + 'SKU' + '</td>' + td + 'pin'
								+ '</td>' + td + 'search_tags' + '</td>' + td + 'logo' + '</td>' + td + 'image' + '</td>' + td + 'location_image' + '</td>' + td + 'address'
								+ '</td>' + td + 'latitude' + '</td>' + td + 'longitude' + '</td>' + td + 'neighborhood' + '</td>' + td + 'timings' + '</td>' + td + 'description'
								+ '</td>' + td + 'access_token_for_bee_delivery' + '</td>' + td + 'pending_emails_body' + '</td>' + td + 'type' + '</td>' + td + 'special' + '</td>' + td + 'active'
								+ '</td>' + td + 'delivery_status' + '</td>' + td + 'delivery_operate_status' + '</td>' + td + 'busy_closed_until' + '</td>' + td + 'delivery_radius' + '</td>' + td + 'enable_delivery_for'
								+ '</td>' + td + 'delivery_options' + '</td>' + td + 'menu_card' + '</td>' + td + 'menu_type' + '</td>' + td + 'isnew_brand' + '</td>' + td + 'created_at' + '</td>' + td + 'updated_at'
								+ '</td>' + td + 'branch' + '</td>' + td + 'merchant_name' + '</td>' + td + 'app_id' + '</td>' + td + 'category_ids' + '</td>' + td + 'popular_category_ids'
								+ '</td>' + td + 'collection_ids' + '</td>' + td + 'image_name' + '</td>' + td + 'logo_name' + '</td>' + td + 'outletMenu' + '</td>' + td + 'total_delivery_orders'
								+ '</td>' + td + 'no_of_offers_redeemed' + '</td>' + td + 'Country' + '</td>' + td + 'brand' + '</td>' + td + 'outletParent';

							for (let j = 0; j < this.mainArray.length; j++) {
								var line = '<tr>' + td;
								var line = line + this.mainArray[j].id + '</td>' + td + this.mainArray[j].merchant_id + '</td>' + td + this.mainArray[j].parents_id + '</td>' + td + this.mainArray[j].collection_id + '</td>' + td + this.mainArray[j].playlist_id + '</td>' + td + this.mainArray[j].name
									+ '</td>' + td + this.mainArray[j].emails + '</td>' + td + this.mainArray[j].phone + '</td>' + td + this.mainArray[j].phones + '</td>' + td + this.mainArray[j].SKU + '</td>' + td + this.mainArray[j].pin
									+ '</td>' + td + this.mainArray[j].search_tags + '</td>' + td + this.mainArray[j].logo + '</td>' + td + this.mainArray[j].image + '</td>' + td + this.mainArray[j].location_image + '</td>' + td + this.mainArray[j].address
									+ '</td>' + td + this.mainArray[j].latitude + '</td>' + td + this.mainArray[j].longitude + '</td>' + td + this.mainArray[j].neighborhood + '</td>' + td + this.mainArray[j].timings + '</td>' + td + this.mainArray[j].description
									+ '</td>' + td + this.mainArray[j].access_token_for_bee_delivery + '</td>' + td + this.mainArray[j].pending_emails_body + '</td>' + td + this.mainArray[j].type + '</td>' + td + this.mainArray[j].special + '</td>' + td + this.mainArray[j].active
									+ '</td>' + td + this.mainArray[j].delivery_status + '</td>' + td + this.mainArray[j].delivery_operate_status + '</td>' + td + this.mainArray[j].busy_closed_until + '</td>' + td + this.mainArray[j].delivery_radius + '</td>' + td + this.mainArray[j].enable_delivery_for
									+ '</td>' + td + this.mainArray[j].delivery_options + '</td>' + td + this.mainArray[j].menu_card + '</td>' + td + this.mainArray[j].menu_type + '</td>' + td + this.mainArray[j].isnew_brand + '</td>' + td + this.mainArray[j].created_at + '</td>' + td + this.mainArray[j].updated_at
									+ '</td>' + td + this.mainArray[j].branch + '</td>' + td + this.mainArray[j].merchant_name + '</td>' + td + this.mainArray[j].app_id + '</td>' + td + this.mainArray[j].category_ids + '</td>' + td + this.mainArray[j].popular_category_ids
									+ '</td>' + td + this.mainArray[j].collection_ids + '</td>' + td + this.mainArray[j].image_name + '</td>' + td + this.mainArray[j].logo_name + '</td>' + td + this.mainArray[j].outletMenu + '</td>' + td + this.mainArray[j].total_delivery_orders
									+ '</td>' + td + this.mainArray[j].no_of_offers_redeemed + '</td>' + td + this.mainArray[j].Country + '</td>' + td + this.mainArray[j].brand + '</td>' + td + '[object Object]';

								if (j == 0) {
									csvContent += header + '</td></tr>' + line + '</td></tr>';
								}
								else {
									csvContent += line + '</td></tr>';
								}
							}

						}
						csvContent = csvContent + '</table>'
						var csvName = 'Outlets_Data_For_Dashboard.xls'
						console.log('Data designed by ', csvContent);
						this.downloadFile(csvContent, csvName);
					}
					else {
						let dialogRef = this.dialog.open(AlertDialog, { autoFocus: false });
						let cm = dialogRef.componentInstance;
						cm.heading = 'Alert!';
						cm.message = 'No Data is Found in this Date';
						cm.cancelButtonText = 'Ok';
						cm.type = 'error';
					}
				}
				else {
					this.mainArray = [];
					this.currentPage = 1;

					let dialogRef = this.dialog.open(AlertDialog, { autoFocus: false });
					let cm = dialogRef.componentInstance;
					cm.heading = 'Alert!';
					cm.message = 'No Data is Found in this Date';
					cm.cancelButtonText = 'Ok';
					cm.type = 'error';

					// this.pages = this.paginationService.setPagination(this.offersCount, index, this.perPage);
					// this.totalPages = this.pages.totalPages;
					//this.loaderService.setLoading(false);
				}
			});
	}

	downloadFile(data, fileName) {

		var csvData = data;
		var uri = 'data:application/vnd.ms-excel;charset=utf-8,' + encodeURIComponent(csvData);
		// var uri = 'data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-16,'+ encodeURIComponent(csvData);
		var downloadLink = document.createElement("a");
		downloadLink.href = uri;
		downloadLink.download = fileName;
		document.body.appendChild(downloadLink);
		downloadLink.click();
		document.body.removeChild(downloadLink);
	}
}