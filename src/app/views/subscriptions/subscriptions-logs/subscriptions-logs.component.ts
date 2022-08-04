import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { MainService, BaseLoaderService, PaginationService } from '../../../services';
import { MatDialog } from '@angular/material/dialog';
import { appConfig } from '../../../../config';
import { UserAppSelectorService } from '../../../lib/app-selector/app-selector.service';

@Component({
  selector: 'app-subscriptions-logs',
  templateUrl: './subscriptions-logs.component.html',
  styleUrls: ['./subscriptions-logs.component.css']
})
export class SubscriptionLogsComponent implements OnInit 
{
	search: string;
	sub: Subscription = new Subscription();
	index: any;
	totalPages: number = 1;
	pages: any;
	totalItems: any;
	currentPage: any;
	subscriptionsCount: any;
	SubscriptionLogs: any;
	id: any;
	perPage: number;
	appSelectorSubscription: Subscription;
	Roles: any;
	// operator: any;

	constructor(protected router: Router,
		protected _route: ActivatedRoute,
		protected mainApiService: MainService,
		protected appSelectorService: UserAppSelectorService, 
		protected paginationService: PaginationService, 
		protected loaderService: BaseLoaderService, protected dialog: MatDialog)	
	{
		this.search = '';
		this.SubscriptionLogs = [];
		this.perPage = 20;
		// this.operator = 'All';
		this.appSelectorSubscription = this.appSelectorService.selectedApp.subscribe((response: any) =>
        {
			this.gerSubscriptionLogs(1);
		});
	}
	
    ngOnDestroy(): void 
	{
		this.appSelectorSubscription.unsubscribe();	
	}

	ngOnInit() 
	{
		// this.gerSubscriptionLogs(1);

		this.sub = this._route.params.subscribe(params => {
			this.id = params['id'];
			if (this.id) 
			{
				this.gerSubscriptionLogs(1);
			}
		});
		let abc = localStorage.getItem('UrbanpointAdmin') as string;
		this.Roles = JSON.parse(abc);
		if(this.Roles.role == '2'){
			// console.log("this.Roles: ",this.Roles)
		}
		
	}

	onSearchSubscription(): void
	{
		this.gerSubscriptionLogs(1);
	}

	gerSubscriptionLogs(index : any, isLoaderHidden?: boolean): void
	{
		if(isLoaderHidden)
		{
			this.loaderService.setLoading(false);
		}
		else
		{
			this.loaderService.setLoading(true);
		}

		let url = 'getSubscriptionLogs?index=' + index + '&index2=' + this.perPage;

		if(this.search != '')
		{
			url = url + '&search=' + this.search;
		}

		if(this.id != 'All')
		{
			url = url + '&user_id=' + this.id;
		}
		
		this.mainApiService.getList(appConfig.base_url_slug + url)
		.then(result => {
			if (result.status == 200  && result.data) 
			{
				this.SubscriptionLogs = result.data.subscriptions;
				this.subscriptionsCount = result.data.subscriptionsCount;
				this.currentPage = index;
				this.pages = this.paginationService.setPagination(this.subscriptionsCount, index, this.perPage);
				this.totalPages = this.pages.totalPages;
				this.loaderService.setLoading(false);
			}
			else
			{
				this.SubscriptionLogs = [];
				this.subscriptionsCount = 0;
				this.currentPage = 1;
				this.pages = this.paginationService.setPagination(this.subscriptionsCount, index, this.perPage);
				this.totalPages = this.pages.totalPages;
				this.loaderService.setLoading(false);
			}
		});
	}

	setPage(pageDate: any) 
	{
		this.currentPage = pageDate.page;
		this.perPage = pageDate.perPage;
		this.index = this.currentPage;
		this.gerSubscriptionLogs(pageDate.page);
	}


	onLocationBack(): void
	{
		window.history.back();
	}

}
