import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { MainService, BaseLoaderService, PaginationService } from '../../services';
import { AlertDialog } from '../../lib';
import { MatDialog } from '@angular/material/dialog';
import { appConfig } from '../../../config';
import { UserAppSelectorService } from '../../lib/app-selector/app-selector.service';

@Component({
	selector: 'app-merchant_account-list',
	templateUrl: './merchant_account-list.component.html'
})
export class MerchantAccountListComponent implements OnInit {
	search: string;
	// type: any;
	sub: Subscription = new Subscription();
	index: any = 1;
	totalPages: number = 1;
	pages: any;
	totalItems: any;
	currentPage: any = 1;
	merchantAccountCount: any;
	merchantAccount: any;
	searchTimer: any;
	perPage: any;
	componentSettings: any = {
		name: null,
		paggination: null,
		search: null
	};
	appSelectorSubscription: Subscription;
	scenario: any;
	abc = localStorage.getItem('UrbanpointAdmin') as string
	UpAdmin = JSON.parse(this.abc);


	constructor(protected router: Router,
		protected _route: ActivatedRoute,
		protected mainApiService: MainService,
		protected paginationService: PaginationService,
		protected loaderService: BaseLoaderService, protected appSelectorService: UserAppSelectorService, protected dialog: MatDialog) {
		this.search = '';
		this.merchantAccount = [];
		this.perPage = 20;

		this.appSelectorSubscription = this.appSelectorService.selectedApp.subscribe((response: any) => {
			this.getMerchantAccountList(1);
		});
	}

	ngOnDestroy(): void {
		this.appSelectorSubscription.unsubscribe();
	}

	ngOnInit() {
		let abcd = localStorage.getItem('componentSettings') as string;
		this.componentSettings = JSON.parse(abcd);
		if (this.componentSettings) {
			if (this.componentSettings.name != null && this.componentSettings.name == 'Admins') {
				this.currentPage = this.componentSettings.paggination;
				this.index = this.componentSettings.paggination;
				this.search = this.componentSettings.search;
			}
		}
		// this.sub = this._route.params.subscribe(params => {
		// 	this.type = params['type'];
		// 	if (this.type)
		// 	{
		this.getMerchantAccountList(this.currentPage);
		// }
		// log here(params);
		// });
	}

	addNew() {
		this.router.navigateByUrl('main/merchant_account/add');
	}

	onSearchMerchantAccount(): void {
		clearTimeout(this.searchTimer);
		this.searchTimer = setTimeout(() => {

			this.getMerchantAccountList(1);

		}, 700);

	}

	getMerchantAccountList(index: any, isLoaderHidden?: boolean): void {
		if (isLoaderHidden) {
			this.loaderService.setLoading(false);
		}
		else {
			this.loaderService.setLoading(true);
		}

		let url = 'merchantDashboard/getMerchants?index=' + index + '&index2=' + this.perPage + '&role_type=2' + '&merchant_type=cms';

		if (this.search != '') {
			url = url + '&search=' + this.search;
		}

		this.mainApiService.getList(url)
			.then(result => {
				// console.log(result);
				if (result.status == 200 && result.data) {
					this.merchantAccount = result.data.merchants;
					this.merchantAccountCount = result.data.merchantsCount;
					this.currentPage = index;
					this.pages = this.paginationService.setPagination(this.merchantAccountCount, index, this.perPage);
					this.totalPages = this.pages.totalPages;
					this.loaderService.setLoading(false);
				}
				else {
					this.merchantAccount = [];
					this.merchantAccountCount = 0;
					this.currentPage = 1;
					this.pages = this.paginationService.setPagination(this.merchantAccountCount, index, this.perPage);
					this.totalPages = this.pages.totalPages;
					this.loaderService.setLoading(false);
				}
			});
	}

	setPage(pageDate: any) {
		this.currentPage = pageDate.page;
		this.perPage = pageDate.perPage;
		this.index = this.currentPage;
		this.getMerchantAccountList(pageDate.page);
	}


	onEditAccount(merchant: any): void {
		localStorage.setItem('Account', JSON.stringify(merchant));
		this.router.navigateByUrl('main/merchant_account/add' + merchant.id);
	}

	// onDeleteAdmin(admin): void
	// {
	// 	let adminData = {
	// 		id: admin.id
	// 	};

	// 	let dialogRef = this.dialog.open(AlertDialog, {autoFocus: false});
	// 	let cm = dialogRef.componentInstance;
	// 	cm.heading = 'Delete Admin';
	// 	cm.message = 'Are you sure to delete Admin';
	// 	cm.submitButtonText = 'Yes';
	// 	cm.cancelButtonText = 'No';
	// 	cm.type = 'ask';
	// 	cm.methodName = appConfig.base_url_slug + 'deleteAdmin';
	// 	cm.dataToSubmit = adminData;
	// 	cm.showLoading = true;

	// 	dialogRef.afterClosed().subscribe(result => {
	// 		if(result)
	// 		{
	// 			this.gerAdminsList(this.currentPage, true);
	// 		}
	// 	})
	// }

	onChangeStatus(merchant: any, event: any): void {
		let archive: any;

		if (merchant.status == "0") {
			archive = 1;
		}
		else {
			archive = 0;
		}

		let Data = {
			id: merchant.id,
			status: archive,
			scenario: this.scenario
		};

		let dialogRef = this.dialog.open(AlertDialog, { autoFocus: false });
		let cm = dialogRef.componentInstance;

		cm.heading = 'Update Status';
		cm.message = 'Are you sure you want to update status?';
		cm.submitButtonText = 'Yes';
		cm.cancelButtonText = 'No';
		cm.type = 'ask';
		cm.methodName = 'getMerchantAccountList'
		cm.dataToSubmit = Data;
		cm.showLoading = true;

		dialogRef.afterClosed().subscribe(result => {
			if (result) {
				this.getMerchantAccountList(this.currentPage, false);
			}
			else {
				merchant.slide = !merchant.slide;
			}
		})
	}
}