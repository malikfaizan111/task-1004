import { MessagingService } from './services/messaging.service';

import { AsyncPipe, CommonModule, HashLocationStrategy, LocationStrategy } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AgmCoreModule, GoogleMapsAPIWrapper } from '@agm/core';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AuthGuard } from './guards/auth.guard';
import { MainAuthGuard } from './guards/main-auth.guard';
import { FlexLayoutModule } from "@angular/flex-layout";
import { MalihuScrollbarModule } from 'ngx-malihu-scrollbar';
import { AgularMaterialModule } from './material.module';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown'

import { NgxEmojiPickerModule } from "ngx-emoji-picker";

// Services
import { AuthService, MainService, PaginationService, BaseLoaderService } from './services';

// Lib
import { FilterDatePipe, AlertDialog, BaseLoaderComponent, PaginationComponent, MapLocationDialog, GetLocationDialog, FilePickerComponent, ExportCSVDialog, MultiTagInputComponent } from './lib';

// Config
import { appConfig } from '../config';

// Directives
import { ClickOutsideDirective } from './directives/click-outside.directive';

// Page Components
import { LoginComponent } from './views/auth/login/login.component';
import { TemplateMainApp } from './templates/template-main-app/template-main-app.component';
import { ForgotPasswordComponent } from './views/auth/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './views/auth/reset-password/reset-password.component';
import { AdminsListComponent, AdminsFormComponent } from './views/admins';
import { MerchantsFormComponent, MerchantsListComponent, MerchantDetailsComponent, MultipleOutletsFormComponent } from './views/merchants';
import { DealsFormComponent, DealsListComponent, DealDetailsComponent } from './views/deals';
import { OutletsListComponent, OutletsFormComponent, OutletDetailsComponent, menuOutletComponent, outletsImage } from './views/outlets';
import { CustomersListComponent, CustomerSMSLogsComponent } from './views/customers';
import { AccessCodesFormComponent, AccessCodesListComponent, ViewCodesComponent } from './views/access_codes';
import { OrdersListComponent } from './views/orders';
import { NotificationsFormComponent, NotificationsListComponent } from './views/notifications';
// import { AutomatedNotificationsFormComponent, AutomatedNotificationsListComponent } from './views/notifications/automated_notifications';
import { VersionsComponent, VersionDialog } from './views/defaults/versions';
import { HomeScreenMessagesComponent, HomeScreenMessagesDialog } from './views/defaults/home_screen_messages';
import { SubscriptionTextComponent, SubscriptionTextDialog } from './views/defaults/subscription_text';
import { SubscriptionPageComponent, SubscriptionPageDialog } from './views/defaults/subscription_page';
import { UberStatusComponent } from './views/defaults/uber_status';
// import { TagInputModule } from 'ngx-chips';
import { NgxMaskModule } from 'ngx-mask'
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { SubscriptionsListComponent } from './views/subscriptions/subscriptions.component';
import { SubscriptionLogsComponent } from './views/subscriptions/subscriptions-logs/subscriptions-logs.component';
import { OrderReviewsComponent } from './views/order_reviews';
import { CodeDetailsComponent } from './views/subscriptions';
import { AppLoaderComponent } from './lib/app-loader/app-loader';
import { AppLoaderService } from './lib/app-loader/app-loader.service';
import { MultipleDealsFormComponent } from './views/outlets/multiple_deals.component';
import { ExportCSVComponent } from './lib/export_csv.component';
import { NotificationDetailsComponent } from './views/notifications/notification-details.component';
import { CustomersFormComponent } from './views/customers/customers-form.component';
import { EditSelectedComponent } from './views/deals/edit-selected.component';
import { ImportCSVComponent } from './lib/import_csv.component';
import { CustomerDetailsComponent } from './views/customers/customer-details.component';
import { CheckEligibilityComponent } from './views/subscriptions/check-eligibility.component';
import { OredooCustomersComponent } from './views/customers/oredoo_customers.component';
import { AppSelectorComponent } from './lib/app-selector/app-selector';
import { UserAppSelectorService } from './lib/app-selector/app-selector.service';
import { SMSLogsComponent } from './views/subscriptions/sms-logs/sms_logs.component';
import { AppsGuard } from './guards/apps.guard';
import { PromoCodesFormComponent, PromoCodesFormNewComponent, PromoCodesListComponent, PromoCodesListNewComponent, ViewPromoCodesComponent } from './views/promo_code';
import { OfferDetailMessagesComponent } from "./views/defaults/offer_detail_message/offer_detail_messages.component";
import { OfferDetailMessagesDialog } from "./views/defaults/offer_detail_message/offer_detail_messages.dialog";
import { SmsFormComponent, SmsListComponent, ViewSmsComponent, SmsCodeFormComponent } from './views/sms';
import { ParentOutletsListComponent, ParentOutletsFormComponent, parentMenuOutlet } from './views/parent_outlets';
import { AssignParentOutletDialog } from './views/outlets/assign_parent.dialog';
import { ReportsComponent } from './views/customers/reports/reports.component';
import { MultiTextInputComponent } from './lib/multi-text-input/multi-text-input.component';
import { ExportMonthDialog } from './lib/export_csv_month';
import { CreditCardPackagesListComponent, CreditCardPackagesFormComponent, CreditCardDetailsComponent } from "./views/credit_card_packages";
import { MerchantAccountFormComponent, MerchantAccountListComponent } from './views/merchant_account';
import { CampaignFormComponent, CampaignListComponent, CampaignDetailsComponent } from "./views/campaign";
import { OoredoBillingComponent } from './views/ooredo-billing/ooredo-billing.component';
import { InterestTagListComponent, InterestTagFormComponent } from './views/interest_tag';
import { CategoriesComponent, CategoriesFormComponent, CategoriesDetailsComponent } from './views/defaults/categories';
import { PopularCategoriesFormComponent, PopularCategoriesComponent } from './views/defaults/popular_categories';
import { CollectionComponent, CollectionFormComponent } from './views/defaults/collection';
import { PlaylistComponent, PlaylistFormComponent } from './views/defaults/category_playlist';
import { TrendingSearchComponent, TrendingSearchDialog } from './views/defaults/trending_search';
import { RestaurantsListComponent, RestaurantsFormComponent } from './views/food_delevery/delivery_outlet';

