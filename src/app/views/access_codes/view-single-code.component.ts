import { AfterViewInit, Component, ElementRef, EventEmitter, OnInit, Output } from '@angular/core';
import { ExportCSVComponent } from '../../lib/export_csv.component';
import { MainService, BaseLoaderService, PaginationService } from '../../services';
import { AppLoaderService } from '../../lib/app-loader/app-loader.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ThrowStmt } from '@angular/compiler';
import { appConfig } from '../../../config';
import { AlertDialog } from '../../lib';
import { AngularCsv } from 'angular-csv-ext/dist/Angular-csv';

@Component({
  selector: 'app-view-single-code',
  templateUrl: './view-single-code.component.html',
  styles: [
  ]
})
export class ViewSingleCodeComponent implements OnInit {

  Code: any;
  mAccessCodes: any[];

  constructor(protected mainApiService: MainService,
    protected appLoaderService: AppLoaderService,
    protected dialog: MatDialog,
    private elRef: ElementRef,
    protected paginationService: PaginationService,)
    {
    this.Code = null;
    this.mAccessCodes = [];
    }

  ngOnInit(): void {
	this.mAccessCodes.push(this.Code)
	console.log(this.mAccessCodes)
  }

  

  onChangemAccessCode(promoCode : any): void 
	{
		let status: any;
		if(promoCode.slide)
		{
			status = 1;
		}
		else
		{
			status = 0;
		}
		let merchantData = {
			id: promoCode.id,
			status: status
		};

		let dialogRef = this.dialog.open(AlertDialog, {autoFocus: false});
		let cm = dialogRef.componentInstance;
		cm.heading = 'Change PromoCode';
		cm.message = 'Are you sure to Update PromoCode';
		cm.submitButtonText = 'Yes';
		cm.cancelButtonText = 'No';
		cm.type = 'ask';
		cm.methodName = appConfig.base_url_slug + 'updateAccessCode';
		cm.dataToSubmit = merchantData;
		cm.showLoading = true;

		dialogRef.afterClosed().subscribe(result => {
			if(result)
			{
				// this.germAccessCodesList(this.currentPage, true);
			}
			else
			{
				promoCode.slide = !promoCode.slide;
			}
		})
	}

	ExportCSV()
	{
		const codes = this.mAccessCodes.map(({slide, ...rest})=>{
			return rest
		})
		var CSVHeader = {
			headers: ["ID", "user_id", "redeemed_on",  "Code", "code_user", "status", "user_id" ]
		  }
		new AngularCsv(codes, 'single-access-code', CSVHeader)
	}

}
