import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { MainService } from '../services/main.service';
import { ExportCSVDialog } from './export_csv';
import { AppLoaderService } from './app-loader/app-loader.service';
import { appConfig } from '../../config';
import { AlertDialog } from './alert.dialog';
import { ExportMonthDialog } from './export_csv_month';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';


const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Component({
	template: ``
})
export class ExportCSVComponent implements OnInit {
	ArrayCSV: any[];
	loaderMessage: string;
	month: string = '';
	year: string = '';
	start_date: string = '';
	end_date: string = '';
	ArrayCSVCount: any;
	method: string = '';
	otherPerPage: any;
	parent_id: any;
	UrlVersion: number = 1;
	IsSingle: boolean = false;
	isNeededDate: boolean;
	isOnlyMonth: boolean;
	DropDown: boolean = false;
	isMonthYear: boolean = false;
	voucher_type: any;
	voucher_id: any;
	url_values: { key: string; value: string; title: string }[];

	billingObject = {
		phoneBil: 'Phone Number',
		emailBil: 'Email',
		nameBil: 'Name',
		genderBil: 'Gender',
		p_monthBil: 'Previous Month',
		p_offer_usedBil: 'Offers used in ',
		p_savingBil: 'Savings in ',
		c_monthBil: 'Selected Month',
		c_offer_usedBil: 'Offers used in ',
		c_savingBil: 'Savings in ',
		merchant_name: 'merchant_name',
		country: 'Country'
	}
	Roles: any;

	constructor(protected mainApiService: MainService, protected appLoaderService: AppLoaderService, protected dialog: MatDialog) {
		this.ArrayCSV = [];
		this.loaderMessage = "Please wait CSV file is preparing to download.";
		this.ArrayCSVCount = 0;
		this.otherPerPage = 0;
		this.parent_id = null;
		this.url_values = [];
		this.isNeededDate = true;
		this.isOnlyMonth = false;
		// this.DropDown=false;
	}

	ngOnInit() {
		let role: any = localStorage.getItem('UrbanpointAdmin');
		if (role != null) {
			this.Roles = JSON.parse(role);
		}

	}

	onExportCSV(): void {
		// if (this.method == 'voucherExport') {
		// 	this.UrlVersion = 2;
		// 	this.IsSingle = false;
		// }
		if (this.isNeededDate) {
			let dialogRef = this.dialog.open(ExportCSVDialog, { autoFocus: false });
			dialogRef.componentInstance.filter_values = this.url_values;
			dialogRef.afterClosed().subscribe(result => {
				if (result != false && result != void 0) {
					this.start_date = result.start_date;
					this.end_date = result.end_date;

					this.getCountData();
				}
			})
		}
		else if (this.isMonthYear) {
			let dialogRef = this.dialog.open(ExportMonthDialog, { autoFocus: false });
			dialogRef.componentInstance.isOnlyMonth = this.isOnlyMonth;
			dialogRef.componentInstance.DropDown = this.DropDown;
			dialogRef.componentInstance.filter_values = this.url_values;
			dialogRef.afterClosed().subscribe(result => {
				if (result != false && result != void 0) {
					if (this.DropDown) {
						this.year = result.year;
						this.month = result.month;
					}
					else if (this.isOnlyMonth) {
						this.start_date = result.start_date;
						this.end_date = result.end_date;
					}

					this.getCountData();
				}
			})

		}
		else {
			this.getCountData();
		}
	}


