import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription, Observable } from 'rxjs';
import { MainService, BaseLoaderService, PaginationService } from '../../../../services';
import { AlertDialog } from '../../../../lib';
import { MatDialog } from '@angular/material/dialog';
import { appConfig } from '../../../../../config';
import { UserAppSelectorService } from '../../../../lib/app-selector/app-selector.service';
import { DialogProgressOrderHistoryListComponent } from '../Dialog_Progress_Order_History';
import * as moment from 'moment';
@Component({
	selector: 'app-delivery_orders_detail',
	templateUrl: './delivery_orders_detail-list.component.html',
	styleUrls: ['./delivery_order_list.scss']
})
export class DeliveryOrdersDetailListComponent implements OnInit {
	orderby: any = '';
	search: string;
	sub: Subscription = new Subscription();
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
	appSelectorSubscription: Subscription;
	ParentOutlets: any;
	parentOutletsCount: any;
	RestaurantsParentOutlets: any = [];
	RestaurantsparentOutletsCount: any;
	type: any;
	codeGet: any = [];
	id: any;
	orderLogDetail: any = [];
	testarr: any = []
	created: any;
	outlet_own_accepted: any;
	outlet_urbanpoint_accepted: any;
	outlet_dispatched: any;
	outlet_delivered: any;
	outlet_rejected: any;
	cancelled_by_user: any;
	driverAccepted: any;
	beeDeliveryLogs: any;
	readyforPickup: any;

	constructor(protected router: Router,
		protected _route: ActivatedRoute,
		protected mainApiService: MainService,
		protected paginationService: PaginationService,
		protected loaderService: BaseLoaderService, protected appSelectorService: UserAppSelectorService, protected dialog: MatDialog) {
		this.search = '';
		this.perPage = 20;
		this.appSelectorSubscription = this.appSelectorService.selectedApp.subscribe((response: any) => {

		});
	}

	ngOnDestroy(): void {
		this.appSelectorSubscription.unsubscribe();
	}
	onLocationBack(): void {
		window.history.back();
	}

	ngOnInit() {
		this.sub = this._route.params.subscribe(params => {
			this.id = params['id'];
			this.getBeeDeliveryLogs();
			let abc = localStorage.getItem('OrderLog') as string;
			this.orderLogDetail = JSON.parse(abc);
			console.log("ParentId in params local storage", this.orderLogDetail.order_logs)

			// this.testarr.push(this.orderLogDetail.order_logs)
			this.testtime();

		})
		let abcd = localStorage.getItem('componentSettings') as string;
		this.componentSettings = JSON.parse(abcd);
		if (this.componentSettings) {
			if (this.componentSettings.name != null && this.componentSettings.name == 'OrderLog') {
				this.currentPage = this.componentSettings.paggination;
				this.index = this.componentSettings.paggination;
				this.search = this.componentSettings.search;
			}
		}
	}

	testtime(): void {
		this.created = moment(this.orderLogDetail.created_at).add(3, 'hours').format('YYYY-MM-DD hh:mm:ss A');
		if (this.orderLogDetail.order_logs.outlet_own_accepted != null) {
			this.driverAccepted = this.orderLogDetail.order_logs.outlet_own_accepted.created_at;
		}
		else {
			this.outlet_own_accepted = null;
		}
		if (this.orderLogDetail.order_logs.outlet_urbanpoint_accepted != null) {
			this.driverAccepted = this.orderLogDetail.order_logs.outlet_urbanpoint_accepted.created_at;
		}
		else {
			this.outlet_urbanpoint_accepted = null;
		}
		if (this.orderLogDetail.order_logs.outlet_dispatched != null) {
			this.outlet_dispatched = moment(this.orderLogDetail.order_logs.outlet_dispatched.created_at).utc().add(3, 'hours').format('YYYY-MM-DD hh:mm:ss A');
		}
		else {
			this.outlet_dispatched = null;
		}
		if (this.orderLogDetail.order_logs.completed != null) {
			this.outlet_delivered = moment(this.orderLogDetail.order_logs.completed.created_at).utc().add(3, 'hours').format('YYYY-MM-DD hh:mm:ss A');
		}
		else {
			this.outlet_delivered = null;
		}
		if (this.orderLogDetail.order_logs.outlet_rejected != null) {
			this.outlet_rejected = moment(this.orderLogDetail.order_logs.outlet_rejected.created_at).utc().add(3, 'hours').format('YYYY-MM-DD hh:mm:ss A');
		}
		else {
			this.outlet_rejected = null;
		}
		if (this.orderLogDetail.order_logs.cancelled_by_user != null) {
			this.cancelled_by_user = moment(this.orderLogDetail.order_logs.cancelled_by_user.created_at).utc().add(3, 'hours').format('YYYY-MM-DD hh:mm:ss A');
		}
		else {
			this.cancelled_by_user = null;
		}
		if (this.orderLogDetail.order_logs.ready_for_pickup != null) {
			this.readyforPickup = moment(this.orderLogDetail.order_logs.ready_for_pickup.created_at).utc().add(3, 'hours').format('YYYY-MM-DD hh:mm:ss A');
		}
		else {
			this.readyforPickup = null;
		}
	}

	getBeeDeliveryLogs() {
		let url = `deliveryOrderLogs?order_id=${this.id}`;
		this.mainApiService.getList(appConfig.base_url_slug + url, false, 2).then(result => {
			if (result.status == 200 && result.data) {
				this.beeDeliveryLogs = result.data.orderslogs;
				this.addTimetoBeeDeliveryLogs();
			}
		});
	}

	addTimetoBeeDeliveryLogs() {
		if (this.beeDeliveryLogs.delivery_requested) {
			this.beeDeliveryLogs.delivery_requested.created_at = moment(this.beeDeliveryLogs.delivery_requested.created_at).utc().add(3, 'hours').format('YYYY-MM-DD hh:mm:ss A');
		}
		if (this.beeDeliveryLogs.delivery_assigned) {
			this.beeDeliveryLogs.delivery_assigned.created_at = moment(this.beeDeliveryLogs.delivery_assigned.created_at).utc().add(3, 'hours').format('YYYY-MM-DD hh:mm:ss A');
		}
		if (this.beeDeliveryLogs.delivery_arrived) {
			this.beeDeliveryLogs.delivery_arrived.created_at = moment(this.beeDeliveryLogs.delivery_arrived.created_at).utc().add(3, 'hours').format('YYYY-MM-DD hh:mm:ss A');
		}
		if (this.beeDeliveryLogs.delivery_picked_up) {
			this.beeDeliveryLogs.delivery_picked_up.created_at = moment(this.beeDeliveryLogs.delivery_picked_up.created_at).utc().add(3, 'hours').format('YYYY-MM-DD hh:mm:ss A');
		}
		// if (this.beeDeliveryLogs) {
		//   this.beeDeliveryLogs.outlet_urbanpoint_accepted.created_at  = moment(this.beeDeliveryLogs.delivery_requested.created_at).utc().add(3, 'hours').format('YYYY-MM-DD hh:mm:ss A');
		// }
		if (this.beeDeliveryLogs.delivery_completed) {
			this.beeDeliveryLogs.delivery_completed.created_at = moment(this.beeDeliveryLogs.delivery_completed.created_at).utc().add(3, 'hours').format('YYYY-MM-DD hh:mm:ss A');
		}
	}
}