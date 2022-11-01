import { EditHistoryListComponent } from './views/defaults/edit-history-list/edit-history-list.component';
import { SmsBlacklistComponent } from './views/defaults/sms-blacklist/sms-blacklist.component';
import { DeliveryKillSwitchLogsComponent } from './views/delivery-kill-switch-logs/delivery-kill-switch-logs.component';
import { AssignPromotionComponent } from './views/food_delevery/assign-promotion/assign-promotion.component';
import { SpendXyformComponent } from './views/food_delevery/spend-xyform/spend-xyform.component';

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


import { AppComponent } from './app.component';
import { LoginComponent } from './views/auth/login/login.component';
import { TemplateMainApp } from './templates/template-main-app/template-main-app.component';

import { AuthGuard, MainAuthGuard } from './guards';
import { ForgotPasswordComponent } from './views/auth/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './views/auth/reset-password/reset-password.component';
import { AdminsListComponent, AdminsFormComponent } from './views/admins';
import { MerchantsFormComponent, MerchantsListComponent, MultipleOutletsFormComponent } from './views/merchants';
import { DealsFormComponent, DealsListComponent } from './views/deals';
import { menuOutletComponent, OutletsFormComponent, outletsImage, OutletsListComponent } from './views/outlets';
import { CustomersListComponent, CustomerSMSLogsComponent } from './views/customers';
import { AccessCodesFormComponent, AccessCodesListComponent } from './views/access_codes';
import { OrdersListComponent } from './views/orders';
import { NotificationsListComponent, NotificationsFormComponent } from './views/notifications';
// import { AutomatedNotificationsFormComponent, AutomatedNotificationsListComponent } from './views/notifications/automated_notifications';
import { VersionsComponent } from './views/defaults/versions';
import { HomeScreenMessagesComponent } from './views/defaults/home_screen_messages';
import { SubscriptionTextComponent } from './views/defaults/subscription_text';
import { SubscriptionPageComponent } from './views/defaults/subscription_page';
import { UberStatusComponent } from './views/defaults/uber_status';
import { SubscriptionsListComponent } from './views/subscriptions/subscriptions.component';
import { SubscriptionLogsComponent } from './views/subscriptions/subscriptions-logs/subscriptions-logs.component';
import { OrderReviewsComponent } from './views/order_reviews';
import { MultipleDealsFormComponent } from './views/outlets/multiple_deals.component';
import { CustomersFormComponent } from './views/customers/customers-form.component';
import { OredooCustomersComponent } from './views/customers/oredoo_customers.component';
import { SMSLogsComponent } from './views/subscriptions/sms-logs/sms_logs.component';
import { AppsGuard } from './guards/apps.guard';
import { PromoCodesListComponent, PromoCodesFormComponent, PromoCodesFormNewComponent, PromoCodesListNewComponent } from './views/promo_code';
import { OfferDetailMessagesComponent } from "./views/defaults/offer_detail_message/offer_detail_messages.component";
import { SmsFormComponent, SmsListComponent, SmsCodeFormComponent } from './views/sms';
import { parentMenuOutlet, ParentOutletsFormComponent, ParentOutletsListComponent } from './views/parent_outlets';
import { ReportsComponent } from './views/customers/reports/reports.component';
import { CreditCardPackagesListComponent, CreditCardPackagesFormComponent } from "./views/credit_card_packages";
import { MerchantAccountFormComponent, MerchantAccountListComponent } from './views/merchant_account';
import { CampaignFormComponent, CampaignListComponent } from './views/campaign';
import { OoredoBillingComponent } from './views/ooredo-billing/ooredo-billing.component';
import { InterestTagListComponent, InterestTagFormComponent } from './views/interest_tag';
import { CategoriesComponent, CategoriesFormComponent } from './views/defaults/categories';
import { PopularCategoriesComponent, PopularCategoriesFormComponent } from './views/defaults/popular_categories';
import { CollectionFormComponent, CollectionComponent } from './views/defaults/collection';
import { PlaylistFormComponent, PlaylistComponent } from './views/defaults/category_playlist';
import { TrendingSearchComponent } from './views/defaults/trending_search';
import { RestaurantsListComponent, RestaurantsFormComponent } from './views/food_delevery/delivery_outlet';

