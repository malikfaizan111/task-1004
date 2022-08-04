import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription, Observable } from 'rxjs';
import { MainService, BaseLoaderService, PaginationService } from '../../../../services';
import { AlertDialog } from '../../../../lib';
import { MatDialog } from '@angular/material/dialog';
import { appConfig } from '../../../../../config';
import { UserAppSelectorService } from '../../../../lib/app-selector/app-selector.service';

@Component({
	selector: 'app-type',
	templateUrl: './type-list.component.html'
})
export class TypeListComponent implements OnInit {

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
	RestaurantsParentOutlets: any;
	RestaurantsparentOutletsCount: any;
	type: any;
	codeGet: any = [];
	id: any;

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
	onLocationBack(): void {
		window.history.back();
	}

	ngOnInit() {
		this.sub = this._route.params.subscribe(params => {
			this.id = params['ParentId'];
			console.log("ParentId in params", this.id)

			this.gerParentOutletsList(1);

		})
		let abc = localStorage.getItem('componentSettings') as string;
		this.componentSettings = JSON.parse(abc);
		if (this.componentSettings) {
			if (this.componentSettings.name != null && this.componentSettings.name == 'MainMenuItem') {
				this.currentPage = this.componentSettings.paggination;
				this.index = this.componentSettings.paggination;
				this.search = this.componentSettings.search;
			}
		}

	}

	addNew() {
		this.router.navigateByUrl('main/Delivery_categories/add');
	}
	onSearchParentOutlet(): void {
		clearTimeout(this.searchTimer);
		this.searchTimer = setTimeout(() => {

			this.gerParentOutletsList(1);

		}, 700);

	}
	gerParentOutletsList(index: any, isLoaderHidden?: boolean): void {
		this.loaderService.setLoading(true);
		let url = 'viewDeliveryCategories?parent_outlet_id=' + this.id;
		if (this.search != '') {
			url = url + '&search=' + this.search;
		}

		localStorage.setItem('componentSettings', JSON.stringify(
			{
				name: 'RestaurantType',
				paggination: this.index,
				search: this.search
			}
		));

		this.mainApiService.getList(appConfig.base_url_slug + url, false, 2)
			.then(result => {
				if (result.status == 200 && result.data) {
					this.RestaurantsParentOutlets = result.data;
					this.RestaurantsparentOutletsCount = result.data.pagination;
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

	setPage(pageDate: any) {
		this.currentPage = pageDate.page;
		this.perPage = pageDate.perPage;
		this.index = this.currentPage;
		this.gerParentOutletsList(pageDate.page);
	}

	onEditRestaurantMenuid(parentOutlet: any): void {
		localStorage.setItem('MainMenuItem', JSON.stringify(parentOutlet));
		this.router.navigateByUrl('main/Delivery_categories/' + parentOutlet.id);
	}
}