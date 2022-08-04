import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';


import { MainService, BaseLoaderService, PaginationService } from '../../services';
import { AlertDialog } from '../../lib';
import { CodeDetailsComponent } from './code_details.dialog';
import { AppLoaderService } from '../../lib/app-loader/app-loader.service';
import { ExportCSVComponent } from '../../lib/export_csv.component';
import { appConfig } from '../../../config';
import { CheckEligibilityComponent } from './check-eligibility.component';
import { UserAppSelectorService } from '../../lib/app-selector/app-selector.service';


@Component({
	selector: 'app-subscriptions-list',
	templateUrl: './subscriptions.component.html'
})
export class SubscriptionsListComponent extends ExportCSVComponent implements OnInit {
	search: string;
	sub: Subscription = new Subscription();
	index: any;
	totalPages: number = 1;
	pages: any;
	totalItems: any;
	currentPage: any;
	subscriptionsCount: any;
	Subscriptions: any;
	id: any;
	searchTimer: any;
	perPage: number;
	// operator: any;
	filterby: any = 'All';
	appSelectorSubscription: Subscription;
	SubscriptionslogCount: any;
	Subscriptionslog: any;

	constructor(protected router: Router,
		protected _route: ActivatedRoute,
		protected mainApiService: MainService,
		protected paginationService: PaginationService,
		protected appSelectorService: UserAppSelectorService,
		protected appLoaderService: AppLoaderService,
		protected loaderService: BaseLoaderService, protected dialog: MatDialog) {
		super(mainApiService, appLoaderService, dialog);
		// this.method = 'getSubscriptions';
		this.search = '';
		this.Subscriptions = [];
		this.perPage = 20;
		// this.operator = 'All';
		this.appSelectorSubscription = this.appSelectorService.selectedApp.subscribe((response: any) => {
			this.gerSubscriptionsList(1);


		});
	}

	ngOnDestroy(): void {
		this.appSelectorSubscription.unsubscribe();
	}

	ngOnInit() {
		// this.gerSubscriptionsList(1);
		this.method = 'getSubscriptions';
		this.sub = this._route.params.subscribe(params => {
			this.id = params['id'];
			if (this.id) {
				this.gerSubscriptionsList(1);
			}
		});
		let abc = localStorage.getItem('UrbanpointAdmin') as string
		this.Roles = JSON.parse(abc);
		if (this.Roles.role == '2') {
			// console.log("this.Roles: ",this.Roles)
		}
		// this.gerSubscriptionslog(1);
	}

	onViewCode(subscription : any): void {
		let dialogRef = this.dialog.open(CodeDetailsComponent, { autoFocus: false });
		dialogRef.componentInstance.Code = subscription.accesscodes;
		dialogRef.afterClosed().subscribe(result => {

		})

	}

	onSearchSubscription(): void {
		clearTimeout(this.searchTimer);
		this.searchTimer = setTimeout(() => {

			this.gerSubscriptionsList(1);

		}, 800);
	}

	onViewSubscriptionLogs(subscription : any): void {
		this.router.navigateByUrl('/main/customers/subscription_logs/' + subscription.user_id);
	}

	onViewSMSLogs(subscription : any): void {
		this.router.navigateByUrl('/main/customers/sms_logs/' + subscription.user_id);
	}


	onSearchModelChange(event : any): void {
		if (this.search == '' || this.search == null) {
			this.gerSubscriptionsList(this.currentPage);
		}
	}

