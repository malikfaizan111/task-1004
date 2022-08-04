import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';


import { MainService, BaseLoaderService, PaginationService } from '../../services';
import { AlertDialog } from '../../lib';
import { appConfig } from '../../../config';
import { UserAppSelectorService } from '../../lib/app-selector/app-selector.service';


@Component({
	selector: 'app-order-reviews',
	templateUrl: './order_reviews.component.html'
})
export class OrderReviewsComponent implements OnInit 
{
	search: string;
	sub: Subscription = new Subscription();
	index: any;
	totalPages: number = 1;
	pages: any;
	totalItems: any;
	currentPage: any;
	outletsCount: any;
	OrderReviews: any;
	id: any;
	perPage: number;
	appSelectorSubscription: Subscription;

	constructor(protected router: Router,
		protected _route: ActivatedRoute,
		protected mainApiService: MainService,
		protected paginationService: PaginationService, 
		protected appSelectorService: UserAppSelectorService, 
		protected loaderService: BaseLoaderService, protected dialog: MatDialog)	
	{
		this.search = '';
		this.OrderReviews = [];
		this.perPage = 20;
		this.appSelectorSubscription = this.appSelectorService.selectedApp.subscribe((response: any) =>
        {
			this.gerOrderReviews(1);
		});
	}
	
    ngOnDestroy(): void 
	{
		this.appSelectorSubscription.unsubscribe();	
	}
	

	ngOnInit() 
	{
		this.sub = this._route.params.subscribe(params => {
			this.id = params['order_id'];
			if (this.id) 
			{
				this.gerOrderReviews(1);
			}
		});
	}

	onSearchOrderReview(): void
	{
		this.gerOrderReviews(1);
	}

	gerOrderReviews(index : any, isLoaderHidden?: boolean): void
	{
		if(isLoaderHidden)
		{
			this.loaderService.setLoading(false);
		}
		else
		{
			this.loaderService.setLoading(true);
		}

		let url = 'getOrderReviews?index=' + index + '&index2=' + this.perPage;

		if(this.search != '')
		{
			url = url + '&search=' + this.search;
		}

		if(this.id != 'All')
		{
			url = url + '&order_id=' + this.id;
		}
		
		this.mainApiService.getList(appConfig.base_url_slug + url)
		.then(result => {
			if (result.status == 200  && result.data) 
			{
				this.OrderReviews = result.data.allReviews;
				this.outletsCount = result.data.allReviewsCount;
				this.currentPage = index;
				this.pages = this.paginationService.setPagination(this.outletsCount, index, this.perPage);
				this.totalPages = this.pages.totalPages;
				this.loaderService.setLoading(false);
			}
			else
			{
				this.OrderReviews = [];
				this.outletsCount = 0;
				this.currentPage = 1;
				this.pages = this.paginationService.setPagination(this.outletsCount, index, this.perPage);
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
		this.gerOrderReviews(pageDate.page);
	}


	onLocationBack(): void
	{
		window.history.back();
	}
}
