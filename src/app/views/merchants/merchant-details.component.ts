import { Component, OnInit, ElementRef, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MainService, BaseLoaderService } from '../../services';
import { AlertDialog } from '../../lib';
import { appConfig } from '../../../config';


@Component({
	selector: 'app-merchant-details',
	templateUrl: './merchant-details.component.html'
})
export class MerchantDetailsComponent implements OnInit, AfterViewInit {

	sub: Subscription = new Subscription();
	Merchant: any;
	Outlets: any;
	status: boolean;
	changed: boolean;

	constructor(private elRef: ElementRef, protected router: Router,
		protected mainApiService: MainService,
		protected loaderService: BaseLoaderService, protected dialog: MatDialog, protected dialogRef: MatDialogRef<MerchantDetailsComponent>) {
		this.Merchant = null;
		this.Outlets = [];
		this.status = false;
		this.changed = false;
	}

	ngOnInit() {
		this.getOutlets();
		if (this.Merchant.active == 1) {
			this.status = true;
		}
		else if (this.Merchant.active == 0) {
			this.status = false;
		}
	}

	ngAfterViewInit() {
		this.elRef.nativeElement.parentElement.classList.add("mat-dialog-changes");
	}


	onEditMerchant(event : any): void {
		localStorage.setItem('Merchant', JSON.stringify(this.Merchant));
		this.router.navigateByUrl('main/parent_companies/' + this.Merchant.id);
		this.dialogRef.close();
		event.stopPropagation();
	}

	onChangeStatus(event: any): void {
		let active: any;
		if (this.status) {
			active = 1;
		}
		else {
			active = 0;
		}
		let Data = {
			id: this.Merchant.id,
			active: active
		};

		let dialogRef = this.dialog.open(AlertDialog, { autoFocus: false });
		let cm = dialogRef.componentInstance;
		cm.heading = 'Change Merchant';
		cm.message = 'Are you sure to Update Merchant';
		cm.submitButtonText = 'Yes';
		cm.cancelButtonText = 'No';
		cm.type = 'ask';
		cm.methodName = appConfig.base_url_slug + 'updateMerchant';
		cm.dataToSubmit = Data;
		cm.showLoading = true;
		cm.urlVersion = 1;

		dialogRef.afterClosed().subscribe(result => {
			if (result) {
				this.getOutlets();
				this.changed = true;
			}
			else {
				this.status = !this.status;
			}
		})
	}

	getOutlets(): void {
		this.mainApiService.getList(appConfig.base_url_slug + 'getOutlets?merchant_id=' + this.Merchant.id)
			.then(result => {
				if (result.status == 200 && result.data) {
					// this.Outlets = result.data.outlets;

					let Outlets: any = result.data.outlets;

					Outlets.forEach((element: any) => {
						if (element.active == 1) {
							element['slide'] = true;
						}
						else if (element.active == 0) {
							element['slide'] = false;
						}
					});
					// log here('dsdsd')
					this.Outlets = Outlets;
				}
				else {
					this.Outlets = [];
				}
			});
	}

	onOutletNameClick(outlet: any): void {
		localStorage.setItem('Outlet', JSON.stringify(outlet));
		window.open('#/main/outlets/' + outlet.id);
		// this.router.navigateByUrl('main/outlets/' + outlet.id);
		// event.stopPropagation();
		// this.dialogRef.close();
	}

	onChangeOutletStatus(outlet: any): void {
		let active: any;
		if (outlet.slide) {
			active = 1;
		}
		else {
			active = 0;
		}
		let Data = {
			id: outlet.id,
			active: active
		};

		let dialogRef = this.dialog.open(AlertDialog, { autoFocus: false });
		let cm = dialogRef.componentInstance;
		cm.heading = 'Change Outlet';
		cm.message = 'Are you sure to Update Outlet';
		cm.submitButtonText = 'Yes';
		cm.cancelButtonText = 'No';
		cm.type = 'ask';
		cm.methodName = appConfig.base_url_slug + 'ADOutlet';
		cm.dataToSubmit = Data;
		cm.showLoading = true;
		cm.urlVersion = 1;

		dialogRef.afterClosed().subscribe(result => {
			if (result) {
				this.getOutlets();
			}
			else {
				this.status = !this.status;
			}
		})
	}

	onDialogClose(): void {
		if (this.changed == false) {
			this.dialogRef.close('cancel');
		}
		else {
			this.dialogRef.close();
		}
	}
}