
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AlertDialog } from 'src/app/lib';
import { AppLoaderService } from 'src/app/lib/app-loader/app-loader.service';
import { UserAppSelectorService } from 'src/app/lib/app-selector/app-selector.service';
import { ExportCSVComponent } from 'src/app/lib/export_csv.component';
import { BaseLoaderService, MainService, PaginationService } from 'src/app/services';
import { appConfig } from 'src/config';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styles: ['']
})
export class TransactionsComponent extends ExportCSVComponent implements OnInit, OnDestroy {

  tranactionList: any;
  baseSlug : any;
  index: any = 1;
  totalPages: number = 1;
  pages: any;
  totalItems: any;
  perPage: number;
  tranactionCount: any;
  currentPage: any = 1;
  componentSettings: any;
  userApp: any;
  method: any;
  search:any;
  searchTimer: any;
  orderBy: any
  appSelectorSubscription: Subscription;

  constructor(protected mainServices: MainService,protected dialog: MatDialog,protected router: Router,
     protected appLoaderService: AppLoaderService,protected loaderService: BaseLoaderService,
     protected paginationService: PaginationService,protected appSelectorService: UserAppSelectorService) {

    super(mainServices,appLoaderService,dialog);

    this.tranactionList = [];
    this.baseSlug = appConfig.base_url_slug;
    this.search = '';
    this.perPage = 20;
    // this.orderBy = 'ASC'

    this.componentSettings = {
      name: null,
      paggination: null,
      search: null
    }

    this.appSelectorSubscription = this.appSelectorService.selectedApp.subscribe((response: any)=>{
      this.userApp = response.user_app_id;
      this.getTransactionList(1);
    })

   }



   ngOnDestroy(): void {
		this.appSelectorSubscription.unsubscribe();
	}


  ngOnInit(): void {
    this.userApp = this.mainServices.user_app.user_app_id.toString();
    let abc = localStorage.getItem('componentSettings') as string;
    this.componentSettings = JSON.parse(abc);
    if(this.componentSettings)
    {
      if(this.componentSettings.name !== null && this.componentSettings.name == 'transaction')
      {
        this.currentPage = this.componentSettings.paggination;
        this.index = this.componentSettings.paggination;
        this.search = this.componentSettings.search;
      }
    }

    this.method = 'userWalletLogs';
    this.UrlVersion= 2;
    this.getTransactionList(this.currentPage);
  }


  onSearch()
  {
    clearTimeout(this.searchTimer);
    this.searchTimer = setTimeout(() => {
      this.getTransactionList(1);
    }, 800);
  }

  getTransactionList(index:any, isLoaderHidden?:boolean)
  {

    if(isLoaderHidden)
    {
      this.loaderService.setLoading(false);
    }
    else{
      this.loaderService.setLoading(true);
    }

    console.log(index);
   let  url = this.baseSlug +  'userWalletLogs?page=' + index + '&per_page=' + this.perPage;

   if(this.search != '')
   {
    url = url + '&search=' + this.search;
   }

   localStorage.setItem('componentSettings', JSON.stringify(
    {
      name: 'transaction',
      paggination: this.index,
      search: this.search
    }
  ));

    this.mainServices.getList(url,false,2).then(result =>{

      if(result.status == 200)
      {
        this.tranactionList = result.data;
        this.currentPage = index;
        this.tranactionCount = result.pagination?.count;
        console.log(this.tranactionCount);
        this.pages = this.paginationService.setPagination(this.tranactionCount,index,this.perPage);
        console.log(this.pages);
        this.totalPages = this.pages.totalPages;
        console.log(this.totalPages);
        this.loaderService.setLoading(false);
      }
      else{
        this.tranactionList = [];
        this.tranactionCount = 0;
        this.currentPage = 1;
        this.pages = this.paginationService.setPagination(this.tranactionCount,index, this.perPage);
        this.loaderService.setLoading(false);
        let dialogRef= this.dialog.open(AlertDialog,{autoFocus:false});
        let componentInstance = dialogRef.componentInstance;
        componentInstance.heading = "ALERT!";
        componentInstance.message = "No Data FOUND";
        componentInstance.cancelButtonText = 'OK';
        componentInstance.type = 'ask';
      }

    });
  }


  setPage(paging:any)
  {
    this.currentPage = paging.page,
    this.perPage = paging.perPage,
    this.index = this.currentPage,
    this.getTransactionList(paging.page);
  }
}
