import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import * as moment from 'moment';

import { MainService, BaseLoaderService, PaginationService } from '../../services';
import { AppLoaderService } from '../../lib/app-loader/app-loader.service';
import { ExportCSVComponent } from '../../lib/export_csv.component';
import { appConfig } from '../../../config';
import { UserAppSelectorService } from '../../lib/app-selector/app-selector.service';

@Component({
  selector: 'app-ooredo-billing',
  templateUrl: './ooredo-billing.component.html',
  styleUrls: ['./ooredo-billing.component.css']
})


export class OoredoBillingComponent extends ExportCSVComponent implements OnInit {
  search: string;
  index: any = 1;
  totalPages: number = 1;
  pages: any;
  totalItems: any;
  currentPage: any = 1;
  perPage: any;
  componentSettings: any = {
    name: null,
    paggination: null,
    search: null
  };
  searchTimer: any;
  BilingCustomers: any;
  bilingCustomersCount: any;
  appSelectorSubscription: Subscription;
  StartDate: any;
  data: any;
  currentDate: Date = new Date();
  minDate: Date = new Date('2014-01-01');

  constructor(protected router: Router,
    protected _route: ActivatedRoute,
    protected mainApiService: MainService,
    protected paginationService: PaginationService,
    protected loaderService: BaseLoaderService, protected appLoaderService: AppLoaderService, protected appSelectorService: UserAppSelectorService, protected dialog: MatDialog) {
    super(mainApiService, appLoaderService, dialog);
    this.method = 'getBillingOredoo';
    this.BilingCustomers = [];
    this.search = '';
    this.perPage = 20;

    this.isNeededDate = false;
    this.isOnlyMonth = true;

    this.appSelectorSubscription = this.appSelectorService.selectedApp.subscribe((response: any) => {
      this.getBilingCustomers(1);
    });
  }

  ngOnDestroy(): void {
    this.appSelectorSubscription.unsubscribe();
  }

  ngOnInit() {
    let abc = localStorage.getItem('componentSettings') as string;
    this.componentSettings = JSON.parse(abc);
    if (this.componentSettings) {
      if (this.componentSettings.name != null && this.componentSettings.name == 'BilingCustomers') {
        this.currentPage = this.componentSettings.paggination;
        this.index = this.componentSettings.paggination;
        this.search = this.componentSettings.search;
      }
    }

    this.getBilingCustomers(1);
  }

  onSearchCustomer(): void {
    clearTimeout(this.searchTimer);
    this.searchTimer = setTimeout(() => {
      this.getBilingCustomers(1);
    }, 800);

  }

  getBilingCustomers(index: any, isLoaderHidden?: boolean): void {

    this.loaderService.setLoading(true);
    let url: any = '';

    url = 'getOoredooBillingReport?from_date=2017-12-2403:50:00&to_date=2018-12-24 03:50:00&index=' + index + '&index2=' + this.perPage;

    if (this.search != '') {
      url = url + '&search=' + this.search;
    }

    localStorage.setItem('componentSettings', JSON.stringify(
      {
        name: 'Customers',
        paggination: this.index,
        search: this.search
      }
    ));

    this.mainApiService.getList(appConfig.base_url_slug + url)
      .then(result => {
        if (result.status == 200 && result.data) {
          let users = result.data.data;
          this.bilingCustomersCount = result.data.count;
          this.currentPage = index;
          this.pages = this.paginationService.setPagination(this.bilingCustomersCount, index, this.perPage);
          this.totalPages = this.pages.totalPages;
          this.BilingCustomers = users;
          // console.log("users",this.BilingCustomers)

          this.loaderService.setLoading(false);
        }
        else {
          this.BilingCustomers = [];
          this.bilingCustomersCount = 0;
          this.currentPage = 1;
          this.pages = this.paginationService.setPagination(this.bilingCustomersCount, index, this.perPage);
          this.totalPages = this.pages.totalPages;
          this.loaderService.setLoading(false);
        }
      });
  }

  setPage(pageDate: any) {
    this.currentPage = pageDate.page;
    this.perPage = pageDate.perPage;
    this.index = this.currentPage;
    this.getBilingCustomers(pageDate.page);
  }

  onStartDate() {
    //console.log(this.StartDate);
    let start = moment(this.StartDate[0]).format('YYYY-MM-DD');
    localStorage.setItem('from_date', JSON.stringify(start));

    let end = moment(this.StartDate[1]).format('YYYY-MM-DD');
    localStorage.setItem('to_date', JSON.stringify(end));
  }
}