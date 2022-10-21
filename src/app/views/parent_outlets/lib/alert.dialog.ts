import { OnInit, Component } from "@angular/core";
import { MatDialogRef, MatDialog } from "@angular/material/dialog";

import { MainService } from "../services/main.service";

@Component({
	selector: 'alert-dialog',
	templateUrl: './alert.dialog.html'
})
export class AlertDialog implements OnInit {
	isLoading: boolean;
	heading: string = '';
	message: string = '';
	type: 'ask' | 'success' | 'error' | 'info';
	cancelButtonText: string;
	submitButtonText: string;
	dataToSubmit: any;
	methodName: any;
	showLoading: boolean;
	methodType: string;
	urlVersion:number = 1;

	constructor(protected mainApiService: MainService, protected dialogRef: MatDialogRef<AlertDialog>, protected dialog: MatDialog) {
		this.isLoading = false;
		this.showLoading = false;
	}

	ngOnInit() {
	}

	onCancelClick(): void {
		this.dialogRef.close(false);
	}

	onSubmitClick(): void {
		// this.dialogRef.close(true);
		this.isLoading = true;
		this.mainApiService.postData(this.methodName, this.dataToSubmit, this.urlVersion)
			.then(result => {
				if (result.status == 200 || result.status == 201) {
					// this.gerOrdersList(this.currentPage);
					this.dialogRef.close(true);
					this.isLoading = false;
				}
				else if (result.status == 400) {
					let dialogRef = this.dialog.open(AlertDialog, { autoFocus: false });
					let cm = dialogRef.componentInstance;
					cm.heading = 'Warning!';
					cm.message = result.error.message;
					cm.cancelButtonText = 'Close';
					cm.type = 'error';
					this.dialogRef.close(false);
				}
				else {
					this.isLoading = false;
					let dialogRef = this.dialog.open(AlertDialog, { autoFocus: false });
					let cm = dialogRef.componentInstance;
					cm.heading = 'Error';
					cm.message = 'Internal Server Error';
					cm.cancelButtonText = 'Ok';
					cm.type = 'error';
				}
			});
	}
}
