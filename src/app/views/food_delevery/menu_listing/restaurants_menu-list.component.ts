import { TimingMenusDialogComponent } from './../timing-menus-dialog/timing-menus-dialog.component';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { MainService, BaseLoaderService, PaginationService } from '../../../services';
import { AlertDialog } from '../../../lib';
import { MatDialog } from '@angular/material/dialog';
import { appConfig } from '../../../../config';
import { UserAppSelectorService } from '../../../lib/app-selector/app-selector.service';
// import tableDragger from 'table-dragger';
// import * as tableDnD from 'tablednd';

declare var $: any;
@Component({
	selector: 'app-restaurants_menu',
	templateUrl: './restaurants_menu-list.component.html'
})
export class RestaurantMenuListComponent implements OnInit
{
	search: string;
	sub: Subscription = new Subscription();
	index: any = 1;
	totalPages: number = 1;
	pages: any;
	totalItems: any;
	currentPage: any = 1;
	searchTimer: any;
	perPage: any;
	componentSettings: any = {
		name: null,
		paggination: null,
		search: null
	};
	appSelectorSubscription: Subscription;
	ParentOutlets: any;
	parentOutletsCount: any;
	RestaurantsParentOutlets: any[] = [];
	RestaurantsparentOutletsCount: any;
	type: any;
	codeGet: any = [];
	id: any;
  Menuid: any;
  menuStatus = false;
  decimals = '';


	constructor(protected router: Router,
		protected _route: ActivatedRoute,
		protected mainApiService: MainService,
		protected paginationService: PaginationService,
		protected loaderService: BaseLoaderService, protected appSelectorService: UserAppSelectorService, protected dialog: MatDialog)
	{
		this.search = '';
		this.perPage = 20;
		this.appSelectorSubscription = this.appSelectorService.selectedApp.subscribe((response: any) =>
		{
			this.gerParentOutletsList(1);
			// this.onViewSubMenu(1);
		});
	}

	ngOnDestroy(): void
	{
		this.appSelectorSubscription.unsubscribe();
	}
	onLocationBack(): void
	{
		window.history.back();
	}

	ngOnInit()
	{
		this.sub = this._route.params.subscribe(params => {
			this.id = params['parentid'];
			this.Menuid = params['MainMenuId'];
			console.log("iddddd in params",this.id)
			// if (this.id != 'add')
			// {
			// 	this.codeGet = JSON.parse(localStorage.getItem('RestaurantParentOutlet'));
				this.gerParentOutletsList(1);
			// }
		})
    // let el = document.getElementById('table');
    // console.log(el);
    // let dragger = tableDragger(el, {
    //   mode: 'row',
    //   dragHandler: '.handle',
    //   animation: 300,
    // });

    // console.log(dragger);
    // dragger.on('drop',function(from, to){
    //   console.log(from);
    //   console.log(to);
    // });
    // let $this = $(this);

    // $("#table").tableDnD()
    // $('tbody').sortable();

		
		let abc = localStorage.getItem('componentSettings') as string;
		this.componentSettings = JSON.parse(abc);
		if (this.componentSettings)
		{
			if (this.componentSettings.name != null && this.componentSettings.name == 'RestaurantMenu')
			{
				this.currentPage = this.componentSettings.paggination;
				this.index = this.componentSettings.paggination;
				this.search = this.componentSettings.search;
			}
		}

	}

