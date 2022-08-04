import { Component, OnInit, ElementRef, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';


import { MainService, BaseLoaderService } from '../../services';
import { AlertDialog } from '../../lib';
import { appConfig } from '../../../config';


@Component({
	selector: 'app-outlet-details',
	templateUrl: './outlet-details.component.html'
})
export class OutletDetailsComponent implements OnInit, AfterViewInit
{
	sub: Subscription = new Subscription();
	Outlet: any;
    Offers: any;
    status: boolean;
	changed: boolean;
	role: any;
	Roles: any;

	constructor(private elRef: ElementRef, protected router: Router,
		protected mainApiService: MainService,
		protected loaderService: BaseLoaderService, protected dialog: MatDialog, protected dialogRef: MatDialogRef<OutletDetailsComponent>)
	{
        this.Outlet = null;
        this.Offers = [];
		this.status = false;
		this.changed = false;
	}

	ngOnInit()
	{
        this.getOffers();
        if(this.Outlet.active == 1)
        {
            this.status = true;
        }
        else if(this.Outlet.active == 0)
        {
            this.status = false;
		}
		let abc = localStorage.getItem('UrbanpointAdmin') as string;
		this.Roles = JSON.parse(abc);
		this.role=this.Roles.role;
    }

    ngAfterViewInit()
    {
        this.elRef.nativeElement.parentElement.classList.add("mat-dialog-changes");
    }


    onEditOutlet(): void
	{
		localStorage.setItem('Outlet', JSON.stringify(this.Outlet));
        this.router.navigateByUrl('main/outlets/' + this.Outlet.id);
        this.dialogRef.close();
		event!.stopPropagation();
    }

    onChangeStatus(): void
	{
		let active: any;
		if(this.status)
		{
			active = 1;
		}
		else
		{
			active = 0;
		}
		let Data = {
			id: this.Outlet.id,
			active: active
		};

		this.Outlet.active == active;

		let dialogRef = this.dialog.open(AlertDialog, {autoFocus: false});
		let cm = dialogRef.componentInstance;
		cm.heading = 'Change Outlet';
		cm.message = 'Are you sure to Update Outlet';
		cm.submitButtonText = 'Yes';
		cm.cancelButtonText = 'No';
		cm.type = 'ask';
		cm.methodName = appConfig.base_url_slug + 'ADOutlet';
		cm.dataToSubmit = Data;
    cm.showLoading = true;
    cm.urlVersion = 1;

		dialogRef.afterClosed().subscribe(result => {
			if(result)
			{
				// this.status = !this.status;
				this.getOffers();
				this.changed = true;
            }
            else
            {
                this.status = !this.status;
            }
		})
	}

	getOffers(): void
	{
		this.mainApiService.getList(appConfig.base_url_slug + 'getOffers?outlet_id=' + this.Outlet.id)
		.then(result => {
			if (result.status == 200  && result.data)
			{
				// this.Offers = result.data.offers;

				let Offers : any = result.data.offers;

				Offers.forEach((element : any) => {
					if(element.active == 1)
					{
						element['slide'] = true;
					}
					else if(element.active == 0)
					{
						element['slide'] = false;
					}
				});
				// log here('dsdsd')
				this.Offers = Offers;
			}
			else
			{
				this.Offers = [];
			}
		});
	}

	onDealNameClick(deal : any): void
	{
		localStorage.setItem('Deal', JSON.stringify(deal));
		window.open('#/main/deals/' + deal.id);
		// this.router.navigateByUrl('main/deals/' + deal.id);
		// event.stopPropagation();
		// this.dialogRef.close();
	}

	onChangeDealStatus(deal : any): void
	{
		let active: any;
		if(deal.slide)
		{
			active = 1;
		}
		else
		{
			active = 0;
		}
		let Data = {
			id: deal.id,
			active: active
		};

		let dialogRef = this.dialog.open(AlertDialog, {autoFocus: false});
		let cm = dialogRef.componentInstance;
		cm.heading = 'Change Deal';
		cm.message = 'Are you sure to Update Deal';
		cm.submitButtonText = 'Yes';
		cm.cancelButtonText = 'No';
		cm.type = 'ask';
		cm.methodName = appConfig.base_url_slug + 'updateOffer';
		cm.dataToSubmit = Data;
    cm.showLoading = true;
    cm.urlVersion = 1;

		dialogRef.afterClosed().subscribe(result => {
			if(result)
			{
                this.getOffers();
            }
            else
            {
                this.status = !this.status;
            }
		})
	}

	onDialogClose(): void
	{
		if(this.changed == false)
		{
			this.dialogRef.close('cancel');
		}
		else
		{
			this.dialogRef.close();
		}
	}
}
