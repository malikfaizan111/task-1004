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
	selector: 'app-sub_menu_item',
	templateUrl: './sub_menu_item-list.component.html'
})
export class SubMenuItemListComponent implements OnInit {
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
	SubMenuItemid: any;
	decimals = '';

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
			this.SubMenuid = params['subMenuItem'];
			this.SubMenuItemid = params['submenuItemid'];
			this.gerParentOutletsList(1);
			// $('tbody').sortable();
		})
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
	onDelete(parentOutlet: any): void {
		let url = 'deleteSubMenuItem/' + parentOutlet.id + '?';

		this.mainApiService.getList(appConfig.base_url_slug + url, false, 2)
			.then(result => {

				if (result.status == 200 && result.data) {
					this.gerParentOutletsList(1);
				}
				else {
				}
			});
	}
	addNew() {
		this.router.navigateByUrl('main/restaurants/mainMenuItem/' + this.id + '/restaurantMenuList/Menu/' + this.Menuid + '/SubMenu/' + this.SubMenuid + '/SubmenuItemForm/add');
	}

	onSearchParentOutlet(): void {
		clearTimeout(this.searchTimer);
		this.searchTimer = setTimeout(() => {
			this.gerParentOutletsList(1);
		}, 700);
	}

	gerParentOutletsList(index: any, isLoaderHidden?: boolean): void {
		this.loaderService.setLoading(true);
		this.decimals = this.appSelectorService.userAppData.user_app_id == 1 ? '1.2' : '1.3';
		let url = 'viewSubMenuItem?sub_menu_id=' + this.SubMenuid + '&per_page=' + this.perPage + '&page=' + index + '&sort_by=id_csv' + '&sort_order=ASC' + '&pagination_type=true';
		if (this.search != '') {
			url = url + '&search=' + this.search;
		}

		localStorage.setItem('componentSettings', JSON.stringify(
			{
				name: 'SubMenuItem',
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

	onEditSubMenuItem(parentOutlet: any): void {
		localStorage.setItem('RestaurantSubMenuItem', JSON.stringify(parentOutlet));
		this.router.navigateByUrl('main/restaurants/mainMenuItem/' + this.id + '/restaurantMenuList/Menu/' + this.Menuid + '/SubMenu/' + this.SubMenuid + '/SubmenuItemForm/' + parentOutlet.id);
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
		let method = 'updateSubMenuItem/' + menu.id;
		let data = {
			status: menu.slide ? '1' : '0',
			description: menu.description,
			description_ar: menu.description_ar,
			id: menu.id,
			is_base_price: menu.is_base_price,
			menu_item_id: menu.menu_item_id,
			multi_choice: menu.multi_choice,
			name: menu.name,
			name_ar: menu.name_ar,
			parent_outlet_id: menu.parent_outlet_id,
			price: menu.price,
			sub_menu_id: menu.sub_menu_id
		}
		this.mainApiService.postData(appConfig.base_url_slug + method, data, 2).then(response => {
			if (response.status == 200) {
			}
		})
	}
}