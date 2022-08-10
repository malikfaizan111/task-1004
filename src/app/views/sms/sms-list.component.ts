import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { MainService, BaseLoaderService, PaginationService } from '../../services';
import { AlertDialog } from '../../lib';
import { appConfig } from '../../../config';
import { UserAppSelectorService } from '../../lib/app-selector/app-selector.service';
import { ViewSmsComponent } from './view_sms.dialog';


@Component({
	selector: 'app-sms-list',
	templateUrl: './sms-list.component.html'
})
export class SmsListComponent implements OnInit 
{
	search: string;
	sub: Subscription = new Subscription();
	index:  any = 1;
	totalPages: number = 1;
	pages: any;
	totalItems: any;
	currentPage:  any = 1;
	smsCount: any;
	Sms: any;
	isMultiple: any;
	searchTimer:any;
	perPage: any;
	componentSettings: any = {
		name: null,
		paggination: null,
		search: null
	};
	user_app: any;
	appSelectorSubscription: Subscription;
	abc = localStorage.getItem('UrbanpointAdmin') as string;
	UpAdmin = JSON.parse(this.abc);

	constructor(protected router: Router,
		protected _route: ActivatedRoute,
		protected mainApiService: MainService,
		protected paginationService: PaginationService, 
		protected loaderService: BaseLoaderService, protected appSelectorService: UserAppSelectorService, protected dialog: MatDialog)	
	{
		this.search = '';
		this.Sms = [];
		this.isMultiple = false;
		this.perPage = 20;

		this.appSelectorSubscription = this.appSelectorService.selectedApp.subscribe((response: any) =>
        {
			this.gerSmsList(1);
		});
	}

	ngOnInit() 
	{
		let abcd = localStorage.getItem('componentSettings') as string;
		this.componentSettings = JSON.parse(abcd)
		if(this.componentSettings)
		{
			if(this.componentSettings.name != null && this.componentSettings.name == 'Sms')
			{
				this.currentPage = this.componentSettings.paggination;
				this.index = this.componentSettings.paggination;
				this.search = this.componentSettings.search;
			}
		}
		this.gerSmsList(this.currentPage);
	}

	addNew() 
	{
		this.router.navigateByUrl('main/sms/form');
	}
	sendsmscode() 
	{
		this.router.navigateByUrl('main/sms/code/form');
	}

	ngOnDestroy(): void 
	{
		this.appSelectorSubscription.unsubscribe();	
	}

	onSearchPromoCode(): void
	{
		clearTimeout(this.searchTimer);
		this.searchTimer = setTimeout(() => {
			this.gerSmsList(1);
		}, 700);
	}

	gerSmsList(index : any, isLoaderHidden?: boolean): void
	{
		this.loaderService.setLoading(true);
		
		let url = 'getSmsSendLogs?index=' + index + '&index2=' + this.perPage;

		if(this.search != '')
		{
			url = url + '&search=' + this.search;
		}

		localStorage.setItem('componentSettings', JSON.stringify(
			{
				name: 'Sms',
				paggination: this.index,
				search: this.search
			}
        ));
		
		this.mainApiService.getList(appConfig.base_url_slug + url)
		.then(result => {
			if (result.status == 200  && result.data) 
			{
				let Sms : any = result.data.sms;
				this.smsCount = result.data.count;
				this.currentPage = index;
				this.pages = this.paginationService.setPagination(this.smsCount, index, this.perPage);
				this.totalPages = this.pages.totalPages;
				this.loaderService.setLoading(false);

				this.Sms = Sms;
			}
			else
			{
				this.Sms = [];
				this.smsCount = 0;
				this.currentPage = 1;
				this.pages = this.paginationService.setPagination(this.smsCount, index, this.perPage);
				this.totalPages = this.pages.totalPages;
				this.loaderService.setLoading(false);
			}
		});
	}

	onViewAllAccessSmsDetail(sms:any)
	{
		// let dialogRef = this.dialog.open(ViewSmsComponent, {autoFocus: false});
		// dialogRef.componentInstance.Deal = sms;
		this.router.navigateByUrl('main/sms/detail')
	}



	setPage(pageDate: any) 
	{
		this.currentPage = pageDate.page;
		this.perPage = pageDate.perPage;
		this.index = this.currentPage;
		this.gerSmsList(pageDate.page);
	}
}
