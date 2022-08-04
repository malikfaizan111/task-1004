import { OnInit, Component } from "@angular/core";
import { MatDialogRef, MatDialog } from "@angular/material/dialog";

import { MainService } from "../../../services/main.service";
import { AlertDialog } from "../../../lib/alert.dialog";
import { appConfig } from "../../../../config";


@Component({
	selector: 'trending_search-dialog',
	templateUrl: './trending_search.dialog.html'
})
export class TrendingSearchDialog implements OnInit {
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
	trendingSearch: any;
	sttatus: any;

	constructor(protected mainApiService: MainService, protected dialogRef: MatDialogRef<TrendingSearchDialog>, protected dialog: MatDialog) {

		this.isEditing = false;
	}

	ngOnInit() {

		if (this.isEditing) {
			if (this.details.status) {
				this.sttatus = '1'
			}
			else {
				this.sttatus = '0'
			}
			this.subData =
			{
				type: 'trending_search',
				app_id: this.details.app_id,
				tag: this.details.text,

				status: this.sttatus,
				id: this.details.id,
			}
		}
	}

	onCancelClick(): void {
		this.dialogRef.close(false);
	}

	onSubmitClick(): void {
		this.isLoading = true;
		this.mainApiService.postData(appConfig.base_url_slug + 'updateTrendingSearchTag', this.subData, 2)
			.then(result => {
				if (result.status == 200 && result.data) {
					this.trendingSearch = result.data;
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