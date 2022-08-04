import { AppLoaderService } from './../../lib/app-loader/app-loader.service';
import { ViewCodesComponent } from './../access_codes/view_codes.dialog';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { Subscription, Observable } from 'rxjs';
import { appConfig } from '../../../config';
import { AlertDialog } from '../../lib';
import { MainService, BaseLoaderService } from '../../services';

@Component({
  selector: 'app-merchant-report',
  templateUrl: './merchant-report.component.html',
  styleUrls: ['./merchant-report.component.css']
})
export class MerchantReportComponent implements OnInit {

  sub: Subscription = new Subscription();
  Form: FormGroup;
  selection: any;
  isLoading: boolean;
  isEditing: boolean;
  merchantccount: any;
  Merchants: any[] = [];
  Parents: any;
  filteredParentOptions: Observable<string[]> = new Observable();
  filteredParentOptionsOne: Observable<string[]> = new Observable();
  parentId: any = [];
  parentIdOne: any = [];
  Outlets: any;
  outletAccount: any = [];
  ParentsOutlet: any;
  parentOutletId: any;
  parentid: any;
  searchData: any = null;
  data: any = [];
  searchTimer: any;
  search: string;
  parentsList: any;
  currentDate = new Date();
  StartDate: any;
  EndDate: any;
  displayDateStart: any;
  displayDateEnd: any;
  TotalRecords = 0;
  isComplete: any;
  orders: any[] = [];
  per_page = '100';
  page = 1;
  report: any;
  loaderMessage = 'Please wait CSV file is preparing to download.';
  fileName: any;
  pages: any;
  orderLength = 0;
  constructor(protected router: Router,
    protected _route: ActivatedRoute,
    protected mainApiService: MainService,
    protected formbuilder: FormBuilder, protected dialogService: AppLoaderService, protected loaderService: BaseLoaderService, protected dialog: MatDialog) {
    this.Form = this.formbuilder.group({
      outlets_parent_id: [''],
      outlets_parent_name: ['', Validators.required],
      from_date: ['', Validators.required],
      to_date: ['', Validators.required],
      // outlets_parent_name: ['Select Restaurant'],
      outlet_id: [''],

    });
    this.search = '';
    this.isLoading = false;
    this.isEditing = false;

    this.Parents = [];
    this.ParentsOutlet = [];


  }

  ngOnInit() {
    // this.dialogService.setLoading(true);
  }

  getValue(name: any) {
    return this.Form.get(name);
  }

  onLocationBack(): void {
    window.history.back();
  }

  // doSubmit(): void
  // {
  // 	this.isLoading = true;
  // 	let method = '';

  // 	this.mainApiService.postData(appConfig.base_url_slug + method, this.Form.value, 2).then(response =>
  // 	{
  // 		if (response.status == 200 || response.status == 201)
  // 		{
  // 			this.router.navigateByUrl('/main/outlet_account');
  // 			this.isLoading = false;
  // 		}
  // 		else
  // 		{
  // 			this.isLoading = false;
  // 			let dialogRef = this.dialog.open(AlertDialog, { autoFocus: false });
  // 			let cm = dialogRef.componentInstance;
  // 			cm.heading = 'Error';
  // 			cm.message = response.error.message;
  // 			cm.cancelButtonText = 'Ok';
  // 			cm.type = 'error';
  // 		}
  // 	},
  // 		Error =>
  // 		{
  // 			// log here(Error)
  // 			this.isLoading = false;
  // 			let dialogRef = this.dialog.open(AlertDialog, { autoFocus: false });
  // 			let cm = dialogRef.componentInstance;
  // 			cm.heading = 'Error';
  // 			cm.message = "Internal Server Error.";
  // 			cm.cancelButtonText = 'Ok';
  // 			cm.type = 'error';
  // 		})
  // }


  startExport() {
    this.isLoading = true;
    this.isComplete = false;
    this.orderLength = 0;
    this.page = 1;
    this.orders = [];

    let url = `merchantReport?per_page=${this.per_page}&page=${this.page}&parents_id=${this.getValue('outlets_parent_id')?.value}&start_date=${this.getValue('from_date')?.value}&ending_date=${this.getValue('to_date')?.value}`;
    if (this.selection == 'outlet') {
      url += `&outlet_id=${this.getValue('outlet_id')?.value}`;
    }

    this.mainApiService.getList(appConfig.base_url_slug + url, false, 2)
      .then(result => {
        if (result.status == 200 && result.data) {
          let data = result.data;
          this.pages = data.pagination.pages;
          this.report = data.report;
          this.TotalRecords = data.pagination.count;
          if (data.pagination.pages != 0 || data.pagination.pages != 1) {
            this.exportCSVReport();
          } else {
            this.orders = data.orders;
            this.createCSVReport(this.orders, this.report, ',', this.fileName);
          }
        }
      });
  }

