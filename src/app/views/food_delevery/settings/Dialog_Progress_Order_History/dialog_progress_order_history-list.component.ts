import { Component, OnInit } from '@angular/core';
import { MainService } from '../../../../services';
import { MatDialogRef } from '@angular/material/dialog';
import { appConfig } from '../../../../../config';
import * as moment from 'moment';
import * as printJS from 'print-js';

@Component({
	selector: 'app-dialog_progress_order_history-list',
	templateUrl: './dialog_progress_order_history-list.component.html'
})
export class DialogProgressOrderHistoryListComponent implements OnInit {
	search: string;

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
	type: any;
	StartDate: any;
	EndDate: any;
	tempArray: any = []
	parent_array: any = [];
	specialInstructions: any = '';
	getAllParentOutletsCount: any;
	Offers: any;
	offersCount: any;
	data: any;
	currentDate: Date = new Date();
	minDate: Date = new Date('2014-01-01');
	id: any;
	OrderDetails: any = [{},];
	creationDateTime: any;
	DeliveyTime: any;
	Promotions: any = [];
	ItemsFromMenu: any = [];
	ItemsAvailFree: any = [];
	ItemsPurchased: any = [];
	orderId: any;
	createdTime: string = '';
	subTotal = 0;
	discountPercentage = 0;
	currency = '';
	hideDiscount = false;
	constructor(protected mainApiService: MainService, protected dialogRef: MatDialogRef<DialogProgressOrderHistoryListComponent>) {
		this.search = '';
		this.perPage = 20;
	}

	ngOnDestroy(): void {

	}

	ngOnInit() {

		localStorage.removeItem('from_date');
		localStorage.removeItem('to_date');
		this.currency = appConfig.currency;

		this.getAllParentOutlets(1);
	}

	getAllParentOutlets(index: any, isLoaderHidden?: boolean): void {
		let url = 'getDeliveryOrderDetail/' + this.orderId + '?';

		this.mainApiService.getList(appConfig.base_url_slug + url, false, 2).then(result => {
			console.log(result);
			if (result.status == 200 && result.data) {
				this.OrderDetails = result.data;

				this.Promotions = this.OrderDetails.order_items.promotions;
				this.ItemsFromMenu = this.OrderDetails.order_items.menu_items;
				this.ItemsFromMenu.forEach((element: any) => {
					if (element.purchased) {
						element.purchased.main_menu_items[0].priceTotal = 0;
						if (element.purchased.main_menu_items[0].is_base_price == "yes") {
							element.purchased.main_menu_items[0].priceTotal += element.purchased.main_menu_items[0].price;
						}
						element.purchased.main_menu_items[0].sub_menu.forEach((el: any) => {
							el.sub_menu_items.forEach((ele: any) => {
								if (ele.is_base_price == "yes") {
									element.purchased.main_menu_items[0].priceTotal += ele.price;
								}
							});
						});
					}
				});

				// Check for b1g1 offers
				if (this.OrderDetails.order_items && this.OrderDetails.order_items.promotions.length != 0) {
					if (this.OrderDetails.order_items.promotions[0].type == 'b1g1f') {
						this.hideDiscount = true;
					}
				}

				// Calculate Discount Percentage
				this.discountPercentage = (this.OrderDetails.saving_amount / this.OrderDetails.sub_total) * 100;
				if (this.discountPercentage % 1 != 0) {
					this.discountPercentage = Number(this.discountPercentage.toFixed(2));
				}

				this.setAddOns(this.Promotions);
				this.setAddOns(this.ItemsFromMenu);
				console.log(this.OrderDetails);
				// this.ItemsAvailFree = this.OrderDetails.items_avail_free;
				// this.ItemsPurchased = this.OrderDetails.items_purchased;
				if (this.OrderDetails.order_notes != '0') {
					this.specialInstructions = this.OrderDetails.order_notes;
				}
				this.creationDateTime = this.OrderDetails.created_at;
				this.createdTime = moment(this.creationDateTime).add(3, 'hours').format('YYYY-MM-DD hh:mm:ss');
				let abc1 = moment().format('h:mm:ss a');
				let date = moment().add(this.DeliveyTime, this.creationDateTime).format('h:mm:ss a');
			}
			else {
				this.OrderDetails = [];

			}
		});
	}

	setPage(pageDate: any) {
		this.currentPage = pageDate.page;
		this.perPage = pageDate.perPage;
		this.index = this.currentPage;
		this.getAllParentOutlets(pageDate.page);
	}

	inItemSelected() {
		if (this.tempArray.length != 0) {
			for (let i = 0; i < this.tempArray.length; i++) {
				if (this.tempArray[i].isSelected == true) {
					return false;
				}
			}
			return true;
		}
	}

	onStartDate() {
		console.log(this.StartDate);
		let start = moment(this.StartDate[0]).format('YYYY-MM-DD');
		localStorage.setItem('from_date', JSON.stringify(start));

		let end = moment(this.StartDate[1]).format('YYYY-MM-DD');
		localStorage.setItem('to_date', JSON.stringify(end));
	}

	onPrint() {
		const printContent = document.getElementById("abc")
		printJS({ printable: printContent?.innerHTML, type: 'raw-html' });
	}

	setAddOns(menus: any) {
		menus.forEach((promo: any) => {
			// For Purchased
			if (promo.purchased) {
				promo.purchased.main_menu_items.forEach((mainMenu: any) => {
					let addOns: any[] = [];
					let nonAddOns: any[] = [];
					mainMenu.sub_menu.forEach((subMenu: any) => {
						subMenu.sub_menu_items.forEach((subMenuItem: any) => {
							if (subMenuItem.is_base_price == 'yes') {
								addOns.push(subMenuItem);
							} else {
								nonAddOns.push(subMenuItem);
							}
						});
					});
					mainMenu.addOns = addOns;
					mainMenu.nonAddOns = nonAddOns
				});
			}
			// For Avail Free
			if (promo.avail_free) {
				promo.avail_free.main_menu_items.forEach((mainMenu: any) => {
					let addOns: any[] = [];
					let nonAddOns: any[] = [];
					mainMenu.sub_menu.forEach((subMenu: any) => {
						subMenu.sub_menu_items.forEach((subMenuItem: any) => {
							if (subMenuItem.is_base_price == 'yes') {
								addOns.push(subMenuItem);
							} else {
								nonAddOns.push(subMenuItem);
							}
						});
					});
					mainMenu.addOns = addOns;
					mainMenu.nonAddOns = nonAddOns
				});
			}
		});
		console.log(this.Promotions);
	}
}