	getCountData(): void {
		let url: any;
		let perPage = 2000;
		if (this.method == 'voucherExport') {
			perPage = 1000;
			url = appConfig.base_url_slug + this.method + '?type=' + this.voucher_type + '&index=' + 1 + '&index2=' + 5 + '&export=csv' + '&voucher_id=' + this.voucher_id;
		}
		else if (this.method == 'exportLinks') {
			perPage = 1000;
			url = appConfig.base_url_slug + this.method + '?index=' + 1 + '&index2=' + 5 + '&export=csv' + '&voucher_id=' + this.voucher_id;
		}
		else if(this.method == 'userWalletLogs')
		{
			perPage = 1000;
			url = appConfig.base_url_slug + this.method + '?page=' + 1 + '&per_page=' + perPage ;
		}
		else {
			url = appConfig.base_url_slug + this.method + '?index=' + 1 + '&index2=' + 5 + '&export=csv';
		}

		if (this.isNeededDate) {
			url = url + '&start_date=' + this.start_date + '&end_date=' + this.end_date;
		}

		if (this.isMonthYear) {
			if (this.isOnlyMonth) {
				url = url + '&start_date=' + this.start_date + '&end_date=' + this.end_date;
			}
			else if (this.DropDown) {

				url = url + '&year=' + this.year + '&month=' + this.month;
			}
		}

		if (this.parent_id != null) {
			url = url + '&id=' + this.parent_id;
		}

		if (this.url_values.length > 0) {
			this.url_values.forEach(element => {
				// if(element.key != '' && element.value != '')
				// {
				url = url + '&' + element.key + '=' + element.value;
				// }
			});
		}


		this.mainApiService.getList(url, this.IsSingle, this.UrlVersion).then(result => {
			if (result.status == 200 && result.data) {
				if (this.method == 'getMerchants') {
					this.ArrayCSVCount = result.data.merchantsCount;
				}
				else if (this.method == 'getOutlets') {
					this.ArrayCSVCount = result.data.outletsCount;
				}
				else if (this.method == 'getOffers') {
					this.ArrayCSVCount = result.data.offersCount;
				}
				else if (this.method == 'getUsers') {
					this.ArrayCSVCount = result.data.usersCount;
				}
				else if (this.method == 'getOoredooBillingReport') {

					this.ArrayCSVCount = result.data.count;
					// console.log("csv ", this.ArrayCSVCount)
				}
				// else if (this.method == 'getBillingOredoo') {
				// 	this.ArrayCSVCount = result.data.users_count;
				// }
				else if (this.method == 'getOrders') {
					this.ArrayCSVCount = result.data.allOrdersCount;
				}
				else if (this.method == 'getSubscriptions') {
					this.ArrayCSVCount = result.data.subscriptionsCount;
				}
				else if (this.method == 'getNonUsers') {
					this.ArrayCSVCount = result.data.usersCount;
				}
				else if (this.method == 'getUsedAccessCodes') {
					this.ArrayCSVCount = result.data.accesscodesCount;
				}
				else if (this.method == 'getTagsCustomers') {
					this.ArrayCSVCount = result.data.offersCount;
				}
				else if (this.method == 'getSubscriptionLog') {
					this.ArrayCSVCount = result.data.count;
					// console.log("count",this.ArrayCSVCount)
				}
				else if (this.method == 'voucherExport') {
					this.ArrayCSVCount = result.pagination.count;
				}
				else if (this.method == 'exportLinks') {
					this.ArrayCSVCount = result.pagination.count;
				}
				else if(this.method == 'userWalletLogs')
				{
					this.ArrayCSVCount = result.pagination.count;
				}

				this.ArrayCSV = [];
				let index = 1, loopIndex = 0;
				let totalCalls = Math.round(this.ArrayCSVCount / perPage);
				// perPage = Math.round(this.ArrayCSVCount / totalCalls);
				if (totalCalls < (this.ArrayCSVCount / perPage)) {
					totalCalls = totalCalls + 1;
				}

				if (this.ArrayCSVCount == 0 || this.ArrayCSVCount == null) {
					let dialogRef = this.dialog.open(AlertDialog, { autoFocus: false });
					let cm = dialogRef.componentInstance;
					cm.heading = 'Export CSV';
					cm.message = 'No records found.';
					cm.cancelButtonText = 'Ok';
					cm.type = 'error';
					return;
				}
				this.appLoaderService.setLoading(true);
				this.myLoop(loopIndex, index, totalCalls, perPage);
			}
			else {
				// this.ArrayCSV = [];
				let dialogRef = this.dialog.open(AlertDialog, { autoFocus: false });
				let cm = dialogRef.componentInstance;
				cm.heading = 'Export CSV';
				cm.message = 'No records found.';
				cm.cancelButtonText = 'Ok';
				cm.type = 'error';
			}
		});
	}

