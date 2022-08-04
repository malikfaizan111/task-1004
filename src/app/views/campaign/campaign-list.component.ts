import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { CampaignDetailsComponent } from './campaign-details.component';

import { MainService, BaseLoaderService, PaginationService } from '../../services';
import { AlertDialog } from '../../lib';

import { appConfig } from '../../../config';
import { UserAppSelectorService } from '../../lib/app-selector/app-selector.service';



@Component({
	selector: 'campaign-list',
	templateUrl: './campaign-list.component.html'
})
export class CampaignListComponent implements OnInit
{
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
	searchTimer:any;
	perPage: number;
	appSelectorSubscription: Subscription;
	scenario: any;
	selectedApp: any;
	
	Campaign: any = [];
	CampaignCount: any;
	// public href: string = "";
	reserveword: any;
	timer: any;
	limit:boolean = true;
	public href: string = "";
	res: any;


	
	constructor(protected router: Router,
		protected _route: ActivatedRoute,
		protected mainApiService: MainService,
		protected paginationService: PaginationService, 
		protected appSelectorService: UserAppSelectorService, 
		protected loaderService: BaseLoaderService, protected dialog: MatDialog)	
	{
		this.search = '';
		
		this.operator = 'All';
		this.perPage = 20;
		this.appSelectorSubscription = this.appSelectorService.selectedApp.subscribe((response: any) =>
        { 
			//console.log("sasa",response)
			this.reserveword=response;

			this.href = window.location.href;
			this.res = this.href.split('#/')
			// console.log(this.res)
			if(this.res[1]=='main/campaign')
			{

				if(this.reserveword.user_app_id== "1")
				{
					this.getCampaign(1);
				}
				else if(this.reserveword.user_app_id== "2" || this.reserveword.user_app_id== "3"|| this.reserveword.user_app_id== "4")
				{
					
					let dialogRef = this.dialog.open(AlertDialog, {autoFocus: false});
					let cm = dialogRef.componentInstance;
					cm.heading = 'Error';
					cm.message = "There is not any Feature here ";
					cm.cancelButtonText = 'Ok';
					cm.type = 'error';
					this.Campaign=[];
					this.CampaignCount=[];
					this.search = '';
					this.limit = true;
				
				}
			}

			
			
		});

	}
	
    ngOnDestroy(): void 
	{
		
	}
	

	ngOnInit() 
	{
		// this.href = window.location.href;
		// this.res = this.href.split('#/')
		//  console.log(this.res);
		//if (this.res[1] == 'auth-mobile/login')
		this.getCampaign(1);
	
	}

	addNew()
	
	{

	
		
			this.router.navigateByUrl('main/campaign' + '/add');
		

		 if(this.reserveword.user_app_id== "2" ||this.reserveword.user_app_id== "3"||this.reserveword.user_app_id== "4")
			{
				this.limit=false;
				// let dialogRef = this.dialog.open(AlertDialog, {autoFocus: false});
                // let cm = dialogRef.componentInstance;
                // cm.heading = 'Error';
                // cm.message = "You cannot add any campaign here";
                // cm.cancelButtonText = 'Ok';
				// cm.type = 'error';
			}
		
	}

	onEdit(item : any)
	{
		localStorage.setItem('Campaign',JSON.stringify(item));
		this.router.navigateByUrl('main/campaign' + '/edit');
	}

	onSearchNotification(): void
	{
		if(this.reserveword.user_app_id== "1")
	{
		clearTimeout(this.searchTimer);
		this.searchTimer = setTimeout(() => 
		{
			this.getCampaign(1);
		}, 800);
	}

	

	}

	getCampaign(index : any, isLoaderHidden?: boolean): void
	{
		this.limit=false;
		this.loaderService.setLoading(true);
		// let url = 'getCampaign';
		let url = 'getCampaign?index=' + index + '&index2=' + this.perPage;
		
		
		
			if(this.search != '')
			{
					url = url + '&search=' + this.search;
				
			}
			
			else
			{
				this.search = '';
			}
		

	

		
		
		this.mainApiService.getList(appConfig.base_url_slug + url)
		.then(result => {
			//console.log(result)
			if (result.status == 200  && result.data) 
			{
				this.Campaign= result.data.campaign;
				this.CampaignCount = result.data.count;
				this.currentPage = index;
				this.pages = this.paginationService.setPagination(this.CampaignCount, index, this.perPage);
				this.totalPages = this.pages.totalPages;
				this.loaderService.setLoading(false);
			}
			else
			{
				this.Campaign = [];
				this.CampaignCount = 0;
				this.currentPage = 1;
				this.pages = this.paginationService.setPagination(this.CampaignCount, index, this.perPage);
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
		this.getCampaign(pageDate.page);
	}

	onChangeStatus(): void
	{
		
	}
	
	// new function
	onViewDetails(item : any): void
	{
		localStorage.setItem('Campaign',JSON.stringify(item));
		let dialogRef = this.dialog.open(CampaignDetailsComponent, {autoFocus: false});
		let compInstance = dialogRef.componentInstance;
		compInstance.Outlet = item;
		dialogRef.afterClosed().subscribe(result => {
			if(result != 'cancel')
			{
				this.getCampaign(this.currentPage);
			}
		})
	}
}
