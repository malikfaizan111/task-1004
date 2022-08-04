import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { MainService, BaseLoaderService, PaginationService } from '../../../services';
import { AlertDialog } from '../../../lib';
import { appConfig } from '../../../../config';
import { UserAppSelectorService } from '../../../lib/app-selector/app-selector.service';
import { ChangeOutletOrderDialogComponent } from './change-outlet-order-dialog.component';
@Component({
	selector: 'app-popularcategories',
	templateUrl: './popularcategories.component.html',
	styleUrls: ['./popularcategories.component.css']
})
export class PopularCategoriesComponent implements OnInit {
	search: string;
	sub: Subscription = new Subscription();
	index: any = 1;
	totalPages: number = 1;
	pages: any;
	totalItems: any;
	currentPage: any = 1;
	CategoriesCount: any;
	Popularcategoriesdata: any;
	isMultiple: any;
	searchTimer: any;
	perPage: any;
	// selectedOutletId: any = [];
	status: any;
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
		this.Popularcategoriesdata = [];
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
			if (this.componentSettings.name != null && this.componentSettings.name == 'Popularcategoriesdata') {
				this.currentPage = this.componentSettings.paggination;
				this.index = this.componentSettings.paggination;
				this.search = this.componentSettings.search;
			}
		}
		this.gerCategoriesList(this.currentPage);
	}

	addNew() {
		this.router.navigateByUrl('main/popularcategories/add');
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

	toggleView(item: any) {
		// console.log(item.status);
		if (item.status) {
			this.status = 'active';
		}
		else {
			this.status = 'not_active';
		}
		var data = {
			status: this.status,
			id: item.id
		}
		var url = 'editPopularCategory';
		this.mainApiService.postData(appConfig.base_url_slug + url, data, 2).then(response => {
			if (response.status == 200 || response.status == 201) {
			}
			else {
				item.status = !item.status
			}
		},
			Error => {
				let dialogRef = this.dialog.open(AlertDialog, { autoFocus: false });
				let cm = dialogRef.componentInstance;
				cm.heading = 'Error';
				cm.message = 'Internal Server Error';
				cm.cancelButtonText = 'Close';
				cm.type = 'error';
			});
	}

	onSwitchCodes(isMultiple: any): void {
		this.isMultiple = isMultiple;
		this.gerCategoriesList(1);
	}

	onAddOutlets() {
		let dialogRef = this.dialog.open(ChangeOutletOrderDialogComponent, { autoFocus: false, disableClose: true });
		dialogRef.componentInstance.formdataid = [];
		dialogRef.componentInstance.formdataid = [...this.Categories];

		dialogRef.afterClosed().subscribe(result => {
			if (result) {
				this.gerCategoriesList(this.currentPage);
				// this.selectedOutletId = [];
				// if (result != false) {
				// this.Categories = [];
				// for (let i = 0; i < result.length; i++) {
				// 	this.Categories.push({
				// 		id: result[i].id,
				// 		name: result[i].name
				// 	})
				// 	this.selectedOutletId.push(result[i].id);
				// }
				// }
			}
			else {
			}
		});
	}

	gerCategoriesList(index: any, isLoaderHidden?: boolean): void {
		this.loaderService.setLoading(true);
		let url = 'viewPopularCategory?page=' + index + '&per_page=' + this.perPage + '&sort_order=Desc';
		// if(this.search != '')
		// {
		// 	url = url + '&search=' + this.search;
		// }

		// localStorage.setItem('componentSettings', JSON.stringify(
		// 	{
		// 		name: 'Popularcategoriesdata',
		// 		paggination: this.index,
		// 		search: this.search
		// 	}
		// ));		
		this.mainApiService.getList(appConfig.base_url_slug + url, false, 2)
			.then(result => {
				if (result.status == 200 && result.data) {
					this.Categories = result.data;
					this.CategoriesCount = result.pagination;
					this.currentPage = index;
					this.pages = this.paginationService.setPagination(this.CategoriesCount, index, this.perPage);
					this.totalPages = this.pages.totalPages;
					this.loaderService.setLoading(false);

					this.Categories.forEach((element: any) => {
						if (element.status == 1) {
							element.status = true;
						}
						else if (element.status == 0) {
							element.status = false;
						}
					});

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

	onEditPopularCategory(popularcategorie: any): void {
		localStorage.setItem('popularcategories', JSON.stringify(popularcategorie));
		this.router.navigateByUrl('main/popularcategories/' + popularcategorie.id);
	}
}