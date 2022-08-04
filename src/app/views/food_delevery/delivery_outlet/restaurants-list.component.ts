import { ExportCSVDialog } from './../../../lib/export_csv';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { MainService, BaseLoaderService, PaginationService } from '../../../services';
import { AlertDialog } from '../../../lib';
import { MatDialog } from '@angular/material/dialog';
import { appConfig } from '../../../../config';
import { UserAppSelectorService } from '../../../lib/app-selector/app-selector.service';
import jsPDF from 'jspdf';
import * as jsZip from 'jszip';
import * as html2canvas from 'html2canvas';
// import * as saveAs from 'file-saver';
declare var saveAs : any;
@Component({
	selector: 'app-restaurants',
	templateUrl: './restaurants-list.component.html'
})
export class RestaurantsListComponent implements OnInit
{
	search: string;
	// type: any;
	sub: Subscription = new Subscription();
	index:  any = 1;
	totalPages: number = 1
	pages: any;
	totalItems: any;
	currentPage:  any = 1;
	merchantAccountCount: any;
	merchantAccount: any;
	searchTimer:any;
	perPage: any;
	componentSettings: any = {
		name: null,
		paggination: null,
		search: null
	};
	appSelectorSubscription: Subscription;
	scenario: any;
	ParentOutlets: any;
	parentOutletsCount: any;
	RestaurantsParentOutlets: any=[];
  RestaurantsparentOutletsCount: any;
  count = 0;
  pdf = new jsPDF(); // ambigous change  pdf: jsPDF = null;
 
  jszip: any;
  credentials: any[] = [];
  parentName = '';
  loading = false;

	constructor(protected router: Router,
		protected _route: ActivatedRoute,
		protected mainApiService: MainService,
		protected paginationService: PaginationService,
		protected loaderService: BaseLoaderService, protected appSelectorService: UserAppSelectorService, protected dialog: MatDialog)
	{
		this.search = '';
		this.merchantAccount = [];
		this.perPage = 20;

		this.appSelectorSubscription = this.appSelectorService.selectedApp.subscribe((response: any) =>
        {
			this.gerParentOutletsList(1);
		});
	}

	ngOnDestroy(): void
	{
		this.appSelectorSubscription.unsubscribe();
	}

	ngOnInit()

		{
      let abc = localStorage.getItem('componentSettings') as string;
			this.componentSettings = JSON.parse(abc);
			if(this.componentSettings)
			{
				if(this.componentSettings.name != null && this.componentSettings.name == 'RestaurantParentOutlet')
				{
					this.currentPage = this.componentSettings.paggination;
					this.index = this.componentSettings.paggination;
					this.search = this.componentSettings.search;
				}
			}
			this.gerParentOutletsList(this.currentPage);
      // this.jszip = new jsZip();
      // console.log(this.jszip);
		}
		// this.sub = this._route.params.subscribe(params => {
		// 	this.type = params['type'];
		// 	if (this.type)
		// 	{
				// this.gerParentOutletsList(this.currentPage);
			// }
			// log here(params);
		// });


	addNew() {
		this.router.navigateByUrl('main/restaurants/add');
	}

	onSearchParentOutlet(): void
	{
		clearTimeout(this.searchTimer);
		this.searchTimer = setTimeout(() => {

			this.gerParentOutletsList(1);

		}, 700);

	}

