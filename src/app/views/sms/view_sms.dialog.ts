import { Component, OnInit, ElementRef, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { MainService, BaseLoaderService, PaginationService } from '../../services';
import { AlertDialog } from '../../lib';
import { appConfig } from '../../../config';
import { ExportCSVComponent } from '../../lib/export_csv.component';
import { AppLoaderService } from '../../lib/app-loader/app-loader.service';


@Component({
	selector: 'app-view-sms',
	templateUrl: './view_sms.dialog.html'
})
export class ViewSmsComponent extends ExportCSVComponent implements OnInit, AfterViewInit
{
	
	sub: Subscription = new Subscription();
	Deal: any;
    mAccessSms: any[];
    currentPage: number = 1;
    index: number = 0;
    accesssmsCount: any;
    pages: any;
    totalPages: number = 1;
	perPage: any;
	isLoading: boolean;

	constructor(private elRef: ElementRef, protected router: Router,
        protected mainApiService: MainService,
        protected paginationService: PaginationService, 
		protected mloaderService: BaseLoaderService, 
		protected appLoaderService: AppLoaderService,
        protected dialog: MatDialog, protected dialogRef: MatDialogRef<ViewSmsComponent>)	
	{
		super(mainApiService, appLoaderService, dialog);
        this.Deal = null;
		this.mAccessSms = [];
		this.perPage = 20;
		this.method = 'getMultipleAccessCode';
		this.isLoading = false;
	}

	ngOnInit() 
	{
		this.germAccessSmsList(1);
		this.parent_id = this.Deal.id;
		this.isNeededDate = false;
    }

    ngAfterViewInit()
    {
        this.elRef.nativeElement.parentElement.classList.add("mat-dialog-changes-1");
    }

    germAccessSmsList(index : any, isLoaderHidden?: boolean): void
	{
		// this.mloaderService.setLoading(true);
		this.isLoading = true;
        let url = 'getSmsTypeDetails?index=' + index + '&index2=' + this.perPage + '&type=' + this.Deal.type;
		
		this.mainApiService.getList(appConfig.base_url_slug + url)
		.then(result => {
			if (result.status == 200  && result.data) 
			{
				let mAccessSms : any = result.data.sms;
				this.accesssmsCount = result.data.count;
				this.currentPage = index;
				this.pages = this.paginationService.setPagination(this.accesssmsCount, index, this.perPage);
				this.totalPages = this.pages.totalPages;
				this.mloaderService.setLoading(false);
				this.isLoading = false;

				// mAccessSms.forEach(element => {
				// 	if(element.status == 1)
				// 	{
				// 		element['slide'] = true;
				// 	}
				// 	else if(element.status == 0)
				// 	{
				// 		element['slide'] = false;
				// 	}
				// });
				// log here('dsdsd')
				this.mAccessSms = mAccessSms;
			}
			else
			{
				this.mAccessSms = [];
				this.accesssmsCount = 0;
				this.currentPage = 1;
				this.pages = this.paginationService.setPagination(this.accesssmsCount, index, this.perPage);
				this.totalPages = this.pages.totalPages;
				// this.mloaderService.setLoading(false);
				this.isLoading = false;
			}
		});
	}


	setPage(pageDate: any) 
	{
		this.currentPage = pageDate.page;
		this.perPage = pageDate.perPage;
		this.index = this.currentPage;
		this.germAccessSmsList(pageDate.page);
	}
}