	myLoop(loopIndex, index, totalCalls, perPage) {
		// log here(this.ArrayCSV);

		// this.otherPerPage = this.ArrayCSVCount - this.ArrayCSV.length;
		// if(this.otherPerPage < 2000)
		// {
		// 	perPage = this.otherPerPage;
		// }
		// let url = appConfig.base_url_slug +this.method + '?index='+ index + '&index2='+ perPage + '&start_date='+ this.start_date + '&end_date='+ this.end_date;
		// if(this.parent_id != null)
		// {
		// 	url = url + '&id=' + this.parent_id;
		// }
		let url: any;
		if (this.method == 'voucherExport') {
			perPage = 1000;
			url = appConfig.base_url_slug + this.method + '?type=' + this.voucher_type + '&page=' + index + '&per_page=' + perPage + '&export=csv' + '&voucher_id=' + this.voucher_id;
		}
		else if (this.method == 'exportLinks') {
			perPage = 1000;
			url = appConfig.base_url_slug + this.method + '?export=csv' + '&page=' + index + '&per_page=' + perPage + '&voucher_id=' + this.voucher_id;
		}
		else if(this.method == 'userWalletLogs')
		{
			perPage = 1000;
			url = appConfig.base_url_slug + this.method + '?page=' + 1 + '&per_page=' + perPage ;
		}
		else {
			url = appConfig.base_url_slug + this.method + '?index=' + index + '&index2=' + perPage + '&export=csv';
		}
		// let url: any = appConfig.base_url_slug + this.method + '?index=' + index + '&index2=' + perPage + '&export=csv';

		if (this.isNeededDate) {
			url = url + '&start_date=' + this.start_date + '&end_date=' + this.end_date;
		}

		if (this.isMonthYear) {
			if (this.isOnlyMonth) {
				url = url + '&start_date=' + this.start_date + '&end_date=' + this.end_date;
			}
			else if (this.DropDown) {

				url = url + '&year=' + this.year + '&month=' + this.month;
			}
		}

		if (this.parent_id != null) {
			url = url + '&id=' + this.parent_id;
		}

		if (this.url_values.length > 0) {
			this.url_values.forEach(element => {
				// if(element.key != '' && element.value != '')
				// {
				url = url + '&' + element.key + '=' + element.value;
				// }
			});
		}

		this.mainApiService.getList(url, this.IsSingle, this.UrlVersion)
			.then(result => {
				if (result.status == 200 && result.data) {
					let usersData: any = [], csvName: any;

					if (this.method == 'getMerchants') {
						csvName = 'merchants.csv';
						usersData = result.data.merchants;
					}
					else if (this.method == 'getOutlets') {
						// csvName = 'outlets.csv';
						// // usersData = result.data.outlets;
						// csvName = 'outlets.csv';
						// let outletData: any = [];
						// outletData = result.data.outlets;
						// let obj: any = [];
						// outletData.forEach(elm => {
						// 	elm.address = `"${elm.address}"`;
						// 	// if(elm.address.includes(",")){
						// 	// elm.address = elm.address.replaceAll(",", " ");
						// 	// }
						// 	elm.description = `"${elm.description}"`;
						// 	// if(elm.description.includes(",")){
						// 	// elm.description = elm.description.replaceAll(",", " ");
						// 	// }
						// 	elm.search_tags = `"${elm.search_tags}"`;
						// 	// if(elm.search_tags.includes(",")){
						// 	// elm.search_tags = elm.search_tags.replaceAll(",", " ");
						// 	// }
						// 	elm.collection_ids = `"${elm.collection_ids}"`;
						// 	// if(elm.collection_ids){
						// 	// if(elm.collection_ids.includes(",")){
						// 	// elm.collection_ids = elm.collection_ids.replaceAll(",", " ");
						// 	// }}
						// 	if (elm.outletParent) {
						// 		if (elm.hasOwnProperty('outletParent')) {
						// 			elm['parentname'] = elm.outletParent.name;
						// 		}
						// 	}
						// 	delete elm['outletParent'];
						// 	// elm.search_tags = `"${elm.search_tags}"`;
						// });
						// usersData = outletData;

						csvName = 'Outlets_Data_For_Dashboard';
						let obj= {};
						result.data.outlets.forEach(elm => {
							obj = elm;
								obj = {
									id: elm.id,
									merchant_id: elm.merchant_id,
									parents_id: elm.parents_id,
									collection_id: elm.collection_id,
									playlist_id: elm.playlist_id,
									name: elm.name,
									emails: elm.emails,
									phone: elm.phone,
									phones: elm.phones,
									SKU: elm.SKU,
									pin: elm.pin,
									search_tags: elm.search_tags,
									logo: elm.logo,
									image: elm.image,
									location_image: elm.location_image,
									address: elm.address,
									latitude: elm.latitude,
									longitude: elm.longitude,
									neighborhood: elm.neighborhood,
									timings: elm.timings,
									description: elm.description,
									access_token_for_bee_delivery: elm.access_token_for_bee_delivery,
									pending_emails_body: elm.pending_emails_body,
									type: elm.type,
									special: elm.special,
									active: elm.active,
									delivery_status: elm.delivery_status,
									delivery_operate_status: elm.delivery_operate_status,
									busy_closed_until: elm.busy_closed_until,
									delivery_radius: elm.delivery_radius,
									enable_delivery_for: elm.enable_delivery_for,
									delivery_options: elm.delivery_options,
									menu_card: elm.menu_card,
									menu_type: elm.menu_type,
									isnew_brand: elm.isnew_brand,
									isnewbrand_expiry: elm.isnewbrand_expiry,
									created_at: elm.created_at,
									updated_at: elm.updated_at,
									branch: elm.branch,
									merchant_name: elm.merchant_name,
									app_id: elm.app_id,
									category_ids: elm.category_ids,
									popular_category_ids: elm.popular_category_ids,
									collection_ids: elm.collection_ids,
									image_name: elm.image_name,
									logo_name: elm.logo_name,
									outletMenu: elm?.outletMenu[0],
									total_delivery_orders: elm.total_delivery_orders,
									no_of_offers_redeemed: elm.no_of_offers_redeemed,
									Country: elm.Country,
									brand: elm.outletParent?.name,
									outletParent: '[object object]'
								}
								usersData.push(obj);	  
						});
					}
					else if (this.method == 'getOffers') {
						csvName = 'deals.csv';
						let obj = {};
						result.data.offers.forEach(element => {
							obj = element;
							obj = {
								id: element.id,
								outlet_id:element.outlet_id,
								title:element.title,
								image:element.image,
								SKU:element.SKU,
								search_tages:element.search_tags,
								interest_tags:element.interest_tags,
								price:element.price,
								special_price:element.special_price,
								approx_saving:element.approx_saving,
								start_datetime:element.start_datetime,
								end_datetime:element.end_datetime,
								valid_for:element.valid_for,
								special: element.special,
								usage_allowance:element.usage_allowance,
								special_type: element.special_type,
								renew: element.renew,
								redemptions: element.redemptions,
								redeemed: element.redeemed,
								per_user: element.per_user,
								orders_count: element.orders_count,
								active: element.active,
								description: element.description,
								rule_of_purchase: element.rule_of_purchase,
								created_at: element.created_at,
								updated_at: element.updated_at,
								remaining_days: element.remaining_days,
								outlet_name: element.outlet_name,
								app_id:element.app_id,
								ppr: '',
								parent_name: element.parent_name,
								organization: element.organization,
								image_name: element.image_name,
								Country: element.country,
								


							};
							usersData.push(obj);
						});
						// usersData = result.data.offers;
					}
					else if (this.method == 'getUsers') {
						csvName = 'registered_customers.csv';
						if (this.Roles.role == '3') {
							let obj = {};

							result.data.users.forEach(elm => {

								let c = new Date(elm.c_month).toLocaleString('default', { month: 'long' });
								let p = new Date(elm.p_month).toLocaleString('default', { month: 'long' });

								obj = elm;
								obj = {

									phone: elm.phone,
									totalsaving: elm.totalsaving,
									totalDealsUsed: elm.totalDealsUsed,
									last_order_date: elm.last_order_date,
									created_at: elm.created_at,

								};

								usersData.push(obj);
							});
						}
						else if (this.Roles.role == '1') {
							usersData = result.data.users;
							usersData.forEach((data) => {
								if (data.deliveryOrders) {
									data['Delivery_Orders'] = data.deliveryOrders.orders_count,
										data['Last_Delivery_Order'] = data.deliveryOrders.last_delivery_order;
									data['B1G1_Offers_Used'] = data.deliveryOrders.promotions_count,
										data['SXGY_Offers_Used'] = data.deliveryOrders.promotions_sxgyf_count,
										data['Total_Delivery_Savings'] = data.deliveryOrders.total_saving_amount,
										data['Avg_Order_Amount'] = data.deliveryOrders.avg_order_amount,
										data['Total_Activity'] = Number(data.deliveryOrders.orders_count) + Number(data.deliveryOrders.promotions_count) + Number(data.deliveryOrders.promotions_sxgyf_count)
								}
									delete data['deliveryOrders'];
								
									if(data.Country == 'Urban Point'){
										data['Country'] = 'Qatar';
									}
									else{
									}
							});
						}

						else {
							let obj = {};

							result.data.users.forEach(elm => {

								let c = new Date(elm.c_month).toLocaleString('default', { month: 'long' });
								let p = new Date(elm.p_month).toLocaleString('default', { month: 'long' });

								obj = elm;
								delete obj['phone'];
								delete obj['email'];
								usersData.push(obj);
							});
							console.log("user data for registered ", usersData)
						}

					}
					else if (this.method == 'getOoredooBillingReport') {
						csvName = 'oredoo_billing_report.csv';
						usersData = result.data.data;

						// let obj = {};

						// result.data.data.forEach(elm => {

						// 	let c = new Date(elm.c_month).toLocaleString('default', { month: 'long' });
						// 	let p = new Date(elm.p_month).toLocaleString('default', { month: 'long' });

						// 	obj = elm;
						// 	delete obj['id'];

						// 	obj = {


						// 		Id: elm.Id,
						// 		phone: elm.phone,
						// 		subscriptionDate: elm.subscriptionDate,
						// 		ApproxSaving: elm.approx_saving,
						// 		UserCreatedAt: elm.UserCreatedAt,

						// 	};

						// 	usersData.push(obj);

						// });

					}
					// else if (this.method == 'getBillingOredoo') {
					// 	csvName = 'oredoo_billing.csv';
					// 	// usersData = result.data.users;

					// 	let obj = {};

					// 	result.data.users.forEach(elm => {

					// 		let c = new Date(elm.c_month).toLocaleString('default', { month: 'long' });
					// 		let p = new Date(elm.p_month).toLocaleString('default', { month: 'long' });
					// 		// obj = elm;
					// 		// delete obj['phone'];
					// 		// delete obj['email'];
					// 		usersData.push(obj);
					// 		// obj = {

					// 		// 	phoneBil: elm.phone,
					// 		// 	emailBil: elm.email,
					// 		// 	nameBil: elm.name,
					// 		// 	genderBil: elm.gender,
					// 		// 	p_monthBil: p,
					// 		// 	p_offer_usedBil: elm.p_offer_used,
					// 		// 	p_savingBil: elm.p_saving,
					// 		// 	c_monthBil: c,
					// 		// 	c_offer_usedBil: elm.c_offer_used,
					// 		// 	c_savingBil: elm.c_saving,
					// 		// };

					// 		// usersData.push(obj);
					// 	});


					// }
					else if (this.method == 'getOrders') {
						csvName = 'orders.csv';
						if (this.Roles.role != '3') {
							usersData = result.data.allOrders;
							
							result.data.allOrders.forEach(data => {
								if(data.Country == 'Urban Point'){
									data['Country'] = 'Qatar';
								}
								else{
								}
							});
						}
						else {
							let obj = {};
							result.data.allOrders.forEach((elem: any) => {
								let c = new Date(elem.c_month).toLocaleString('default', { month: 'long' });
								let p = new Date(elem.p_month).toLocaleString('default', { month: 'long' });
								obj = elem;
								obj = {

									order_id: elem.order_id,
									outlet_name: elem.outlet_name,
									title: elem.title,
									approx_saving: elem.approx_saving,
									order_created_at: elem.order_created_at,
									phone: elem.phone,

								}
								usersData.push(obj);
							});
						}


					}
					else if (this.method == 'getNonUsers') {
						csvName = 'non_registered_customers.csv';


						if (this.Roles.role != '2') {
							usersData = result.data.users;
						}
						else {
							let obj = {};

							result.data.users.forEach(elm => {

								let c = new Date(elm.c_month).toLocaleString('default', { month: 'long' });
								let p = new Date(elm.p_month).toLocaleString('default', { month: 'long' });

								obj = elm;
								delete obj['phone'];
								delete obj['email'];
								usersData.push(obj);
							});
						}

						// console.log("user data for registered ",usersData)

					}
					else if (this.method == 'getUsedAccessCodes') {
						csvName = 'multiple_access_codes.csv';
						usersData = result.data.accesscodes;
					}
					else if (this.method == 'getTagsCustomers') {
						csvName = 'search_tags_report.csv';
						usersData = result.data.offers;
					}
					else if (this.method == 'getSubscriptionLog') {
						csvName = 'subscription_log_report.csv';
						usersData = result.data.data;

					}
					else if (this.method == 'getSubscriptions') {
						csvName = 'subscriptions.csv';
						if (this.Roles.role == '1') {
							usersData = result.data.subscriptions;
							usersData.forEach((data) => {

						// if(data.accesscodes && data.accesscodes !== undefined){
								// 		data['Redemptions'] = data.accesscodes.redemptions;
								// }
								// else{
								// 	data['Redemptions'] = 0;
								// }

								if(data.totalDealsUsed !== undefined && data.totalDealsUsed){
									data['Total_Deal_Used'] = data.totalDealsUsed;
								}
								else{
									data['Total_Deal_Used'] = 0;
								}

								if (data.deliveryOrdersSubscriptionLogs) {
									data['B1G1_Offers_Used'] = data.deliveryOrdersSubscriptionLogs.promotions_count;
									data['SXGY_Offers_Used'] = data.deliveryOrdersSubscriptionLogs.promotions_sxgyf_count;
								}

								if (data.deliveryOrders) {
									data['Delivery_Orders'] = data.deliveryOrders.orders_count,
										data['Last_Delivery_Order'] = data.deliveryOrders.last_delivery_order;
									data['Total_Delivery_Savings'] = data.deliveryOrders.total_saving_amount,
										data['Avg_Order_Amount'] = data.deliveryOrders.avg_order_amount,
										data['Total_Activity'] = Number(data.deliveryOrders.orders_count) + Number(data.Total_Deal_Used);
								}


								delete data['deliveryOrders'];
								delete data['deliveryOrdersSubscriptionLogs'];
								delete data['start_date'];
								delete data['start_time'];
								delete data['expiry_date'];
								delete data['expiry_time'];
								delete data['created_date'];
								delete data['created_time'];
								delete data['updated_date'];
								delete data['updated_time'];

								if(data.Country == 'Urban Point'){
									data['Country'] = 'Qatar';
								}
								else{
								}
							});
						}
						else if (this.Roles.role == '2') {
							let obj = {};

							result.data.subscriptions.forEach(elem => {

								let c = new Date(elem.c_month).toLocaleString('default', { month: 'long' });
								let p = new Date(elem.p_month).toLocaleString('default', { month: 'long' });

								obj = elem;
								delete obj['phone'];
								delete obj['email'];
								usersData.push(obj);
							});
						}
						else {
							let obj = {};
							result.data.subscriptions.forEach(elem => {
								let c = new Date(elem.c_month).toLocaleString('default', { month: 'long' });
								let p = new Date(elem.p_month).toLocaleString('default', { month: 'long' });
								obj = elem;
								obj = {

									user_id: elem.user_id,
									name: elem.name,
									phone: elem.phone,
									status: elem.status,
									totalDealsUsed: elem.totalDealsUsed,
									lastOrderDate: elem.lastOrderDate,
									lastOrderTime: elem.lastOrderTime,
									Bundled_Subscription_Type: elem.Bundled_Subscription_Type,
									approx_saving: elem.approx_saving,
									subscriptionStartDate: elem.subscriptionStartDate,
									subscriptionExpiryDate: elem.subscriptionExpiryDate,
									subscription_type: elem.subscription_type,
									created_date: elem.created_date,
									updated_date: elem.updated_date,
									accesscode_id: elem.accesscode_id,
									accesscodes: elem.accesscodes,
									// Delivery_Orders: elem.deliveryOrders.orders_count,
									// Last_Delivery_Order: elem.deliveryOrders.last_delivery_order,
									// B1G1_Offers_Used: elem.deliveryOrders.promotions_count,
									// SXGY_Offers_Used: elem.deliveryOrders.promotions_sxgyf_count,
									// Total_Delivery_Savings: elem.deliveryOrders.total_saving_amount,
									// Avg_Order_Amount: elem.deliveryOrders.avg_order_amount,
									// Total_Activity: elem.deliveryOrders.orders_count + elem.deliveryOrders.promotions_count + elem.deliveryOrders.promotions_sxgyf_count

								}
								usersData.push(obj);
							});
						}


						usersData.forEach(element => {

							element.accesscode = element.accesscodes.code;
							if (element.accesscode == void 0) {
								element.accesscode = null;
							}

							delete element.accesscodes;
						});
					}

					else if (this.method == 'voucherExport' && this.voucher_type == 'free') {
						csvName = 'Voucher_links.csv';
						// usersData = result.data;
						let obj = {};
						result.data.forEach(elem => {
							obj = elem;
							obj = {
								Confirmation_ID: elem.id,
								Vocuher_ID: elem.voucher_id,
								Brand: elem.web_vouchers?.outlets_parents?.name,
								Offer_Name: elem.web_vouchers?.offer_name,
								Offer_ID: elem.id,
								Offer_Code_Link: elem.offer_code_link,
								Offer_Code_Link_Date: elem.offer_code_generated_on,
								Sub_Text: elem.web_vouchers?.sub_text,
								Details_Exclusions: elem.web_vouchers?.details_exclusions,
								Phone: elem.phone,
								Status: elem.status,
								Used_Date: elem.offer_used_on,
								Expiry: elem.web_vouchers?.expiry_date,

							}
							usersData.push(obj);
						});
					}
					else if (this.method == 'voucherExport' && this.voucher_type == 'paid') {
						csvName = 'Voucher_links.csv';
						// usersData = result.data;
						let obj = {};
						result.data.forEach(elem => {
							obj = elem;
							obj = {
								Confirmation_ID: elem.id,
								Brand: elem.web_vouchers?.outlets_parents?.name,
								Offer_Name: elem.web_vouchers?.offer_name,
								Offer_ID: elem.web_vouchers?.id,
								Offer_Code_Link: elem.offer_code_link,
								Sub_Text: elem.web_vouchers?.sub_text,
								Details_Exclusions: elem.web_vouchers?.details_exclusions,
								Phone: elem.phone,
								Phone_Confirmed_date: elem.phone_confirmed_date,
								Status: elem.status,
								Used_Date: elem.offer_used_on,
								Expiry: elem.web_vouchers?.expiry_date,

							}
							usersData.push(obj);
						});
					}
					else if (this.method == 'exportLinks') {
						csvName = 'Export_links.csv';
						// usersData = result.data;
						let obj = {};
						result.data.forEach(elem => {
							obj = elem;
							obj = {
								Confirmation_ID: elem.id,
								Link: elem.offer_code_link,
								Brand: elem.web_vouchers?.outlets_parents?.name,
								Offer: elem.web_vouchers?.offer_name,
								Expiry: elem.web_vouchers?.expiry_date,
							}
							usersData.push(obj);
						});
					}
					else if(this.method == 'userWalletLogs')
					{
						csvName = 'Balance_Tranaction.csv';
						let obj = {};
						result.data.forEach(elem => {
							obj = elem;
							obj = {
								Transaction_ID: elem.id,
								User_ID: elem.user_id,
								Outlet_name: elem.outlet_name,
								Order_ID: elem.order_id,
								Phone: elem.phone,
								Transaction: elem.transaction,
								Type: elem.type,
								Amount_in_QAR: elem.total_order_amount,
								Transaction_Date: elem.created_at,
							}
							usersData.push(obj);
						});
					}

					usersData.forEach(element => {
						this.ArrayCSV.push(element);
					});

					loopIndex++;
					index++;

					if (loopIndex < totalCalls) {
						this.myLoop(loopIndex, index, totalCalls, perPage);
						if (loopIndex == totalCalls - 1) {
							this.loaderMessage = "Your file is downloading."
						}
					}
					else {
						// console.log('Loop Finished, Your File is Downloading.');

						let csvContent = "";

						this.ArrayCSV.forEach((rowArray, index) => {
							var line = '';
							var header = '';

							for (var key in rowArray) {
								if (rowArray[key] != null && typeof rowArray[key] == 'string') {
									try {
										rowArray[key] = rowArray[key].split(',').join(';');
										rowArray[key] = rowArray[key].split('"').join('');
										rowArray[key] = rowArray[key].split('\n').join('||');
										rowArray[key] = rowArray[key].split('\r').join('||');
									} catch (error) {
										// console.log(error);
										// console.log(key, rowArray[key])
									}
								}
								if (index == 0) {
									if (key == 'phoneBil') {
										header += this.billingObject[key] + ',';
									}
									else if (key == 'emailBil') {
										header += this.billingObject[key] + ',';
									}
									else if (key == 'merchant_name') {
										header += this.billingObject[key] + ',';
									}
									else if (key == 'nameBil') {
										header += this.billingObject[key] + ',';
									}
									else if (key == 'genderBil') {
										header += this.billingObject[key] + ',';
									}
									else if (key == 'country') {
										header += this.billingObject[key] + ',';
									}
									else if (key == 'p_monthBil') {
										header += this.billingObject[key] + ',';
									}
									else if (key == 'p_offer_usedBil') {
										header += this.billingObject[key] + this.billingObject['p_monthBil'] + ',';
									}
									else if (key == 'p_savingBil') {
										header += this.billingObject[key] + this.billingObject['p_monthBil'] + ',';
									}
									else if (key == 'c_monthBil') {
										header += this.billingObject[key] + ',';
									}
									else if (key == 'c_offer_usedBil') {
										header += this.billingObject[key] + this.billingObject['c_monthBil'] + ',';
									}
									else if (key == 'c_savingBil') {
										header += this.billingObject[key] + this.billingObject['c_monthBil'] + ',';
									}
									else {
										header += key + ',';
									}
								}
								line += rowArray[key] + ',';
							}
							if (index == 0) {
								csvContent += header + '\r\n' + line + '\r\n';
							}
							else {
								csvContent += line + '\r\n';
							}
						});
						// console.log(csvContent);
						// log here(this.ArrayCSV)
						// log here(csvContent.split('\r\n'))

						if(this.method == 'getOutlets'){
							this.downloadOutletFile(this.ArrayCSV,csvName);
						}
						else{
							this.downloadFile(csvContent, csvName);
						}
					}
				}
				else {
					this.ArrayCSV = [];
				}
			});
	}

