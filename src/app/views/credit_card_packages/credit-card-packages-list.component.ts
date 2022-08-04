import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { MainService, BaseLoaderService, PaginationService } from '../../services';
import { AlertDialog } from '../../lib';
import { appConfig } from '../../../config';
import { UserAppSelectorService } from '../../lib/app-selector/app-selector.service';
import { CreditCardDetailsComponent } from './credit-card-details.component';

@Component({
	selector: 'app-credit-card-packages-list',
	templateUrl: './credit-card-packages-list.component.html'
})
export class CreditCardPackagesListComponent implements OnInit {
	search: string;
	sub: Subscription = new Subscription();
	index: any;
	totalPages: number = 1;
	pages: any;
	totalItems: any;
	currentPage: any;
	notificationsCount: any;
	CreditCardPackagesItem: any;
	operator: string;
	searchTimer: any;
	perPage: number;
	appSelectorSubscription: Subscription;
	scenario: any;
	selectedApp: any;
	abc = localStorage.getItem('UrbanpointAdmin') as string;
	UpAdmin = JSON.parse(this.abc);

	constructor(protected router: Router,
		protected _route: ActivatedRoute,
		protected mainApiService: MainService,
		protected paginationService: PaginationService,
		protected appSelectorService: UserAppSelectorService,
		protected loaderService: BaseLoaderService, protected dialog: MatDialog) {
		this.search = '';
		this.CreditCardPackagesItem = [];
		this.operator = 'All';
		this.perPage = 20;

		let resp = this.appSelectorService.getApp();
		this.selectedApp = parseInt(resp.user_app_id);

		this.appSelectorSubscription = this.appSelectorService.selectedApp.subscribe((response: any) => {
			this.gerCreditCardPackagesList(1);

			this.selectedApp = parseInt(response.user_app_id);
		});
	}

	ngOnDestroy(): void {
		this.appSelectorSubscription.unsubscribe();
	}


	ngOnInit() {
		this.sub = this._route.params.subscribe(params => {
			this.scenario = params['scenario'];
			if (this.scenario) {
				this.gerCreditCardPackagesList(1);
			}
		});
	}

	addNew() {
		this.router.navigateByUrl('main/credit-card-packages/' + this.scenario + '/add');
	}

	onEdit(item: any) {
		localStorage.setItem('CreditCardPackages', JSON.stringify(item));
		this.router.navigateByUrl('main/credit-card-packages/' + this.scenario + '/edit');
	}

	onSearchNotification(): void {
		clearTimeout(this.searchTimer);
		this.searchTimer = setTimeout(() => {
			this.gerCreditCardPackagesList(1);
		}, 800);
	}

	gerCreditCardPackagesList(index: any, isLoaderHidden?: boolean): void {

		this.loaderService.setLoading(true);
		let url = 'getCreditcardPackages?scenario=' + this.scenario;

		if (this.search != '') {
			url = url + '&search=' + this.search;
		}
		else {
			this.search = '';
		}

		this.mainApiService.getList(appConfig.base_url_slug + url).then(result => {
			if (result.status == 200 && result.data) {

				let Items = result.data;
				this.loaderService.setLoading(false);

				Items.forEach((element: any) => {
					if (element.status == 1) {
						element['slide'] = true;
					}
					else if (element.status == 0) {
						element['slide'] = false;
					}
				});
				this.CreditCardPackagesItem = Items;

			}
			else {
				this.CreditCardPackagesItem = [];
				this.notificationsCount = 0;
				this.currentPage = 1;
				this.pages = this.paginationService.setPagination(this.notificationsCount, index, this.perPage);
				this.totalPages = this.pages.totalPages;
				this.loaderService.setLoading(false);
			}
		});
	}

	setPage(pageDate: any) {
		this.currentPage = pageDate.page;
		this.perPage = pageDate.perPage;
		this.index = this.currentPage;
		this.gerCreditCardPackagesList(pageDate.page);
	}

	onChangeStatus(item: any, event: any): void {
		let archive: any;

		if (item.status == "0") {
			archive = 1;
		}
		else {
			archive = 0;
		}

		let Data = {
			id: item.id,
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
		cm.methodName = appConfig.base_url_slug + 'updateCreditcardPackages';
		cm.urlVersion = 1;
		cm.dataToSubmit = Data;
		cm.showLoading = true;

		dialogRef.afterClosed().subscribe(result => {
			if (result) {
				this.gerCreditCardPackagesList(this.currentPage, false);
			}
			else {
				item.slide = !item.slide;
			}
		})
	}

	// new function
	onViewDetails(item: any): void {
		let dialogRef = this.dialog.open(CreditCardDetailsComponent);
		dialogRef.componentInstance.CreditCard = item;
	}
}