import { Component, OnInit, ElementRef, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
// import { Subscription } from 'rxjs';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';


import { MainService, BaseLoaderService } from '../../services';
// import { AlertDialog } from '../../lib';


@Component({
	selector: 'app-access-code-details',
	templateUrl: './code_details.dialog.html'
})
export class CodeDetailsComponent implements OnInit, AfterViewInit
{
	
	// sub: Subscription;
	Code: any;
    // Offers: any;
    status: boolean;

	constructor(private elRef: ElementRef, protected router: Router,
		protected mainApiService: MainService,
		protected loaderService: BaseLoaderService, protected dialog: MatDialog, protected dialogRef: MatDialogRef<CodeDetailsComponent>)	
	{
        this.Code = null;
        // this.Offers = [];
        this.status = false;
	}

	ngOnInit() 
	{
        // this.getOffers();
        if(this.Code.active == 1)
        {
            this.status = true;
        }
        else if(this.Code.active == 0)
        {
            this.status = false;
        }
    }

    ngAfterViewInit()
    {
        this.elRef.nativeElement.parentElement.classList.add("mat-dialog-changes-1");
    }
}