import { MenuItemsFormComponent } from './views/food_delevery/menu_form';
import { MainMenuListComponent, MainMenuFormComponent } from './views/food_delevery/main_menu_item';
import { TypeListComponent, TypeFormComponent } from './views/food_delevery/settings/Delivery_categories';
import { DeliveryPlaylistComponent, DeliveryPlaylistFormComponent } from './views/food_delevery/settings/Delivery_playlist';
import { DeliveryPlaylistParentOutletFormComponent } from './views/food_delevery/settings/deliver_playlist_to_parentoutlet';
import { PromotionFormComponent, PromotionComponent } from './views/food_delevery/settings/promotion';
import { RestaurantMenuListComponent } from './views/food_delevery/menu_listing';
import { SubMenuFormComponent, SubMenuListComponent } from './views/food_delevery/sub_menu';
import { SubMenuItemFormComponent, SubMenuItemListComponent } from './views/food_delevery/sub_menu_item';
import { OutletAccountListComponent, OutletAccountFormComponent } from './views/food_delevery/settings/outlet_account';
import { DeliveryCategoryParentOutletFormComponent } from './views/food_delevery/settings/deliver_category_to_parentoutlet';
import { DeliveryOrdersListComponent, DeliveryOrdersDetailListComponent } from './views/food_delevery/settings/Delivery_orders';
import { TimingOutletDialog } from './views/outlets/timing.dialog';
import { DialogProgressOrderHistoryListComponent } from './views/food_delevery/settings/Dialog_Progress_Order_History';
import {imagePreviewComponent} from './views/outlets/image-preview.component';
import { AutocompleteLibModule } from './lib/search-dropdown/autocomplete-lib.module';
import { DeliveryCollectionParentOutletFormComponent } from './views/food_delevery/settings/deliver_collection_to_parentoutlet';
import { SpendXylistComponent } from './views/food_delevery/spend-xylist/spend-xylist.component';
import { SpendXyformComponent } from './views/food_delevery/spend-xyform/spend-xyform.component';
import { AssignPromotionComponent } from './views/food_delevery/assign-promotion/assign-promotion.component';
import { AssignDriverComponent } from './views/custom-dialogues/assign-driver/assign-driver.component';
import { MerchantReportComponent } from './views/merchant-report/merchant-report.component';
import { TimingMenusDialogComponent } from './views/food_delevery/timing-menus-dialog/timing-menus-dialog.component';
import { DeliveryOptionsDialogComponent } from './lib/delivery-options-dialog/delivery-options-dialog.component';
import { BeeDeliveryTokenDialogComponent } from './dialogs/bee-delivery-token-dialog/bee-delivery-token-dialog.component';
import { DeliveryKillSwitchComponent } from './views/delivery-kill-switch/delivery-kill-switch.component';
import { DeliveryKillSwitchLogsComponent } from './views/delivery-kill-switch-logs/delivery-kill-switch-logs.component';
import { SmsBlacklistComponent } from './views/defaults/sms-blacklist/sms-blacklist.component';
import { EditHistoryListComponent } from './views/defaults/edit-history-list/edit-history-list.component';
import { OutletListDialogComponent } from './dialogs/outlet-list-dialog/outlet-list-dialog.component';
import { SmsBlacklistDialogComponent } from './views/defaults/sms-blacklist/view-sms-blacklist-dialog.component';
import { TrendingSearchFormComponent } from './views/defaults/trending_search/trending_search-form.component';
import { AddOutletDialogComponent } from './views/interest_tag/add-outlet-dialog.component';
import { ApiLoaderInterceptorService } from './services/api-loader.interceptor.service';
import { ApiLoaderService } from './services/api-loader.service';
import { ChangeOutletOrderDialogComponent } from './views/defaults/popular_categories/change-outlet-order-dialog.component';
import {ChangeOutletImageComponent} from './views/outlets/change-outlet-image.component';
import {changeParentOutletImageComponent} from './views/parent_outlets/change-parentoutlet-image.component';
// import { NgxDnDModule } from '@swimlane/ngx-dnd';
// import { NgxUIModule } from '@swimlane/ngx-ui';
import { EligibleTestComponent } from './views/subscription-packages/eligible-test.component';
import { EligibleComponent } from './views/subscription-packages';
import { EligibleFormComponent } from './views/subscription-packages/eligible-form.component';
import { WebRedemptionListComponent } from './views/defaults/web_redemption/web_redemption-list.component';
import { WebRedemptionFormComponent } from './views/defaults/web_redemption/web_redemption-form.component';
import { AddOutletDialogWebComponent } from './views/defaults/web_redemption/add-outlet-dialog.component';
import { WebRedemptionDetailListComponent } from './views/defaults/web_redemption/web_redemption-detail-list.component';
import { ChangeOutletImage } from './views/outlets/outlets-change-image.component';
import {ViewSingleCodeComponent} from './views/access_codes/view-single-code.component';
import { NewSmsListComponent } from './views/newsms/new-sms-list.component';
import { NewSmsFormComponent } from './views/newsms/new-sms-form.component';
import { SmsDetailComponent } from './views/newsms/sms-detail.component';