	addNew()
	{
		this.router.navigateByUrl('main/restaurants/mainMenuItem/'+this.id+'/restaurantMenuList/'+this.Menuid+'/add');
	}
	onSearchParentOutlet(): void
	{
		clearTimeout(this.searchTimer);
		this.searchTimer = setTimeout(() =>
		{

			this.gerParentOutletsList(1);

		}, 700);

	}
	onDelete(parentOutlet : any):void
	{
		let url = 'deleteMenuItem/'+parentOutlet.id+'?' ;

		this.mainApiService.getList(appConfig.base_url_slug + url, false, 2)
			.then(result =>
			{

				if (result.status == 200 && result.data)
				{
					this.gerParentOutletsList(1);

				}
				else
				{


				}
			});
	}
	gerParentOutletsList(index : any, isLoaderHidden?: boolean): void
	{
    this.loaderService.setLoading(true);
    this.decimals = this.appSelectorService.userAppData.user_app_id == 1 ? '1.2' : '1.3';
		let url = 'viewMenuItem?parent_outlet_id=' + this.id + '&per_page=' + this.perPage + '&page=' + index + '&main_menu_id='+this.Menuid  + '&sort_by=id_csv' + '&sort_order=ASC' + '&pagination_type=true';
		if (this.search != '')
		{
			url = url + '&search=' + this.search;
		}

		localStorage.setItem('componentSettings', JSON.stringify(
			{
				name: 'RestaurantMenu',
				paggination: this.index,
				search: this.search
			}
		));

		this.mainApiService.getList(appConfig.base_url_slug + url, false, 2)
			.then(result =>
			{
				if (result.status == 200 && result.data)
				{
					this.RestaurantsParentOutlets = result.data;
          this.RestaurantsparentOutletsCount = result.pagination.count;
          this.RestaurantsParentOutlets.forEach(menu => {
            menu.slide = menu.status == '1' ? true: false;
          });
					this.currentPage = index;
					this.pages = this.paginationService.setPagination(this.RestaurantsparentOutletsCount, index, this.perPage);
					this.totalPages = this.pages.totalPages;
					this.loaderService.setLoading(false);
				}
				else
				{
					this.RestaurantsParentOutlets = [];
					this.RestaurantsparentOutletsCount = 0;
					this.currentPage = 1;
					this.pages = this.paginationService.setPagination(this.RestaurantsparentOutletsCount, index, this.perPage);
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
		this.gerParentOutletsList(pageDate.page);
	}

	onEditRestaurantMenuid(parentOutlet : any): void
	{
		localStorage.setItem('RestaurantMenudetail', JSON.stringify(parentOutlet));
		this.router.navigateByUrl('main/restaurants/mainMenuItem/'+this.id+'/restaurantMenuList/'+this.Menuid+'/' + parentOutlet.id);
  }

  onAssignTiming(menu : any, event : any): void
	{
		let dialogRef = this.dialog.open(TimingMenusDialogComponent, {autoFocus: false});
		let compInstance = dialogRef.componentInstance;
    compInstance.menuId = menu.id;
    compInstance.menuType = 'menu_items';
		dialogRef.afterClosed().subscribe(result => {
			if(result)
			{
				this.gerParentOutletsList(1);
			}
		});
		event.stopPropagation();
	}

	// onViewSubMenu(parentOutlet): void
	// {
	// 	let dialogRef = this.dialog.open(RestaurantsMenuDetailsComponent, {autoFocus: false});
	// 	let compInstance = dialogRef.componentInstance;
	// 	compInstance.Outlet = parentOutlet;
	// 	dialogRef.afterClosed().subscribe(result => {
	// 		if(result != 'cancel')
	// 		{
	// 			this.gerParentOutletsList(this.currentPage);
	// 		}
	// 	})
	// }
	onViewSubMenu(parentOutlet : any): void
	{
		localStorage.setItem('RestaurantSubMenu', JSON.stringify(parentOutlet));
		this.router.navigateByUrl('main/restaurants/mainMenuItem/'+this.id+'/restaurantMenuList/'+this.Menuid+'/Menu/' + parentOutlet.id);
  }

  changeMenuStatus(menu : any) {
    let method = 'updateMenuItem/' + menu.id;
    let data = {
      status: menu.slide ? '1': '0',
      parent_outlet_id: menu.parent_outlet_id,
      name: menu.name,
      name_ar: menu.name_ar,
      main_menu_item_id: menu.main_menu_item_id
    }
    this.mainApiService.postData(appConfig.base_url_slug + method, data, 2).then(response => {
      if (response.status == 200) {
      }
    })
  }
}