import { MenuItemsFormComponent } from './views/food_delevery/menu_form';
import { MainMenuListComponent, MainMenuFormComponent } from './views/food_delevery/main_menu_item';
import { TypeListComponent, TypeFormComponent } from './views/food_delevery/settings/Delivery_categories';
import { DeliveryPlaylistComponent, DeliveryPlaylistFormComponent } from './views/food_delevery/settings/Delivery_playlist';
import { DeliveryPlaylistParentOutletFormComponent } from './views/food_delevery/settings/deliver_playlist_to_parentoutlet';
import { PromotionFormComponent, PromotionComponent } from './views/food_delevery/settings/promotion';
import { SubMenuFormComponent, SubMenuListComponent } from './views/food_delevery/sub_menu';
import { SubMenuItemListComponent, SubMenuItemFormComponent } from './views/food_delevery/sub_menu_item';
import { RestaurantMenuListComponent } from './views/food_delevery/menu_listing';
import { OutletAccountFormComponent, OutletAccountListComponent } from './views/food_delevery/settings/outlet_account';
import { DeliveryCategoryParentOutletFormComponent } from './views/food_delevery/settings/deliver_category_to_parentoutlet';
import { DeliveryOrdersListComponent, DeliveryOrdersDetailListComponent } from './views/food_delevery/settings/Delivery_orders';
import { DeliveryCollectionParentOutletFormComponent } from './views/food_delevery/settings/deliver_collection_to_parentoutlet';
import { SpendXylistComponent } from './views/food_delevery/spend-xylist/spend-xylist.component';
import { MerchantReportComponent } from './views/merchant-report/merchant-report.component';
import { DeliveryKillSwitchComponent } from './views/delivery-kill-switch/delivery-kill-switch.component';
import { TrendingSearchFormComponent } from './views/defaults/trending_search/trending_search-form.component';
import { EligibleComponent, EligibleTestComponent } from './views/subscription-packages';
import { EligibleFormComponent } from './views/subscription-packages/eligible-form.component';
import { WebRedemptionListComponent } from './views/defaults/web_redemption/web_redemption-list.component';
import { WebRedemptionFormComponent } from './views/defaults/web_redemption/web_redemption-form.component';
import { WebRedemptionDetailListComponent } from './views/defaults/web_redemption/web_redemption-detail-list.component';
import {NewSmsListComponent} from './views/newsms/new-sms-list.component';
import {NewSmsFormComponent} from './views/newsms/new-sms-form.component';
import {SmsDetailComponent} from './views/newsms/sms-detail.component';
import {TransactionsComponent} from './views/defaults/transactions/transactions.component'
import {KpiReportComponent} from './views/kpi-report/kpi-report.component';
import { UploadMultipleBrandsComponent } from './views/parent_outlets/upload-multiple-brands.component';
import {OutletTagsListComponent, SelectBrandsOrOutletsListComponent, AddTagsComponent, SelectTagsComponent} from './views/outlets_tags/index';



const publicRoutes: Routes = [
	{ path: '', redirectTo: 'login', pathMatch: 'full' },
	{ path: 'login', component: LoginComponent },
	{ path: 'forgot-password', component: ForgotPasswordComponent },
	{ path: 'reset-password', component: ResetPasswordComponent },
	{ path: 'reset-pin', component: ResetPasswordComponent },
];

