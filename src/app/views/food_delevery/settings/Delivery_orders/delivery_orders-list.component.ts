import { AppLoaderService } from './../../../../lib/app-loader/app-loader.service';
import { ExportCSVDialog } from './../../../../lib/export_csv';
import { Component, ElementRef, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription, Observable } from 'rxjs';
import { MainService, BaseLoaderService, PaginationService } from '../../../../services';
import { AlertDialog } from '../../../../lib';
import { MatDialog } from '@angular/material/dialog';
import { appConfig } from '../../../../../config';
import { UserAppSelectorService } from '../../../../lib/app-selector/app-selector.service';
import { DialogProgressOrderHistoryListComponent } from '../Dialog_Progress_Order_History';
import * as moment from 'moment';
import { AssignDriverComponent } from '../../../custom-dialogues/assign-driver/assign-driver.component';
import { csvHeaders } from '../../../../enums/csv_headers';
@Component({
  selector: 'app-delivery_orders',
  templateUrl: './delivery_orders-list.component.html',
  styleUrls: ['./delivery_order_list.scss']
})
export class DeliveryOrdersListComponent implements OnInit {
  orderby: any = '';
  isEditStatus = false;
  search: string;
  sub: Subscription = new Subscription();
  index: any = 1;
  totalPages: number = 1;
  pages: any;
  totalItems: any;
  currentPage: any = 1;
  searchTimer: any;
  perPage: any;
  orderStatus: any;
  orderId: any;
  requests: Promise<any>[] = [];
  primaryReasons: any[] = [];
  secondaryReasons: any[] = [];
  selectedPrimaryReason: any;
  selectedSecondaryReason: any;
  componentSettings: any = {
    name: null,
    paggination: null,
    search: null
  };
  appSelectorSubscription: Subscription;
  ParentOutlets: any;
  parentOutletsCount: any;
  RestaurantsParentOutlets: any = [];
  RestaurantsparentOutletsCount: any;
  type: any;
  codeGet: any = [];
  id: any;
  isUnAttended = false;
  addNotes: boolean = false;
  notes: string = '';
  notesEdit: any;
  isLoading: any;
  orderStatuses = ['outlet_preparing', 'outlet_dispatched', 'outlet_rejected', 'completed', 'ready_for_pickup', 'cancel_by_outlet'];
  start_date: any;
  end_date: any;
  parentId: any;
  per_page = '100';
  page = 1;
  loaderMessage = 'Please wait CSV file is preparing to download.';
  orderLength = 0;
  orders: any[] = [];
  isComplete: any;
  report: any;
  TotalRecords = 0;
  failedReqs: any[] = [];
  extraLength = 0;
  orderTypeSelected = '';
  pass: any;
  updateAll = false;
  driverType = null;
  currentDriver = null;
  statusLabel = '';
  driverLabel = '';
  selectedOrder: any;
  statusLoading = false;
  driverLoading = false;
  notesLoading = false;
  abc = localStorage.getItem('UrbanpointAdmin') as string;
  UpAdmin = JSON.parse(this.abc);


  constructor(protected router: Router,
    protected template: ElementRef,
    protected _route: ActivatedRoute,
    protected mainApiService: MainService,
    protected paginationService: PaginationService,
    protected dialogService: AppLoaderService,
    protected loaderService: BaseLoaderService, protected appSelectorService: UserAppSelectorService, protected dialog: MatDialog) {
    this.search = '';
    this.perPage = 20;
    this.appSelectorSubscription = this.appSelectorService.selectedApp.subscribe((response: any) => {
      this.gerParentOutletsList(1);
    });
  }

  ngOnDestroy(): void {
    this.appSelectorSubscription.unsubscribe();
  }
  onLocationBack(): void {
    window.history.back();
  }
  getOrder(orderby: any): void {
    console.log("orderby", orderby)
    this.gerParentOutletsList(orderby);
  }

  ngOnInit() {
    this.getNotes('primary');
    this.getNotes('secondary');
    this.checkForPushMsgUpdate();
    this.sub = this._route.params.subscribe(params => {
      this.id = params['ParentId'];
      console.log("ParentId in params", this.id)
      this.gerParentOutletsList(1);
    })
    let abcd = localStorage.getItem('componentSettings') as string;
    this.componentSettings = JSON.parse(abcd);
    if (this.componentSettings) {
      if (this.componentSettings.name != null && this.componentSettings.name == 'MainMenuItem') {
        this.currentPage = this.componentSettings.paggination;
        this.index = this.componentSettings.paggination;
        this.search = this.componentSettings.search;
      }
    }

  }

