import { OnInit, Component } from "@angular/core";
import { MatDialogRef, MatDialog } from "@angular/material/dialog";

import { MainService } from "../../../services/main.service";
import { AlertDialog } from "../../../lib/alert.dialog";
import { appConfig } from "../../../../config";
import { Validators } from "@angular/forms";

@Component({
	selector: 'subscription_page-dialog',
	templateUrl: './subscription_page.dialog.html'
})
export class SubscriptionPageDialog implements OnInit {
	isLoading: boolean = false;
	showLoading: any = null;
	isEditing: any;
	details: any;

	subData: any;
	app_id: string = '';
	text: string = '';
	id: string = '';
	type: string = '';
	SubscriptionPage: any;

	constructor(protected mainApiService: MainService, protected dialogRef: MatDialogRef<SubscriptionPageDialog>, protected dialog: MatDialog) {

		this.isEditing = false;
	}

	ngOnInit() {

		if (this.isEditing) {
			this.subData =
			{
				type: this.details.type,
				app_id: this.details.app_id,
				text: this.details.text,
				text_ar: this.details.text_ar,
				id: this.details.id,

			}
		}
	}

	onCancelClick(): void {
		this.dialogRef.close(false);
	}

	onSubmitClick(): void {
		this.isLoading = true;
		this.mainApiService.postData(appConfig.base_url_slug + 'defaultCreditScreen', this.subData)
			.then(result => {
				if (result.status == 200 && result.data) {
					this.SubscriptionPage = result.data;
					this.dialogRef.close(true);
					this.isLoading = false;
				}
				else {
					// alert('Error');
					this.isLoading = false;
					let dialogRef = this.dialog.open(AlertDialog, { autoFocus: false });
					let cm = dialogRef.componentInstance;
					cm.heading = 'Error';
					cm.message = 'Error Occured, cannot update at this time. Try again later.';
					cm.cancelButtonText = 'Ok';
					cm.type = 'error';
				}
			});
	}
}