  exportCSVReport(): void {

    if (this.page == 1) {
      this.dialogService.setLoading(true);
    }

    //---New---//

    for (let i = 0; i < this.pages; i++) {
      console.log('RAN');
      let url = `merchantReport?per_page=${this.per_page}&page=${i + 1}&parents_id=${this.getValue('outlets_parent_id')?.value}&start_date=${this.getValue('from_date')?.value}&ending_date=${this.getValue('to_date')?.value}`;

      if (this.selection == 'outlet') {
        url += `&outlet_id=${this.getValue('outlet_id')?.value}`;
      }

      this.fileName = this.selection == 'brand' ? 'Brand Report' : 'Outlet Report';
      this.mainApiService.getList(appConfig.base_url_slug + url, false, 2)
        .then(result => {
          if (result.status == 200 && result.data) {
            let data = result.data;
            if (this.page == 1) {
              this.orders = data.orders;
            }
            this.collectOrderResponse(data);
          }
        });
    }

  }

  collectOrderResponse(data: any) {

    if (this.page != 1) {
      this.orders = this.orders.concat(data.orders);
      this.orderLength = this.orders.length;
    }
    this.page += 1;
    if (this.orders.length == data.pagination.count) {
      this.isLoading = false;
      this.dialogService.setLoading(false);
      this.createCSVReport(this.orders, this.report, ',', this.fileName);
    }

  }

  check() {
    if (this.selection == 'brand') {
      this.Form.get('outlet_id')?.setErrors(null);
    }
  }

  selectEvent(item: any) {
    console.log('selectEvent', item);
    if (item) {
      this.Form.get('outlets_parent_id')?.setValue(item.id);
      this.getOutletsList(item.id);
    }
  }

  onCleared(item: any) {
    console.log('onCleared', item);
    this.Form.get('outlets_parent_id')?.setValue(null);
  }

  onChangeSearch(val: string) {
    var url = "getParents?search=" + val + '&per_page=500';

    clearTimeout(this.searchTimer);
    this.searchTimer = setTimeout(() => {
      this.mainApiService.getList(appConfig.base_url_slug + url).then(response => {
        console.log('onChangeSearch', response);

        this.parentsList = response.data.parents;
      })
    }, 700);
  }

  getOutletsList(id: any): void {
    let url = 'getOutlets?delivery_status=1&index2=500&parent_id=' + id;

    this.mainApiService.getList(appConfig.base_url_slug + url)
      .then(result => {
        if (result.status == 200 && result.data) {
          this.ParentsOutlet = result.data.outlets;
          console.log(result);
        }
        else {
          this.ParentsOutlet = [];
        }
      });
  }

  onStartDate(): void {
    let startDate = moment(this.StartDate).format('YYYY-MM-DD');
    this.Form.get('from_date')?.setValue(startDate);
    this.displayDateStart = moment(this.StartDate).format('D-MMM-YY');
  }

  onEndDate(): void {
    let endDate = moment(this.EndDate).format('YYYY-MM-DD');
    this.Form.get('to_date')?.setValue(endDate);
    this.displayDateEnd = moment(this.EndDate).format('D-MMM-YY');
  }