const mainApp: Routes = [

	{ path: '', redirectTo: 'parent_companies', pathMatch: 'full' },


	{ path: 'parent_companies', component: MerchantsListComponent, canActivate: [AppsGuard], data: { roles: ['1', '2'] } },
	{ path: 'parent_companies/:id', component: MerchantsFormComponent, canActivate: [AppsGuard], data: { roles: ['1', '2'] } },
	{ path: 'parent_companies/multiple_outlets/:id', component: MultipleOutletsFormComponent, canActivate: [AppsGuard], data: { roles: ['1', '2'] } },
	// parent outlet code
	{ path: 'restaurants', component: RestaurantsListComponent, canActivate: [AppsGuard], data: { roles: ['1', '2'] } },
	{ path: 'restaurants/:id', component: RestaurantsFormComponent, canActivate: [AppsGuard], data: { roles: ['1', '2'] } },

	{ path: 'delivery_order', component: DeliveryOrdersListComponent, canActivate: [AppsGuard], data: { roles: ['1', '2'] } },
	{ path: 'unattended_orders', component: DeliveryOrdersListComponent, canActivate: [AppsGuard], data: { roles: ['1', '2'], isUnAttended: true } },
	{ path: 'delivery_order/:id', component: DeliveryOrdersDetailListComponent, canActivate: [AppsGuard], data: { roles: ['1', '2'] } },

	{ path: 'restaurants/deliveryCategory/:parentid', component: DeliveryCategoryParentOutletFormComponent, canActivate: [AppsGuard], data: { roles: ['1', '2'] } },
	{ path: 'restaurants/deliveryCollection/:parentid', component: DeliveryCollectionParentOutletFormComponent, canActivate: [AppsGuard], data: { roles: ['1', '2'] } },

	{ path: 'restaurants/mainMenuItem/:parentid', component: MainMenuListComponent, canActivate: [AppsGuard], data: { roles: ['1', '2'] } },
	{ path: 'restaurants/mainMenuItem/:parentid/menuForm/:MainMenuId', component: MainMenuFormComponent, canActivate: [AppsGuard], data: { roles: ['1', '2'] } },


	{ path: 'restaurants/mainMenuItem/:parentid/restaurantMenuList/:MainMenuId', component: RestaurantMenuListComponent, canActivate: [AppsGuard], data: { roles: ['1', '2'] } },
	{ path: 'restaurants/mainMenuItem/:parentid/restaurantMenuList/:MainMenuId/:ids', component: MenuItemsFormComponent, canActivate: [AppsGuard], data: { roles: ['1', '2'] } },

	{ path: 'restaurants/mainMenuItem/:parentid/restaurantMenuList/:MainMenuId/Menu/:Menuid', component: SubMenuListComponent, canActivate: [AppsGuard], data: { roles: ['1', '2'] } },
	{ path: 'restaurants/mainMenuItem/:parentid/restaurantMenuList/Menu/:Menuid/SubmenuForm/:id', component: SubMenuFormComponent, canActivate: [AppsGuard], data: { roles: ['1', '2'] } },


	{ path: 'restaurants/mainMenuItem/:parentid/restaurantMenuList/Menu/:Menuid/SubMenu/:subMenuItem', component: SubMenuItemListComponent, canActivate: [AppsGuard], data: { roles: ['1', '2'] } },
	{ path: 'restaurants/mainMenuItem/:parentid/restaurantMenuList/Menu/:Menuid/SubMenu/:subMenuItem/SubmenuItemForm/:submenuItemid', component: SubMenuItemFormComponent, canActivate: [AppsGuard], data: { roles: ['1', '2'] } },

	{ path: 'Delivery_categories', component: TypeListComponent, canActivate: [AppsGuard], data: { roles: ['1', '2'] } },
	{ path: 'Delivery_categories/menuValue/:ParentId', component: TypeListComponent, canActivate: [AppsGuard], data: { roles: ['1', '2'] } },
	{ path: 'Delivery_categories/:id', component: TypeFormComponent, canActivate: [AppsGuard], data: { roles: ['1', '2'] } },

	{ path: 'restaurants/:parentid/promotion', component: PromotionComponent, canActivate: [AppsGuard], data: { roles: ['1', '2'] } },
	{ path: 'restaurants/:parentid/promotionForm/:promotionid', component: PromotionFormComponent, canActivate: [AppsGuard], data: { roles: ['1', '2'] } },

	{ path: 'delivery_playlist', component: DeliveryPlaylistComponent, canActivate: [AppsGuard], data: { roles: ['1', '2'] } },
	{ path: 'delivery_playlist/:id', component: DeliveryPlaylistFormComponent, canActivate: [AppsGuard], data: { roles: ['1', '2'] } },
	{ path: 'delivery_playlist_parentOutlet', component: DeliveryPlaylistParentOutletFormComponent, canActivate: [AppsGuard], data: { roles: ['1', '2'] } },
	{ path: 'spendXYList', component: SpendXylistComponent, canActivate: [AppsGuard], data: { roles: ['1', '2'] } },
	{ path: 'spendXYForm/:id', component: SpendXyformComponent, canActivate: [AppsGuard], data: { roles: ['1', '2'] } },
	{ path: 'assignPromotion', component: AssignPromotionComponent, canActivate: [AppsGuard], data: { roles: ['1', '2'] } },
	{ path: 'outlet_account', component: OutletAccountListComponent, canActivate: [AppsGuard], data: { roles: ['1', '2', '3'] } },
	{ path: 'outlet_account/:id', component: OutletAccountFormComponent, canActivate: [AppsGuard], data: { roles: ['1'] } },

	//

	{ path: 'merchant_account', component: MerchantAccountListComponent, canActivate: [AppsGuard], data: { roles: ['1', '2', '3'] } },
	{ path: 'merchant_account/:id', component: MerchantAccountFormComponent, canActivate: [AppsGuard], data: { roles: ['1'] } },

	{ path: 'brands', component: ParentOutletsListComponent, canActivate: [AppsGuard], data: { roles: ['1', '2'] } },
	{ path: 'brands/upload_multiple_brands', component: UploadMultipleBrandsComponent, canActivate: [AppsGuard], data: { roles: ['1', '2'] } },
	{ path: 'brands/:id', component: ParentOutletsFormComponent, canActivate: [AppsGuard], data: { roles: ['1', '2'] } },
	{ path: 'brands/:id/:type', component: parentMenuOutlet, canActivate: [AppsGuard], data: {roles: ['1','2']}},

	{ path: 'outlets', component: OutletsListComponent, canActivate: [AppsGuard], data: { roles: ['1', '2', '3'] } },
	{ path: 'outlets/:id', component: OutletsFormComponent, canActivate: [AppsGuard], data: { roles: ['1', '2'] } },
	{path: 'outlet/:id/:type', component: menuOutletComponent, canActivate:[AppsGuard], data: {roles:['1', '2']}},
	{path:'outletImage/:id/:type', component: outletsImage , canActivate:[AppsGuard], data: {roles: ['1','2']}},

	{ path: 'outlets/multiple_deals/:id', component: MultipleDealsFormComponent, canActivate: [AppsGuard], data: { roles: ['1', '2'] } },
	{ path: 'deals', component: DealsListComponent, canActivate: [AppsGuard], data: { roles: ['1', '2', '3'] } },
	{ path: 'deals/:id', component: DealsFormComponent, canActivate: [AppsGuard], data: { roles: ['1', '2'] } },

	{ path: 'outlets_tags', component: OutletTagsListComponent, canActivate: [AppsGuard], data: { roles: ['1', '2', '3'] } },
	{ path: 'outlets_tags/select', component: SelectBrandsOrOutletsListComponent, canActivate: [AppsGuard], data: { roles: ['1', '2', '3'] } },
	{ path: 'outlets_tags/add', component: AddTagsComponent, canActivate: [AppsGuard], data: { roles: ['1', '2', '3'] } },
	{ path: 'outlets_tags/select/:id', component: SelectTagsComponent, canActivate: [AppsGuard], data: { roles: ['1', '2', '3'] } },


	{ path: 'notifications', component: NotificationsListComponent, canActivate: [AppsGuard], data: { roles: ['1', '2'] } },
	{ path: 'notifications/:id', component: NotificationsFormComponent, canActivate: [AppsGuard], data: { roles: ['1', '2'] } },

	{ path: 'credit-card-packages/:scenario', component: CreditCardPackagesListComponent, canActivate: [AppsGuard], data: { roles: ['1', '2'] } },
	{ path: 'credit-card-packages/:scenario/:id', component: CreditCardPackagesFormComponent, canActivate: [AppsGuard], data: { roles: ['1', '2'] } },

	{ path: 'subscription-packages/:scenario', component: EligibleComponent, canActivate: [AppsGuard], data: { roles: ['1', '2'] } },
	{ path: 'subscription-packages/:scenario/add', component: EligibleFormComponent, canActivate: [AppsGuard], data: { roles: ['1', '2'] } },
	{ path: 'subscription-packages/:scenario/:id', component: EligibleTestComponent, canActivate: [AppsGuard], data: { roles: ['1', '2'] } },

	{ path: 'subscription-packages/:scenario', component: EligibleComponent, canActivate: [AppsGuard], data: { roles: ['1', '2'] } },
	{ path: 'subscription-packages/:scenario/add', component: EligibleFormComponent, canActivate: [AppsGuard], data: { roles: ['1', '2'] } },
	{ path: 'subscription-packages/:scenario/:id', component: EligibleTestComponent, canActivate: [AppsGuard], data: { roles: ['1', '2'] } },

	{ path: 'campaign', component: CampaignListComponent, canActivate: [AppsGuard], data: { roles: ['1', '2'] } },
	{ path: 'campaign/:id', component: CampaignFormComponent, canActivate: [AppsGuard], data: { roles: ['1', '2'] } },


	{ path: 'newsms/list', component: NewSmsListComponent, canActivate: [AppsGuard], data: { roles: ['1', '2'] } },
	{ path: 'newsms/form', component: NewSmsFormComponent, canActivate: [AppsGuard], data: { roles: ['1', '2'] } },
	{ path: 'sms/detail/:id', component: SmsDetailComponent, canActivate: [AppsGuard], data: { roles: ['1', '2'] } },
	{ path: 'sms/list', component: SmsListComponent, canActivate: [AppsGuard], data: { roles: ['1', '2'] } },
	{ path: 'sms/form', component: SmsFormComponent, canActivate: [AppsGuard], data: { roles: ['1', '2'] } },
	{ path: 'sms/code/form', component: SmsCodeFormComponent, canActivate: [AppsGuard], data: { roles: ['1', '2'] } },

	{ path: 'subscription_text', component: SubscriptionTextComponent, canActivate: [AppsGuard], data: { roles: ['1'] } },
	{ path: 'subscription_page', component: SubscriptionPageComponent, canActivate: [AppsGuard], data: { roles: ['1'] } },
	{ path: 'uber_status', component: UberStatusComponent, canActivate: [AppsGuard], data: { roles: ['1'] } },
	{ path: 'customers/oredoo_billing', component: OredooCustomersComponent, canActivate: [AppsGuard], data: { roles: ['1'] } },
	{ path: 'customers/reports', component: ReportsComponent, canActivate: [AppsGuard], data: { roles: ['1', '2'] } },


	{ path: 'categories', component: CategoriesComponent, canActivate: [AppsGuard], data: { roles: ['other', '2', '1'] } },
	{ path: 'categories/:id', component: CategoriesFormComponent, canActivate: [AppsGuard], data: { roles: ['other', '2', '1'] } },

	{ path: 'collection', component: CollectionComponent, canActivate: [AppsGuard], data: { roles: ['other', '2', '1'] } },
	{ path: 'collection/:id', component: CollectionFormComponent, canActivate: [AppsGuard], data: { roles: ['other', '2', '1'] } },

	{ path: 'playlist', component: PlaylistComponent, canActivate: [AppsGuard], data: { roles: ['other', '2', '1'] } },
	{ path: 'playlist/:id', component: PlaylistFormComponent, canActivate: [AppsGuard], data: { roles: ['other', '2', '1'] } },

	{ path: 'popularcategories', component: PopularCategoriesComponent, canActivate: [AppsGuard], data: { roles: ['other', '2', '1'] } },
	{ path: 'popularcategories/:id', component: PopularCategoriesFormComponent, canActivate: [AppsGuard], data: { roles: ['other', '2', '1'] } },


	{ path: 'access_codes', component: AccessCodesListComponent, canActivate: [AppsGuard], data: { roles: ['other', '2'] } },
	{ path: 'access_codes/:id', component: AccessCodesFormComponent, canActivate: [AppsGuard], data: { roles: ['other', '2'] } },

	{ path: 'interest_tag', component: InterestTagListComponent, canActivate: [AppsGuard], data: { roles: ['other', '2'] } },
	{ path: 'interest_tag/add', component: InterestTagFormComponent, canActivate: [AppsGuard], data: { roles: ['other', '2'] } },
	{ path: 'interest_tag/:id', component: InterestTagFormComponent, canActivate: [AppsGuard], data: { roles: ['other', '2'] } },

	{ path: 'promo_codes', component: PromoCodesListComponent, canActivate: [AppsGuard], data: { roles: ['other', '2'] } },
	{ path: 'promo_codes/:id', component: PromoCodesFormComponent, canActivate: [AppsGuard], data: { roles: ['other', '2'] } },
	{ path:'promo_codesNew', component: PromoCodesListNewComponent, canActivate: [AppsGuard], data:{roles:['other', '2']}},
	{ path:'promo_codesNew/:id', component:PromoCodesFormNewComponent, canActivate: [AppsGuard], data:{roles:['other', '2']}},

	{path: 'kpi_report', component: KpiReportComponent, canActivate: [AppsGuard], data: {roles: ['1', '2']}},

	{ path: 'team', component: AdminsListComponent, canActivate: [AppsGuard], data: { roles: ['other'] } },
	{ path: 'team/:id', component: AdminsFormComponent, canActivate: [AppsGuard], data: { roles: ['other'] } },
	{ path: 'customers/subscriptions/:id', component: SubscriptionsListComponent, canActivate: [AppsGuard], data: { roles: ['other', '2', '3'] } },
	{ path: 'subscriptions/:id', component: SubscriptionsListComponent, canActivate: [AppsGuard], data: { roles: ['other', '2', 3] } },
	{ path: 'customers/orders/:id', component: OrdersListComponent, canActivate: [AppsGuard], data: { roles: ['other', '2'] } },
	{ path: 'customers/orders/:id/reviews/:order_id', component: OrderReviewsComponent, canActivate: [AppsGuard], data: { roles: ['other', '2'] } },
	{ path: 'orders/:id', component: OrdersListComponent, canActivate: [AppsGuard], data: { roles: ['other', '2', '3'] } },
	{ path: 'orders/:id/reviews/:order_id', component: OrderReviewsComponent, canActivate: [AppsGuard], data: { roles: ['other', '2'] } },
	{ path: 'customers/subscription_logs/:id', component: SubscriptionLogsComponent, canActivate: [AppsGuard], data: { roles: ['other', '2'] } },
	{ path: 'customers/sms_logs/:id', component: SMSLogsComponent, canActivate: [AppsGuard], data: { roles: ['other', '2'] } },
	{ path: 'customers/customers_sms_logs/:id', component: CustomerSMSLogsComponent, canActivate: [AppsGuard], data: { roles: ['other'] } },
	{ path: 'customers/:type', component: CustomersListComponent, canActivate: [AppsGuard], data: { roles: ['other', '2', 3] } },
	{ path: 'customers/edit/:id', component: CustomersFormComponent, canActivate: [AppsGuard], data: { roles: ['other', '2'] } },
	{ path: 'versions', component: VersionsComponent, canActivate: [AppsGuard], data: { roles: ['other'] } },
	{ path: 'home_screen_messages', component: HomeScreenMessagesComponent, canActivate: [AppsGuard], data: { roles: ['other'] } },
	{ path: 'offer_detail_messages', component: OfferDetailMessagesComponent, canActivate: [AppsGuard], data: { roles: ['other'] } },
	{ path: 'trending_search', component: TrendingSearchComponent, canActivate: [AppsGuard], data: { roles: ['other'] } },
	{ path: 'trending_search/add', component: TrendingSearchFormComponent, canActivate: [AppsGuard], data: { roles: ['other'] } },
	{ path: 'merchant_report', component: MerchantReportComponent, canActivate: [AppsGuard], data: { roles: ['other'] } },
	{ path: 'kill_switch', component: DeliveryKillSwitchComponent, canActivate: [AppsGuard] },
	{ path: 'kill_switch/logs', component: DeliveryKillSwitchLogsComponent, canActivate: [AppsGuard] },
	{ path: 'sms-blacklist', component: SmsBlacklistComponent, canActivate: [AppsGuard] },
	{ path: 'edit-history-list', component: EditHistoryListComponent, canActivate: [AppsGuard] },
	{ path: 'web_redemption', component: WebRedemptionListComponent, canActivate: [AppsGuard] },
	{ path: 'web_redemption/add', component: WebRedemptionFormComponent, canActivate: [AppsGuard] },
	{ path: 'web_redemption/:id', component: WebRedemptionDetailListComponent, canActivate: [AppsGuard] },
	{ path: 'Transactions', component: TransactionsComponent, canActivate: [AppsGuard], data: { roles: ['other', '2', '3'] } },

	// { path: 'Ooredo-Billing', component: OoredoBillingComponent, canActivate: [AppsGuard], data: { roles: ['1'] } },

];

const appRoutes: Routes = [
	{ path: '', redirectTo: '/auth/login', pathMatch: 'full' },
	{ path: 'auth', component: AppComponent, children: publicRoutes, canActivate: [AuthGuard] },
	{ path: 'main', component: TemplateMainApp, children: mainApp, canActivate: [MainAuthGuard] },
	// { path: 'main', component: TemplateMainApp, children: mainApp },
];


@NgModule({
	imports: [RouterModule.forRoot(appRoutes)],
	exports: [RouterModule],
	providers: []
})
export class AppRoutingModule { }
