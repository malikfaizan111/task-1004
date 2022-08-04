import { OnInit, Component } from "@angular/core";
import { MatDialogRef, MatDialog } from "@angular/material/dialog";

import { MainService } from "../../../services/main.service";
import { AlertDialog } from "../../../lib/alert.dialog";
import { appConfig } from "../../../../config";
import {OfferDetailMessagesComponent} from "./offer_detail_messages.component";

@Component({
	selector: 'offer_detail_message-dialog',
	templateUrl: 'offer_detail_messages.dialog.html'
})
export class OfferDetailMessagesDialog implements OnInit
{
	isLoading: boolean;
	showLoading: boolean;
	OfferDetailMessage: any;
	offer_status: any;
	status: any;
	// message

	constructor(protected mainApiService: MainService, protected dialogRef: MatDialogRef<OfferDetailMessagesComponent>, protected dialog: MatDialog)
	{
		this.isLoading = false;
        this.showLoading  = false;
	}

	ngOnInit() 
	{
		// this.me
	}

	onCancelClick(): void
	{
		this.dialogRef.close(false);
	}

	onSubmitClick(): void
	{
        this.isLoading = true;
		
		if(this.offer_status)
		{
			this.status = 1;
		}
		else
		{
			this.status = 0;
		}

		let data = {
			type: 'offers',
			text: this.OfferDetailMessage,
			status: this.status
		}

		this.mainApiService.postData(appConfig.base_url_slug + 'addUpdateDefault', data)
		.then(result => {
			if (result.status == 200  && result.data) 
			{
				this.dialogRef.close(true);
				this.isLoading = false;
			}
			else 
			{
                this.isLoading = false;
                let dialogRef = this.dialog.open(AlertDialog, { autoFocus: false });
				let cm = dialogRef.componentInstance;
				cm.heading = 'Error';
				cm.message = 'Error Occured, cannot update at this time. Try again later. Max size 50 characters.';
				cm.cancelButtonText = 'Ok';
				cm.type = 'error';
			}
		});
	}

	updateOfferStatus(): void
	{
		if(this.offer_status)
		{
			this.status = 1;
		}
		else
		{
			this.status = 0;
		}
	}
}
