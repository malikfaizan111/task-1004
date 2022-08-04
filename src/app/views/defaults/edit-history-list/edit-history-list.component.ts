import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { appConfig } from '../../../../config';
import { AppLoaderService } from '../../../lib/app-loader/app-loader.service';
import { UserAppSelectorService } from '../../../lib/app-selector/app-selector.service';
import { MainService, PaginationService, BaseLoaderService } from '../../../services';

@Component({
	selector: 'app-edit-history-list',
	templateUrl: './edit-history-list.component.html',
	styleUrls: ['./edit-history-list.component.css']
})
export class EditHistoryListComponent implements OnInit {

	search: string;
	sub: Subscription = new Subscription();
	index: any;
	totalPages: number = 1;
	pages: any;
	totalItems: any;
	currentPage: any;
	smsArrayCount: any;
	historyList: any[] = [];
	id: any;
	searchTimer: any;
	perPage: number;
	// operator: any;
	filterby: any = 'All';
	appSelectorSubscription: Subscription;
	Roles: any;

	constructor(protected router: Router,
		protected _route: ActivatedRoute,
		protected mainApiService: MainService,
		protected paginationService: PaginationService,
		protected appSelectorService: UserAppSelectorService,
		protected appLoaderService: AppLoaderService,
		protected loaderService: BaseLoaderService, protected dialog: MatDialog) {
		this.search = '';
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
		this.getSMSList(1);
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
		} else {
			this.loaderService.setLoading(true);
		}

		let url = 'editHistory?page=' + index + '&per_page=' + this.perPage;

		if (this.search) {
			url = url + '&search=' + this.search;
		}

		this.mainApiService.getList(appConfig.base_url_slug + url, false, 2)
			.then(result => {
				if (result.status == 200 && result.data) {
					this.historyList = result.data
					this.smsArrayCount = result.pagination.count;
					this.currentPage = index;
					this.pages = this.paginationService.setPagination(this.smsArrayCount, index, this.perPage);
					this.totalPages = this.pages.totalPages;
					this.loaderService.setLoading(false);
				}
				else {
					this.historyList = [];
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