  onOrderLog(parentOutlet: any) {
    localStorage.setItem('OrderLog', JSON.stringify(parentOutlet));
    this.router.navigateByUrl('main/delivery_order/' + parentOutlet.id);
  }

  onSearchParentOutlet() {
    clearTimeout(this.searchTimer);
    this.searchTimer = setTimeout(() => {
      this.gerParentOutletsList(1);
    }, 700);
  }

  gerParentOutletsList(index: any, isLoaderHidden?: boolean, orderUpdate = '') {

    if (!this.selectedOrder) {
      this.loaderService.setLoading(true);
    }

    this._route.data.subscribe((d) => {
          if (d.isUnAttended) {
        this.isUnAttended = true;
        this.perPage = 500;
      }
      console.log(this.isUnAttended);
    });
    let url = '';
    if (this.orderby == '' && this.search == '') {
      url = 'getDeliveryOrders?page=' + index + '&per_page=' + this.perPage + '&sort_order=Desc';
      if (this.isUnAttended) {
        url = url + '&order_status=' + 'pending' + '&created_before_minutes=3';
      }
    }
    else {
      url = 'getDeliveryOrders?';

      let searchText = this.search;
      if (this.search.includes('&')) {
        searchText = this.search.replace("&", "%26");
      }

      if (this.orderby != '' && this.search == '') {
        url = url + 'order_status=' + this.orderby;
      }
      else if (this.orderby == '' && this.search != '') {
        url = url + 'order_id=' + searchText + '&page=' + index + '&per_page=' + this.perPage;
      }
      else {
        url = url + 'order_id=' + searchText + '&order_status=' + this.orderby + '&page=' + index + '&per_page=' + this.perPage;
      }

    }

    this.mainApiService.getList(appConfig.base_url_slug + url, false, 2)
      .then(result => {
        if (result.status == 200 && result.data) {
          this.RestaurantsParentOutlets = result.data;
          this.RestaurantsparentOutletsCount = result.pagination.count;

          if (this.selectedOrder) {
            this.selectedOrder = this.RestaurantsParentOutlets.find((obj: any) => obj.id == this.selectedOrder.id);
            this.openUpdateOrder(this.selectedOrder);

            if (orderUpdate == 'statusUpdate') {
              this.successPopUp('Order Status');
              this.statusLoading = false;
            }

            if (orderUpdate == 'driver') {
              this.successPopUp('Driver');
              this.driverLoading = false;
            }

            if (orderUpdate == 'notes') {
              this.successPopUp('Admin Notes');
              this.notesLoading = false;
            }
          }

          this.loaderService.orders.subscribe((arr) => {
            if ((arr != undefined || arr.length != 0) && this.isUnAttended) {
              this.RestaurantsParentOutlets = arr;
              this.addHoursToOrders(this.RestaurantsParentOutlets);
            }
          });
          this.addHoursToOrders(this.RestaurantsParentOutlets);
          console.log(this.RestaurantsParentOutlets);
          this.currentPage = index;
          this.pages = this.paginationService.setPagination(this.RestaurantsparentOutletsCount, index, this.perPage);
          this.totalPages = this.pages.totalPages;
          this.loaderService.setLoading(false);
        }
        else {
          this.RestaurantsParentOutlets = [];
          this.RestaurantsparentOutletsCount = 0;
          this.currentPage = 1;
          this.pages = this.paginationService.setPagination(this.RestaurantsparentOutletsCount, index, this.perPage);
          this.totalPages = this.pages.totalPages;
          this.loaderService.setLoading(false);
        }
      });
  }

  setPage(pageDate: any) {
    this.currentPage = pageDate.page;
    this.perPage = pageDate.perPage;
    this.index = this.currentPage;
    this.gerParentOutletsList(pageDate.page);
  }

  onEditRestaurantMenuid(parentOutlet: any) {
    localStorage.setItem('MainMenuItem', JSON.stringify(parentOutlet));
    this.router.navigateByUrl('main/Delivery_categories/' + parentOutlet.id);
  }