@NgModule({
  imports: [
    FormsModule,
    BrowserModule,
    CommonModule,
    // HttpModule,
    // TagInputModule,
    HttpClientModule,
    AppRoutingModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    AgularMaterialModule,
    AgmCoreModule.forRoot({
      apiKey: appConfig.google_api_key,
      libraries: ['places']
    }),
    FlexLayoutModule,
    MalihuScrollbarModule.forRoot(),
    NgxMaskModule.forRoot(),
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    NgxEmojiPickerModule.forRoot(),
    // NgProgressModule,
    AutocompleteLibModule,
    // NgDragDropModule.forRoot(),
    BsDropdownModule.forRoot()
    // AngularFireMessagingModule
  ],
  providers: [
    AuthGuard,
    AuthService,
    MainService,
    ApiLoaderService,
    MainAuthGuard,
    AppsGuard,
    PaginationService,
    BaseLoaderService,
    GoogleMapsAPIWrapper,
    AppLoaderService,
    UserAppSelectorService,
    MessagingService,
    AsyncPipe,
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ApiLoaderInterceptorService,
      multi: true
    },
    // { provide: OWL_DATE_TIME_FORMATS, useValue: 'fr' },
    // {provide: HTTP_INTERCEPTORS, useClass: NgProgressInterceptor, multi: true },
  ],
  declarations: [
    AppComponent,
    LoginComponent,
    TemplateMainApp,
    AlertDialog,
    ClickOutsideDirective,
    BaseLoaderComponent,
    PaginationComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    MapLocationDialog,
    ChangeOutletOrderDialogComponent,
    ChangeOutletImageComponent,
    ChangeOutletImage,
    changeParentOutletImageComponent,
    GetLocationDialog,
    FilePickerComponent,
    AdminsListComponent,
    AdminsFormComponent,
    SmsBlacklistDialogComponent,
    CampaignListComponent,
    CampaignFormComponent,
    CampaignDetailsComponent,
    EligibleTestComponent,
    EligibleFormComponent,
    EligibleComponent,
    MerchantAccountFormComponent,
    MerchantAccountListComponent,

    //    food and delivery section
    RestaurantsListComponent,
    RestaurantsFormComponent,
    RestaurantMenuListComponent,
    SubMenuListComponent,
    SubMenuFormComponent,
    SubMenuItemListComponent,
    SubMenuItemFormComponent,
    MenuItemsFormComponent,
    MainMenuListComponent,
    MainMenuFormComponent,
    TypeListComponent,
    TypeFormComponent,
    DeliveryPlaylistComponent, DeliveryPlaylistFormComponent,
    DeliveryPlaylistParentOutletFormComponent,
    PromotionFormComponent,
    PromotionComponent,
    OutletAccountListComponent,
    OutletAccountFormComponent,
    DeliveryCategoryParentOutletFormComponent,
    DeliveryOrdersListComponent,

    MerchantsFormComponent, MerchantsListComponent,
    DealsFormComponent, DealsListComponent,
    ParentOutletsListComponent, ParentOutletsFormComponent, parentMenuOutlet,
    OutletsListComponent, OutletsFormComponent, OutletDetailsComponent,
    menuOutletComponent,
    outletsImage,
    AccessCodesFormComponent, AccessCodesListComponent,
    CustomersListComponent,
    OrdersListComponent,
    NotificationsFormComponent, NotificationsListComponent,
    VersionsComponent, VersionDialog,
    // AutomatedNotificationsFormComponent, AutomatedNotificationsListComponent,
    HomeScreenMessagesComponent, HomeScreenMessagesDialog,
    OfferDetailMessagesComponent, OfferDetailMessagesDialog,
    SubscriptionTextComponent, SubscriptionTextDialog,
    SubscriptionPageComponent, SubscriptionPageDialog,
    UberStatusComponent,
    FilterDatePipe,
    SubscriptionsListComponent,
    SubscriptionLogsComponent,
    OrderReviewsComponent,
    DealDetailsComponent,
    CategoriesDetailsComponent,
    MerchantDetailsComponent,
    ViewCodesComponent,
    ViewSmsComponent,
    CodeDetailsComponent,
    MultipleOutletsFormComponent,
    AppLoaderComponent,
    MultipleDealsFormComponent,
    ExportCSVDialog,
    ExportMonthDialog,
    ExportCSVComponent,
    ImportCSVComponent,
    NotificationDetailsComponent,
    CustomersFormComponent,
    OredooCustomersComponent,
    EditSelectedComponent,
    MultiTagInputComponent,
    CustomerDetailsComponent,
    CheckEligibilityComponent,
    AppSelectorComponent,
    SMSLogsComponent,
    CustomerSMSLogsComponent,
    PromoCodesFormComponent,
    PromoCodesListComponent,
    PromoCodesFormNewComponent,
    PromoCodesListNewComponent,
    ViewPromoCodesComponent,
    SmsListComponent,
    SmsFormComponent,
    SmsCodeFormComponent,
    AssignParentOutletDialog,
    TimingOutletDialog,
    ReportsComponent,
    MultiTextInputComponent,
    CreditCardPackagesListComponent,
    CreditCardDetailsComponent,
    CreditCardPackagesFormComponent,
    OoredoBillingComponent,
    InterestTagListComponent,
    InterestTagFormComponent,
    CategoriesComponent, CategoriesFormComponent,
    CollectionComponent, CollectionFormComponent,
    PlaylistComponent, PlaylistFormComponent,
    PopularCategoriesComponent, PopularCategoriesFormComponent,
    TrendingSearchComponent, TrendingSearchDialog,
    TrendingSearchFormComponent,
    DialogProgressOrderHistoryListComponent,
    DeliveryOrdersDetailListComponent,
    DeliveryCollectionParentOutletFormComponent,
    SpendXylistComponent,
    SpendXyformComponent,
    AssignPromotionComponent,
    AssignDriverComponent,
    MerchantReportComponent,
    TimingMenusDialogComponent,
    DeliveryOptionsDialogComponent,
    BeeDeliveryTokenDialogComponent,
    DeliveryKillSwitchComponent,
    DeliveryKillSwitchLogsComponent,
    SmsBlacklistComponent,
    EditHistoryListComponent,
    OutletListDialogComponent,
    AddOutletDialogComponent,
    WebRedemptionListComponent,
    WebRedemptionFormComponent,
    AddOutletDialogWebComponent,
    WebRedemptionDetailListComponent,
    imagePreviewComponent,
    ViewSingleCodeComponent,
    NewSmsListComponent,
    NewSmsFormComponent,
    SmsDetailComponent,

  
  ],
  entryComponents: [
    AlertDialog,
    MapLocationDialog,
    GetLocationDialog,
    ChangeOutletOrderDialogComponent,
    ChangeOutletImageComponent,
    ChangeOutletImage,
    changeParentOutletImageComponent,
    VersionDialog,
    HomeScreenMessagesDialog, OfferDetailMessagesDialog, SubscriptionTextDialog, SubscriptionPageDialog, TrendingSearchDialog,
    OutletDetailsComponent,
    CampaignDetailsComponent,
    DealDetailsComponent,
    CategoriesDetailsComponent,
    MerchantDetailsComponent,
    ViewCodesComponent,
    ViewSingleCodeComponent,
    ViewSmsComponent,
    CodeDetailsComponent,
    ExportCSVDialog,
    ExportMonthDialog,
    NotificationDetailsComponent,
    EditSelectedComponent,
    CustomerDetailsComponent,
    CheckEligibilityComponent,
    ViewPromoCodesComponent,
    CreditCardDetailsComponent,
    AssignParentOutletDialog,
    TimingOutletDialog,
    DialogProgressOrderHistoryListComponent,
    AssignDriverComponent,
    TimingMenusDialogComponent,
    DeliveryOptionsDialogComponent,
    BeeDeliveryTokenDialogComponent,
    OutletListDialogComponent,
    SmsBlacklistDialogComponent,
    AddOutletDialogComponent,
    AddOutletDialogWebComponent,
    imagePreviewComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
