import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';


import { MainService, BaseLoaderService, PaginationService } from '../../../services';
// import { AlertDialog } from '../../../lib';
// import { CodeDetailsComponent } from '../code_details.dialog';
import { AppLoaderService } from '../../../lib/app-loader/app-loader.service';
// import { ExportCSVComponent } from '../../../lib/export_csv.component';
import { appConfig } from '../../../../config';
// import { CheckEligibilityComponent } from '../check-eligibility.component';
// CheckEligibilityComponent
import { UserAppSelectorService } from '../../../lib/app-selector/app-selector.service';
// import { CheckEligibilityComponent } from '../../subscriptions/check-eligibility.component';


@Component({
	selector: 'app-customer-sms-logs',
	templateUrl: './customer-sms-logs.component.html'
})
export class CustomerSMSLogsComponent implements OnInit {
	search: string;
	sub: Subscription = new Subscription();
	index: any;
	totalPages: number = 1;
	pages: any;
	totalItems: any;
	currentPage: any;
	smsArrayCount: any;
	SMSArray: any;
	id: any;
	searchTimer: any;
	perPage: number;
	// operator: any;
	filterby: any = 'All';
	appSelectorSubscription: Subscription;

	constructor(protected router: Router,
		protected _route: ActivatedRoute,
		protected mainApiService: MainService,
		protected paginationService: PaginationService,
		protected appSelectorService: UserAppSelectorService,
		protected appLoaderService: AppLoaderService,
		protected loaderService: BaseLoaderService, protected dialog: MatDialog) {
		this.search = '';
		this.SMSArray = [];
		this.perPage = 20;
		// this.operator = 'All';
		this.appSelectorSubscription = this.appSelectorService.selectedApp.subscribe((response: any) => {
			this.getSMSList(1);
		});
	}

	ngOnDestroy(): void {
		this.appSelectorSubscription.unsubscribe();
	}

	ngOnInit() {
		this.sub = this._route.params.subscribe(params => {
			this.id = params['id'];
			if (this.id) {
				this.getSMSList(1);
			}
		});
	}

	onSearchSubscription(): void {
		clearTimeout(this.searchTimer);
		this.searchTimer = setTimeout(() => {

			this.getSMSList(1);

		}, 800);
	}


	onSearchModelChange(event: any): void {
		if (this.search == '' || this.search == null) {
			this.getSMSList(this.currentPage);
		}
	}

	getSMSList(index: any, isLoaderHidden?: boolean): void {
		if (isLoaderHidden) {
			this.loaderService.setLoading(false);
		}
		else {
			this.loaderService.setLoading(true);
		}

		let url = 'getSmsLogsByPhone?index=' + index + '&index2=' + this.perPage;

		if (this.id != 'All') {
			url = url + '&phone=' + this.id;
		}
		if (this.search) {
			url = url + '&search=' + this.search;
		}

		this.mainApiService.getList(appConfig.base_url_slug + url)
			.then(result => {
				if (result.status == 200 && result.data) {
					this.SMSArray = result.data.sms;
					this.smsArrayCount = result.data.count;
					this.currentPage = index;
					this.pages = this.paginationService.setPagination(this.smsArrayCount, index, this.perPage);
					this.totalPages = this.pages.totalPages;
					this.loaderService.setLoading(false);
				}
				else {
					this.SMSArray = [];
					this.smsArrayCount = 0;
					this.currentPage = 1;
					this.pages = this.paginationService.setPagination(this.smsArrayCount, index, this.perPage);
					this.totalPages = this.pages.totalPages;
					this.loaderService.setLoading(false);
				}
			});
	}

	setPage(pageDate: any) {
		this.currentPage = pageDate.page;
		this.perPage = pageDate.perPage;
		this.index = this.currentPage;
		this.getSMSList(pageDate.page);
	}

	onLocationBack(): void {
		window.history.back();
	}
}