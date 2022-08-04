import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { MainService, BaseLoaderService, PaginationService } from '../../../services';
import { AlertDialog } from '../../../lib';
import {ViewPromoCodesComponent} from "../view_promo_codes.dialog";
import { appConfig } from '../../../../config';
import { UserAppSelectorService } from '../../../lib/app-selector/app-selector.service';



@Component({
    selector: 'app_promo_codes_list_new',
	templateUrl: './promo_code_list_new.component.html'
})
export class PromoCodesListNewComponent implements OnInit{
    search: string;
	sub: Subscription = new Subscription();
	index:  any = 1;
	totalPages: number = 1;
	pages: any;
	totalItems: any;
	currentPage:  any = 1;
	merchantsCount: any;
	PromoCodes: any;
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

	constructor(protected router: Router,
		protected _route: ActivatedRoute,
		protected mainApiService: MainService,
		protected paginationService: PaginationService, 
		protected loaderService: BaseLoaderService, protected appSelectorService: UserAppSelectorService, protected dialog: MatDialog)	
	{
		this.search = '';
		this.PromoCodes = [];
		this.isMultiple = false;
		this.perPage = 20;

		this.appSelectorSubscription = this.appSelectorService.selectedApp.subscribe((response: any) =>
        {
			this.gerPromoCodesList(1);
		});
	}

	ngOnInit() 
	{
		let abc = localStorage.getItem('componentSettings') as string;
		this.componentSettings = JSON.parse(abc);
		if(this.componentSettings)
		{
			if(this.componentSettings.name != null && this.componentSettings.name == 'PromoCodes')
			{
				this.currentPage = this.componentSettings.paggination;
				this.index = this.componentSettings.paggination;
				this.search = this.componentSettings.search;
			}
		}
		this.gerPromoCodesList(this.currentPage);
	}

	addNew() 
	{
		this.router.navigateByUrl('main/promo_codesNew/add');
	}

	ngOnDestroy(): void 
	{
		this.appSelectorSubscription.unsubscribe();	
	}

	onSearchPromoCode(): void
	{
		clearTimeout(this.searchTimer);
		this.searchTimer = setTimeout(() => {
			this.gerPromoCodesList(1);
		}, 700);
	}
	
	onSwitchCodes(isMultiple : any): void
	{
		this.isMultiple = isMultiple;
		this.gerPromoCodesList(1);
	}

	gerPromoCodesList(index : any, isLoaderHidden?: boolean): void
	{
		this.loaderService.setLoading(true);
		let url = 'getDiscountCodes?index=' + index + '&index2=' + this.perPage;

		if(this.search != '')
		{
			url = url + '&search=' + this.search;
		}

		localStorage.setItem('componentSettings', JSON.stringify(
			{
				name: 'PromoCodes',
				paggination: this.index,
				search: this.search
			}
        ));
		
		this.mainApiService.getList(appConfig.base_url_slug + url)
		.then(result => {
			if (result.status == 200  && result.data) 
			{
				let PromoCodes : any = result.data.discountcodes;
				this.merchantsCount = result.data.discountcodesCount;
				this.currentPage = index;
				this.pages = this.paginationService.setPagination(this.merchantsCount, index, this.perPage);
				this.totalPages = this.pages.totalPages;
				this.loaderService.setLoading(false);

				PromoCodes.forEach((element : any) => {
					if(element.status == 1)
					{
						element['slide'] = true;
					}
					else if(element.status == 0)
					{
						element['slide'] = false;
					}
				});
				// log here('dsdsd')
				this.PromoCodes = PromoCodes;
			}
			else
			{
				this.PromoCodes = [];
				this.merchantsCount = 0;
				this.currentPage = 1;
				this.pages = this.paginationService.setPagination(this.merchantsCount, index, this.perPage);
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
		this.gerPromoCodesList(pageDate.page);
	}

	onEditPromoCodes(promoCode : any): void 
	{
		localStorage.setItem('PromoCode', JSON.stringify(promoCode));
		this.router.navigateByUrl('main/promo_codesNew/'+ promoCode.id);
	}

	onChangePromoCode(promoCode : any): void 
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
		cm.methodName =  appConfig.base_url_slug + 'updateDiscountCode';
		cm.dataToSubmit = merchantData;
		cm.showLoading = true;

		dialogRef.afterClosed().subscribe(result => {
			if(result)
			{
				this.gerPromoCodesList(this.currentPage, true);
			}
			else
			{
				promoCode.slide = !promoCode.slide;
			}
		})
	}

	onViewAllPromoCodes(code:any)
	{
		let dialogRef = this.dialog.open(ViewPromoCodesComponent, {autoFocus: false});
		dialogRef.componentInstance.data = code;
	}
}