	gerParentOutletsList(index : any, isLoaderHidden?: boolean): void
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
				name: 'RestaurantParentOutlet',
				paggination: this.index,
				search: this.search
			}
        ));

		this.mainApiService.getList(appConfig.base_url_slug + url)
		.then(result => {
			if (result.status == 200  && result.data)
			{
				this.RestaurantsParentOutlets = result.data.parents;
				this.RestaurantsparentOutletsCount = result.data.counts;
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


	// onEditAccount(merchant): void
	// {
	// 	localStorage.setItem('Account', JSON.stringify(merchant));
	// 	this.router.navigateByUrl('main/merchant_account/add' + merchant.id);
	// }
	onEditRestaurant(parentOutlet : any): void
	{
		localStorage.setItem('RestaurantParentOutlet', JSON.stringify(parentOutlet));
		this.router.navigateByUrl('main/restaurants/' + parentOutlet.id);
	}
	onMainMenu(parentOutlet : any): void
	{
		localStorage.setItem('RestaurantParentOutlet', JSON.stringify(parentOutlet));
		// this.router.navigateByUrl('/main/restaurantsId/restaurantMenu/' + parentOutlet.id);
		this.router.navigateByUrl('/main/restaurants/mainMenuItem/'+ parentOutlet.id);
	}
	onPromotion(parentOutlet : any): void
	{
		// localStorage.setItem('Promotion', JSON.stringify(parentOutlet));
		// this.router.navigateByUrl('/main/restaurantsId/restaurantMenu/' + parentOutlet.id);
		this.router.navigateByUrl('/main/restaurants/'+ parentOutlet.id +'/promotion');
	}
	onDeliveryCategory(parentOutlet : any): void
	{
		localStorage.setItem('RestaurantParentOutlet', JSON.stringify(parentOutlet));

		this.router.navigateByUrl('/main/restaurants/deliveryCategory/'+ parentOutlet.id);
	}
	onDeliveryCollection(parentOutlet : any): void
	{
		localStorage.setItem('RestaurantParentOutlet', JSON.stringify(parentOutlet));
		this.router.navigateByUrl('/main/restaurants/deliveryCollection/'+ parentOutlet.id);
	}

	onMenu(parentOutlet : any): void
	{
		localStorage.setItem('RestaurantParentOutlet', JSON.stringify(parentOutlet));
		this.router.navigateByUrl('/main/restaurants/MenuItem/'+ parentOutlet.id);
  }

  downloadCredentials(parent : any) {
    this.parentName = parent.name;
    this.loading = true;
    let url = 'getOutletsCredintials?outlet_parent_id=' + parent.id;
    this.mainApiService.getList(appConfig.base_url_slug + url, false, 2).then(result => {
			if (result.status == 200  && result.data) {
        this.credentials = result.data;
        if (this.credentials.length != 0) {
          this.jszip = new jsZip();
          this.downloadPdf();
        } else {
          this.loading = false;
        }
			} else {
        this.loading = false;
      }
		});
  }

  downloadPdf() {
    // if (this.pdf == null) {
      this.initializePdf();
    // }
    // let x = [{u: 'user1', p: 'pass1'}, {u: 'user2', p: 'pass2'}];
    document.getElementById('content')!.style.visibility = 'visible';
    document.getElementById('user')!.innerHTML = this.credentials[this.count].username;
    document.getElementById('pass')!.innerHTML = this.credentials[this.count].password;
    var data = document.getElementById('contentToConvert');
    //@ts-ignore
    html2canvas(data).then((canvas : any) => {  
      // Few necessary setting options
    let contentDataURL = canvas.toDataURL('image/png')
    console.log(contentDataURL);
    let imgProps= this.pdf.getImageProperties(contentDataURL);
    let pdfWidth = this.pdf.internal.pageSize.getWidth();
    let pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    // if (this.count != 1) {
    //   this.pdf.addPage('new','portrait');
    // }
    this.pdf.addImage(contentDataURL, 'PNG', 0, 0, pdfWidth, pdfHeight,'','FAST');
    document.getElementById('content')!.style.visibility = 'hidden';
    this.jszip.file(this.credentials[this.count].name + '.pdf', this.pdf.output('blob'));
      if (this.count + 1 == this.credentials.length) {
      // let save: any = this.pdf.save( this.parentName + '-Credentials.pdf', {returnPromise: true}); // Generated PDF
      // save.then(()=> {
      //   this.loading = false;
      //   this.count = 0;
      //   this.pdf = null;
      // })
      // this.jszip.file(this.parentName + '.pdf', this.pdf.output('blob'));
      this.jszip.generateAsync({type: 'blob'}).then((content : any)=> {
        saveAs(content, this.parentName + '.zip');
          this.loading = false;
          this.count = 0;
          this.pdf = new jsPDF();
      })
      } else {
        this.count+= 1;
        this.downloadPdf();
      }
    });
  }

  initializePdf() {
    this.pdf = new jsPDF({
      orientation: 'portrait',
    });
  }


  // exportDeliveryReport() {
  //   let dialogRef = this.dialog.open(ExportCSVDialog, { autoFocus: false });
  //   dialogRef.afterClosed().subscribe(result => {
  //     if (result != false && result != void 0) {
  //       this.start_date = result.start_date;
  //       this.end_date = result.end_date;
  //       console.log(this.start_date);
  //       console.log(this.end_date);
  //     }
  //   });
  // }




  // createCSVReport(arrayData, report ,delimiter, fileName) {

  //   console.log(report);

  //   let orderListHeaders = ["Order Date","Order Name","Customer Name","Item List","Order Total","Delivered By", "Payment Method", "Order Placed","Order Accepted"];
  //   let orderStatsHeaders = ["Orders","","","Delivery","","","Pickup or Dinein","","", "Payments"];
  //   let chargesSummaryHeaders = ["Contractually Agreed Charges","","","Charges Summary","","","Settlement"];
  //   let orderStatCount = report.orders.count;
  //   let orderStatAmount = report.orders.amount;
  //   let charges = report.charges;
  //   let rates = report.rates;

  //             //--Report 1 heading--//
  //             let report1 = 'Report 1 - Settlement Report' + '\n\n';
  //             let csv = report1;

  //             //--Dates--//
  //             let dates = 'From Date, ' + this.displayDateStart + '\n' + 'To Date, ' + this.displayDateEnd + '\n\n'
  //             csv += dates;

  //             //--Order Stats Headings--//
  //             let orderstats = orderStatsHeaders.join(delimiter) + '\n';
  //             csv += orderstats;

  //             //--Order Stats Content--//

  //             let statsContent = 'Total number of Orders, ' + report.orders_count + ', ,' + 'Total Deliveries, ' + report.orders_count + ', ,' + 'Total , ' +  report.orders_count + ', ,' + 'Total Payments, ' + report.orders_amount + '\n'
  //                                 + 'Orders paid by Cash, ' + orderStatCount.by_cash + ', ,' + 'Urban Point Driver, ' + orderStatCount.by_urbanpoint + ', ,' + 'Pickup, ' +  report.orders_count + ', ,' + 'Total Cash Payments, ' + orderStatAmount.by_cash + '\n'
  //                                 + 'Orders paid within app, ' + orderStatCount.by_card + ', ,' + 'Outlet Driver, ' + orderStatCount.by_outlet + ', ,' + 'Dine-in,   -' + ', ,' + 'Total In-app Payments, ' + orderStatAmount.by_card + '\n'
  //                                 + 'Orders Cancelled by Restaurant, ' + orderStatCount.rejected_by_outlet + '\n' + 'Orders Cancelled by Customer, ' + orderStatCount.cancelled_by_user + '\n\n';
  //             csv += statsContent;

  //             //--Summary Heading--//
  //             let summaryHeading = chargesSummaryHeaders.join(delimiter) + '\n';
  //             csv += summaryHeading;

  //             //--Summary Content--//

  //             let summaryContent = 'Commision, '  + rates.commission + '%' + ', ,' + 'Total Credit Card Charges, ' + charges.credit_card_fee + ' %, ,' + 'Urban Point Share, ' + report.urbanpoint_share + '\n'
  //                                 + 'Delivery Charge, ' + rates.delivery_charges + 'QAR' + ', ,' + 'Total Delivery Charges, ' + charges.delivery_charges + ', ,' + 'Outlet Share, ' + report.outlet_share  + '\n'
  //                                 + 'Credit Card Fees, '  + rates.credit_card_fee + '%'  + '\n' + 'TOTAL COMMISION, ' + charges.commission + ' %' + '\n'
  //                                 + 'Taxes, '  + rates.taxes  + '\n' + 'Total Taxes, ' + charges.taxes + '\n'
  //                                 + ', , ,' + 'Total Charges, ' + report.total_charges + '\n\n';
  //             csv += summaryContent;

  //             //--Report 2 heading--//
  //             let report2 = 'Report 2 - Sales Report' + '\n\n';
  //             csv += report2;

  //             //--Order List--//
  //             let orderheader = orderListHeaders.join(delimiter) + '\n';
  //             csv += orderheader;

  //             arrayData.forEach( obj => {
  //             let row = [];
  //             let itemString = "";
  //                 if (obj.order_items.menu_items.length != 0) {
  //                   let items = obj.order_items.menu_items;
  //                   items.forEach(item => {
  //                     if (item.avail_free) {
  //                       itemString += item.avail_free.main_menu_items[0].name + ',';;
  //                       if (item.avail_free.main_menu_items[0].sub_menu.length != 0 ) {
  //                         let subMenu = item.avail_free.main_menu_items[0].sub_menu[0];
  //                         subMenu.sub_menu_items.forEach( subMenuItem => {
  //                           itemString += subMenuItem.name + ',';
  //                         });
  //                       }
  //                     }
  //                     if (item.purchased) {
  //                       itemString += item.purchased.main_menu_items[0].name + ',';
  //                       if (item.purchased.main_menu_items[0].sub_menu.length != 0 ) {
  //                         let subMenu = item.purchased.main_menu_items[0].sub_menu[0];
  //                         subMenu.sub_menu_items.forEach( subMenuItem => {
  //                           itemString += subMenuItem.name + ',';;
  //                         });
  //                       }
  //                     }
  //                   });
  //                 }

  //                 if (obj.order_items.promotions.length != 0) {
  //                   let promotions = obj.order_items.promotions;
  //                   promotions.forEach(item => {
  //                     if (item.avail_free) {
  //                       itemString += item.avail_free.main_menu_items[0].name + ',';
  //                       if (item.avail_free.main_menu_items[0].sub_menu.length != 0 ) {
  //                         let subMenu = item.avail_free.main_menu_items[0].sub_menu[0];
  //                         subMenu.sub_menu_items.forEach( subMenuItem => {
  //                           itemString += subMenuItem.name + ',';
  //                         });
  //                       }
  //                     }
  //                     if (item.purchased) {
  //                       itemString += item.purchased.main_menu_items[0].name + ',';
  //                       if (item.purchased.main_menu_items[0].sub_menu.length != 0 ) {
  //                         let subMenu = item.purchased.main_menu_items[0].sub_menu[0];
  //                         subMenu.sub_menu_item.forEach( subMenuItem => {
  //                           itemString += subMenuItem.name + ',';
  //                         });
  //                       }
  //                     }
  //                   });
  //                 }

  //                 let str = `"${itemString}"`;
  //                 row = [obj.created_at, obj.id, obj.user_name, str , obj.sub_total, obj.accepted_delivery, obj.payment_method, obj.created_at, obj.delivery_status ];
  //                 csv += row.join(delimiter)+"\n";
  //             });
  //             //--Order List End--//

  //             let csvData = new Blob([csv], { type: 'text/csv' });
  //             let csvUrl = URL.createObjectURL(csvData);

  //             let hiddenElement = document.createElement('a');
  //             hiddenElement.href = csvUrl;
  //             hiddenElement.target = '_blank';
  //             hiddenElement.download = fileName + '.csv';
  //             hiddenElement.click();
  //         }
	// AddCSVMenu():void
	// {
	// 	this.router.navigateByUrl('/main/restaurants/mainMenuItem/restaurantMenuList');
  // }

}
