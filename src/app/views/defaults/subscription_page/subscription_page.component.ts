import { Component, OnInit } from '@angular/core';
import { MainService } from '../../../services/main.service';
import { MatDialog } from '@angular/material/dialog';
import { SubscriptionPageDialog } from './subscription_page.dialog';
import { BaseLoaderService } from '../../../services';
import { AlertDialog } from '../../../lib';
import { appConfig } from '../../../../config';
import { UserAppSelectorService } from '../../../lib/app-selector/app-selector.service';
import { Subscription } from 'rxjs';
import { ControlContainer } from '@angular/forms';

@Component({
	selector: 'app-subscription_page',
	templateUrl: './subscription_page.component.html'
})
export class SubscriptionPageComponent implements OnInit {
	SubscriptionPage: any[];
	public href: string = "";
	res: any;


	appSelectorSubscription: Subscription;

	constructor(protected mainApiService: MainService,
		protected appSelectorService: UserAppSelectorService,
		protected dialog: MatDialog) {
		this.SubscriptionPage = [];

		this.appSelectorSubscription = this.appSelectorService.selectedApp.subscribe((response: any) => {
			this.href = window.location.href;
			this.res = this.href.split('#/');
			if (this.res[1] == 'main/subscription_page') {
				if (response.user_app_id == "1" || response.user_app_id == "4") {
					this.getSubscriptionPageList();
				}
				else if (response.user_app_id == "2" || response.user_app_id == "3") {

					let dialogRef = this.dialog.open(AlertDialog, { autoFocus: false });
					let cm = dialogRef.componentInstance;
					cm.heading = 'Error';
					cm.message = "There is not any Feature Here";
					cm.cancelButtonText = 'Ok';
					cm.type = 'error';
					this.SubscriptionPage = [];

				}
			}


		});
	}

	ngOnDestroy(): void {
		this.appSelectorSubscription.unsubscribe();
	}


	ngOnInit() {
		this.getSubscriptionPageList();
	}

	onAddParagraph(params: any): void {
		let dialogRef = this.dialog.open(SubscriptionPageDialog, { autoFocus: false });
		dialogRef.componentInstance.isEditing = false;
		dialogRef.componentInstance.details = null;


		dialogRef.afterClosed().subscribe(result => {
			if (result) {
				this.getSubscriptionPageList();
			}
		})
	}

	onEditParagraph(item: any): void {
		let dialogRef = this.dialog.open(SubscriptionPageDialog, { autoFocus: false });
		dialogRef.componentInstance.isEditing = true;
		dialogRef.componentInstance.details = item;


		dialogRef.afterClosed().subscribe(result => {
			if (result) {
				this.getSubscriptionPageList();
			}
		})
	}

	getSubscriptionPageList(): void {
		this.SubscriptionPage = [];
		let url = 'defaultCreditScreen';

		this.mainApiService.postData(appConfig.base_url_slug + url, {})
			.then(result => {

				if (result.status == 200 && result.data) {
					this.SubscriptionPage = result.data;
					//console.log(this.SubscriptionPage);
				}

				else {
					this.SubscriptionPage = [];
				}
			});
	}
}