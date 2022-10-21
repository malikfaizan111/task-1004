import { MessagingService } from './../../services/messaging.service';
import { BaseLoaderService } from './../../services/base-loader.service';
import { Subscription } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { MainService } from '../../services/main.service';
import { appConfig } from '../../../config';
import { UserAppSelectorService } from '../../lib/app-selector/app-selector.service';
import { image } from 'html2canvas/dist/types/css/types/image';
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
	userName: any;
	// notificationClick:any;
	public scrollbarOptions = { axis: 'y', theme: 'minimal' };
	menus: SideMenuItems[];
	constructor(protected mainApiService: MainService,
		private router: Router,
		private baseService: BaseLoaderService,
		private messagingService: MessagingService,  protected appSelectorService: UserAppSelectorService) {
		this.adminClick = false;
		this.userName = JSON.parse(localStorage.getItem('UrbanpointAdmin'))
		// console.log('name', this.userName)
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
				{
					image: 'Merchant',
					label: 'Merchant',
					is_parent: true,
					opened: false,
					children: [
						{ routerLink: '/main/outlets', image: 'Merchant', label: 'Outlets' },
						{ routerLink: '/main/deals', image: 'Merchant', label: 'Offers' },
					]
				},
				{
					image: 'Customers',
					label: 'Customers',
					is_parent: true,
					opened: false,
					children: [
						{ routerLink: '/main/customers/registered', image: 'Customers', label: 'Registrations' },
						{ routerLink: '/main/subscriptions/All', image: 'Customers', label: 'Subscriptions' },
					]
				},
				{ routerLink: '/main/orders/All', image: 'Redemptions', label: 'Redemptions' },
				
				
				
			]
		}
		else if (UrbanpointAdmin.name == 2) {
			this.menus = [
				{ routerLink: '/main/team', image: 'Team', label: 'Team' },
				// { routerLink: '/main/merchants', image: 'merchants', label: 'ORGANIZATIONS' },
				// { routerLink: '/main/outlets', image: 'outlets', label: 'OUTLETS' },
				// { routerLink: '/main/deals', image: 'deals', label: 'OFFERS' },
				{
					image: 'Categories',
					label: 'Categories & Tags',
					is_parent: true,
					opened: false,
					children: [
						{ routerLink: '/main/interest_tag', image: 'Categories', label: 'Interests' },
					]
				},
				{
					image: 'Customers',
					label: 'Customers',
					is_parent: true,
					opened: false,
					children: [
						{ routerLink: '/main/customers/registered', image: 'Customers', label: 'Registrations' },
						{ routerLink: '/main/subscriptions/All', image: 'Customers', label: 'Subscriptions' },
						// { routerLink: '/main/customers/non_registered', image: 'defaults', label: 'NON REGISTERED' },
						// { routerLink: '/main/customer/oredoo_billing', image: 'defaults', label: 'OREDOO BILLING' },
					]
				},
				{ routerLink: '/main/orders/All', image: 'Redemptions', label: 'Redemptions' },
				// { routerLink: '/main/notifications', image: 'notifications', label: 'NOTIFICATIONS' },
				{
					image: 'Marketing',
					label: 'Marketing',
					is_parent: true,
					opened: false,
					children: [
						{ routerLink: '/main/newsms/list', image: 'Marketing', label: 'SMS' },
						{ routerLink:'/main/promo_codesNew', image:'Marketing', label:'Promo Code'},
						{ routerLink: '/main/access_codes', image: 'Marketing', label: 'Access Code' },
						{ routerLink: '/main/sms/list', image: 'Marketing', label: 'Old SMS' },
					]
				},
				// { routerLink: '/main/promo_codes', image: 'promo codes', label: 'PROMO CODES' },
				{
					image: 'Configurations',
					label: 'Configurations',
					is_parent: true,
					opened: false,
					children: [
						{routerLink: 'kpi_report', image: 'Configurations', label: 'Kpi Report' },
						{ routerLink: '/main/home_screen_messages', image: 'Configurations', label: 'Home Screen Messages' },
						{ routerLink: '/main/versions', image: 'Configurations', label: 'Versions' },
						{ routerLink: '/main/credit-card-packages/ooredooUsers', image: 'dashboard', label: ' Old Ooredoo Package' },
						{ routerLink: '/main/credit-card-packages/nonOoredooUsers', image: 'dashboard', label: 'Old Non Ooredoo Package' },
						{ routerLink: '/main/promo_codes', image: 'access_codes', label: 'Old Promo Codes' },
					]
				},
				{
					image: 'credit_card',
					label: 'Packages',
					is_parent: true,
					opened: false,
					children: [
						{ routerLink: '/main/credit-card-packages/ooredooUsers', image: 'dashboard', label: 'Ooredoo' },
						{ routerLink: '/main/credit-card-packages/nonOoredooUsers', image: 'dashboard', label: 'Non Ooredoo' },
						{ routerLink: '/main/promo_codes', image: 'access_codes', label: 'Promo Codes' },
					]
				},
				
				// {
				// 	image: 'defaults',  
				// 	label: 'DEFAULTS',
				// 	is_parent: true,
				// 	opened: false,
				// 	children: [
				// 		// {routerLink: '/main/Transactions', image: 'defaults', label: 'Balance Transaction'},
						
				// 		// { routerLink: '/main/subscription_text', image: 'defaults', label: 'SUBSCRIPTION TEXT' },
				// 		// { routerLink: '/main/uber_status', image: 'defaults', label: 'UBER STATUS' },
						
				// 	]
				// },
			]
		}
		else if (UrbanpointAdmin.role == 2) {
			this.menus = [
				{
					image: 'Merchant_Portals',
					label: 'Merchant Portals',
					is_parent: true,
					opened: false,
					children: [
						{ routerLink: '/main/merchant_account', image: 'Merchant_Portals', label: 'Parent Company Accounts' },
						{ routerLink: '/main/outlet_account', image: 'Configurations', label: 'Outlets Accounts' },
					]
				},
				{
					image: 'Merchant',
					label: 'Merchant',
					is_parent: true,
					opened: false,
					children: [
						{ routerLink: '/main/parent_companies', image: 'Merchant', label: 'Parent Companies' },
						{ routerLink: '/main/brands', image: 'Merchant', label: 'BRANDS' },
						{ routerLink: '/main/outlets', image: 'Merchant', label: 'OUTLETS' },
						{ routerLink: '/main/deals', image: 'Merchant', label: 'OFFERS' },
					]
				},
				{
					image: 'Customers',
					label: 'Customers',
					is_parent: true,
					opened: false,
					children: [
						{ routerLink: '/main/customers/registered', image: 'Customers', label: 'Registrations' },
						{ routerLink: '/main/subscriptions/All', image: 'Customers', label: 'Subscriptions' },
						{ routerLink: '/main/customers/non_registered', image: 'Customers', label: 'Non Registered' },
						// { routerLink: '/main/customers/oredoo_billing', image: 'defaults', label: 'OOREDOO BILLING' },	
					]
				},
				{ routerLink: '/main/orders/All', image: 'Redemptions', label: 'Redemptions' },
				{
					image: 'Subscription_Packages',
					label: "Subscription"+ '\n' + "Packages",
					is_parent: true,
					opened: false,
					children: [
						{ routerLink: '/main/subscription-packages/eligible', image: 'Subscription_Packages', label: 'Eligible' },
						{ routerLink: '/main/subscription-packages/not_eligible', image: 'Subscription_Packages', label: 'Not Eligible' },
						{ routerLink: '/main/subscription-packages/card_only', image: 'Subscription_Packages', label: 'Card Only' },
					]
				},
				{
					image: 'Marketing',
					label: 'Marketing',
					is_parent: true,
					opened: false,
					children: [
						{ routerLink: '/main/notifications', image: 'Marketing', label: 'Push Notifications' },
						{ routerLink: '/main/newsms/list', image: 'Marketing', label: 'SMS' },
						{ routerLink: '/main/campaign', image: 'Marketing', label: 'In-App Banner' },
						{ routerLink:'/main/promo_codesNew', image:'Marketing', label:'Promo Code'},
						{ routerLink: '/main/access_codes', image: 'Marketing', label: 'Access Code' },
						{ routerLink: '/main/sms/list', image: 'Marketing', label: 'Old SMS' },
					]
				},
				{
					image: 'Delivery',
					label: 'Delivery',
					is_parent: true,
					opened: false,
					children: [
						{ routerLink: '/main/delivery_order', image: 'Delivery', label: 'Delivery Orders' },
						{ routerLink: '/main/unattended_orders', image: 'Delivery', label: 'Unattended Orders' }
					]
				},
				
				
				
				// {
				// 	image: 'campaign',
				// 	label: 'CAMPAIGN',
				// 	is_parent: true,
				// 	opened: false,
				// 	children: [
						
				// 	]
				// },
				
				
				// { routerLink: '/main/interest_tag', image: 'interest tag', label: 'INTEREST TAG' },
				
				// { routerLink: '/main/promo_codes', image: 'promo codes', label: 'PROMO CODES' },
				
				
				// {
				// 	image: 'credit card packages',
				// 	label: 'PACKAGES',
				// 	is_parent: true,
				// 	opened: false,
				// 	children: [
						
						
				// 	]
				// },
				{
					image: 'Configurations',
					label: 'Configurations',
					is_parent: true,
					opened: false,
					children: [
						{ routerLink: 'kpi_report', image: 'Configurations', label: 'KPI REPORT' },
						{ routerLink: '/main/customers/reports', image: 'Configurations', label: 'Reports' },
						{ routerLink: '/main/credit-card-packages/ooredooUsers', image: 'dashboard', label: ' Old Ooredoo Package' },
						{ routerLink: '/main/credit-card-packages/nonOoredooUsers', image: 'dashboard', label: 'Old Non Ooredoo Package' },
						{ routerLink: '/main/promo_codes', image: 'access_codes', label: 'Old Promo Codes' },
						// { routerLink: '/main/promo_codes', image: 'Configurations', label: 'Promo Code' },
						// { routerLink: '/main/credit-card-packages/ooredooUsers', image: 'dConfigurations', label: 'Ooredoo' }, 
						// { routerLink: '/main/credit-card-packages/nonOoredooUsers', image: 'Configurations', label: 'Non Ooredoo' },
						
					]
				},
				{
					image: 'credit_card',
					label: 'Packages',
					is_parent: true,
					opened: false,
					children: [
						{ routerLink: '/main/credit-card-packages/ooredooUsers', image: 'dashboard', label: 'Ooredoo' },
						{ routerLink: '/main/credit-card-packages/nonOoredooUsers', image: 'dashboard', label: 'Non Ooredoo' },
						{ routerLink: '/main/promo_codes', image: 'access_codes', label: 'Promo Codes' },
					]
				},
			]
		 } 	else if (UrbanpointAdmin.role == 2 && this.selectedApp != 1) {
			this.menus = [
				{
					image: 'Merchant_Portals',
					label: 'Merchant Portals',
					is_parent: true,
					opened: false,
					children: [
						{ routerLink: '/main/merchant_account', image: 'Merchant_Portals', label: 'Parent Company Accounts' },
						{ routerLink: '/main/outlet_account', image: 'Configurations', label: 'Outlets Accounts' },
					]
				},
				{
					image: 'Merchant',
					label: 'Merchant',
					is_parent: true,
					opened: false,
					children: [
						{ routerLink: '/main/parent_companies', image: 'Merchant', label: 'Parent Companies' },
						{ routerLink: '/main/brands', image: 'Merchant', label: 'BRANDS' },
						{ routerLink: '/main/outlets', image: 'Merchant', label: 'OUTLETS' },
						{ routerLink: '/main/deals', image: 'Merchant', label: 'OFFERS' },
					]
				},
				
				
				{
					image: 'Customers',
					label: 'Customers',
					is_parent: true,
					opened: false,
					children: [
						{ routerLink: '/main/customers/registered', image: 'Customers', label: 'Registrations' },
						{ routerLink: '/main/subscriptions/All', image: 'Customers', label: 'Subscriptions' },
						{ routerLink: '/main/customers/non_registered', image: 'Customers', label: 'Non Registered' },
						
						// { routerLink: '/main/customers/oredoo_billing', image: 'defaults', label: 'OOREDOO BILLING' },
						
					]
				},
				{ routerLink: '/main/orders/All', image: 'Redemptions', label: 'Redemptions' },
				{
					image: 'Marketing',
					label: 'Marketing',
					is_parent: true,
					opened: false,
					children: [
						{ routerLink: '/main/notifications', image: 'Marketing', label: 'Push Notifications' },
						{ routerLink: '/main/newsms/list', image: 'Marketing', label: 'SMS' },
						{ routerLink: '/main/campaign', image: 'Marketing', label: 'In-App Banner' },
						{ routerLink:'/main/promo_codesNew', image:'Marketing', label:'Promo Code'},
						{ routerLink: '/main/sms/list', image: 'Marketing', label: 'Old SMS' },
						
					]
				},
				{
					image: 'Delivery',
					label: 'Delivery',
					is_parent: true,
					opened: false,
					children: [
						{ routerLink: '/main/delivery_order', image: 'Delivery', label: 'Delivery Orders' },
						{ routerLink: '/main/unattended_orders', image: 'Delivery', label: 'Unattended Orders' }
					]
				},
				{
					image: 'Configurations',
					label: 'Configurations',
					is_parent: true,
					opened: false,
					children: [
						{ routerLink: 'kpi_report', image: 'Configurations', label: 'KPI REPORT' },
						{ routerLink: '/main/customers/reports', image: 'Configurations', label: 'Reports' },
						{ routerLink: '/main/credit-card-packages/ooredooUsers', image: 'dashboard', label: ' Old Ooredoo Package' },
						{ routerLink: '/main/credit-card-packages/nonOoredooUsers', image: 'dashboard', label: 'Old Non Ooredoo Package' },
						{ routerLink: '/main/promo_codes', image: 'access_codes', label: 'Old Promo Codes' },
						// { routerLink: '/main/promo_codes', image: 'Configurations', label: 'Promo Code' },
						// { routerLink: '/main/credit-card-packages/ooredooUsers', image: 'Configurations', label: 'Ooredoo' }, 
						// { routerLink: '/main/credit-card-packages/nonOoredooUsers', image: 'Configurations', label: 'Non Ooredoo' },
						
					]
				},
				{
					image: 'credit_card',
					label: 'Packages',
					is_parent: true,
					opened: false,
					children: [
						{ routerLink: '/main/credit-card-packages/ooredooUsers', image: 'dashboard', label: 'Ooredoo' },
						{ routerLink: '/main/credit-card-packages/nonOoredooUsers', image: 'dashboard', label: 'Non Ooredoo' },
						{ routerLink: '/main/promo_codes', image: 'access_codes', label: 'Promo Codes' },
					]
				},
				
				// {
				// 	image: 'campaign',
				// 	label: 'CAMPAIGN',
				// 	is_parent: true,
				// 	opened: false,
				// 	children: [
				// 		{ routerLink: '/main/campaign', image: 'dashboard', label: 'PROMO IMAGE' },
				// 	]
				// },
				
				// { routerLink: '/main/interest_tag', image: 'interest tag', label: 'INTEREST TAG' },
				// { routerLink: '/main/access_codes', image: 'access codes', label: 'ACCESS CODES' },
				// {
				// 	image: 'credit card packages',
				// 	label: 'PACKAGES',
				// 	is_parent: true,
				// 	opened: false,
				// 	children: [
				// 		{ routerLink: '/main/credit-card-packages/ooredooUsers', image: 'dashboard', label: 'OOREDOO' },
				// 		{ routerLink: '/main/credit-card-packages/nonOoredooUsers', image: 'dashboard', label: 'NON OOREDOO' },
				// 		{ routerLink: '/main/promo_codes', image: 'access_codes', label: 'PROMO CODES' },
				// 	]
				// },
			]
		}  
		else if (UrbanpointAdmin.role == 3) {
			this.menus = [
				{
					image: 'Merchant_Portals',
					label: 'Merchant Portals',
					is_parent: true,
					opened: false,
					children: [
						{ routerLink: '/main/merchant_account', image: 'Merchant_Portals', label: 'Parent Company Accounts' },
						{ routerLink: '/main/outlet_account', image: 'Configurations', label: 'Outlets Accounts' }, 
					]
				},
				{
					image: 'Merchant',
					label: 'Merchant',
					is_parent: true,
					opened: false,
					children: [
						{ routerLink: '/main/parent_companies', image: 'Merchant', label: 'Parent Companies' },
						{ routerLink: '/main/brands', image: 'Merchant', label: 'BRANDS' },
						{ routerLink: '/main/outlets', image: 'Merchant', label: 'OUTLETS' },
						{ routerLink: '/main/deals', image: 'Merchant', label: 'OFFERS' },
					]
				},
				{
					image: 'Customers',
					label: 'Customers',
					is_parent: true,
					opened: false,
					children: [
						{ routerLink: '/main/customers/registered', image: 'Customers', label: 'Registrations' },
						{ routerLink: '/main/subscriptions/All', image: 'Customers', label: 'Subscriptions' },
						{ routerLink: '/main/customers/non_registered', image: 'Customers', label: 'Non Registered' },
						
						// { routerLink: '/main/customers/oredoo_billing', image: 'defaults', label: 'OOREDOO BILLING' },
						
					]
				},
				{ routerLink: '/main/orders/All', image: 'Redemptions', label: 'Redemptions' },
				
				
				
				// {
				// 	image: 'customers',
				// 	label: 'CUSTOMERS',
				// 	is_parent: true,
				// 	opened: false,
				// 	children: [
						
						
				// 	]
				// },
				{
					image: 'Delivery',
					label: 'Delivery',
					is_parent: true,
					opened: false,
					children: [
						{ routerLink: '/main/delivery_order', image: 'Delivery', label: 'Delivery Orders' },
						{ routerLink: '/main/unattended_orders', image: 'Delivery', label: 'Unattended Orders' }
					]
				},
				{
					image: 'Configurations',
					label: 'Configurations',
					is_parent: true,
					opened: false,
					children: [
						
						
						{ routerLink: '/main/customers/reports', image: 'Configurations', label: 'Reports' },
						// { routerLink: '/main/promo_codes', image: 'Configurations', label: 'Promo Code' },
						{ routerLink: '/main/customers/oredoo_billing', image: 'Configurations', label: 'Ooredoo Billing' },
						{ routerLink: '/main/credit-card-packages/ooredooUsers', image: 'dashboard', label: ' Old Ooredoo Package' },
						{ routerLink: '/main/credit-card-packages/nonOoredooUsers', image: 'dashboard', label: 'Old Non Ooredoo Package' },
						{ routerLink: '/main/promo_codes', image: 'access_codes', label: 'Old Promo Codes' },
						
						
					]
				},
				{
					image: 'credit_card',
					label: 'Packages',
					is_parent: true,
					opened: false,
					children: [
						{ routerLink: '/main/credit-card-packages/ooredooUsers', image: 'dashboard', label: 'Ooredoo' },
						{ routerLink: '/main/credit-card-packages/nonOoredooUsers', image: 'dashboard', label: 'Non Ooredoo' },
						{ routerLink: '/main/promo_codes', image: 'access_codes', label: 'Promo Codes' },
					]
				},
				
				
			]
		}
		else if (UrbanpointAdmin.role == 1 && this.selectedApp != 1){
			this.menus = [
				{ routerLink: '/main/team', image: 'Team', label: 'Team' },
				{
					image: 'Merchant_Portals',
					label: 'Merchant Portals',
					is_parent: true,
					opened: false,
					children: [
						{ routerLink: '/main/merchant_account', image: 'Merchant_Portals', label: 'Parent Company Accounts' },
						{ routerLink: '/main/outlet_account', image: 'Merchant_Portals', label: 'Outlet Accounts' },
					]
				},
				{
					image: 'Merchant',
					label: 'Merchant',
					is_parent: true,
					opened: false,
					children: [
						{ routerLink: '/main/parent_companies', image: 'Merchant', label: 'Parent Companies' },
						{ routerLink: '/main/brands', image: 'Merchant', label: 'BRANDS' },
						{ routerLink: '/main/outlets', image: 'Merchant', label: 'OUTLETS' },
						{ routerLink: '/main/deals', image: 'Merchant', label: 'OFFERS' },
						{ routerLink: '/main/merchant_report', image: 'Merchant', label: 'Merchant Reports' },
					]
				},
				{
					image: 'Categories',
					label: 'Categories & Tags',
					is_parent: true,
					opened: false,
					children: [
						{ routerLink: '/main/categories', image: 'Categories', label: 'Main Categories' },
						{ routerLink: '/main/trending_search', image: 'Categories', label: 'Trending Search Keywords' },
						{ routerLink: '/main/interest_tag', image: 'Categories', label: 'Interests' },
						{ routerLink: '/main/popularcategories', image: 'Categories', label: 'Popular Categories' },
						{ routerLink: '/main/collection', image: 'Categories', label: 'Subcategories' },
					]
				},
				{
					image: 'Customers',
					label: 'Customers',
					is_parent: true,
					opened: false,
					children: [
						{ routerLink: '/main/customers/registered', image: 'Customers', label: 'Registrations' },
						{ routerLink: '/main/subscriptions/All', image: 'Customers', label: 'Subscriptions' },
						{ routerLink: '/main/customers/non_registered', image: 'Customers', label: 'Non Registered' },
						
						// { routerLink: '/main/customers/oredoo_billing', image: 'defaults', label: 'OOREDOO BILLING' },
						
					]
				},
				{ routerLink: '/main/orders/All', image: 'Redemptions', label: 'Redemptions' },
				{
					image: 'Marketing',
					label: 'Marketing',
					is_parent: true,
					opened: false,
					children: [
						{ routerLink: '/main/notifications', image: 'Marketing', label: 'Push Notifications' },
						{ routerLink: '/main/newsms/list', image: 'Marketing', label: 'SMS' },
						{ routerLink: '/main/campaign', image: 'Marketing', label: 'In-App Banner' },
						{ routerLink: '/main/web_redemption', image: 'Marketing', label: 'Web Vouchers'},
						{ routerLink:'/main/promo_codesNew', image:'Marketing', label:'Promo Code'},
						{ routerLink: '/main/access_codes', image: 'Marketing', label: 'Access Code' },
						{ routerLink: '/main/sms-blacklist', image: 'Marketing', label: 'SMS Blacklist' },
						{ routerLink: '/main/sms/list', image: 'Marketing', label: 'Old SMS' },
						
					]
				},
				{
					image: 'Delivery',
					label: 'Delivery',
					is_parent: true,
					opened: false,
					children: [
						{ routerLink: '/main/delivery_order', image: 'Delivery', label: 'Delivery Orders' },
						{ routerLink: '/main/unattended_orders', image: 'Delivery', label: 'Unattended Orders' },
						{ routerLink: '/main/restaurants', image: 'Delivery', label: 'Delivery Brands' },
						{ routerLink: '/main/Delivery_categories', image: 'Delivery', label: 'Delivery Categories' },
						{ routerLink: '/main/kill_switch', image: 'Delivery', label: 'Killswitch' },
						
						// { routerLink: '/main/outlet_account', image: 'merchants', label: 'OUTLET ACCOUNT' },
						
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

				{
					image: 'Configurations',
					label: 'Configurations',
					is_parent: true,
					opened: false,
					children: [
						{routerLink: 'kpi_report', image: 'Configurations', label: 'Kpi Report'},
						{ routerLink: '/main/customers/reports', image: 'Configurations', label: 'Reports' },
						// { routerLink: '/main/promo_codes', image: 'Configurations', label: 'Promo Code' },
						{ routerLink: '/main/customers/oredoo_billing', image: 'Configurations', label: 'Ooredoo Billing' },
						// { routerLink: '/main/credit-card-packages/ooredooUsers', image: 'Configurations', label: 'Ooredoo' },
						// { routerLink: '/main/credit-card-packages/nonOoredooUsers', image: 'Configurations', label: 'Non Ooredoo' },
						{ routerLink: '/main/delivery_playlist', image: 'Configurations', label: 'Delivery Playlist' }, 
						{ routerLink: '/main/delivery_playlist_parentOutlet', image: 'Configurations', label: 'Delivery Playlist Parent Outlet' },
						{ routerLink: '/main/spendXYList', image: 'Configurations', label: '25% Offers' },
						{ routerLink: '/main/home_screen_messages', image: 'Configurations', label: 'Home Screen Messages' },
						{ routerLink: '/main/subscription_text', image: 'Configurations', label: 'Subscription Text' }, 
						{ routerLink: '/main/subscription_page', image: 'Configurations', label: 'Subscription Page' },
						{ routerLink: '/main/uber_status', image: 'Configurations', label: 'Uber Status' },
						{ routerLink: '/main/offer_detail_messages', image: 'Configurations', label: 'Offer Detail Messages' },
						{ routerLink: '/main/versions', image: 'Configurations', label: 'Versions' },
						{ routerLink: '/main/playlist', image: 'Configurations', label: 'Category Playlist' },
						{ routerLink: '/main/credit-card-packages/ooredooUsers', image: 'dashboard', label: ' Old Ooredoo Package' },
						{ routerLink: '/main/credit-card-packages/nonOoredooUsers', image: 'dashboard', label: 'Old Non Ooredoo Package' },
						{ routerLink: '/main/promo_codes', image: 'access_codes', label: 'Old Promo Codes' },
						
						
						
					]
				},
				{
					image: 'credit_card',
					label: 'Packages',
					is_parent: true,
					opened: false,
					children: [
						{ routerLink: '/main/credit-card-packages/ooredooUsers', image: 'dashboard', label: 'Ooredoo' },
						{ routerLink: '/main/credit-card-packages/nonOoredooUsers', image: 'dashboard', label: 'Non Ooredoo' },
						{ routerLink: '/main/promo_codes', image: 'access_codes', label: 'Promo Codes' },
					]
				},
				{ routerLink: '/main/edit-history-list', image: 'CMS_History', label: 'CMS Editing History' },
				
				
				// { routerLink: '/main/Ooredo-Billing', image: 'deals', label: 'Ooredoo Billing' },
				// {
				// 	image: 'customers',
				// 	label: 'CUSTOMERS',
				// 	is_parent: true,
				// 	opened: false,
				// 	children: [
						
						
				// 	]
				// },
				
				
					
				// {
				// 	image: 'campaign',
				// 	label: 'CAMPAIGN',
				// 	is_parent: true,
				// 	opened: false,
				// 	children: [
						
				// 	]
				// },
				
				
				
				
				// { routerLink: '/main/promo_codes', image: 'promo codes', label: 'PROMO CODES' },
				
				
				
				// {
				// 	image: 'default',
				// 	label: 'DEFAULTS',
				// 	is_parent: true,
				// 	opened: false,
				// 	children: [
				// 		// {routerLink: '/main/Transactions', image: 'defaults', label: 'Balance Transaction'},
						
						
				// 	]
				// },
				// {
				// 	image: 'credit card packages',
				// 	label: 'PACKAGES',
				// 	is_parent: true,
				// 	opened: false,
				// 	children: [
						
						
				// 	]
				// },
			]
		}
		else {
			this.menus = [
				{ routerLink: '/main/team', image: 'Team', label: 'Team' },
				{
					image: 'Merchant_Portals',
					label: 'Merchant Portals',
					is_parent: true,
					opened: false,
					children: [
						{ routerLink: '/main/merchant_account', image: 'Merchant_Portals', label: 'Parent Company Accounts' },
						{ routerLink: '/main/outlet_account', image: 'Merchant_Portals', label: 'Outlet Accounts' },
					]
				},
				{
					image: 'Merchant',
					label: 'Merchant',
					is_parent: true,
					opened: false,
					children: [
						{ routerLink: '/main/parent_companies', image: 'Merchant', label: 'Parent Companies' },
						{ routerLink: '/main/brands', image: 'Merchant', label: 'Brands' },
						{ routerLink: '/main/outlets', image: 'Merchant', label: 'Outlets' },
						{ routerLink: '/main/deals', image: 'Merchant', label: 'Offers' },
						{ routerLink: '/main/merchant_report', image: 'Merchant', label: 'Merchant Reports' },
					]
				},
				{
					image: 'Categories',
					label: 'Categories & Tags',
					is_parent: true,
					opened: false,
					children: [
						{ routerLink: '/main/categories', image: 'Categories', label: 'Main Categories' },
						{ routerLink: '/main/trending_search', image: 'Categories', label: 'Trending Search Keywords' },
						{ routerLink: '/main/interest_tag', image: 'Categories', label: 'Interests' },
						{ routerLink: '/main/popularcategories', image: 'Categories', label: 'Popular Categories' },
						{ routerLink: '/main/collection', image: 'Categories', label: 'Subcategories' },
					]
				},

				{
					image: 'Customers',
					label: 'Customers',
					is_parent: true,
					opened: false,
					children: [
						{ routerLink: '/main/customers/registered', image: 'Customers', label: 'Registrations' },
						{ routerLink: '/main/subscriptions/All', image: 'Customers', label: 'Subscriptions' },
						{ routerLink: '/main/customers/non_registered', image: 'Customers', label: 'Non Registered' },
						
						// { routerLink: '/main/customers/oredoo_billing', image: 'defaults', label: 'OOREDOO BILLING' },
						
					]
				},
				{ routerLink: '/main/orders/All', image: 'Redemptions', label: 'Redemptions' },
				// { routerLink: '/main/Ooredo-Billing', image: 'deals', label: 'Ooredoo Billing' },
				{
					image: 'Subscription_Packages',
					label: "Subscription"+ '\n' + "Packages",
					is_parent: true,
					opened: false,
					children: [
						{ routerLink: '/main/subscription-packages/eligible', image: 'Subscription_Packages', label: 'Eligible' },
						{ routerLink: '/main/subscription-packages/not_eligible', image: 'Subscription_Packages', label: 'Not Eligible' },
						{ routerLink: '/main/subscription-packages/card_only', image: 'Subscription_Packages', label: 'Card Only' },
						// { routerLink: '/main/credit-card-packages/nonOoredooUsers', image: 'dashboard', label: 'NON OOREDOO' },
					]
				},
				{
					image: 'Marketing',
					label: 'Marketing',
					is_parent: true,
					opened: false,
					children: [
						{ routerLink: '/main/notifications', image: 'Marketing', label: 'Push Notifications' },
						{ routerLink: '/main/newsms/list', image: 'Marketing', label: 'SMS' },
						{ routerLink: '/main/campaign', image: 'Marketing', label: 'In-App Banner' },
						{ routerLink: '/main/web_redemption', image: 'Marketing', label: 'Web Vouchers'},
						{ routerLink:'/main/promo_codesNew', image:'Marketing', label:'Promo Code'},
						{ routerLink: '/main/access_codes', image: 'Marketing', label: 'Access Code' },
						{ routerLink: '/main/sms-blacklist', image: 'Marketing', label: 'SMS Blacklist' },
						{ routerLink: '/main/sms/list', image: 'Marketing', label: 'Old SMS' },
					]
				},
				{
					image: 'Delivery',
					label: 'Delivery',
					is_parent: true,
					opened: false,
					children: [
						{ routerLink: '/main/delivery_order', image: 'Delivery', label: 'Delivery Orders' },
						{ routerLink: '/main/unattended_orders', image: 'Delivery', label: 'Unattended Orders' },
						{ routerLink: '/main/restaurants', image: 'Delivery', label: 'Delivery Brands' },
						{ routerLink: '/main/Delivery_categories', image: 'Delivery', label: 'Delivery Categories' },
						{ routerLink: '/main/kill_switch', image: 'Delivery', label: 'Killswitch' },
					]
				},
				{
					image: 'Configurations',
					label: 'Configurations',
					is_parent: true,
					opened: false,
					children: [
						{routerLink: 'kpi_report', image: 'Configurations', label: 'Kpi Report'},
						{ routerLink: '/main/customers/reports', image: 'Configurations', label: 'Reports' },
						// { routerLink: '/main/promo_codes', image: 'Configurations', label: 'Promo Code' },
						{ routerLink: '/main/customers/oredoo_billing', image: 'Configurations', label: 'Ooredoo Billing' },
						// { routerLink: '/main/credit-card-packages/ooredooUsers', image: 'Configurations', label: 'Ooredoo' },
						// { routerLink: '/main/credit-card-packages/nonOoredooUsers', image: 'Configurations', label: 'Non Ooredoo' },
						{ routerLink: '/main/delivery_playlist', image: 'Configurations', label: 'Delivery Playlist' }, 
						{ routerLink: '/main/delivery_playlist_parentOutlet', image: 'Configurations', label: 'Delivery Playlist Parent Outlet' },
						{ routerLink: '/main/spendXYList', image: 'Configurations', label: '25% Offers' },
						{ routerLink: '/main/home_screen_messages', image: 'Configurations', label: 'Home Screen Messages' },
						{ routerLink: '/main/subscription_text', image: 'Configurations', label: 'Subscription Text' }, 
						{ routerLink: '/main/subscription_page', image: 'Configurations', label: 'Subscription Page' },
						{ routerLink: '/main/uber_status', image: 'Configurations', label: 'Uber Status' },
						{ routerLink: '/main/offer_detail_messages', image: 'Configurations', label: 'Offer Detail Messages' },
						{ routerLink: '/main/versions', image: 'Configurations', label: 'Versions' },
						{ routerLink: '/main/playlist', image: 'Configurations', label: 'Category Playlist' },
						{ routerLink: '/main/credit-card-packages/ooredooUsers', image: 'dashboard', label: ' Old Ooredoo Package' },
						{ routerLink: '/main/credit-card-packages/nonOoredooUsers', image: 'dashboard', label: 'Old Non Ooredoo Package' },
						{ routerLink: '/main/promo_codes', image: 'access_codes', label: 'Old Promo Codes' },
							
						
						// { routerLink: '/main/sms/list', image: 'Configurations', label: 'SMS' },	
					]
				},
				// {
				// 	image: 'credit_card',
				// 	label: 'Packages',
				// 	is_parent: true,
				// 	opened: false,
				// 	children: [
				// 		{ routerLink: '/main/credit-card-packages/ooredooUsers', image: 'dashboard', label: 'Ooredoo' },
				// 		{ routerLink: '/main/credit-card-packages/nonOoredooUsers', image: 'dashboard', label: 'Non Ooredoo' },
				// 		{ routerLink: '/main/promo_codes', image: 'access_codes', label: 'Promo Codes' },
				// 	]
				// },
				{ routerLink: '/main/edit-history-list', image: 'CMS_History', label: 'CMS Editing History' }, 
				// {
				// 	image: 'customers',
				// 	label: 'CUSTOMERS',
				// 	is_parent: true,
				// 	opened: false,
				// 	children: [
						
						
						
						
				// 	]
				// },
				// {
				// 	image: 'customers',
				// 	label: 'FOOD & DELIVERY',
				// 	is_parent: true,
				// 	opened: false,
				// 	children: [
						
						
				// 		// { routerLink: '/main/outlet_account', image: 'merchants', label: 'OUTLET ACCOUNT' },
						
				// 		// {
				// 		// 	image: 'dashboard',
				// 		// 	label: 'SETTINGS',
				// 		// 	is_parent: true,
				// 		// 	opened: false,
				// 		// 	children: [
				// 		// 		// { routerLink: '/main/restaurants/mainMenuItem', image: 'defaults', label: 'MAIN MENU ITEM' },
				// 		// 		{ routerLink: '/main/Delivery_categories', image: 'defaults', label: 'DELIVERY CATEGORIES' },
				// 		// 		{ routerLink: '/main/delivery_playlist', image: 'defaults', label: 'DELIVERY PLAYLIST' },
				// 		// 		{ routerLink: '/main/delivery_playlist_parentOutlet', image: 'defaults', label: 'DELIVERY PLAYLIST PARENT OUTLET' },
				// 		// 	]
				// 		// },
				// 		// { routerLink: '/main/customers/oredoo_billing', image: 'defaults', label: 'SETTINGS' },
				// 	]
				// },
				
				
						
				// {
				// 	image: 'campaign',
				// 	label: 'CAMPAIGN',
				// 	is_parent: true,
				// 	opened: false,
				// 	children: [
						
				// 	]
				// },
				
				
				
				
				// { routerLink: '/main/promo_codes', image: 'promo codes', label: 'PROMO CODES' },
				
				
				
				// {
				// 	image: 'default',
				// 	label: 'DEFAULTS',
				// 	is_parent: true,
				// 	opened: false,
				// 	children: [
				// 		// {routerLink: '/main/Transactions', image: 'defaults', label: 'Balance Transaction'},
				// 	]
				// },
				// {
				// 	image: 'credit card packages',
				// 	label: 'PACKAGES',
				// 	is_parent: true,
				// 	opened: false,
				// 	children: [
						
						
				// 	]
				// },
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

// test