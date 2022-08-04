import { OnInit, Component } from "@angular/core";
import { MatDialogRef, MatDialog } from "@angular/material/dialog";

import { MainService } from "../../../services/main.service";
import { AlertDialog } from "../../../lib/alert.dialog";
import { appConfig } from "../../../../config";

@Component({
	selector: 'subscription_text-dialog',
	templateUrl: './subscription_text.dialog.html'
})
export class SubscriptionTextDialog implements OnInit {
	isLoading: boolean;
	showLoading: boolean;
	isEditing: any;
	details: any;
	paraNumber: any;
	subData: any;

	constructor(protected mainApiService: MainService, protected dialogRef: MatDialogRef<SubscriptionTextDialog>, protected dialog: MatDialog) {
		this.isLoading = false;
		this.showLoading = false;
		this.isEditing = false;
	}

	ngOnInit() {
		if (this.isEditing) {
			this.subData = {
				type: 'subscription',
				paragraph: this.details.paragraph,
				text: this.details.text,
				id: this.paraNumber,
				status: 1
			}

			if (this.details == null) {
				this.subData = {
					type: 'subscription',
					paragraph: this.paraNumber,
					text: null,
					id: null,
					status: 1
				}
			}
			else {
				this.subData = {
					type: 'subscription',
					paragraph: this.details.paragraph,
					text: this.details.text,
					id: this.details.id,
					status: 1
				}
			}
		}
		else {
			this.subData = {
				type: 'subscription',
				paragraph: this.paraNumber,
				text: '',
				status: 1
			}
		}
	}

	onCancelClick(): void {
		this.dialogRef.close(false);
	}

	onSubmitClick(): void {
		this.isLoading = true;

		// if(this.isEditing)
		// {
		// 	this.subData = {
		// 		type: 'subscription',
		// 		paragraph: this.details.paragraph,
		// 		text: this.details.text,
		// 		id: this.paraNumber,
		// 	}
		// }
		// else
		// {
		// 	this.subData = {
		// 		type: 'subscription',
		// 		paragraph: this.paraNumber,
		// 		text: '',
		// 	}
		// }

		this.mainApiService.postData(appConfig.base_url_slug + 'addUpdateDefault', this.subData)
			.then(result => {
				if (result.status == 200 && result.data) {
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
