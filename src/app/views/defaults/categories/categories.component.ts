import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { MainService, BaseLoaderService, PaginationService } from '../../../services';
import { AlertDialog } from '../../../lib';
import { appConfig } from '../../../../config';
import { UserAppSelectorService } from '../../../lib/app-selector/app-selector.service';
import { CategoriesDetailsComponent } from './categories-detail.component';
@Component({
	selector: 'app-categories',
	templateUrl: './categories.component.html',
	styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {
	search: string;
	sub: Subscription = new Subscription();
	index: any = 1;
	totalPages: number = 1;
	pages: any;
	totalItems: any;
	currentPage: any = 1;
	CategoriesCount: any;
	PromoCodes: any;
	isMultiple: any;
	searchTimer: any;
	perPage: any;
	componentSettings: any = {
		name: null,
		paggination: null,
		search: null
	};
	Categories: any = [];
	user_app: any;
	appSelectorSubscription: Subscription;


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
			this.gerCategoriesList(1);
		});
	}

	ngOnInit() {
		let abc = localStorage.getItem('componentSettings') as string;
		this.componentSettings = JSON.parse(abc);
		if (this.componentSettings) {
			if (this.componentSettings.name != null && this.componentSettings.name == 'PromoCodes') {
				this.currentPage = this.componentSettings.paggination;
				this.index = this.componentSettings.paggination;
				this.search = this.componentSettings.search;
			}
		}
		this.gerCategoriesList(this.currentPage);
	}

	addNew() {
		this.router.navigateByUrl('main/categories/add');
	}
	addNew1() {
		let arr = [];
		for (var i = 0; i < this.Categories.length; i++) {
			arr.push({
				id: this.Categories[i].id,
				name: this.Categories[i].name,
				orderby: this.Categories[i].orderby,
			});
		}
		let dialogRef = this.dialog.open(CategoriesDetailsComponent, { autoFocus: false });
		let compInstance = dialogRef.componentInstance;
		compInstance.catArray = arr;
		dialogRef.afterClosed().subscribe(result => {
			if (result) {
				this.gerCategoriesList(this.currentPage);
			}
		})
	}

	ngOnDestroy(): void {
		this.appSelectorSubscription.unsubscribe();
	}

	onSearchPromoCode(): void {
		clearTimeout(this.searchTimer);
		this.searchTimer = setTimeout(() => {
			this.gerCategoriesList(1);
		}, 700);
	}

	onSwitchCodes(isMultiple: any): void {
		this.isMultiple = isMultiple;
		this.gerCategoriesList(1);
	}

	gerCategoriesList(index: any, isLoaderHidden?: boolean): void {
		this.loaderService.setLoading(true);
		let url = 'getCategories?index=' + index + '&index2=' + this.perPage;

		if (this.search != '') {
			url = url + '&search=' + this.search;
		}

		localStorage.setItem('componentSettings', JSON.stringify(
			{
				name: 'Categories',
				paggination: this.index,
				search: this.search
			}
		));

		this.mainApiService.getList(appConfig.base_url_slug + url)
			.then(result => {
				if (result.status == 200 && result.data) {
					this.Categories = result.data.categories;
					this.CategoriesCount = result.data.categoriesCount;
					this.currentPage = index;
					this.pages = this.paginationService.setPagination(this.CategoriesCount, index, this.perPage);
					this.totalPages = this.pages.totalPages;
					this.loaderService.setLoading(false);

				}
				else {
					this.Categories = [];
					this.CategoriesCount = 0;
					this.currentPage = 1;
					this.pages = this.paginationService.setPagination(this.CategoriesCount, index, this.perPage);
					this.totalPages = this.pages.totalPages;
					this.loaderService.setLoading(false);
				}
			});
	}

	setPage(pageDate: any) {
		this.currentPage = pageDate.page;
		this.perPage = pageDate.perPage;
		this.index = this.currentPage;
		this.gerCategoriesList(pageDate.page);
	}

	onEditCategorie(categorie: any): void {
		localStorage.setItem('categories', JSON.stringify(categorie));
		this.router.navigateByUrl('main/categories/' + categorie.id);
	}
}