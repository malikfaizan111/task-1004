import { filter } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { MainService, BaseLoaderService, PaginationService } from '../../../../services';
import { AlertDialog } from '../../../../lib';
import { appConfig } from '../../../../../config';
import { UserAppSelectorService } from '../../../../lib/app-selector/app-selector.service';

@Component({
	selector: 'app-promotion',
	templateUrl: './promotion-list.component.html',

})
export class PromotionComponent implements OnInit {
	search: string;
	sub: Subscription = new Subscription();
	index: any = 1;
	totalPages: number = 1;
	pages: any;
	totalItems: any;
	currentPage: any = 1;
	PromotionCount: any;
	PromoCodes: any;
	isMultiple: any;
	searchTimer: any;
	perPage: any;
	componentSettings: any = {
		name: null,
		paggination: null,
		search: null
	};
	Promotion: any = [];
	user_app: any;
	appSelectorSubscription: Subscription;
	id: any;
	promotionid: any;


	constructor(protected router: Router,
		protected _route: ActivatedRoute,
		protected mainApiService: MainService,
		protected paginationService: PaginationService,
		protected loaderService: BaseLoaderService, protected appSelectorService: UserAppSelectorService, protected dialog: MatDialog) {
		this.search = '';
		this.PromoCodes = [];
		this.isMultiple = false;
		this.perPage = 20;

		this.appSelectorSubscription = this.appSelectorService.selectedApp.subscribe((response: any) => {
			this.getPromotionList(1);
		});
	}

	ngOnInit() {
		this.sub = this._route.params.subscribe(params => {
			this.id = params['parentid'];
			this.promotionid = params['promotionid'];
		});
		console.log("parenid", this.id)
		let abc = localStorage.getItem('componentSettings') as string;
		this.componentSettings = JSON.parse(abc);
		if (this.componentSettings) {
			if (this.componentSettings.name != null && this.componentSettings.name == 'Promotion') {
				this.currentPage = this.componentSettings.paggination;
				this.index = this.componentSettings.paggination;
				this.search = this.componentSettings.search;
			}
		}
		this.getPromotionList(this.currentPage);
	}
	onLocationBack(): void {
		window.history.back();
	}

	addNew() {
		this.router.navigateByUrl('main/restaurants/' + this.id + '/promotionForm/add');
	}

	// addNew1()
	// {
	// 	let arr = [];
	// 	for(var i = 0; i < this.Categories.length; i++){
	// 		arr.push({
	// 			id: this.Categories[i].id,
	// 			name: this.Categories[i].name,
	// 			orderby: this.Categories[i].orderby,
	// 		});
	// 	}
	// 	let dialogRef = this.dialog.open(CollectionDetailsComponent, {autoFocus: false});
	// 	let compInstance = dialogRef.componentInstance;
	// 	compInstance.catArray = arr;
	// 	dialogRef.afterClosed().subscribe(result => {
	// 		if(result)
	// 		{
	// 			this.gerCategoriesList(this.currentPage);
	// 		}
	// 	})
	// }

	ngOnDestroy(): void {
		this.appSelectorSubscription.unsubscribe();
	}

	onSearchPromoCode(): void {
		clearTimeout(this.searchTimer);
		this.searchTimer = setTimeout(() => {
			this.getPromotionList(1);
		}, 700);
	}

	onSwitchCodes(isMultiple: any): void {
		this.isMultiple = isMultiple;
		this.getPromotionList(1);
	}

	getPromotionList(index: any, isLoaderHidden?: boolean): void {
		this.loaderService.setLoading(true);
		let url = 'viewPromotion?pagination_type=true' + '&per_page=' + this.perPage + '&page=' + index + '&sort_order=Desc' + '&parent_outlet_id=' + this.id;

		if (this.search != '') {
			url = url + '&search=' + this.search;
		}

		localStorage.setItem('componentSettings', JSON.stringify(
			{
				name: 'Promotion',
				paggination: this.index,
				search: this.search
			}
		));

		this.mainApiService.getList(appConfig.base_url_slug + url, false, 2)
			.then(result => {
				if (result.status == 200 && result.data) {
					this.Promotion = result.data;
					this.Promotion = this.Promotion.filter((promo: any) => promo.type == 'b1g1f');
					this.PromotionCount = result.pagination.count;
					this.currentPage = index;
					this.pages = this.paginationService.setPagination(this.PromotionCount, index, this.perPage);
					this.totalPages = this.pages.totalPages;
					this.loaderService.setLoading(false);
				}
				else {
					this.Promotion = [];
					this.PromotionCount = 0;
					this.currentPage = 1;
					this.pages = this.paginationService.setPagination(this.PromotionCount, index, this.perPage);
					this.totalPages = this.pages.totalPages;
					this.loaderService.setLoading(false);
				}
			});
	}

	setPage(pageDate: any) {
		this.currentPage = pageDate.page;
		this.perPage = pageDate.perPage;
		this.index = this.currentPage;
		this.getPromotionList(pageDate.page);
	}

	onEditPromotion(Promotion: any): void {
		localStorage.setItem('Promotion', JSON.stringify(Promotion));
		this.router.navigateByUrl('main/restaurants/' + this.id + '/promotionForm/' + Promotion.id);
	}
}