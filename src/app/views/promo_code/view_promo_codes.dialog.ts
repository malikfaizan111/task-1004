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
	selector: 'app-view_promo_codes',
	templateUrl: './view_promo_codes.dialog.html'
})
export class ViewPromoCodesComponent extends ExportCSVComponent implements OnInit, AfterViewInit
{
	
	sub: Subscription = new Subscription();
	data: any;
    mPromoCodes: any[];
    currentPage: number = 1;
    index: number = 0;
    accesscodesCount: any;
    pages: any;
    totalPages: any;
	perPage: any;

	constructor(private elRef: ElementRef, protected router: Router,
        protected mainApiService: MainService,
        protected paginationService: PaginationService, 
		// protected mloaderService: BaseLoaderService, 
		protected appLoaderService: AppLoaderService,
        protected dialog: MatDialog, protected dialogRef: MatDialogRef<ViewPromoCodesComponent>)	
	{
		super(mainApiService, appLoaderService, dialog);
        this.data = null;
		this.mPromoCodes = [];
		this.perPage = 20;
		this.method = 'getMultipleDiscountCode';
	}

	ngOnInit() 
	{
		this.germPromoCodesList(1);
		this.parent_id = this.data.id;
		this.isNeededDate = false;
    }

    ngAfterViewInit()
    {
        this.elRef.nativeElement.parentElement.classList.add("mat-dialog-changes-1");
    }

    germPromoCodesList(index : any, isLoaderHidden?: boolean): void
	{
        let url = 'getMultipleDiscountCode?index=' + index + '&index2=' + this.perPage + '&id=' + this.data.id;
		
		this.mainApiService.getList(appConfig.base_url_slug + url)
		.then(result => {
			if (result.status == 200  && result.data) 
			{
				let mPromoCodes : any = result.data.discountcodes;
				this.accesscodesCount = result.data.discountcodesCount;
				this.currentPage = index;
				this.pages = this.paginationService.setPagination(this.accesscodesCount, index, this.perPage);
				this.totalPages = this.pages.totalPages;

				mPromoCodes.forEach((element : any) => {
					if(element.status == 1)
					{
						element['slide'] = true;
					}
					else if(element.status == 0)
					{
						element['slide'] = false;
					}
				});
				this.mPromoCodes = mPromoCodes;
			}
			else
			{
				this.mPromoCodes = [];
				this.accesscodesCount = 0;
				this.currentPage = 1;
				this.pages = this.paginationService.setPagination(this.accesscodesCount, index, this.perPage);
				this.totalPages = this.pages.totalPages;
			}
		});
	}


	setPage(pageDate: any) 
	{
		this.currentPage = pageDate.page;
		this.perPage = pageDate.perPage;
		this.index = this.currentPage;
		this.germPromoCodesList(pageDate.page);
	}
    
    onChangemPromoCode(promoCode : any): void 
	{
		let status: any;
		if(promoCode.slide)
		{
			status = 1;
		}
		else
		{
			status = 0;
		}
		let merchantData = {
			id: promoCode.id,
			status: status
		};

		let dialogRef = this.dialog.open(AlertDialog, {autoFocus: false});
		let cm = dialogRef.componentInstance;
		cm.heading = 'Change PromoCode';
		cm.message = 'Are you sure to Update PromoCode';
		cm.submitButtonText = 'Yes';
		cm.cancelButtonText = 'No';
		cm.type = 'ask';
		cm.methodName = appConfig.base_url_slug + 'updateDiscountCode';
		cm.dataToSubmit = merchantData;
		cm.showLoading = true;

		dialogRef.afterClosed().subscribe(result => {
			if(result)
			{
				this.germPromoCodesList(this.currentPage, true);
			}
			else
			{
				promoCode.slide = !promoCode.slide;
			}
		})
	}
}
