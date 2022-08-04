import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';

import { MainService, BaseLoaderService, PaginationService } from '../../services';
import { AppLoaderService } from '../../lib/app-loader/app-loader.service';
import { ExportCSVComponent } from '../../lib/export_csv.component';
import { appConfig } from '../../../config';
import { UserAppSelectorService } from '../../lib/app-selector/app-selector.service';


@Component({
	selector: 'app-orders-list',
	templateUrl: './orders-list.component.html'
})
export class OrdersListComponent extends ExportCSVComponent implements OnInit {
	search: string;
	sub: Subscription = new Subscription();
	index: any = 1;
	totalPages: number = 1;
	pages: any;
	totalItems: any;
	currentPage: any = 1;
	outletsCount: any;
	Orders: any;
	id: any;
	searchTimer: any;
	perPage: number;
	componentSettings: any;
	appSelectorSubscription: Subscription;
	role: any;

	constructor(protected router: Router,
		protected _route: ActivatedRoute,
		protected mainApiService: MainService,
		protected paginationService: PaginationService,
		protected appSelectorService: UserAppSelectorService,
		protected appLoaderService: AppLoaderService,
		protected loaderService: BaseLoaderService, protected dialog: MatDialog) {
		super(mainApiService, appLoaderService, dialog);
		this.method = 'getOrders';
		this.search = '';
		this.Orders = [];
		this.perPage = 20;

		this.componentSettings = {
			name: null,
			paggination: null,
			search: null
		}
		this.appSelectorSubscription = this.appSelectorService.selectedApp.subscribe((response: any) => {
			this.gerOrdersList(1);
		});
	}

	ngOnDestroy(): void {
		this.appSelectorSubscription.unsubscribe();
	}


	ngOnInit() {
		let abc = localStorage.getItem('componentSettings') as string;
		this.componentSettings = JSON.parse(abc);
		if (this.componentSettings) {
			if (this.componentSettings.name != null && this.componentSettings.name == 'Orders') {
				this.currentPage = this.componentSettings.paggination;
				this.index = this.componentSettings.paggination;
				this.search = this.componentSettings.search;
			}
		}
		this.method = 'getOrders';
		this.sub = this._route.params.subscribe(params => {
			this.id = params['id'];
			if (this.id) {
				this.gerOrdersList(this.currentPage);
			}
		});
		let abcd = localStorage.getItem('UrbanpointAdmin') as string;
		this.Roles = JSON.parse(abcd);
		this.role = this.Roles.role;
	}

	onViewReview(order: any) {
		if (this.id != 'All') {
			this.router.navigateByUrl('main/customers/orders/' + this.id + '/reviews/' + order.order_id);
		}
		else {
			this.router.navigateByUrl('main/orders/' + this.id + '/reviews/' + order.order_id);
		}

	}

	onSearchOrder(): void {
		clearTimeout(this.searchTimer);
		this.searchTimer = setTimeout(() => {

			this.gerOrdersList(1);

		}, 800);
	}

	gerOrdersList(index: any, isLoaderHidden?: boolean): void {
		if (isLoaderHidden) {
			this.loaderService.setLoading(false);
		}
		else {
			this.loaderService.setLoading(true);
		}

		let url = 'getOrders?index=' + index + '&index2=' + this.perPage;

		if (this.search != '') {
			url = url + '&search=' + this.search;
		}

		if (this.id != 'All') {
			url = url + '&user_id=' + this.id;
		}

		localStorage.setItem('componentSettings', JSON.stringify(
			{
				name: 'Orders',
				paggination: this.index,
				search: this.search
			}
		));

		this.mainApiService.getList(appConfig.base_url_slug + url)
			.then(result => {
				if (result.status == 200 && result.data) {
					this.Orders = result.data.allOrders;
					this.outletsCount = result.data.allOrdersCount;
					this.currentPage = index;
					this.pages = this.paginationService.setPagination(this.outletsCount, index, this.perPage);
					this.totalPages = this.pages.totalPages;
					this.loaderService.setLoading(false);
				}
				else {
					this.Orders = [];
					this.outletsCount = 0;
					this.currentPage = 1;
					this.pages = this.paginationService.setPagination(this.outletsCount, index, this.perPage);
					this.totalPages = this.pages.totalPages;
					this.loaderService.setLoading(false);
				}
			});
	}

	setPage(pageDate: any) {
		this.currentPage = pageDate.page;
		this.perPage = pageDate.perPage;
		this.index = this.currentPage;
		this.gerOrdersList(pageDate.page);
	}

	onLocationBack(): void {
		window.history.back();
	}
}