  onOrderHistoryDetail(code: any) {
    let dialogRef = this.dialog.open(DialogProgressOrderHistoryListComponent, { autoFocus: false });
    let cm = dialogRef.componentInstance;
    console.log('this.OrderDetails', code.id)
    cm.orderId = code.id;
  }

  addHoursToOrders(orders: any) {
    orders.forEach((element: any) => {
      if (element.order_logs.outlet_own_accepted) {
        element.order_logs.outlet_own_accepted.created_at = moment(element.order_logs.outlet_own_accepted.created_at).utc().add(3, 'hours').format('YYYY-MM-DD hh:mm:ss A');
      }
      if (element.order_logs.outlet_urbanpoint_accepted) {
        element.order_logs.outlet_urbanpoint_accepted.created_at = moment(element.order_logs.outlet_urbanpoint_accepted.created_at).utc().add(3, 'hours').format('YYYY-MM-DD hh:mm:ss A');
      }
      if (element.created_at) {
        element.created_at = moment(element.created_at).utc().add(3, 'hours').format('YYYY-MM-DD hh:mm:ss A');
      }
    });
  }

  openUpdateOrder(order: any) {
    window.scrollTo(0, 0);
    this.selectedOrder = order;
    this.updateAll = true;
    this.driverType = order.accepted_delivery;
    this.currentDriver = order.accepted_delivery;
    this.statusLabel = this.getOutletStatus(order);
    this.driverLabel = order.accepted_delivery ? order.accepted_delivery : 'n/a';
    // Update Status Code
    this.isEditStatus = true;
    this.orderId = order.id;
    this.orderTypeSelected = order.order_type;
    console.log(this.orderTypeSelected);
    this.orderStatus = this.orderStatuses.includes(order.status) ? order.status : null;

    // Add notes Code
    console.log(order);
    this.addNotes = true;
    this.notesEdit = order.cancellation_notes ? true : false;
    this.orderId = order.id;
    this.notes = order.cancellation_notes ? order.cancellation_notes : order.admin_notes ? order.admin_notes : '';
    this.selectedPrimaryReason = order.cancellation_reason;
    this.selectedSecondaryReason = order.cancellation_reason_2;

  }

  updateOrder() {
    this.isLoading = true;
    this.driverType = this.driverType == this.currentDriver ? null : this.driverType;
    let reason1 = this.selectedPrimaryReason;
    let reason2 = this.selectedSecondaryReason;
    let data = {
      cancellation_reason: reason1,
      cancellation_notes: this.notes,
      cancellation_reason_type: 'Primary',
      cancellation_reason_2: reason2,
      cancellation_reason_type_2: 'Secondary',
    };

    let method = `updateOrder/${this.orderId}/${this.driverType}?status=${this.orderStatus}`;
    this.mainApiService.postData(appConfig.base_url_slug + method, data, 2).then((res) => {
      if (res.status == 200) {
        this.back();
      }

      if (res.status == 412) {
        this.errorDialog(res);
      }

      if (res.status == 422) {
        this.errorDialog(res);
      }

      if (res.status == 500) {
        this.errorDialog(res);
      }

      if (res.status == 404) {
        this.errorDialog(res);
      }

      this.isLoading = false;

    })
      .catch((err) => {
        this.isLoading = false;
        let dialogRef = this.dialog.open(AlertDialog, { autoFocus: false });
        let cm = dialogRef.componentInstance;
        cm.type = 'error';
        cm.heading = 'Error';
        cm.message = err.message;
      })
  }

  errorDialog(err: any) {
    this.isLoading = false;
    let dialogRef = this.dialog.open(AlertDialog, { autoFocus: false });
    let cm = dialogRef.componentInstance;
    cm.type = 'error';
    cm.heading = 'Error';
    cm.message = err.message;
  }

  editStatus(order: any) {
    this.isEditStatus = true;
    this.orderId = order.id;
    this.orderTypeSelected = order.order_type;
    this.orderStatus = this.orderStatuses.includes(order.status) ? order.status : null;
  }

  updateOrderStatus() {
    this.statusLoading = true;
    let url = 'updateOrderStatus/' + this.orderId + '?status=' + this.orderStatus;
    this.mainApiService.getList(appConfig.base_url_slug + url, false, 2)
      .then(result => {
        if (result.status == 200) {
          this.gerParentOutletsList(this.currentPage, false, 'statusUpdate');
          this.getNumberOfOrders();
          // this.isEditStatus = false;
          this.orderStatus = null;
        } else {
          this.statusLoading = false;
        }
      });
  }

