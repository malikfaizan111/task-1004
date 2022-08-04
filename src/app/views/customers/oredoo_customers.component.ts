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
	selector: 'app-oredoo_customers-list',
	templateUrl: './oredoo_customers.component.html',
	styles: ['td{text-align:center}']
})
export class OredooCustomersComponent extends ExportCSVComponent implements OnInit {
	search: string;
	index: any = 1;
	totalPages: number = 1;
	pages: any;
	totalItems: any;
	currentPage: any = 1;
	perPage: any;
	componentSettings: any = {
		name: null,
		paggination: null,
		search: null
	};
	searchTimer: any;
	BilingCustomers: any;
	bilingCustomersCount: any;
	appSelectorSubscription: Subscription;
	userRole: any;
	constructor(protected router: Router,
		protected _route: ActivatedRoute,
		protected mainApiService: MainService,
		protected paginationService: PaginationService,
		protected loaderService: BaseLoaderService, protected appLoaderService: AppLoaderService, protected appSelectorService: UserAppSelectorService, protected dialog: MatDialog) {
		super(mainApiService, appLoaderService, dialog);
		this.method = 'getOoredooBillingReport';
		this.BilingCustomers = [];
		this.search = '';
		this.perPage = 20;

		this.isNeededDate = false;
		this.isMonthYear = true;
		this.isOnlyMonth = false;
		this.DropDown = true;


		this.appSelectorSubscription = this.appSelectorService.selectedApp.subscribe((response: any) => {
			this.getBilingCustomers(1);
		});
	}

	ngOnDestroy(): void {
		this.appSelectorSubscription.unsubscribe();
	}

	ngOnInit() {
		let xyz = localStorage.getItem('UrbanpointAdmin') as string;
		this.userRole = JSON.parse(xyz);
		let abc = localStorage.getItem('componentSettings') as string;
		this.componentSettings = JSON.parse(abc);
		if (this.componentSettings) {
			if (this.componentSettings.name != null && this.componentSettings.name == 'BilingCustomers') {
				this.currentPage = this.componentSettings.paggination;
				this.index = this.componentSettings.paggination;
				this.search = this.componentSettings.search;
			}
		}

		this.getBilingCustomers(1);
	}

	onSearchCustomer(): void {
		clearTimeout(this.searchTimer);
		this.searchTimer = setTimeout(() => {
			this.getBilingCustomers(1);
		}, 800);

	}

	getBilingCustomers(index: any, isLoaderHidden?: boolean): void {

		this.loaderService.setLoading(true);
		let url: any = '';

		// url = 'getBillingOredooUsers?index='+ index + '&index2='+ this.perPage;
		url = 'getOoredooBillingReport?index=' + index + '&index2=' + this.perPage;

		if (this.search != '') {
			url = url + '&search=' + this.search;
		}

		localStorage.setItem('componentSettings', JSON.stringify(
			{
				name: 'Customers',
				paggination: this.index,
				search: this.search
			}
		));

		this.mainApiService.getList(appConfig.base_url_slug + url)
			.then(result => {
				if (result.status == 200 && result.data) {
					// let users = result.data.users;
					let users = result.data.data;
					// this.bilingCustomersCount = result.data.users_count;
					this.bilingCustomersCount = result.data.count;
					this.currentPage = index;
					this.pages = this.paginationService.setPagination(this.bilingCustomersCount, index, this.perPage);
					this.totalPages = this.pages.totalPages;
					this.BilingCustomers = users;

					this.loaderService.setLoading(false);
				}
				else {
					this.BilingCustomers = [];
					this.bilingCustomersCount = 0;
					this.currentPage = 1;
					this.pages = this.paginationService.setPagination(this.bilingCustomersCount, index, this.perPage);
					this.totalPages = this.pages.totalPages;
					this.loaderService.setLoading(false);
				}
			});
	}

	setPage(pageDate: any) {
		this.currentPage = pageDate.page;
		this.perPage = pageDate.perPage;
		this.index = this.currentPage;
		this.getBilingCustomers(pageDate.page);
	}
}