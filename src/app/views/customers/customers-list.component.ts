import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';


import { MainService, BaseLoaderService, PaginationService } from '../../services';
import { AppLoaderService } from '../../lib/app-loader/app-loader.service';
import { ExportCSVComponent } from '../../lib/export_csv.component';
import { CustomerDetailsComponent } from './customer-details.component';
import { appConfig } from '../../../config';
import { UserAppSelectorService } from '../../lib/app-selector/app-selector.service';


@Component({
	selector: 'app-customers-list',
	templateUrl: './customers-list.component.html'
})
export class CustomersListComponent extends ExportCSVComponent implements OnInit {
	search: string;
	sub: Subscription = new Subscription();
	index: any = 1;
	totalPages: number = 1;
	pages: any;
	totalItems: any;
	currentPage: any = 1;
	customersCount: any;
	Customers: any;
	operator: any;
	searchTimer: any;
	sortby: string;
	orderby: string;
	perPage: any;
	componentSettings: any = {
		name: null,
		paggination: null,
		search: null
	};
	type: any;
	title: string = '';
	isPremier: any;
	appSelectorSubscription: Subscription;
	Roles: any;
	wallet = false;
	currency = 'qar';
	amount = '';

	constructor(protected router: Router,
		protected _route: ActivatedRoute,
		protected mainApiService: MainService,
		protected paginationService: PaginationService,
		protected loaderService: BaseLoaderService, protected appLoaderService: AppLoaderService, protected appSelectorService: UserAppSelectorService, protected dialog: MatDialog) {
		super(mainApiService, appLoaderService, dialog);
		this.method = 'getUsers';
		this.search = '';
		this.isPremier = 'All';
		this.Customers = [];
		this.operator = 'All';
		this.sortby = 'network';
		this.orderby = 'ASC';
		this.perPage = 20;

		this.appSelectorSubscription = this.appSelectorService.selectedApp.subscribe((response: any) => {
			this.gerCustomersList(1);
		});

		// this.Roles = JSON.parse(localStorage.getItem('UrbanpointAdmin'));

	}

	ngOnDestroy(): void {
		this.appSelectorSubscription.unsubscribe();
	}

	ngOnInit() {
		let abcd = localStorage.getItem('componentSettings') as string;
		this.componentSettings = JSON.parse(abcd);
		if (this.componentSettings) {
			if (this.componentSettings.name != null && this.componentSettings.name == 'Customers') {
				this.currentPage = this.componentSettings.paggination;
				this.index = this.componentSettings.paggination;
				this.search = this.componentSettings.search;
			}
		}

		this.sub = this._route.params.subscribe(params => {
			this.type = params['type'];
			this.currentPage = 1;
			if (this.type == 'registered') {
				this.title = 'REGISTERED';
				this.method = 'getUsers';
				this.gerCustomersList(this.currentPage);
			}
			else if (this.type == 'non_registered') {
				this.title = 'NON REGISTERED';
				this.method = 'getNonUsers';
				this.gerCustomersList(this.currentPage);
			}
		});
		let abc = localStorage.getItem('UrbanpointAdmin') as string;
		this.Roles = JSON.parse(abc);
		if (this.Roles.role == '2') {
			//console.log("this.Roles: ",this.Roles)
		}
	}

	onViewSMSLogs(cust: any): void {
		this.router.navigateByUrl('/main/customers/customers_sms_logs/' + cust.phone);
	}

	onViewDetails(cus: any): void {
		let dialogRef = this.dialog.open(CustomerDetailsComponent, { autoFocus: false });
		let compInstance = dialogRef.componentInstance;
		compInstance.Customer = cus;
		compInstance.role = this.Roles.role;

		// dialogRef.afterClosed().subscribe(result => {
		// 	if(result != 'cancel')
		// 	{
		// 		this.gerMerchantsList(this.currentPage);
		// 	}
		// })
	}

	addNew() {
		this.router.navigateByUrl('main/customers/add');
	}

	onSearchCustomer(): void {
		clearTimeout(this.searchTimer);
		this.searchTimer = setTimeout(() => {
			this.gerCustomersList(1);
		}, 800);

	}

	onViewSubscriptions(customer: any): void {
		this.router.navigateByUrl('/main/customers/subscriptions/' + customer.id);
	}

	onViewSubscriptionLogs(customer: any): void {
		this.router.navigateByUrl('/main/customers/subscription_logs/' + customer.id);
	}

	onViewOrders(customer: any): void {
		this.router.navigateByUrl('/main/customers/orders/' + customer.id);
	}

	gerCustomersList(index: any, isLoaderHidden?: boolean): void {

		if (isLoaderHidden) {
			this.loaderService.setLoading(false);
		}
		else {
			this.loaderService.setLoading(true);
		}
		let url: any = '';

		if (this.type == 'registered') {
			this.url_values = [
				{ key: 'sortby', value: this.sortby, title: 'Sort By' },
				{ key: 'orderby', value: this.orderby, title: 'Order By' }
			];

			url = 'getUsers?index=' + index + '&index2=' + this.perPage + '&orderby=' + this.orderby;

			if (this.search != '') {
				url = url + '&search=' + this.search;
			}
			if (this.sortby != '') {
				url = url + '&sortby=' + this.sortby;
			}

			if (this.operator != 'All') {
				url = url + '&network=' + this.operator;
				this.url_values.push({ key: 'network', value: this.operator, title: 'Network' })
			}
		}
		else if (this.type == 'non_registered') {
			this.url_values = [
				{ key: 'filterby', value: this.isPremier, title: 'Premier' }
			];

			url = 'getNonUsers?index=' + index + '&index2=' + this.perPage;

			if (this.search != '') {
				url = url + '&search=' + this.search;
			}
			if (this.isPremier == 'premier') {
				url = url + '&filterby=' + this.isPremier;
			}
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
					if (this.type == 'registered') {
						let users = result.data.users;
						this.customersCount = result.data.usersCount;
						this.currentPage = index;
						this.pages = this.paginationService.setPagination(this.customersCount, index, this.perPage);
						this.totalPages = this.pages.totalPages;
						users.forEach((element: any) => {
							if (element.device_info != null && element.device_info != '') {
								element.device_info = element.device_info.split('|').join(', ');
							}
						});
						this.Customers = users;
					}
					else if (this.type == 'non_registered') {
						this.Customers = result.data.users;
						this.customersCount = result.data.usersCount;
						this.currentPage = index;
						this.pages = this.paginationService.setPagination(this.customersCount, index, this.perPage);
						this.totalPages = this.pages.totalPages;
					}
					this.loaderService.setLoading(false);
				}
				else {
					this.Customers = [];
					this.customersCount = 0;
					this.currentPage = 1;
					this.pages = this.paginationService.setPagination(this.customersCount, index, this.perPage);
					this.totalPages = this.pages.totalPages;
					this.loaderService.setLoading(false);
				}
			});
	}

	setPage(pageDate: any) {
		this.currentPage = pageDate.page;
		this.perPage = pageDate.perPage;
		this.index = this.currentPage;
		this.gerCustomersList(pageDate.page);
	}

	onEditCustomer(customer: any): void {
		localStorage.setItem('Customer', JSON.stringify(customer));
		this.router.navigateByUrl('main/customers/edit/' + customer.id);
	}

	openWallet() {
		this.wallet = true;
	}
}