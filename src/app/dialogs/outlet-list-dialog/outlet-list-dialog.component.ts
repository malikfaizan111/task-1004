import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { appConfig } from '../../../config';
import { AppLoaderService } from '../../lib/app-loader/app-loader.service';
import { UserAppSelectorService } from '../../lib/app-selector/app-selector.service';
import { MainService, PaginationService, BaseLoaderService } from '../../services';
import { VersionDialog } from '../../views/defaults/versions';

@Component({
  selector: 'app-outlet-list-dialog',
  templateUrl: './outlet-list-dialog.component.html',
  styleUrls: ['./outlet-list-dialog.component.css']
})
export class OutletListDialogComponent implements OnInit {

	search: string;
	sub: Subscription = new Subscription();
	index: any;
	totalPages: number = 1;
	pages: any;
	totalItems: any;
	currentPage: any;
	smsArrayCount: any;
	outletList: any[] = [];
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
    protected dialogRef: MatDialogRef<OutletListDialogComponent>,
		protected loaderService: BaseLoaderService, protected dialog: MatDialog)
	{
		this.search = '';
		this.perPage = 5;
		// this.operator = 'All';
		this.appSelectorSubscription = this.appSelectorService.selectedApp.subscribe((response: any) =>
        {
			this.getOutletList(1);
		});
	}

    ngOnDestroy(): void
	{
		this.appSelectorSubscription.unsubscribe();
	}

	ngOnInit()
	{
		this.getOutletList(1);
	}


	onSearchSubscription(): void
	{
		clearTimeout(this.searchTimer);
		this.searchTimer = setTimeout(() => {

			this.getOutletList(1);

		}, 800);
	}


	onSearchModelChange(event : any): void
	{
		if(this.search == '' || this.search == null)
		{
			this.getOutletList(this.currentPage);
		}
	}

	getOutletList(index : any, isLoaderHidden?: boolean): void
	{
		if(isLoaderHidden) {
			this.loaderService.setLoading(false);
		} else {
			this.loaderService.setLoading(true);
		}

    let url = 'getAllOutlets?index1=' + index + '&index2=' + this.perPage;

    if (this.search) {
      url = url + '&search=' + this.search;
    }

		this.mainApiService.getList(appConfig.base_url_slug + url, false)
		.then(result => {
			if (result.status == 200  && result.data)
			{
				this.outletList = result.data
				// this.smsArrayCount = result.pagination.count;
				// this.currentPage = index;
				// this.pages = this.paginationService.setPagination(this.smsArrayCount, index, this.perPage);
				// this.totalPages = this.pages.totalPages;
				this.loaderService.setLoading(false);
			}
			else
			{
				this.outletList = [];
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
		this.getOutletList(pageDate.page);
	}

	onLocationBack(): void {
		window.history.back();
	}

  onSelectOutlet(outlet : any) {
    this.dialogRef.close(outlet);
  }

}
