import { Component, OnInit, ElementRef, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { MainService, BaseLoaderService } from '../../services';


@Component({
	selector: 'app-customer-details',
	templateUrl: './customer-details.component.html'
})
export class CustomerDetailsComponent implements OnInit, AfterViewInit
{
	
	sub: Subscription = new Subscription();
	Customer: any;
	role:any;

	constructor(private elRef: ElementRef, protected router: Router,
		protected mainApiService: MainService,
		protected loaderService: BaseLoaderService, protected dialog: MatDialog, protected dialogRef: MatDialogRef<CustomerDetailsComponent>)	
	{
        this.Customer = null;
	}

	ngOnInit() 
	{
       
    }

    ngAfterViewInit()
    {
        this.elRef.nativeElement.parentElement.classList.add("mat-dialog-changes");
    }

    
    onEditCustomer(event : any): void 
	{
		localStorage.setItem('Customer', JSON.stringify(this.Customer));
		this.router.navigateByUrl('main/customers/edit/' + this.Customer.id);
        this.dialogRef.close();
		event.stopPropagation();
    }
    
	onDialogClose(): void
	{
		// if(this.changed == false)
		// {
		// 	this.dialogRef.close('cancel');
		// }
		// else
		// {
			this.dialogRef.close('cancel');
		// }
	}
}
