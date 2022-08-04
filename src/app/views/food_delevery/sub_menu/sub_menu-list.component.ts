import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { MainService, BaseLoaderService, PaginationService } from '../../../services';
import { AlertDialog } from '../../../lib';
import { MatDialog } from '@angular/material/dialog';
import { appConfig } from '../../../../config';
import { UserAppSelectorService } from '../../../lib/app-selector/app-selector.service';
declare var $: any;
@Component({
	selector: 'app-sub_menu',
	templateUrl: './sub_menu-list.component.html'
})
export class SubMenuListComponent implements OnInit {
	search: string;
	sub: Subscription = new Subscription();
	index: any = 1;
	totalPages: number = 1;
	pages: any;
	totalItems: any;
	currentPage: any = 1;
	searchTimer: any;
	perPage: any;
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
	SubMenuid: any;
	Menuid: any;
	menuStatus = false;

	constructor(protected router: Router,
		protected _route: ActivatedRoute,
		protected mainApiService: MainService,
		protected paginationService: PaginationService,
		protected loaderService: BaseLoaderService, protected appSelectorService: UserAppSelectorService, protected dialog: MatDialog) {
		this.search = '';
		this.perPage = 20;
		this.appSelectorSubscription = this.appSelectorService.selectedApp.subscribe((response: any) => {
			this.gerParentOutletsList(1);
		});
	}

	ngOnDestroy(): void {
		this.appSelectorSubscription.unsubscribe();
	}


	ngOnInit() {
		this.sub = this._route.params.subscribe(params => {
			this.id = params['parentid'];
			this.Menuid = params['Menuid'];
			this.SubMenuid = params['Submenu'];

			console.log("SubMenuid in params", this.id)
			console.log("Menuid in params", this.Menuid)

			this.gerParentOutletsList(1);

		})
		// $('tbody').sortable();
		let abc = localStorage.getItem('componentSettings') as string;
		this.componentSettings = JSON.parse(abc);
		if (this.componentSettings) {
			if (this.componentSettings.name != null && this.componentSettings.name == 'SubMenuItem') {
				this.currentPage = this.componentSettings.paggination;
				this.index = this.componentSettings.paggination;
				this.search = this.componentSettings.search;
			}
		}

	}

	addNew() {

		this.router.navigateByUrl('main/restaurants/mainMenuItem/' + this.id + '/restaurantMenuList/Menu/' + this.Menuid + '/SubmenuForm/add');
	}
	onSearchParentOutlet(): void {
		clearTimeout(this.searchTimer);
		this.searchTimer = setTimeout(() => {

			this.gerParentOutletsList(1);

		}, 700);

	}
	onDelete(parentOutlet: any): void {
		let url = 'deleteSubMenu/' + parentOutlet.id + '?';

		this.mainApiService.getList(appConfig.base_url_slug + url, false, 2)
			.then(result => {

				if (result.status == 200 && result.data) {

					this.gerParentOutletsList(1);


				}
				else {


				}
			});
	}
	gerParentOutletsList(index: any, isLoaderHidden?: boolean): void {
		this.loaderService.setLoading(true);
		let url = 'viewSubMenu?menu_item_id=' + this.Menuid + '&per_page=' + this.perPage + '&page=' + index + '&sort_order=ASC' + '&pagination_type=true';
		if (this.search != '') {
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
			.then(result => {
				if (result.status == 200 && result.data) {
					this.RestaurantsParentOutlets = result.data;
					this.RestaurantsparentOutletsCount = result.pagination.count;
					this.RestaurantsParentOutlets.forEach(menu => {
						menu.slide = menu.status == '1' ? true : false;
					});
					this.currentPage = index;
					this.pages = this.paginationService.setPagination(this.RestaurantsparentOutletsCount, index, this.perPage);
					this.totalPages = this.pages.totalPages;
					this.loaderService.setLoading(false);
				}
				else {
					this.RestaurantsParentOutlets = [];
					this.RestaurantsparentOutletsCount = 0;
					this.currentPage = 1;
					this.pages = this.paginationService.setPagination(this.RestaurantsparentOutletsCount, index, this.perPage);
					this.totalPages = this.pages.totalPages;
					this.loaderService.setLoading(false);
				}
			});
	}

	onLocationBack(): void {
		window.history.back();
	}
	setPage(pageDate: any) {
		this.currentPage = pageDate.page;
		this.perPage = pageDate.perPage;
		this.index = this.currentPage;
		this.gerParentOutletsList(pageDate.page);
	}

	onEditSubMenu(parentOutlet: any): void {
		localStorage.setItem('RestaurantSubMenu', JSON.stringify(parentOutlet));
		this.router.navigateByUrl('main/restaurants/mainMenuItem/' + this.id + '/restaurantMenuList/Menu/' + this.Menuid + '/SubmenuForm/' + parentOutlet.id);
	}
	onSubMenuItem(parentOutlet: any): void {
		localStorage.setItem('RestaurantSubMenu', JSON.stringify(parentOutlet));
		this.router.navigateByUrl('main/restaurants/mainMenuItem/' + this.id + '/restaurantMenuList/Menu/' + this.Menuid + '/SubMenu/' + parentOutlet.id);
	}

	onDelete1(parentOutlet: any): void {
		// let url = 'viewMenuItem?parent_outlet_id=' + this.id;
		let url = 'deleteSubMenu/' + parentOutlet.id;
		this.mainApiService.getList(appConfig.base_url_slug + url, false, 2)
			.then(result => {
				if (result.status == 200 && result.data) {
					let dialogRef = this.dialog.open(AlertDialog, { autoFocus: false });
					let cm = dialogRef.componentInstance;
					cm.heading = 'SUCCESS';
					cm.message = "YOU CAN DELETE SUB-MENU";
					cm.cancelButtonText = 'Ok';
					cm.type = 'success';
					this.gerParentOutletsList(1);

				}
				else {
					let dialogRef = this.dialog.open(AlertDialog, { autoFocus: false });
					let cm = dialogRef.componentInstance;
					cm.heading = 'Error';
					cm.message = "YOU CAN'T DELETE SUB-MENU";
					cm.cancelButtonText = 'Ok';
					cm.type = 'error';

					this.loaderService.setLoading(false);
				}
			});

	}

	changeMenuStatus(menu: any) {
		let method = 'updateSubMenu/' + menu.id;
		let data = {
			status: menu.slide ? '1' : '0',
			parent_outlet_id: menu.parent_outlet_id.toString(),
			menu_item_id: menu.menu_item_id.toString(),
			heading: menu.heading,
			heading_ar: menu.heading_ar,
			title: menu.title,
			id: menu.id,
			title_ar: menu.title_ar,
			selection_type: menu.selection_type,
			menu_type: menu.menu_type
		}
		this.mainApiService.postData(appConfig.base_url_slug + method, data, 2).then(response => {
			if (response.status == 200) {
			}
		})
	}
}