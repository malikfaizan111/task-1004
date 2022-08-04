import { OnInit, Component } from "@angular/core";
import { MatDialogRef, MatDialog } from "@angular/material/dialog";

import { MainService } from "../../../services/main.service";
import { AlertDialog } from "../../../lib/alert.dialog";
import { appConfig } from "../../../../config";

@Component({
	selector: 'version-dialog',
	templateUrl: './version.dialog.html'
})
export class VersionDialog implements OnInit 
{
	isLoading: boolean;
    showLoading: boolean;
    platform: any;
    forcefully_updated: any;

	constructor(protected mainApiService: MainService, protected dialogRef: MatDialogRef<VersionDialog>, protected dialog: MatDialog) 
	{
		this.isLoading = false;
        this.showLoading  = false;
        this.platform = null;
        this.forcefully_updated = false;
	}

	ngOnInit() 
	{
	}

	onCancelClick(): void
	{
		this.dialogRef.close(false);
	}

	onSubmitClick(): void
	{
        this.isLoading = true;

        if(this.forcefully_updated)
        {
            this.platform.forcefully_updated = 1;
        }
        else
        {
            this.platform.forcefully_updated = 0;
        }

        // this.platform.type = type;
        
        // let data = {
        //     type: 
        // }

		this.mainApiService.postData(appConfig.base_url_slug + 'updateVersion', this.platform)
		.then(result => {
			if (result.status == 200  && result.data) 
			{
				this.dialogRef.close(true);
				this.isLoading = false;
			}
			else 
			{
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
