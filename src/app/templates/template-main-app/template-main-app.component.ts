import { MessagingService } from './../../services/messaging.service';
import { BaseLoaderService } from './../../services/base-loader.service';
import { Subscription } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { MainService } from '../../services/main.service';
import { appConfig } from '../../../config';
import { UserAppSelectorService } from '../../lib/app-selector/app-selector.service';
declare var $: any;
export class SideMenuItems {
	routerLink?: string;
	image?: string;
	label?: string;
	is_parent?: boolean;
	is_hidden?: boolean;
	children?: SideMenuItems[];
	opened?: boolean;
}
@Component({
	selector: 'template-main-app',
	templateUrl: 'template-main-app.component.html',
	styleUrls: ['template-main-app.component.scss'],
})
export class TemplateMainApp implements OnInit, OnDestroy {
	timer: any;
	Notifications: any;
	adminClick: boolean;
	audio: any;
	noOfOrders = 0;
	show: any;
	appSelectorSubscription: Subscription;
	selectedApp: any;
	// notificationClick:any;
	public scrollbarOptions = { axis: 'y', theme: 'minimal' };
	menus: SideMenuItems[];
	constructor(protected mainApiService: MainService,
		private router: Router,
		private baseService: BaseLoaderService,
		private messagingService: MessagingService,  protected appSelectorService: UserAppSelectorService) {
		this.adminClick = false;
		this.menus = [
			// { routerLink: '/main/dashboard', image: 'dashboard@2x', label: 'Dashboard' },
			// {
			// 	image: 'Admin@2x',
			// 	label: 'Admins',
			// 	is_parent: true,
			// 	opened: false,
			// 	children: [
			// 		{ routerLink: '/main/admins/0', image: 'Admin@2x', label: 'Super Admin' },
			// 		{ routerLink: '/main/admins/1', image: 'Admin@2x', label: 'Branch Manager'	},
			// 		{ routerLink: '/main/admins/2', image: 'Driver@2x', label: 'Drivers' },
			// 	]
			// },
			// { routerLink: '/main/customers', image: 'customers@2x', label: 'Customers' },
			// { routerLink: '/main/branches', image: 'branches@2x', label: 'Branches' },
			// { routerLink: '/main/menu_items', image: 'Menu@2x', label: 'Menu Items' },
			// // { routerLink: '/main/offers', image: 'Offers@2x', label: 'Offers' },
			// { routerLink: '/main/orders', image: 'Orders@2x', label: 'Orders' },
			// { routerLink: '/main/promo_code', image: 'Promo@2x', label: 'Promo Code' },
			// { routerLink: '/main/notifications', image: 'Notifications@2x', label: 'Notifications' },
			// { routerLink: '/main/settings', image: 'Settings@2x', label: 'Settings' }
		];
		this.Notifications = {
			ordersCount: 0,
			maxId: 0
		}
		this.listenToGetSeletedApp();
	}
	ngOnInit() {
		// this.messagingService.requestPermission();
		// this.messagingService.receiveMessage();
		console.log('pipline');
		this.messagingService.receiveMessage();
		this.audio = new Audio();
		this.audio.src = './assets/audio/pendingAudio.mp4';
		this.initiateAudio();
		this.getNumberOfOrders();
		this.checkForOrderCount();
		setInterval(() => {
			this.getUnAttendedOrders(1);
		}, 60000);
		
		$("a.nav-dropdown-trigger").on("click", function (e: any) {
			e.preventDefault();
			var $this = $(this);
			$this.parent(".sub-nav").toggleClass("opened");
		});
		$(".menu-trigger").on("click", function (e: any) {
			e.preventDefault();
			var $this = $(this);
			$this.toggleClass("active");
			$this.parents(".dashboard-main").find(".page-sidebar").toggleClass("opened");
			$this.parents(".dashboard-main").find(".page-content").toggleClass("opened");
		});
		this.getCounts();
	}
	listenToGetSeletedApp(){
		// let resp = this.appSelectorService.getApp();
		// this.selectedApp = parseInt(resp.user_app_id);
		this.appSelectorSubscription = this.appSelectorService.selectedApp.subscribe((response: any) =>
        {			
			this.selectedApp = parseInt(response.user_app_id);
			let UrbanpointAdmin = JSON.parse(localStorage.getItem('UrbanpointAdmin'));
		if ((UrbanpointAdmin.name == 5) && (UrbanpointAdmin.role == 3)) {
			this.menus = [
				{ routerLink: '/main/orders/All', image: 'orders', label: 'REDEMPTIONS' },
				{ routerLink: '/main/subscriptions/All', image: 'subscribe-orange', label: 'SUBSCRIPTIONS' },
				{ routerLink: '/main/outlets', image: 'outlets', label: 'OUTLETS' },
				{ routerLink: '/main/deals', image: 'deals', label: 'OFFERS' },
				{ routerLink: '/main/customers/registered', image: 'defaults', label: 'REGISTERED' },
			]
		}
		else if (UrbanpointAdmin.name == 2) {
			this.menus = [
				{ routerLink: '/main/team', image: 'admin', label: 'TEAM' },
				// { routerLink: '/main/merchants', image: 'merchants', label: 'ORGANIZATIONS' },
				// { routerLink: '/main/outlets', image: 'outlets', label: 'OUTLETS' },
				// { routerLink: '/main/deals', image: 'deals', label: 'OFFERS' },
				{
					image: 'customers',
					label: 'CUSTOMERS',
					is_parent: true,
					opened: false,
					children: [
						{ routerLink: '/main/customers/registered', image: 'defaults', label: 'REGISTERED' },
						// { routerLink: '/main/customers/non_registered', image: 'defaults', label: 'NON REGISTERED' },
						// { routerLink: '/main/customer/oredoo_billing', image: 'defaults', label: 'OREDOO BILLING' },
					]
				},
				{ routerLink: '/main/orders/All', image: 'orders', label: 'REDEMPTIONS' },
				{ routerLink: '/main/subscriptions/All', image: 'subscribe-orange', label: 'SUBSCRIPTIONS' },
				// { routerLink: '/main/notifications', image: 'notifications', label: 'NOTIFICATIONS' },
				{ routerLink: '/main/access_codes', image: 'access_codes', label: 'ACCESS CODES' },
				{ routerLink: '/main/interest_tag', image: 'InterestTags', label: 'INTEREST TAG' },
				// { routerLink: '/main/promo_codes', image: 'promo codes', label: 'PROMO CODES' },
				{ routerLink:'/main/promo_codesNew', image:'access_codes', label:'PROMO CODES New Version'},
				{routerLink: 'kpi_report', image: 'kip-report', label: 'KPI REPORT' },
				{
					image: 'defaults',
					label: 'DEFAULTS',
					is_parent: true,
					opened: false,
					children: [
						// {routerLink: '/main/Transactions', image: 'defaults', label: 'Balance Transaction'},
						{ routerLink: '/main/home_screen_messages', image: 'defaults', label: 'HOME SCREEN MESSAGES' },
						// { routerLink: '/main/subscription_text', image: 'defaults', label: 'SUBSCRIPTION TEXT' },
						// { routerLink: '/main/uber_status', image: 'defaults', label: 'UBER STATUS' },
						{ routerLink: '/main/versions', image: 'defaults', label: 'VERSIONS' },
					]
				},
			]
		}
		else if (UrbanpointAdmin.role == 2) {
			this.menus = [
				{ routerLink: '/main/parent_companies', image: 'organization', label: 'PARENT COMPANIES' },
				{ routerLink: '/main/merchant_account', image: 'merchant account', label: 'Merchants Accounts' },
				{ routerLink: '/main/outlet_account', image: 'outlet acc', label: 'OUTLETS ACCOUNTS' },
				{ routerLink: '/main/brands', image: 'parentOutlet', label: 'BRANDS' },
				{ routerLink: '/main/outlets', image: 'outlets', label: 'OUTLETS' },
				{ routerLink: '/main/deals', image: 'offers', label: 'OFFERS' },
				{
					image: 'customers',
					label: 'CUSTOMERS',
					is_parent: true,
					opened: false,
					children: [
						{ routerLink: '/main/customers/registered', image: 'defaults', label: 'REGISTERED' },
						{ routerLink: '/main/customers/non_registered', image: 'defaults', label: 'NON REGISTERED' },
						// { routerLink: '/main/customers/oredoo_billing', image: 'defaults', label: 'OOREDOO BILLING' },
						{ routerLink: '/main/customers/reports', image: 'defaults', label: 'REPORTS' },
					]
				},
				{
					image: 'customers',
					label: 'FOOD & DELIVERY',
					is_parent: true,
					opened: false,
					children: [
						{ routerLink: '/main/delivery_order', image: 'defaults', label: 'DELIVERY ORDER' },
						{ routerLink: '/main/unattended_orders', image: 'defaults', label: 'UNATTENDED ORDERS' }
					]
				},
				{ routerLink: '/main/orders/All', image: 'orders', label: 'REDEMPTIONS' },
				{ routerLink: '/main/subscriptions/All', image: 'subscriptions', label: 'SUBSCRIPTIONS' },
				{
					image: 'credit card packages',
					label: 'SUBSCRIPTION PACKAGES',
					is_parent: true,
					opened: false,
					children: [
						{ routerLink: '/main/subscription-packages/eligible', image: 'dashboard', label: 'ELIGIBLE' },
						{ routerLink: '/main/subscription-packages/not_eligible', image: 'dashboard', label: 'NOT ELIGIBLE' },
						{ routerLink: '/main/subscription-packages/card_only', image: 'dashboard', label: 'CARD ONLY' },
					]
				},
				{
					image: 'campaign',
					label: 'CAMPAIGN',
					is_parent: true,
					opened: false,
					children: [
						{ routerLink: '/main/campaign', image: 'dashboard', label: 'PROMO IMAGE' },
					]
				},
				{ routerLink: '/main/notifications', image: 'notifications', label: 'NOTIFICATIONS' },
				{ routerLink: '/main/sms/list', image: 'notifications', label: 'SMS' },
				// { routerLink: '/main/interest_tag', image: 'interest tag', label: 'INTEREST TAG' },
				{ routerLink: '/main/access_codes', image: 'access codes', label: 'ACCESS CODES' },
				// { routerLink: '/main/promo_codes', image: 'promo codes', label: 'PROMO CODES' },
				{ routerLink:'/main/promo_codesNew', image:'promo codes', label:'PROMO CODES'},
				{routerLink: 'kpi_report', image: 'kip-report', label: 'KPI REPORT' },
				{
					image: 'credit card packages',
					label: 'PACKAGES',
					is_parent: true,
					opened: false,
					children: [
						{ routerLink: '/main/credit-card-packages/ooredooUsers', image: 'dashboard', label: 'OOREDOO' },
						{ routerLink: '/main/credit-card-packages/nonOoredooUsers', image: 'dashboard', label: 'NON OOREDOO' },
						{ routerLink: '/main/promo_codes', image: 'access_codes', label: 'PROMO CODES' },
					]
				},
			]
		 } 	else if (UrbanpointAdmin.role == 2 && this.selectedApp != 1) {
			this.menus = [
				{ routerLink: '/main/parent_companies', image: 'organization', label: 'PARENT COMPANIES' },
				{ routerLink: '/main/merchant_account', image: 'merchant account', label: 'Merchants Accounts' },
				{ routerLink: '/main/outlet_account', image: 'outlet acc', label: 'OUTLETS ACCOUNTS' },
				{ routerLink: '/main/brands', image: 'parentOutlet', label: 'BRANDS' },
				{ routerLink: '/main/outlets', image: 'outlets', label: 'OUTLETS' },
				{ routerLink: '/main/deals', image: 'offers', label: 'OFFERS' },
				{
					image: 'customers',
					label: 'CUSTOMERS',
					is_parent: true,
					opened: false,
					children: [
						{ routerLink: '/main/customers/registered', image: 'defaults', label: 'REGISTERED' },
						{ routerLink: '/main/customers/non_registered', image: 'defaults', label: 'NON REGISTERED' },
						// { routerLink: '/main/customers/oredoo_billing', image: 'defaults', label: 'OOREDOO BILLING' },
						{ routerLink: '/main/customers/reports', image: 'defaults', label: 'REPORTS' },
					]
				},
				{
					image: 'customers',
					label: 'FOOD & DELIVERY',
					is_parent: true,
					opened: false,
					children: [
						{ routerLink: '/main/delivery_order', image: 'defaults', label: 'DELIVERY ORDER' },
						{ routerLink: '/main/unattended_orders', image: 'defaults', label: 'UNATTENDED ORDERS' }
					]
				},
				{ routerLink: '/main/orders/All', image: 'orders', label: 'REDEMPTIONS' },
				{ routerLink: '/main/subscriptions/All', image: 'subscriptions', label: 'SUBSCRIPTIONS' },
				{
					image: 'campaign',
					label: 'CAMPAIGN',
					is_parent: true,
					opened: false,
					children: [
						{ routerLink: '/main/campaign', image: 'dashboard', label: 'PROMO IMAGE' },
					]
				},
				{ routerLink: '/main/notifications', image: 'notifications', label: 'NOTIFICATIONS' },
				{ routerLink: '/main/sms/list', image: 'notifications', label: 'SMS' },
				// { routerLink: '/main/interest_tag', image: 'interest tag', label: 'INTEREST TAG' },
				// { routerLink: '/main/access_codes', image: 'access codes', label: 'ACCESS CODES' },
				{ routerLink:'/main/promo_codesNew', image:'promo codes', label:'PROMO CODES'},
				{routerLink: 'kpi_report', image: 'kip-report', label: 'KPI REPORT' },
				{
					image: 'credit card packages',
					label: 'PACKAGES',
					is_parent: true,
					opened: false,
					children: [
						{ routerLink: '/main/credit-card-packages/ooredooUsers', image: 'dashboard', label: 'OOREDOO' },
						{ routerLink: '/main/credit-card-packages/nonOoredooUsers', image: 'dashboard', label: 'NON OOREDOO' },
						{ routerLink: '/main/promo_codes', image: 'access_codes', label: 'PROMO CODES' },
					]
				},
			]
		}  
		else if (UrbanpointAdmin.role == 3) {
			this.menus = [
				{ routerLink: '/main/parent_companies', image: 'organization', label: 'PARENT COMPANIES' },
				{ routerLink: '/main/merchant_account', image: 'merchant account', label: 'Merchants Accounts' },
				{ routerLink: '/main/outlet_account', image: 'outlet acc', label: 'OUTLETS ACCOUNTS' },
				{ routerLink: '/main/brands', image: 'parentOutlet', label: 'BRANDS' },
				{ routerLink: '/main/outlets', image: 'outlets', label: 'OUTLETS' },
				{ routerLink: '/main/deals', image: 'offers', label: 'OFFERS' },
				{
					image: 'customers',
					label: 'CUSTOMERS',
					is_parent: true,
					opened: false,
					children: [
						{ routerLink: '/main/customers/registered', image: 'defaults', label: 'REGISTERED' },
						{ routerLink: '/main/customers/non_registered', image: 'defaults', label: 'NON REGISTERED' },
						{ routerLink: '/main/customers/oredoo_billing', image: 'defaults', label: 'OOREDOO BILLING' },
						{ routerLink: '/main/customers/reports', image: 'defaults', label: 'REPORTS' },
					]
				},
				{
					image: 'customers',
					label: 'FOOD & DELIVERY',
					is_parent: true,
					opened: false,
					children: [
						{ routerLink: '/main/delivery_order', image: 'defaults', label: 'DELIVERY ORDER' },
						{ routerLink: '/main/unattended_orders', image: 'defaults', label: 'UNATTENDED ORDERS' },
					]
				},
				{ routerLink: '/main/orders/All', image: 'orders', label: 'REDEMPTIONS' },
				{ routerLink: '/main/subscriptions/All', image: 'subscriptions', label: 'SUBSCRIPTIONS' },
				{ routerLink: '/main/access_codes', image: 'access codes', label: 'ACCESS CODES' },
			]
		}
		else if (UrbanpointAdmin.role == 1 && this.selectedApp != 1){
			this.menus = [
				{ routerLink: '/main/team', image: 'admin', label: 'TEAM' },
				{ routerLink: '/main/parent_companies', image: 'organization', label: 'PARENT COMPANIES' },
				{ routerLink: '/main/merchant_account', image: 'merchant account', label: 'Merchants Accounts' },
				{ routerLink: '/main/outlet_account', image: 'outlet acc', label: 'OUTLETS ACCOUNTS' },
				{ routerLink: '/main/brands', image: 'parentOutlet', label: 'BRANDS' },
				{ routerLink: '/main/outlets', image: 'outlets', label: 'OUTLETS' },
				{ routerLink: '/main/deals', image: 'offers', label: 'OFFERS' },
				// { routerLink: '/main/Ooredo-Billing', image: 'deals', label: 'Ooredoo Billing' },
				{
					image: 'customers',
					label: 'CUSTOMERS',
					is_parent: true,
					opened: false,
					children: [
						{ routerLink: '/main/customers/registered', image: 'defaults', label: 'REGISTERED' },
						{ routerLink: '/main/customers/non_registered', image: 'defaults', label: 'NON REGISTERED' },
						{ routerLink: '/main/customers/oredoo_billing', image: 'defaults', label: 'OOREDOO BILLING' },
						{ routerLink: '/main/customers/reports', image: 'defaults', label: 'REPORTS' },
					]
				},
				{
					image: 'customers',
					label: 'FOOD & DELIVERY',
					is_parent: true,
					opened: false,
					children: [
						{ routerLink: '/main/restaurants', image: 'defaults', label: 'DELIVERY BRANDS' },
						{ routerLink: '/main/delivery_order', image: 'defaults', label: 'DELIVERY ORDER' },
						{ routerLink: '/main/unattended_orders', image: 'defaults', label: 'UNATTENDED ORDERS' },
						{ routerLink: '/main/Delivery_categories', image: 'defaults', label: 'DELIVERY CATEGORIES' },
						{ routerLink: '/main/delivery_playlist', image: 'defaults', label: 'DELIVERY PLAYLIST' },
						// { routerLink: '/main/outlet_account', image: 'merchants', label: 'OUTLET ACCOUNT' },
						{ routerLink: '/main/delivery_playlist_parentOutlet', image: 'defaults', label: 'DELIVERY PLAYLIST PARENT OUTLET' },
						{ routerLink: '/main/spendXYList', image: 'defaults', label: '25% Offers' },
						// {
						// 	image: 'dashboard',
						// 	label: 'SETTINGS',
						// 	is_parent: true,
						// 	opened: false,
						// 	children: [
						// 		// { routerLink: '/main/restaurants/mainMenuItem', image: 'defaults', label: 'MAIN MENU ITEM' },
						// 		{ routerLink: '/main/Delivery_categories', image: 'defaults', label: 'DELIVERY CATEGORIES' },
						// 		{ routerLink: '/main/delivery_playlist', image: 'defaults', label: 'DELIVERY PLAYLIST' },
						// 		{ routerLink: '/main/delivery_playlist_parentOutlet', image: 'defaults', label: 'DELIVERY PLAYLIST PARENT OUTLET' },
						// 	]
						// },
						// { routerLink: '/main/customers/oredoo_billing', image: 'defaults', label: 'SETTINGS' },
					]
				},
				{ routerLink: '/main/orders/All', image: 'orders', label: 'REDEMPTIONS' },
				{ routerLink: '/main/subscriptions/All', image: 'subscriptions', label: 'SUBSCRIPTIONS' },		
				{
					image: 'campaign',
					label: 'CAMPAIGN',
					is_parent: true,
					opened: false,
					children: [
						{ routerLink: '/main/campaign', image: 'dashboard', label: 'PROMO IMAGE' },
					]
				},
				{ routerLink: '/main/notifications', image: 'notifications', label: 'NOTIFICATIONS' },
				{ routerLink: '/main/sms/list', image: 'notifications', label: 'SMS' },
				{ routerLink: '/main/access_codes', image: 'access codes', label: 'ACCESS CODES' },
				{ routerLink: '/main/interest_tag', image: 'interest tag', label: 'INTEREST TAG' },
				// { routerLink: '/main/promo_codes', image: 'promo codes', label: 'PROMO CODES' },
				{ routerLink:'/main/promo_codesNew', image:'promo codes', label:'PROMO CODES'},
				{routerLink: 'kpi_report', image: 'kip-report', label: 'KPI REPORT' },
				{ routerLink: '/main/merchant_report', image: 'orders', label: 'MERCHANT REPORT' },
				{
					image: 'default',
					label: 'DEFAULTS',
					is_parent: true,
					opened: false,
					children: [
						// {routerLink: '/main/Transactions', image: 'defaults', label: 'Balance Transaction'},
						{ routerLink: '/main/home_screen_messages', image: 'defaults', label: 'HOME SCREEN MESSAGES' },
						{ routerLink: '/main/subscription_text', image: 'defaults', label: 'SUBSCRIPTION TEXT' },
						{ routerLink: '/main/subscription_page', image: 'defaults', label: 'SUBSCRIPTION PAGE' },
						{ routerLink: '/main/sms-blacklist', image: 'defaults', label: 'SMS BLACKLIST' },
						{ routerLink: '/main/web_redemption', image: 'defaults', label: 'WEB REDEMPTION'},
						{ routerLink: '/main/uber_status', image: 'defaults', label: 'UBER STATUS' },
						{ routerLink: '/main/offer_detail_messages', image: 'defaults', label: 'OFFER DETAIL MESSAGES' },
						{ routerLink: '/main/versions', image: 'defaults', label: 'VERSIONS' },
						{ routerLink: '/main/categories', image: 'defaults', label: 'CATEGORIES' },
						{ routerLink: '/main/popularcategories', image: 'defaults', label: 'POPULAR CATEGORIES' },
						{ routerLink: '/main/collection', image: 'defaults', label: 'COLLECTION' },
						{ routerLink: '/main/playlist', image: 'defaults', label: 'CATEGORY PLAYLIST' },
						{ routerLink: '/main/trending_search', image: 'defaults', label: 'TRENDING SEARCH' },
						{ routerLink: '/main/edit-history-list', image: 'defaults', label: 'CMS EDITING HISTORY' },
						{ routerLink: '/main/kill_switch', image: 'defaults', label: 'KILL SWITCH' },
					]
				},
				{
					image: 'credit card packages',
					label: 'PACKAGES',
					is_parent: true,
					opened: false,
					children: [
						{ routerLink: '/main/credit-card-packages/ooredooUsers', image: 'dashboard', label: 'OOREDOO' },
						{ routerLink: '/main/credit-card-packages/nonOoredooUsers', image: 'dashboard', label: 'NON OOREDOO' },
						{ routerLink: '/main/promo_codes', image: 'access_codes', label: 'PROMO CODES' },
					]
				},
			]
		}
		else {
			this.menus = [
				{ routerLink: '/main/team', image: 'admin', label: 'TEAM' },
				{ routerLink: '/main/parent_companies', image: 'organization', label: 'PARENT COMPANIES' },
				{ routerLink: '/main/merchant_account', image: 'merchant account', label: 'Merchants Accounts' },
				{ routerLink: '/main/outlet_account', image: 'outlet acc', label: 'OUTLETS ACCOUNTS' },
				{ routerLink: '/main/brands', image: 'parentOutlet', label: 'BRANDS' },
				{ routerLink: '/main/outlets', image: 'outlets', label: 'OUTLETS' },
				{ routerLink: '/main/deals', image: 'offers', label: 'OFFERS' },
				// { routerLink: '/main/Ooredo-Billing', image: 'deals', label: 'Ooredoo Billing' },
				{
					image: 'customers',
					label: 'CUSTOMERS',
					is_parent: true,
					opened: false,
					children: [
						{ routerLink: '/main/customers/registered', image: 'defaults', label: 'REGISTERED' },
						{ routerLink: '/main/customers/non_registered', image: 'defaults', label: 'NON REGISTERED' },
						{ routerLink: '/main/customers/oredoo_billing', image: 'defaults', label: 'OOREDOO BILLING' },
						{ routerLink: '/main/customers/reports', image: 'defaults', label: 'REPORTS' },
					]
				},
				{
					image: 'customers',
					label: 'FOOD & DELIVERY',
					is_parent: true,
					opened: false,
					children: [
						{ routerLink: '/main/restaurants', image: 'defaults', label: 'DELIVERY BRANDS' },
						{ routerLink: '/main/delivery_order', image: 'defaults', label: 'DELIVERY ORDER' },
						{ routerLink: '/main/unattended_orders', image: 'defaults', label: 'UNATTENDED ORDERS' },
						{ routerLink: '/main/Delivery_categories', image: 'defaults', label: 'DELIVERY CATEGORIES' },
						{ routerLink: '/main/delivery_playlist', image: 'defaults', label: 'DELIVERY PLAYLIST' },
						// { routerLink: '/main/outlet_account', image: 'merchants', label: 'OUTLET ACCOUNT' },
						{ routerLink: '/main/delivery_playlist_parentOutlet', image: 'defaults', label: 'DELIVERY PLAYLIST PARENT OUTLET' },
						{ routerLink: '/main/spendXYList', image: 'defaults', label: '25% Offers' },
						// {
						// 	image: 'dashboard',
						// 	label: 'SETTINGS',
						// 	is_parent: true,
						// 	opened: false,
						// 	children: [
						// 		// { routerLink: '/main/restaurants/mainMenuItem', image: 'defaults', label: 'MAIN MENU ITEM' },
						// 		{ routerLink: '/main/Delivery_categories', image: 'defaults', label: 'DELIVERY CATEGORIES' },
						// 		{ routerLink: '/main/delivery_playlist', image: 'defaults', label: 'DELIVERY PLAYLIST' },
						// 		{ routerLink: '/main/delivery_playlist_parentOutlet', image: 'defaults', label: 'DELIVERY PLAYLIST PARENT OUTLET' },
						// 	]
						// },
						// { routerLink: '/main/customers/oredoo_billing', image: 'defaults', label: 'SETTINGS' },
					]
				},
				{ routerLink: '/main/orders/All', image: 'orders', label: 'REDEMPTIONS' },
				{ routerLink: '/main/subscriptions/All', image: 'subscriptions', label: 'SUBSCRIPTIONS' },
				{
					image: 'credit card packages',
					label: 'SUBSCRIPTION PACKAGES',
					is_parent: true,
					opened: false,
					children: [
						{ routerLink: '/main/subscription-packages/eligible', image: 'dashboard', label: 'ELIGIBLE' },
						{ routerLink: '/main/subscription-packages/not_eligible', image: 'dashboard', label: 'NOT ELIGIBLE' },
						{ routerLink: '/main/subscription-packages/card_only', image: 'dashboard', label: 'CARD ONLY' },
						// { routerLink: '/main/credit-card-packages/nonOoredooUsers', image: 'dashboard', label: 'NON OOREDOO' },
					]
				},		
				{
					image: 'campaign',
					label: 'CAMPAIGN',
					is_parent: true,
					opened: false,
					children: [
						{ routerLink: '/main/campaign', image: 'dashboard', label: 'PROMO IMAGE' },
					]
				},
				{ routerLink: '/main/notifications', image: 'notifications', label: 'NOTIFICATIONS' },
				{ routerLink: '/main/newsms/list', image: 'notifications', label: 'SMS' },
				{ routerLink: '/main/access_codes', image: 'access codes', label: 'ACCESS CODES' },
				{ routerLink: '/main/interest_tag', image: 'interest tag', label: 'INTEREST TAG' },
				// { routerLink: '/main/promo_codes', image: 'promo codes', label: 'PROMO CODES' },
				{ routerLink:'/main/promo_codesNew', image:'promo codes', label:'PROMO CODES'},
				{routerLink: 'kpi_report', image: 'kip-report', label: 'KPI REPORT' },
				{ routerLink: '/main/merchant_report', image: 'orders', label: 'MERCHANT REPORT' },
				{
					image: 'default',
					label: 'DEFAULTS',
					is_parent: true,
					opened: false,
					children: [
						// {routerLink: '/main/Transactions', image: 'defaults', label: 'Balance Transaction'},
						{ routerLink: '/main/home_screen_messages', image: 'defaults', label: 'HOME SCREEN MESSAGES' },
						{ routerLink: '/main/subscription_text', image: 'defaults', label: 'SUBSCRIPTION TEXT' },
						{ routerLink: '/main/subscription_page', image: 'defaults', label: 'SUBSCRIPTION PAGE' },
						{ routerLink: '/main/sms-blacklist', image: 'defaults', label: 'SMS BLACKLIST' },
						{ routerLink: '/main/web_redemption', image: 'defaults', label: 'WEB REDEMPTION'},
						{ routerLink: '/main/uber_status', image: 'defaults', label: 'UBER STATUS' },
						{ routerLink: '/main/offer_detail_messages', image: 'defaults', label: 'OFFER DETAIL MESSAGES' },
						{ routerLink: '/main/versions', image: 'defaults', label: 'VERSIONS' },
						{ routerLink: '/main/categories', image: 'defaults', label: 'CATEGORIES' },
						{ routerLink: '/main/popularcategories', image: 'defaults', label: 'POPULAR CATEGORIES' },
						{ routerLink: '/main/collection', image: 'defaults', label: 'COLLECTION' },
						{ routerLink: '/main/playlist', image: 'defaults', label: 'CATEGORY PLAYLIST' },
						{ routerLink: '/main/trending_search', image: 'defaults', label: 'TRENDING SEARCH' },
						{ routerLink: '/main/edit-history-list', image: 'defaults', label: 'CMS EDITING HISTORY' },
						{ routerLink: '/main/kill_switch', image: 'defaults', label: 'KILL SWITCH' },
						{ routerLink: '/main/sms/list', image: 'notifications', label: 'SMS' },
					]
				},
				{
					image: 'credit card packages',
					label: 'PACKAGES',
					is_parent: true,
					opened: false,
					children: [
						{ routerLink: '/main/credit-card-packages/ooredooUsers', image: 'dashboard', label: 'OOREDOO' },
						{ routerLink: '/main/credit-card-packages/nonOoredooUsers', image: 'dashboard', label: 'NON OOREDOO' },
						{ routerLink: '/main/promo_codes', image: 'access_codes', label: 'PROMO CODES' },
					]
				},
			]
		}
		});
	}
	getCounts(): void {
		clearTimeout(this.timer);
		this.getNotificationCount();
		this.timer = setTimeout(() => {
			this.getCounts();
		}, 8000);
	}
	getNotificationCount(): void {
		let maxId: any = localStorage.getItem('MaxId');
		if (maxId == void 0 || maxId == 0) {
			// maxId = 0;
			return;
		}
		this.mainApiService.getList(appConfig.base_url_slug + 'getCounts?maxId=' + maxId).then(response => {
			if (response.status == 200) {
				this.Notifications = response.data;
			}
			else if (response.status == 404) {
				this.Notifications = {
					ordersCount: 0,
					maxId: 0
				}
			}
			else {
			}
		});
	}
	ngOnDestroy() {
		$(".sidebar-nav a.nav-dropdown-trigger").off("click", function (e: any) {
			e.preventDefault();
		});
	}
	onLogout(): void {
		this.mainApiService.onLogout().then(result => {
			if (result.status === 200 && result.data) {
				localStorage.clear();
				this.adminClick = false;
				window.location.reload();
			}
		});
	}
	onHomeClick(): void {
		this.router.navigate(['/main']);
	}
	onNotificationClick(): void {
		if (this.Notifications.ordersCount == 0) {
			return;
		}
		this.Notifications = {
			ordersCount: 0,
			maxId: 0
		}
		this.router.navigateByUrl('/main/orders');
		// this.ordersComponent.ngOnInit();
	}
	onMenuClick(menu, event): void {
		localStorage.removeItem('componentSettings');
		event.preventDefault();
		event.stopPropagation();
		this.menus.forEach(element => {
			if (element.label != menu.label) {
				element.opened = false;
			}
		});
		menu.opened = !menu.opened;
		// log here('Parent', menu);
		if (menu.label == 'Orders') {
			this.Notifications = {
				ordersCount: 0,
				maxId: 0
			}
		}
	}
	onChildMenuClick(menu, event): void {
		// localStorage.removeItem('componentSettings');
		event.preventDefault();
		event.stopPropagation();
		// this.menus.forEach(element => {
		// 	if (element.label != menu.label) {
		// 		element.opened = false;
		// 	}
		// });
		menu.opened = !menu.opened;
		console.log(menu)
		// log here('Parent', menu);
		// if (menu.label == 'Orders') {
		// 	this.Notifications = {
		// 		ordersCount: 0,
		// 		maxId: 0
		// 	}
		// }
	}
	onChildClick(menu, event): void {
		event.preventDefault();
		event.stopPropagation();
		// log here('Child', menu);
	}
	initiateAudio() {
		this.audio.load();
		this.audio.play();
		this.audio.muted = true;
		// this.audio.loop = true;
	}
	playAudioFor30Seconds() {
		this.audio.muted = false;
		this.audio.loop = true;
		this.audio.load();
		this.audio.play();
	}
	stopAudio() {
		this.audio.muted = true;
	}
	getUnAttendedOrders(index, isLoaderHidden?: boolean): void {
		// debugger;
		let url = ''
		url = 'getDeliveryOrders?page=' + index + '&per_page=' + 500 + '&sort_order=Desc' + '&order_status=' + 'pending' + '&created_before_minutes=3';
		this.mainApiService.getList(appConfig.base_url_slug + url, false, 2)
			.then(result => {
				if (result.status === 200 && result.data) {
					this.noOfOrders = result.data.length;
					this.noOfOrders.toString();
					this.baseService.sendToUnAttendedOrders(result.data);
					if (result.data.length !== 0) {
						this.playAudioFor30Seconds();
						setTimeout(() => {
							this.stopAudio();
						}, 30000);
					}
				}
			});
	}
	getNumberOfOrders() {
		let url = ''
		url = 'getDeliveryOrders?page=' + 1 + '&per_page=' + 500 + '&sort_order=Desc' + '&order_status=' + 'pending' + '&created_before_minutes=3';
		this.mainApiService.getList(appConfig.base_url_slug + url, false, 2)
			.then(result => {
				if (result.status === 200 && result.data) {
					this.noOfOrders = result.data.length;
					this.noOfOrders.toString();
				}
			});
	}
	checkForOrderCount() {
		console.log('Fired');
		this.baseService.orderCount.subscribe((count) => {
			this.noOfOrders = count;
			this.noOfOrders.toString();
		});
	}
}