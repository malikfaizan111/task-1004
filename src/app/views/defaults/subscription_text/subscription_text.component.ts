import { Component, OnInit } from '@angular/core';
import { MainService } from '../../../services/main.service';
import { MatDialog } from '@angular/material/dialog';
import { SubscriptionTextDialog } from './subscription_text.dialog';
import { BaseLoaderService } from '../../../services';
import { AlertDialog } from '../../../lib';
import { appConfig } from '../../../../config';
import { UserAppSelectorService } from '../../../lib/app-selector/app-selector.service';
import { Subscription } from 'rxjs';

@Component({
	selector: 'app-subscription_text',
	templateUrl: './subscription_text.component.html'
})
export class SubscriptionTextComponent implements OnInit {
	SubscriptionText: any[];
	ParagraphOne: any[] = [];
	ParagraphTwo: any[] = [];
	firstPara: any;
	secondPara: any;
	appSelectorSubscription: Subscription;

	constructor(protected mainApiService: MainService,
		protected appSelectorService: UserAppSelectorService,
		protected dialog: MatDialog) {
		this.SubscriptionText = [];
		this.firstPara = true;
		this.secondPara = false;
		this.appSelectorSubscription = this.appSelectorService.selectedApp.subscribe((response: any) => {
			this.getSubscriptionTextList(0);
		});
	}

	ngOnDestroy(): void {
		this.appSelectorSubscription.unsubscribe();
	}


	ngOnInit() {
		this.getSubscriptionTextList(0);
	}

	onAddParagraph(params: any): void {
		let dialogRef = this.dialog.open(SubscriptionTextDialog, { autoFocus: false });
		dialogRef.componentInstance.isEditing = false;
		dialogRef.componentInstance.details = null;
		dialogRef.componentInstance.paraNumber = params;

		dialogRef.afterClosed().subscribe(result => {
			if (result) {
				this.getSubscriptionTextList(params);
			}
		})
	}

	onEditParagraph(item: any, params: any): void {
		let dialogRef = this.dialog.open(SubscriptionTextDialog, { autoFocus: false });
		dialogRef.componentInstance.isEditing = true;
		dialogRef.componentInstance.details = item;
		dialogRef.componentInstance.paraNumber = params;

		dialogRef.afterClosed().subscribe(result => {
			if (result) {
				this.getSubscriptionTextList(params);
			}
		})
	}

	getSubscriptionTextList(params: number): void {
		if (params == 0) {
			this.firstPara = true;
			this.secondPara = true;
			this.ParagraphOne = [];
			this.ParagraphTwo = [];
		}
		else if (params == 1) {
			this.secondPara = true;
			this.ParagraphOne = [];
		}
		else {
			this.firstPara = true;
			
			this.ParagraphTwo = [];
		}

		this.SubscriptionText = [];
		let url = 'getDefaults';
		
		this.mainApiService.getList(appConfig.base_url_slug + url, true)
			.then(result => {
				if (result.status == 200 && result.data) {
					this.SubscriptionText = result.data.subText;
					this.SubscriptionText.forEach(element => {
						if (params == 0) {
							if (element.paragraph == 1) {
								this.ParagraphOne.push(element);
								this.firstPara = false;
							}
							else {
								this.ParagraphTwo.push(element);
								this.secondPara = false;
							}

						}
						else if (params == 1) {
							if (element.paragraph == 1) {
								this.ParagraphOne.push(element);
								this.secondPara = false;
							}
						}
						else {
							if (element.paragraph == 2) {
								this.ParagraphTwo.push(element);
								this.firstPara = false;
							}
						}
					});
				}
				else {
					this.SubscriptionText = [];
				}
			});
	}

	onDeleteParagraph(item: any, params: any): void {
		let Data = {
			type: 'subscription',
			id: item.id,
			paragraph: params
		};

		let dialogRef = this.dialog.open(AlertDialog, { autoFocus: false });
		let cm = dialogRef.componentInstance;
		cm.heading = 'Delete Paragraph';
		cm.message = 'Are you sure to delete?';
		cm.submitButtonText = 'Yes';
		cm.cancelButtonText = 'No';
		cm.type = 'ask';
		cm.methodName = appConfig.base_url_slug + 'deleteDefault';
		cm.dataToSubmit = Data;
		cm.showLoading = true;

		dialogRef.afterClosed().subscribe(result => {
			if (result) {
				this.getSubscriptionTextList(params);
			}
		})
	}
}