	gerSubscriptionsList(index : any, isLoaderHidden?: boolean): void {

		this.url_values = [
			{ key: 'filterby', value: this.filterby, title: 'Filter By' }
		];

		if (isLoaderHidden) {
			this.loaderService.setLoading(false);
		}
		else {
			this.loaderService.setLoading(true);
		}

		let url = 'getSubscriptions?index=' + index + '&index2=' + this.perPage;

		if (this.search != '') {
			url = url + '&search=' + this.search;
		}
		if (this.filterby != 'All') {
			url = url + '&filterby=' + this.filterby;
		}

		if (this.id != 'All') {
			url = url + '&user_id=' + this.id;
		}

		this.mainApiService.getList(appConfig.base_url_slug + url)
			.then(result => {
				if (result.status == 200 && result.data) {
					this.Subscriptions = result.data.subscriptions;
					this.subscriptionsCount = result.data.subscriptionsCount;
					this.currentPage = index;
					this.pages = this.paginationService.setPagination(this.subscriptionsCount, index, this.perPage);
					this.totalPages = this.pages.totalPages;
					this.loaderService.setLoading(false);
				}
				else {
					this.Subscriptions = [];
					this.subscriptionsCount = 0;
					this.currentPage = 1;
					this.pages = this.paginationService.setPagination(this.subscriptionsCount, index, this.perPage);
					this.totalPages = this.pages.totalPages;
					this.loaderService.setLoading(false);
				}
			});
	}
	gerSubscriptionslog(index : any, isLoaderHidden?: boolean): void {
		this.isNeededDate = false;
		this.isOnlyMonth = true;
		this.isMonthYear = true;
	
		if (isLoaderHidden) {
			this.loaderService.setLoading(false);
		}
		else {
			this.loaderService.setLoading(true);
		}

		let url = 'getSubscriptionLog?index=' + index + '&index2=' + this.perPage;
		this.mainApiService.getList(appConfig.base_url_slug + url)
			.then(result => {
				if (result.status == 200 && result.data) {
					console.log("sub", result)
					this.Subscriptionslog = result.data.data;
					this.SubscriptionslogCount = result.data.count;
					console.log("co", this.SubscriptionslogCount)
					this.currentPage = index;
					this.pages = this.paginationService.setPagination(this.SubscriptionslogCount, index, this.perPage);
					this.totalPages = this.pages.totalPages;
					this.loaderService.setLoading(false);
				}
				else {
					this.Subscriptionslog = [];
					this.SubscriptionslogCount = 0;
					this.currentPage = 1;
					this.pages = this.paginationService.setPagination(this.SubscriptionslogCount, index, this.perPage);
					this.totalPages = this.pages.totalPages;
					this.loaderService.setLoading(false);
				}
			});
	}

	setPage(pageDate: any) {
		this.currentPage = pageDate.page;
		this.perPage = pageDate.perPage;
		this.index = this.currentPage;
		this.gerSubscriptionsList(pageDate.page);
	}


	onLocationBack(): void {
		window.history.back();
	}

	onCheckEligibilityComponent(): void {
		let dialogRef = this.dialog.open(CheckEligibilityComponent, { autoFocus: false });
		// dialogRef.afterClosed().subscribe(result => {
		// 	if(result)
		// 	{
		// 	}
		// })
	}

	onChangeSub(subcs : any): void {
		let Data = {
			phone: subcs.phone
		};

		let dialogRef = this.dialog.open(AlertDialog, { autoFocus: false });
		let cm = dialogRef.componentInstance;
		cm.heading = 'Unsubscribe';
		cm.message = 'Are you sure to Unsubscribe';
		cm.submitButtonText = 'Yes';
		cm.cancelButtonText = 'No';
		cm.type = 'ask';
		cm.methodName = 'subscription/unsubscribe';
		cm.dataToSubmit = Data;
		cm.showLoading = true;

		dialogRef.afterClosed().subscribe(result => {
			if (result) {
				this.gerSubscriptionsList(this.currentPage, true);
			}
		})
	}

	// onExportCSV(value?: any) {
	// 	if (value == 'subcript') {
	// 		this.isNeededDate = false;
	// 		this.isOnlyMonth = true;
	// 		this.method = "gerSubscriptionslog"
	// 		super.onExportCSV();
	// 	}

	// 	else {
	// 		this.isNeededDate = true;

	// 		this.isOnlyMonth = false;
	// 		this.method = "getSubscriptions"
	// 		super.onExportCSV();
	// 	}

	// }
	onSubscription(): void {
		this.method = "getSubscriptionLog"
		this.isNeededDate = false;
		this.isOnlyMonth = true;
		this.isMonthYear = true;
		this.onExportCSV();
	}
	onexport(): void {
		this.isNeededDate = true;
		this.isOnlyMonth = false;
		this.isMonthYear = true;
		this.method = "getSubscriptions"
		super.onExportCSV();
	}

}
