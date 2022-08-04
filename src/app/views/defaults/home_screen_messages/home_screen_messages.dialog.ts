import { OnInit, Component } from "@angular/core";
import { MatDialogRef, MatDialog } from "@angular/material/dialog";

import { MainService } from "../../../services/main.service";
import { AlertDialog } from "../../../lib/alert.dialog";
import { appConfig } from "../../../../config";

@Component({
	selector: 'home_screen_message-dialog',
	templateUrl: './home_screen_messages.dialog.html'
})
export class HomeScreenMessagesDialog implements OnInit 
{
	isLoading: boolean;
	showLoading: boolean;
	homeScreenMessage: any;
	// message

	constructor(protected mainApiService: MainService, protected dialogRef: MatDialogRef<HomeScreenMessagesDialog>, protected dialog: MatDialog) 
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

        let data = {
			type: 'home-page',
			text: this.homeScreenMessage,
			status: 1
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
}