  back() {
    this.selectedOrder = null;
    this.isEditStatus = false;
    this.orderStatus = null
    this.clearNotesData();
    this.updateAll = false;
    this.gerParentOutletsList(1);
  }

  getNumberOfOrders() {
    let url = ''
    url = 'getDeliveryOrders?page=' + 1 + '&per_page=' + 500 + '&sort_order=Desc' + '&order_status=' + 'pending' + '&created_before_minutes=3';
    this.mainApiService.getList(appConfig.base_url_slug + url, false, 2)
      .then(result => {
        if (result.status == 200 && result.data) {
          this.loaderService.sendOrderCount(result.data.length);
        }
      });
  }

  openAssignDriver(order: any) {
    let dialogRef = this.dialog.open(AssignDriverComponent, { width: '56%', autoFocus: false, disableClose: false });
    let cm = dialogRef.componentInstance;
    cm.orderId = order.id;
    cm.driver_type = order.accepted_delivery;


    dialogRef.afterClosed().subscribe(result => {
      this.gerParentOutletsList(1);
      // this.playAudio();
      // sessionStorage.setItem('isAppStartedCMS', 'true');
    });
  }

  checkForPushMsgUpdate() {
    console.log('Fired');
    this.loaderService.pushMsgRefresh.subscribe((count) => {
      this.gerParentOutletsList(1);
    });
  }

  setPrimaryReason(reason: any, subReason = '') {
    this.selectedPrimaryReason = subReason ? reason + ' - ' + subReason : reason;
  }

  setSecondaryReason(reason: any, subReason = '') {
    this.selectedSecondaryReason = subReason ? reason + ' - ' + subReason : reason;;
  }


  getNotes(type: any) {
    let url = `getDeliveryOrdersCancellationReasons?type=${type}`;
    this.mainApiService.getList(appConfig.base_url_slug + url, false, 2).then((res) => {
      if (res.status == 200) {
        if (type == 'primary') {
          this.primaryReasons = res.data;
        } else {
          this.secondaryReasons = res.data;
        }
        console.log(res);
      }
    });
  }

  addNote(order: any) {
    console.log(order);
    this.addNotes = true;
    this.notesEdit = order.cancellation_notes ? true : false;
    this.orderId = order.id;
    this.notes = order.cancellation_notes ? order.cancellation_notes : order.admin_notes ? order.admin_notes : '';
    this.selectedPrimaryReason = order.cancellation_reason;
    this.selectedSecondaryReason = order.cancellation_reason_2;
  }

  addAdminNotes(): void {
    this.notesLoading = true;
    let reason1 = this.selectedPrimaryReason;
    let reason2 = this.selectedSecondaryReason;
    let data = {
      cancellation_reason: reason1,
      cancellation_notes: this.notes,
      cancellation_reason_type: 'Primary',
      cancellation_reason_2: reason2,
      cancellation_reason_type_2: 'Secondary',
    };
    let method = 'deliveryOrdersCancellationReason/' + this.orderId;
    this.mainApiService.postData(appConfig.base_url_slug + method, data, 2).then(response => {
      if (response.status == 200 || response.status == 201) {
        this.gerParentOutletsList(this.currentPage, false, 'notes');
        // this.clearNotesData();
        // this.gerParentOutletsList(1);
      } else {
        this.notesLoading = false;
      }
    });
  }

  clearReasons() {
    this.selectedPrimaryReason = null;
    this.selectedSecondaryReason = null;
  }

  clearNotesData() {
    this.addNotes = false;
    this.notesEdit = false;
    this.notes = '';
    this.selectedPrimaryReason = null;
    this.selectedSecondaryReason = null;
  }

  exportDeliveryReport() {
    let dialogRef = this.dialog.open(ExportCSVDialog, { autoFocus: false });
    dialogRef.componentInstance.deliveryExport = true;
    dialogRef.afterClosed().subscribe(result => {
      if (result != false && result != void 0) {
        this.start_date = result.start_date;
        this.end_date = result.end_date;
        this.parentId = result.data ? result.data.id : null;
        this.startExport();
      }
    });
  }

