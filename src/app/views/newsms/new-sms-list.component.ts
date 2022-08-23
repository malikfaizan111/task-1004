// import { Component, OnInit } from '@angular/core';

// @Component({
//   selector: 'app-new-sms-list',
//   templateUrl: './new-sms-list.component.html',
//   styles: [
//   ]
// })
// export class NewSmsListComponent implements OnInit {

//   constructor() { }

//   ngOnInit(): void {
//   }

// }

import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { MainService, BaseLoaderService, PaginationService } from '../../services';
import { AlertDialog } from '../../lib';
import { appConfig } from '../../../config';
import { UserAppSelectorService } from '../../lib/app-selector/app-selector.service';
import { count } from 'console';


@Component({
	selector: 'app-new-sms-list',
	templateUrl: './new-sms-list.component.html'
})
export class NewSmsListComponent implements OnInit 
{
	// search: string;
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
		// this.search = '';
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
				// this.search = this.componentSettings.search;
			}
		}
		console.log('s', this.currentPage)
		this.gerSmsList(this.currentPage);
	}

	addNew() 
	{
		this.router.navigateByUrl('main/newsms/form');
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
		
		let url = 'getSmsCampaign?page=' + index + '&index2=' + this.perPage;

		// if(this.search != '')
		// {
		// 	url = url + '&search=' + this.search;
		// }
		// let url = 'getSmsCampaign?page=2'

		localStorage.setItem('componentSettings', JSON.stringify(
			{
				name: 'Sms',
				paggination: this.index,
				// search: this.search
			}
        ));
		
		this.mainApiService.getSms(url)
		.then(result => {
			if (result.statusCode === 200  && result.data) 
			{
				let Sms : any = result.data.sms_campaigns;
				this.smsCount = result.data.pagination.count;
				this.currentPage = index;
				this.pages = this.paginationService.setPagination(this.smsCount, index, this.perPage);
				this.totalPages = this.pages.totalPages;
				console.log('page', this.totalPages)
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
				console.log('page', this.totalPages)
				this.loaderService.setLoading(false);
			}
		});
	}

	onViewAllAccessSmsDetail(sms:any)
	{
		// let dialogRef = this.dialog.open(ViewSmsComponent, {autoFocus: false});
		// dialogRef.componentInstance.Deal = sms;
		// localStorage.setItem('Sms', JSON.stringify(sms));
    localStorage.removeItem('componentSettings')
		this.router.navigateByUrl('main/sms/detail/' + sms.id)
	}

	setPage(pageDate: any) 
	{
		console.log('dsadsda', pageDate)
		this.currentPage = pageDate.page;
		this.perPage = pageDate.perPage;
		this.index = this.currentPage;
		this.gerSmsList(pageDate.page);
	}

	onRefresh()
	{
		this.gerSmsList(1);
	}
}

