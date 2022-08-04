import { AlertDialog } from './../../lib/alert.dialog';
import { PaginationService } from './../../services/pagination.service';
import { MainService } from './../../services/main.service';
import { AppLoaderService } from './../../lib/app-loader/app-loader.service';
import { Component, OnInit } from '@angular/core';
import { appConfig } from '../../../config';
import { MatDialog } from '@angular/material/dialog';
import * as moment from 'moment';

@Component({
  selector: 'app-delivery-kill-switch-logs',
  templateUrl: './delivery-kill-switch-logs.component.html',
  styleUrls: ['./delivery-kill-switch-logs.component.css']
})
export class DeliveryKillSwitchLogsComponent implements OnInit {

  killswitchLogs: any[] = [];
  killswitchLogsCount = 0;
  perPage = 20;
  page = 1;
  currentPage = 1;
  pages: any;
  totalPages = 0;
  index = 0;
  TotalRecords = 0;
  orderLength = 0;
  selectedTab = 'kill_switch';
  loaderMessage = 'Please wait CSV file is preparing to download.';

  per_page = '100';
  orders: any[] = [];
  isComplete: any;
  report: any;
  failedReqs: any[] = [];
  requests: any[] = [];
  extraLength = 0;
  isLoading: any;


  constructor(private loaderService: AppLoaderService, private mainApiService: MainService, private paginationService: PaginationService, protected dialog: MatDialog) { }

  ngOnInit() {
    this.getKillSwitchLogs(1, 'kill_switch');
  }

  back() {
    window.history.back();
  }

  getKillSwitchLogs(index = 1, type: any) {
    // this.loaderService.setLoading(true);
    let url = 'killSwitchLogs?page=' + index + '&per_page=' + this.perPage + '&type=' + type;

    this.mainApiService.getList(appConfig.base_url_slug + url, false, 2)
      .then(result => {
        if (result.status == 200 && result.data) {
          this.killswitchLogs = result.data.logs;
          console.log(this.killswitchLogs);

          this.killswitchLogsCount = result.data.pagination.count;
          this.currentPage = index;
          this.pages = this.paginationService.setPagination(this.killswitchLogsCount, index, this.perPage);
          this.totalPages = this.pages.totalPages;
          this.loaderService.setLoading(false);
        }
        else {
          this.killswitchLogs = [];
          this.killswitchLogsCount = 0;
          this.currentPage = 1;
          this.pages = this.paginationService.setPagination(this.killswitchLogsCount, index, this.perPage);
          this.totalPages = this.pages.totalPages;
          this.loaderService.setLoading(false);
        }
      });
  }

  tabClick(event: any) {
    console.log(event);
    switch (event.index) {
      case 0:
        this.getKillSwitchLogs(1, 'kill_switch');
        this.selectedTab = 'kill_switch';
        break;

      case 1:
        this.getKillSwitchLogs(1, 'bee_delivery_kill_switch');
        this.selectedTab = 'bee_delivery_kill_switch';
        break;

      case 2:
        this.getKillSwitchLogs(1, 'majoor_kill_switch');
        this.selectedTab = 'majoor_kill_switch';
        break;

      default:
        break;
    }
  }