	downloadFile(data, fileName) {
		this.loaderMessage = "Please wait CSV file is preparing to download.";
		this.appLoaderService.setLoading(false);
		var BOM = "\uFEFF";  // For tackling non-english Characters
		var csvData = BOM + data;
		var blob = new Blob([csvData], {
			type: "application/csv;charset=utf-8;"
		});

		if (window.navigator.msSaveBlob) {
			navigator.msSaveBlob(blob, fileName);
		}
		else {
			// FOR OTHER BROWSERS
			var link = document.createElement("a");
			var csvUrl = URL.createObjectURL(blob);
			link.href = csvUrl;
			link.download = fileName;
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
		}
	}

	downloadOutletFile(data, fileName) {
		this.loaderMessage = "Please wait CSV file is preparing to download.";
		this.appLoaderService.setLoading(false);
		// var BOM = "\uFEFF";  // For tackling non-english Characters
		// var csvData = BOM + data;
		// var blob = new Blob([csvData], {
		// 	type: 'data:application/vnd.ms-excel;charset=utf-8,' + encodeURIComponent(csvData)
		// });
		// if (window.navigator.msSaveBlob) {
		// 	navigator.msSaveBlob(blob, fileName);
		// }
		// else {
		// 	// FOR OTHER BROWSERS
		// 	var link = document.createElement("a");
		// 	var csvUrl = URL.createObjectURL(blob);
		// 	link.href = csvUrl;
		// 	link.download = fileName;
		// 	document.body.appendChild(link);
		// 	link.click();
		// 	document.body.removeChild(link);
		// }
		this.exportAsExcelFile(data,fileName);
		
	}


	  public exportAsExcelFile(json: any[], excelFileName: string): void {
    
		const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
		console.log('worksheet',worksheet);
		const workbook: XLSX.WorkBook = { Sheets: { 'sheet1': worksheet }, SheetNames: ['sheet1'] };
		const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
		//const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });
		this.saveAsExcelFile(excelBuffer, excelFileName);
	  }
	
	  private saveAsExcelFile(buffer: any, fileName: string): void {
		const data: Blob = new Blob([buffer], {
		  type: EXCEL_TYPE
		});
		FileSaver.saveAs(data, fileName + EXCEL_EXTENSION);
	  }
}
