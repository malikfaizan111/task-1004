import { Component, OnInit, ElementRef, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';


import { MainService, BaseLoaderService } from '../../services';
import { AlertDialog } from '../../lib';
import { appConfig } from '../../../config';


@Component({
	selector: 'app-campaign-details',
	templateUrl: './campaign-details.component.html'
})
export class CampaignDetailsComponent implements OnInit, AfterViewInit
{
	
	sub: Subscription = new Subscription();
	Item: any;
    
    status: boolean;
	changed: boolean;
	Offers: any;
	Campaign: any = [];
	CampaignCount: any;
	currentPage: any;
	pages: any;
	search: string = '';
	paginationService: any;
	totalPages: any;
	Outlet: any;

	constructor(private elRef: ElementRef, protected router: Router,
		protected mainApiService: MainService,
		protected loaderService: BaseLoaderService, protected dialog: MatDialog, protected dialogRef: MatDialogRef<CampaignDetailsComponent>)	
	{
		this.Outlet = null;
		this.Offers = [];
		this.status = false;
		this.changed = false;
	}

	ngOnInit() 
	{ //issue adding compain ID into local storage and send back to data base 
		// var data = JSON.parse(localStorage.getItem('ParentId'));
		// this.Outlet
		// this.sub = this._route.params.subscribe(params => {
		// 	this.id = params['this.outlet.id'];
		// });
		// this.getCampaign(1)
		let abc = localStorage.getItem('Campaign') as string;
		this.Outlet = JSON.parse(abc);
    }

    ngAfterViewInit()
    {
        this.elRef.nativeElement.parentElement.classList.add("mat-dialog-changes");
    }

    
    onEdit(): void 
	{
		

        // this.router.navigateByUrl('main/campaign/' + this.Outlet.id);
        // this.dialogRef.close();
		// event.stopPropagation();
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

		dialogRef.afterClosed().subscribe(result => {
			if(result)
			{
				// this.status = !this.status;
				this.getCampaign(1);
				this.changed = true;
            }
            else
            {
                this.status = !this.status;
            }
		})
	}

	getCampaign(index : any, isLoaderHidden?: boolean): void
	{
		
		this.loaderService.setLoading(true);
		let url = 'getCampaign';

		if(this.search != '')
		{
			url = url + '&search=' + this.search;
		}
		else
		{
			this.search = '';
		}
		
		this.mainApiService.getList(appConfig.base_url_slug + url +this.Outlet.id)
		.then(result => {
			console.log(result)
			if (result.status == 200  && result.data) 
			{
				this.Campaign= result.data;
				this.CampaignCount = result.data.CampaignCount;
				this.currentPage = index;
				
				this.loaderService.setLoading(false);
			}
			else
			{
				this.Campaign = [];
				this.CampaignCount = 0;
				this.currentPage = 1;
				
				
				this.loaderService.setLoading(false);
			}
		});
	}
	perPage(CampaignCount: any, index: any, perPage: any): any {
		throw new Error("Method not implemented.");
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
		cm.methodName = appConfig.base_url_slug + 'ADOffer';
		cm.dataToSubmit = Data;
		cm.showLoading = true;

		dialogRef.afterClosed().subscribe(result => {
			if(result)
			{
                this.getCampaign(1);
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
