import { map } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { MainService, BaseLoaderService, PaginationService } from '../../services';
import { AlertDialog } from '../../lib';
import { MatDialog } from '@angular/material/dialog';
import { appConfig } from '../../../config';
import { UserAppSelectorService } from '../../lib/app-selector/app-selector.service';

@Component({
	selector: 'app-parent_outlets-list',
	templateUrl: './parent_outlets-list.component.html'
})
export class ParentOutletsListComponent implements OnInit
{
	search: string;
  status = false;
	// type: any;
	sub: Subscription = new Subscription();
	index:  any = 1;
	totalPages: number = 1;
	pages: any;
	totalItems: any;
	currentPage:  any = 1;
	parentOutletsCount: any;
	ParentOutlets: any;
	searchTimer:any;
	perPage: any;
	componentSettings: any = {
		name: null,
		paggination: null,
		search: null
	};
	appSelectorSubscription: Subscription;
	abc = localStorage.getItem('UrbanpointAdmin') as string;
  UpAdmin = JSON.parse(this.abc);


	constructor(protected router: Router,
		protected _route: ActivatedRoute,
		protected mainApiService: MainService,
		protected paginationService: PaginationService,
		protected loaderService: BaseLoaderService, protected appSelectorService: UserAppSelectorService, protected dialog: MatDialog)
	{
		this.search = '';
		this.ParentOutlets = [];
		this.perPage = 20;

		this.appSelectorSubscription = this.appSelectorService.selectedApp.subscribe((response: any) =>
        {
			this.getParentOutletsList(1);
		});
	}

	ngOnDestroy(): void
	{
		this.appSelectorSubscription.unsubscribe();
	}

	ngOnInit()
	{
		let abcd = localStorage.getItem('componentSettings') as string;
		this.componentSettings = JSON.parse(abcd)
		if(this.componentSettings)
		{
			if(this.componentSettings.name != null && this.componentSettings.name == 'ParentOutlets')
			{
				this.currentPage = this.componentSettings.paggination;
				this.index = this.componentSettings.paggination;
				this.search = this.componentSettings.search;
			}
		}
		this.getParentOutletsList(this.currentPage);
	}

	addNew()
	{
		this.router.navigateByUrl('main/brands/add');
	}

	onSearchParentOutlet(): void
	{
		clearTimeout(this.searchTimer);
		this.searchTimer = setTimeout(() => {

			this.getParentOutletsList(1);

		}, 700);

	}

	getParentOutletsList(index : any, isLoaderHidden?: boolean): void
	{
		if(isLoaderHidden)
		{
			this.loaderService.setLoading(false);
		}
		else
		{
			this.loaderService.setLoading(true);
		}

		let url = 'getParents?index=' + index + '&index2=' + this.perPage;

		if(this.search != '')
		{
			url = url + '&search=' + this.search;
		}

		localStorage.setItem('componentSettings', JSON.stringify(
			{
				name: 'ParentOutlets',
				paggination: this.index,
				search: this.search
			}
        ));

		this.mainApiService.getList(appConfig.base_url_slug + url)
		.then(result => {
			if (result.status == 200  && result.data)
			{
				this.ParentOutlets = result.data.parents;
        this.ParentOutlets.map((data : any) => data.pickup = data.pickup == 'true' ? true: false);
        console.log(this.ParentOutlets);
				this.parentOutletsCount = result.data.counts;
				this.currentPage = index;
				this.pages = this.paginationService.setPagination(this.parentOutletsCount, index, this.perPage);
				this.totalPages = this.pages.totalPages;
				this.loaderService.setLoading(false);
			}
			else
			{
				this.ParentOutlets = [];
				this.parentOutletsCount = 0;
				this.currentPage = 1;
				this.pages = this.paginationService.setPagination(this.parentOutletsCount, index, this.perPage);
				this.totalPages = this.pages.totalPages;
				this.loaderService.setLoading(false);
			}
		});
	}

  updatePickUpStatus(parent : any) {

    let url = `updatePickupStatus/${parent.id}?status=${parent.pickup}`;
		this.mainApiService.postData(appConfig.base_url_slug + url,{},2).then(response => {
			if (response.status == 200 || response.status == 201)
			{
				this.getParentOutletsList(1);
			}
		},
		Error => {
		})
  }

	setPage(pageDate: any)
	{
		this.currentPage = pageDate.page;
		this.perPage = pageDate.perPage;
		this.index = this.currentPage;
		this.getParentOutletsList(pageDate.page);
	}


	onEditParentOutlet(parentOutlet : any): void
	{
		localStorage.setItem('ParentOutlet', JSON.stringify(parentOutlet));
		this.router.navigateByUrl('main/brands/' + parentOutlet.id);
	}

	onDeleteParentOutlet(parentOutlet : any): void
	{
		let parentOutletData = {
			id: parentOutlet.id
		};

		let dialogRef = this.dialog.open(AlertDialog, {autoFocus: false});
		let cm = dialogRef.componentInstance;
		cm.heading = 'Delete Parent Outlet';
		cm.message = 'Are you sure to delete Parent Outlet?';
		cm.submitButtonText = 'Yes';
		cm.cancelButtonText = 'No';
		cm.type = 'ask';
		cm.methodName = appConfig.base_url_slug + 'deleteParent';
		cm.dataToSubmit = parentOutletData;
		cm.showLoading = true;

		dialogRef.afterClosed().subscribe(result => {
			if(result)
			{
				this.getParentOutletsList(this.currentPage, true);
			}
		})
	}

}
