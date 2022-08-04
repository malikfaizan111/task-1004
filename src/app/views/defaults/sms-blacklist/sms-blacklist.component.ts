import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { appConfig } from '../../../../config';
import { AppLoaderService } from '../../../lib/app-loader/app-loader.service';
import { UserAppSelectorService } from '../../../lib/app-selector/app-selector.service';
import { MainService, PaginationService, BaseLoaderService } from '../../../services';
import { SmsBlacklistDialogComponent } from './view-sms-blacklist-dialog.component';

@Component({
  selector: 'app-sms-blacklist',
  templateUrl: './sms-blacklist.component.html',
  styleUrls: ['./sms-blacklist.component.css']
})
export class SmsBlacklistComponent implements OnInit {

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
	searchTimer:any;
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
		protected loaderService: BaseLoaderService, protected dialog: MatDialog)
	{
		this.search = '';
		this.SMSArray = [{}];
		this.perPage = 20;
		// this.operator = 'All';
		this.appSelectorSubscription = this.appSelectorService.selectedApp.subscribe((response: any) =>
        {
			this.getSMSList(1);
		});
	}

    ngOnDestroy(): void
	{
		this.appSelectorSubscription.unsubscribe();
	}

	ngOnInit()
	{
		this.sub = this._route.params.subscribe(params => {
			this.id = params['id'];
				this.getSMSList(1);
		});
		let abc = localStorage.getItem('UrbanpointAdmin') as string;
		this.Roles = JSON.parse(abc);
		
		// if(this.Roles.role == '2'){
		// 	 console.log("this.Roles: ",this.Roles)
		// }
	}


	onSearchSubscription(): void
	{
		clearTimeout(this.searchTimer);
		this.searchTimer = setTimeout(() => {

			this.getSMSList(1);

		}, 800);
	}


	onSearchModelChange(event : any): void
	{
		if(this.search == '' || this.search == null)
		{
			this.getSMSList(this.currentPage);
		}
	}

	getSMSList(index : any, isLoaderHidden?: boolean): void
	{
		if(isLoaderHidden)
		{
			this.loaderService.setLoading(false);
		}
		else
		{
			this.loaderService.setLoading(true);
		}
		// http://18.184.164.213/up_qatar/api/v1/cms/getSmsLogs?index=1&index2=10&user_id=45298
		let url = 'getBlacklistSmsStatus?page=' + index;


		this.mainApiService.getList(appConfig.base_url_slug + url, false, 2)
		.then(result => {
			if (result.status == 200  && result.data)
			{
				this.SMSArray = result.data;
				this.smsArrayCount = result.pagination.count;
				this.currentPage = index;
				this.pages = this.paginationService.setPagination(this.smsArrayCount, index, this.perPage);
				this.totalPages = this.pages.totalPages;
				this.loaderService.setLoading(false);
			}
			else
			{
				this.SMSArray = [];
				this.smsArrayCount = 0;
				this.currentPage = 1;
				this.pages = this.paginationService.setPagination(this.smsArrayCount, index, this.perPage);
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
		this.getSMSList(pageDate.page);
	}

	onAddNewNumber()
	{
		// sms = this.SMSArray;
		let dialogRef = this.dialog.open(SmsBlacklistDialogComponent, {autoFocus: false});
		dialogRef.componentInstance.showMessage = true;
		//dialogRef.componentInstance.data = sms;
		dialogRef.afterClosed().subscribe(result => {
			this.getSMSList(1);
		
	});
	}

	onDelete(sms:any)
	{
		// sms = this.SMSArray;
		let dialogRef = this.dialog.open(SmsBlacklistDialogComponent, {autoFocus: false});
		dialogRef.componentInstance.data = sms;
		dialogRef.componentInstance.showDeleteDialog = true;
		dialogRef.afterClosed().subscribe(result => {
                this.getSMSList(1);
            
        });
	}

	onLocationBack(): void
	{
		window.history.back();
	}

}
