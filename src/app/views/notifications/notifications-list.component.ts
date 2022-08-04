import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { MainService, BaseLoaderService, PaginationService } from '../../services';
import { AlertDialog } from '../../lib';
import { NotificationDetailsComponent } from './notification-details.component';
import { appConfig } from '../../../config';
import { UserAppSelectorService } from '../../lib/app-selector/app-selector.service';


@Component({
	selector: 'app-notifications-list',
	templateUrl: './notifications-list.component.html'
})
export class NotificationsListComponent implements OnInit {
	search: string;
	sub: Subscription = new Subscription();
	index: any;
	totalPages: number = 1;
	pages: any;
	totalItems: any;
	currentPage: any;
	notificationsCount: any;
	Notifications: any;
	operator: string;
	searchTimer: any;
	perPage: number;
	appSelectorSubscription: Subscription;
	abc = localStorage.getItem('UrbanpointAdmin') as string;
	UpAdmin = JSON.parse(this.abc);

	constructor(protected router: Router,
		protected _route: ActivatedRoute,
		protected mainApiService: MainService,
		protected paginationService: PaginationService,
		protected appSelectorService: UserAppSelectorService,
		protected loaderService: BaseLoaderService, protected dialog: MatDialog) {
		this.search = '';
		this.Notifications = [];
		this.operator = 'All';
		this.perPage = 20;
		this.appSelectorSubscription = this.appSelectorService.selectedApp.subscribe((response: any) => {
			this.gerNotificationsList(1);
		});
	}

	ngOnDestroy(): void {
		this.appSelectorSubscription.unsubscribe();
	}


	ngOnInit() {
		// this.sub = this._route.params.subscribe(params => {
		// this.type = params['type'];
		// if (this.type) 
		// {
		this.gerNotificationsList(1);
		// }
		// log here(params);
		// });
	}

	addNew() {
		this.router.navigateByUrl('main/notifications/add');
	}

	onSearchNotification(): void {
		clearTimeout(this.searchTimer);
		this.searchTimer = setTimeout(() => {

			this.gerNotificationsList(1);

		}, 800);

	}

	gerNotificationsList(index: any, isLoaderHidden?: boolean): void {
		if (isLoaderHidden) {
			this.loaderService.setLoading(false);
		}
		else {
			this.loaderService.setLoading(true);
		}

		let url = 'getNotifications?index=' + index + '&index2=' + this.perPage;

		if (this.search != '') {
			// url = 'getNotifications?type=' + this.type + '&search=' + this.search;
			url = url + '&search=' + this.search;
		}
		else {
			this.search = '';
		}


		if (this.operator != 'All') {
			url = url + '&network=' + this.operator;
		}


		this.mainApiService.getList(appConfig.base_url_slug + url)
			.then(result => {
				if (result.status == 200 && result.data) {

					let Notifications = result.data.notifications;
					this.notificationsCount = result.data.notificationsCount;
					this.currentPage = index;
					this.pages = this.paginationService.setPagination(this.notificationsCount, index, this.perPage);
					this.totalPages = this.pages.totalPages;
					this.loaderService.setLoading(false);

					Notifications.forEach((element: any) => {
						if (element.archive == 1) {
							element['slide'] = true;
						}
						else if (element.archive == 0) {
							element['slide'] = false;
						}
					});
					this.Notifications = Notifications;

				}
				else {
					this.Notifications = [];
					this.notificationsCount = 0;
					this.currentPage = 1;
					this.pages = this.paginationService.setPagination(this.notificationsCount, index, this.perPage);
					this.totalPages = this.pages.totalPages;
					this.loaderService.setLoading(false);
				}
			});
	}

	setPage(pageDate: any) {
		this.currentPage = pageDate.page;
		this.perPage = pageDate.perPage;
		this.index = this.currentPage;
		this.gerNotificationsList(pageDate.page);
	}


	onResendNotification(notification: any, event: any): void {
		let notificationData = {
			notification_id: notification.id
		};

		let dialogRef = this.dialog.open(AlertDialog, { autoFocus: false });
		let cm = dialogRef.componentInstance;
		cm.heading = 'Resend Notification';
		cm.message = 'Are you sure to Resend Notification?';
		cm.submitButtonText = 'Yes';
		cm.cancelButtonText = 'No';
		cm.type = 'ask';
		cm.methodName = appConfig.base_url_slug + 'reSendNotification';
		cm.dataToSubmit = notificationData;
		cm.showLoading = true;

		dialogRef.afterClosed().subscribe(result => {
			if (result) {
				// this.gerNotificationsList(this.currentPage, true);
			}
		})
		event.stopPropagation();
	}

	onChangeNotification(notification: any, event: any): void {
		let archive: any = 0;

		let Data = {
			id: notification.id,
			archive: archive
		};

		let dialogRef = this.dialog.open(AlertDialog, { autoFocus: false });
		let cm = dialogRef.componentInstance;
		cm.heading = 'Send Notification';
		cm.message = 'Are you sure to Send Notification';
		cm.submitButtonText = 'Yes';
		cm.cancelButtonText = 'No';
		cm.type = 'ask';
		cm.methodName = appConfig.base_url_slug + 'updateNotification';
		cm.dataToSubmit = Data;
		cm.showLoading = true;

		dialogRef.afterClosed().subscribe(result => {
			if (result) {
				this.gerNotificationsList(this.currentPage, true);
			}
			else {
				notification.slide = true;
			}
		})

		event.stopPropagation();
	}

	onViewDetails(notification: any): void {
		let dialogRef = this.dialog.open(NotificationDetailsComponent, { autoFocus: false });
		let compInstance = dialogRef.componentInstance;
		compInstance.Notification = notification;
		// dialogRef.afterClosed().subscribe(result => {
		// 	// if(result == 'reload')
		// 	// {
		// 		// this.gerDealsList(this.currentPage);
		// 	// }
		// })
	}

	onDeleteNotification(notification: any): void {
		let notificationData = {
			id: notification.id
		};

		let dialogRef = this.dialog.open(AlertDialog, { autoFocus: false });
		let cm = dialogRef.componentInstance;
		cm.heading = 'Delete Notification';
		cm.message = 'Are you sure to delete Notification';
		cm.submitButtonText = 'Yes';
		cm.cancelButtonText = 'No';
		cm.type = 'ask';
		cm.methodName = appConfig.base_url_slug + 'deleteNotification';
		cm.dataToSubmit = notificationData;
		cm.showLoading = true;

		dialogRef.afterClosed().subscribe(result => {
			if (result) {
				this.gerNotificationsList(this.currentPage, true);
			}
		})
	}
}