  startExport() {
    this.isLoading = true;
    this.isComplete = false;
    this.orderLength = 0;
    this.page = 1;
    this.orders = [];
    this.requests = [];
    this.failedReqs = [];
    this.extraLength = 0;
    console.log(this.orders);

    let url = `getDeliveryOrdersExport?start_date=${this.start_date}&ending_date=${this.end_date}&page=${this.page}&per_page=${this.per_page}`;

    if (this.parentId) {
      url += '&outlet_id=' + this.parentId;
    }

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
          } else {
            for (let i = 0; i < this.pages; i++) {
              url = `getDeliveryOrdersExport?start_date=${this.start_date}&ending_date=${this.end_date}&page=${this.page}&per_page=${this.per_page}`;
              this.requests.push(this.mainApiService.getList(appConfig.base_url_slug + url, false, 2));
              this.page += 1;
            }
            this.dialogService.setLoading(true);

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
                  let url = `deliveryOrdersExport?start_date=${this.start_date}&ending_date=${this.end_date}&page=${req.page}&per_page=${this.per_page}`;
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
        }
      });
  }


  collectOrderResponse(data: any, index: any, pages: any) {

    if (data.pagination.page == 1) {
      this.orders = data.orders;
    }

    if (data.pagination.page != 1) {
      this.orders = this.orders.concat(data.orders);
      this.orderLength = this.orders.length;
    }

    if (index + 1 == pages) {
      this.isLoading = false;
      this.dialogService.setLoading(false);
      this.createCSVReport(this.orders, this.report, ',', 'Delivery Report');
    }

  }

  createCSVReport(arrayData: any, report: any, delimiter: any, fileName: any) {

    let orderListHeaders = csvHeaders.deliveryOrders;
    //--CSV text initialzed--//
    let csv = '';
    //--Order Headings Added--//
    csv += orderListHeaders.join(delimiter) + '\n';
    arrayData.forEach((obj: any) => {

      Object.keys(obj).forEach((key) => {
        if (obj[key] == null) {
          obj[key] = '-';
        }
      })

      let row = [];
      let adminNotes = `"${obj.admin_notes}"`;
      let address = `"${obj.address}"`;

      //--- Check for null entries ---//
      let latitude = obj.latitude;
      let longitude = obj.longitude;
      obj.preparation_time = obj.preparation_time || '';
      obj.amount = obj.amount || '';
      obj.payment_method = obj.payment_method || '';

      let promotions = `"${obj.promotions}"`;
      let promotions_sxgy = `"${obj.promotions_sxgy}"`;

      row = [obj.order_month, obj.id, obj.order_date, obj.order_time, obj.outlet_parent_name, obj.outlet_parent_name, obj.outlet_name, obj.accepted_delivery, obj.fleet, obj.status,
      obj.order_type, obj.payment_method, obj.offer_type, obj.food_cost_before_discount, obj.sub_total, obj.savings_amount, obj.delivery_charges, obj.amount, obj.amount_after_discount,
      obj.contract_commission_standard, obj.contract_commission_up_driver, obj.contratually_agreed_delivery_charges, obj.credit_card_fee, obj.urbanpoint_commission, obj.charge_for_up_driver,
      obj.total_credit_cart_charges, obj.total_urbanpoint_charges, obj.merchant_earnings, obj.contract_merchant_driver_fee, obj.merchant_earnings_new, obj.Issue_Scenario_1,
      obj.Issue_Scenario_2, adminNotes, obj.successful, obj.Post_Scenario_Subtotal, obj.Post_Scenario_Savings, obj.Post_Scenario_Delivery_Fee_to_Customer, obj.Post_Scenario_Total_Amount,
      obj.Post_Scenario_Food_Cost_After_Discount, obj.Post_Scenario_Total_UP_Charges, obj.Post_Scenario_Merchant_Earnings, obj.Merchant_Negative_Adjustments, obj.Merchant_Positive_Adjustments,
      obj.Bee_Negative_Adjustments, obj.Bee_Positive_Adjustments, obj.Cash_Collected_By_Bee, obj.ref_id, obj.outlet_id, obj.user_id, obj.parents_id, promotions, promotions_sxgy,
      obj.driver_id, obj.delivery_status, obj.created_at, obj.phone, obj.email, obj.user_name, address, obj.user_latitude, obj.user_longitude, latitude, longitude];

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

  getOutletStatus(order: any) {

    switch (order.status) {
      case 'pending': {
        return 'Pending';
      }

      case 'outlet_preparing': {
        return 'Preparing';
      }

      case 'waiting': {
        return 'Bank Pending';
      }

      case 'created': {
        return 'Created';
      }

      case 'success': {
        return 'Paid';
      }

      case 'rejected_by_vista': {
        return 'Card Declined';
      }

      case 'cancelled_due_to_payment': {
        return 'Payment Unsuccessful';
      }

      case 'cancelled_payment_not_initiated': {
        return 'Payment Pending';
      }

      case 'cancel_due_to_timeout': {
        return 'Auto Cancelled';
      }

      case 'ready_for_pickup': {
        return 'Completed';
      }

      case 'outlet_urbanpoint_accepted': {
        return 'Accepted';
      }

      case 'outlet_own_accepted': {
        return 'Accepted';
      }

      case 'outlet_dispatched': {
        return 'Dispatched';
      }
      case 'outlet_rejected': {
        return 'Rejected'
      }

      case 'cancel_by_outlet': {
        return 'Cancelled'
      }

      case 'completed': {
        return 'Completed';
      }

      default: {
        return order.status;
      }
    }
  }

  getdriverType(order: any) {
    let driver = '';
    if (!order.bee_order_id && !order.majoor_order_id) {
      if (order.outlets) {
        driver = order.outlets.enable_delivery_for == 'majoor' ? '(Majoor)' :
          order.outlets.enable_delivery_for == 'bee_delivery' ? '(Bee)' : '';
      }
    } else {
      driver = order.bee_order_id ? '(Bee)' : '(Majoor)';
    }
    return driver;
  }

  assignDriver() {
    this.driverLoading = true;
    let url = `acceptOrder/${this.orderId}/${this.driverType}`;

    this.mainApiService.getList(appConfig.base_url_slug + url, true, 2)
      .then(result => {
        console.log(result);
        if (result.status == 200 && result.data) {
          this.gerParentOutletsList(this.currentPage, false, 'driver');
        }
        else if (result.status == 412) {
          this.isLoading = false;
          let dialogRef = this.dialog.open(AlertDialog, { autoFocus: false });
          let cm = dialogRef.componentInstance;
          cm.heading = 'Error';
          cm.message = 'Driver has already been assigned';
          cm.cancelButtonText = 'Ok';
          cm.type = 'error';
          this.driverLoading = false;
        }
        else {
          this.errorPopUp(result.error.message);
          this.driverLoading = false;
        }
        this.isLoading = false;
      });
  }

  successPopUp(text: any) {
    let dialogRef = this.dialog.open(AlertDialog, { autoFocus: false });
    let cm = dialogRef.componentInstance;
    cm.heading = 'Success';
    cm.message = `${text} Updated Successfully`;
    cm.cancelButtonText = 'Okay';
    cm.type = 'success';
  }

  errorPopUp(msg: any) {
    let dialogRef = this.dialog.open(AlertDialog, { autoFocus: false });
    let cm = dialogRef.componentInstance;
    cm.heading = 'Error';
    cm.message = msg;
    cm.cancelButtonText = 'Okay';
    cm.type = 'error';
  }

  // startBuzzerCalls() {
  //   setTimeout(() =>
  //   {
  //     let dialogRef = this.dialog.open(AlertDialog, { autoFocus: false, disableClose: true });
  //     let cm = dialogRef.componentInstance;
  //     cm.heading = 'logo';
  //     cm.message = 'Please click <span class="bold-text">OK</span> to confirm that you are ready to receive orders from Urban Point';
  //     cm.cancelButtonText = 'Ok';
  //     cm.type = 'info';
  //     dialogRef.afterClosed().subscribe(result =>
  //     {
  //       this.playAudio();
  //       sessionStorage.setItem('isAppStartedCMS', 'true');
  //     });
  //   }, 1000);
  // }

  // initiateAudio() {
  //   this.audio.load();
  //   this.audio.play();
  //   this.audio.muted = true;
  //   // this.audio.loop = true;
  // }

  // playAudioFor30Seconds() {
  //   this.audio.muted = false;
  // 	this.audio.load();
  // 	this.audio.play();
  // }

  // stopAudio() {
  //   this.audio.muted = true;
  // }

}