  createCSVReport(arrayData: any, report: any, delimiter: any, fileName: any) {

    console.log(report);

    let orderListHeaders = ["Order Date", "Order Name", "Customer Name", "Item List", "Order Total", "Delivered By", "Payment Method", "Order Placed", "Order Accepted"];
    let orderStatsHeaders = ["Orders", "", "", "Delivery", "", "", "Pickup or Dinein", "", "", "Payments"];
    let chargesSummaryHeaders = ["Contractually Agreed Charges", "", "", "Charges Summary", "", "", "Settlement"];
    let orderStatCount = report.orders.count;
    let orderStatAmount = report.orders.amount;
    let charges = report.charges;
    let rates = report.rates;

    //--Report 1 heading--//
    let report1 = 'Report 1 - Settlement Report' + '\n\n';
    let csv = report1;

    //--Dates--//
    let dates = 'From Date, ' + this.displayDateStart + '\n' + 'To Date, ' + this.displayDateEnd + '\n\n'
    csv += dates;

    //--Order Stats Headings--//
    let orderstats = orderStatsHeaders.join(delimiter) + '\n';
    csv += orderstats;

    //--Order Stats Content--//

    let statsContent = 'Total number of Orders, ' + report.orders_count + ', ,' + 'Total Deliveries, ' + report.orders_count + ', ,' + 'Total , ' + report.orders_count + ', ,' + 'Total Payments, ' + report.orders_amount + '\n'
      + 'Orders paid by Cash, ' + orderStatCount.by_cash + ', ,' + 'Urban Point Driver, ' + orderStatCount.by_urbanpoint + ', ,' + 'Pickup, ' + report.orders_count + ', ,' + 'Total Cash Payments, ' + orderStatAmount.by_cash + '\n'
      + 'Orders paid within app, ' + orderStatCount.by_card + ', ,' + 'Outlet Driver, ' + orderStatCount.by_outlet + ', ,' + 'Dine-in,   -' + ', ,' + 'Total In-app Payments, ' + orderStatAmount.by_card + '\n'
      + 'Orders Cancelled by Restaurant, ' + orderStatCount.rejected_by_outlet + '\n' + 'Orders Cancelled by Customer, ' + orderStatCount.cancelled_by_user + '\n\n';
    csv += statsContent;

    //--Summary Heading--//
    let summaryHeading = chargesSummaryHeaders.join(delimiter) + '\n';
    csv += summaryHeading;

    //--Summary Content--//

    let summaryContent = 'Commision, ' + rates.commission + '%' + ', ,' + 'Total Credit Card Charges, ' + charges.credit_card_fee + ' %, ,' + 'Urban Point Share, ' + report.urbanpoint_share + '\n'
      + 'Delivery Charge, ' + rates.delivery_charges + 'QAR' + ', ,' + 'Total Delivery Charges, ' + charges.delivery_charges + ', ,' + 'Outlet Share, ' + report.outlet_share + '\n'
      + 'Credit Card Fees, ' + rates.credit_card_fee + '%' + '\n' + 'TOTAL COMMISION, ' + charges.commission + ' %' + '\n'
      + 'Taxes, ' + rates.taxes + '\n' + 'Total Taxes, ' + charges.taxes + '\n'
      + ', , ,' + 'Total Charges, ' + report.total_charges + '\n\n';
    csv += summaryContent;

    //--Report 2 heading--//
    let report2 = 'Report 2 - Sales Report' + '\n\n';
    csv += report2;

    //--Order List--//
    let orderheader = orderListHeaders.join(delimiter) + '\n';
    csv += orderheader;

    arrayData.forEach((obj: any) => {
      let row = [];
      let itemString = "";
      if (obj.order_items.menu_items.length != 0) {
        let items = obj.order_items.menu_items;
        items.forEach((item: any) => {
          if (item.avail_free) {
            itemString += item.avail_free.main_menu_items[0].name + ',';;
            if (item.avail_free.main_menu_items[0].sub_menu.length != 0) {
              let subMenu = item.avail_free.main_menu_items[0].sub_menu[0];
              subMenu.sub_menu_items.forEach((subMenuItem: any) => {
                itemString += subMenuItem.name + ',';
              });
            }
          }
          if (item.purchased) {
            itemString += item.purchased.main_menu_items[0].name + ',';
            if (item.purchased.main_menu_items[0].sub_menu.length != 0) {
              let subMenu = item.purchased.main_menu_items[0].sub_menu[0];
              subMenu.sub_menu_items.forEach((subMenuItem: any) => {
                itemString += subMenuItem.name + ',';;
              });
            }
          }
        });
      }

      if (obj.order_items.promotions.length != 0) {
        let promotions = obj.order_items.promotions;
        promotions.forEach((item: any) => {
          if (item.avail_free) {
            itemString += item.avail_free.main_menu_items[0].name + ',';
            if (item.avail_free.main_menu_items[0].sub_menu.length != 0) {
              let subMenu = item.avail_free.main_menu_items[0].sub_menu[0];
              subMenu.sub_menu_items.forEach((subMenuItem: any) => {
                itemString += subMenuItem.name + ',';
              });
            }
          }
          if (item.purchased) {
            itemString += item.purchased.main_menu_items[0].name + ',';
            if (item.purchased.main_menu_items[0].sub_menu.length != 0) {
              let subMenu = item.purchased.main_menu_items[0].sub_menu[0];
              subMenu.sub_menu_item.forEach((subMenuItem: any) => {
                itemString += subMenuItem.name + ',';
              });
            }
          }
        });
      }

      let str = `"${itemString}"`;
      row = [obj.created_at, obj.id, obj.user_name, str, obj.sub_total, obj.accepted_delivery, obj.payment_method, obj.created_at, obj.delivery_status];
      csv += row.join(delimiter) + "\n";
    });
    //--Order List End--//

    let csvData = new Blob([csv], { type: 'text/csv' });
    let csvUrl = URL.createObjectURL(csvData);

    let hiddenElement = document.createElement('a');
    hiddenElement.href = csvUrl;
    hiddenElement.target = '_blank';
    hiddenElement.download = fileName + '.csv';
    hiddenElement.click();
  }
}