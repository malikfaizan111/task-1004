import { Component, OnInit } from '@angular/core';
import { MainService } from '../../../services/main.service';
import { MatDialog } from '@angular/material/dialog';
import { BaseLoaderService } from '../../../services';
import { appConfig } from '../../../../config';
import { UserAppSelectorService } from '../../../lib/app-selector/app-selector.service';
import { Subscription } from 'rxjs';
import { TrendingSearchDialog } from './trending_search.dialog';
import { Router } from '@angular/router';


@Component({
	selector: 'app-trending_search',
	templateUrl: 'trending_search.component.html'
})
export class TrendingSearchComponent implements OnInit {
	trendingSearch: any;
	appSelectorSubscription: Subscription;

	constructor(protected mainApiService: MainService,
		protected appSelectorService: UserAppSelectorService,
		protected dialog: MatDialog,
		protected loaderService: BaseLoaderService,
		private router: Router) {
		this.trendingSearch = null;
		this.appSelectorSubscription = this.appSelectorService.selectedApp.subscribe((response: any) => {
			this.gettrendingSearchList();
		});
	}

	ngOnDestroy(): void {
		this.appSelectorSubscription.unsubscribe();
	}

	ngOnInit() {
		this.gettrendingSearchList();
	}

	SettingChange() {
		this.gettrendingSearchList();
	}

	addNew() {
		this.router.navigate(['/main/trending_search/add']);
	}

	gettrendingSearchList(isLoaderHidden?: boolean): void {
		this.trendingSearch = null;
		if (isLoaderHidden) {
			this.loaderService.setLoading(false);
		}
		else {
			this.loaderService.setLoading(true);
		}
		let url = 'getTrendingSearchTag';

		this.mainApiService.getList(appConfig.base_url_slug + url, true, 2)
			.then(result => {
				if (result.status == 200 && result.data) {
					this.trendingSearch = result.data;
					this.loaderService.setLoading(false);
				}
				else {
					this.trendingSearch = null;
					this.loaderService.setLoading(false);
				}
			});
	}
	onEditTrending(item: any): void {
		let dialogRef = this.dialog.open(TrendingSearchDialog, { autoFocus: false });
		dialogRef.componentInstance.isEditing = true;
		dialogRef.componentInstance.details = item;


		dialogRef.afterClosed().subscribe(result => {
			if (result) {
				this.gettrendingSearchList();
			}
		})
	}
	onDelete(item: any): void {
		let url = 'deleteTrendingSearchTag';
		let x = { 'id': item.id }
		this.mainApiService.postData(appConfig.base_url_slug + url, x, 2)
			.then(result => {
				if (result.status == 200 && result.data) {
					this.gettrendingSearchList();
				}
				else {
				}
			});
	}
}