  startExport(log: any) {
    this.isLoading = true;
    this.isComplete = false;
    this.orderLength = 0;
    this.page = 1;
    this.orders = [];
    this.requests = [];
    this.failedReqs = [];
    this.extraLength = 0;
    console.log(this.orders);

    let url = `userAttempsExport?log_id=${log.id}&page=${this.page}&per_page=${this.per_page}`;

    // if (this.parentId) {
    //   url += '&outlet_id=' + this.parentId;
    // }

    this.mainApiService.getList(appConfig.base_url_slug + url, false, 2)
      .then(result => {
        if (result.status == 200 && result.data) {

          console.log(result);
          let data = result.data;
          this.pages = data.pagination.pages;
          this.report = data.report;
          this.TotalRecords = data.pagination.count;


          if (this.TotalRecords == 0) {
            let dialogRef = this.dialog.open(AlertDialog, { autoFocus: false });
            let cm = dialogRef.componentInstance;
            cm.heading = 'Export CSV';
            cm.message = 'No records found.';
            cm.cancelButtonText = 'Ok';
            cm.type = 'error';
            return;
          }

          if (this.pages = 1) {
            this.loaderService.setLoading(true);
            this.exportCsv(result.data.user_attempts);
            return;
          }

          for (let i = 0; i < this.pages; i++) {
            url = `userAttempsExport?log_id=${log.id}&page=${this.page}&per_page=${this.per_page}`;
            this.requests.push(this.mainApiService.getList(appConfig.base_url_slug + url, false, 2));
            this.page += 1;
          }
          this.loaderService.setLoading(true);

          Promise.all(this.requests).then(result => {
            console.log('THIS =>', result);
            result.forEach((res, i) => {
              if (res.status == 502) {
                res['page'] = i + 1;
                this.failedReqs.push(res);
              }
            });
            if (this.failedReqs.length != 0) {
              this.failedReqs.forEach((req, index) => {
                let url = `userAttempsExport?log_id=${log.id}&page=${req.page}&per_page=${this.per_page}`;
                this.mainApiService.getList(appConfig.base_url_slug + url, false, 2).then((res) => {
                  if (res.status == 200) {
                    result.push(res);
                    console.log('NOW THIS =>', result);
                    if (this.failedReqs.length == index + 1) {
                      result.forEach((res, i) => {
                        if (res.status == 200) {
                          this.extraLength = result.length;
                          this.collectOrderResponse(res.data, i, this.extraLength);
                        }
                      });
                    }
                  }
                });
              });
            } else {
              result.forEach((res, i) => {
                if (res.status == 200) {
                  this.collectOrderResponse(res.data, i, data.pagination.pages);
                }
              });
            }
          });
        }
      });
  }


  collectOrderResponse(data: any, index: any, pages: any) {

    if (data.pagination.page == 1) {
      this.orders = data.user_attempts;
    }

    if (data.pagination.page != 1) {
      this.orders = this.orders.concat(data.orders);
      this.orderLength = this.orders.length;
    }

    if (index + 1 == pages) {
      this.isLoading = false;
      this.loaderService.setLoading(false);
      // this.createCSVReport(this.orders,this.report,',','Delivery Report');
      this.exportCsv(this.orders);
    }

  }

  exportUsers(id: any) {
    let url = 'userAttempsExport?log_id=' + id;
    this.mainApiService.getList(appConfig.base_url_slug + url, false, 2)
      .then(result => {
        if (result.status == 200 && result.data) {
          // this.killswitchLogs = result.data.logs;
          this.exportCsv(result.data.user_attempts);
        }
      });
  }

  exportCsv(arr: any) {

    let header: any = Object.keys(arr[0]);
    header = [...header, 'Enabled_date', 'Enabled_Time'];

    //--CSV text initialzed--//
    let csv = '';
    let typeIndex: any;

    //-- Headings Added--//
    arr.forEach((obj: any) => {

      obj['Enabled_date'] = moment(obj.created_at).format('L');
      obj['Enabled_Time'] = moment(obj.created_at).format('LT');

      Object.keys(obj).forEach((key, i) => {
        if (obj[key] == null) {
          obj[key] = '-';
        }

        if (key == 'outlet_name') {
          obj[key] = `"${obj['outlet_name']}"`;
        }

        if (key == 'type') {
          typeIndex = i;
          obj[key] = obj[key] == 'kill_switch' ? 'UrbanPoint' : obj[key] == 'bee_delivery_kill_sw' ? 'Bee' : 'Majoor';
        }

        if (key == 'outlets' || key == 'id' || key == 'updated_at' || key == 'created_at' || key == 'kill_switch_log_id') {
          delete obj[key];
        }
      });
    });

    header[typeIndex] = 'Killswitch_type';
    header.splice(header.indexOf('id'), 1);
    header.splice(header.indexOf('outlets'), 1);
    header.splice(header.indexOf('created_at'), 1);
    header.splice(header.indexOf('updated_at'), 1);
    header.splice(header.indexOf('kill_switch_log_id'), 1);
    csv += header.join(',') + '\n';


    //-- Printing Rows -- //
    arr.forEach((element: any) => {
      csv += Object.values(element).join(',') + "\n";
    });

    //--Printing End--//

    let csvData = new Blob([csv], { type: 'text/csv' });
    let csvUrl = URL.createObjectURL(csvData);

    let hiddenElement = document.createElement('a');
    hiddenElement.href = csvUrl;
    hiddenElement.target = '_blank';
    hiddenElement.download = 'UsersAttempt' + '.csv';
    hiddenElement.click();
    this.loaderService.setLoading(false);
  }
  setPage(pageDate: any) {
    this.currentPage = pageDate.page;
    this.perPage = pageDate.perPage;
    this.index = this.currentPage;
    this.getKillSwitchLogs(pageDate.page, this.selectedTab);
  }
}