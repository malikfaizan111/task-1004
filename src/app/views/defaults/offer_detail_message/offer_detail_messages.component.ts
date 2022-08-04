import { Component, OnInit } from '@angular/core';
import { MainService } from '../../../services/main.service';
import { MatDialog } from '@angular/material/dialog';
import { BaseLoaderService } from '../../../services';
import { appConfig } from '../../../../config';
import { UserAppSelectorService } from '../../../lib/app-selector/app-selector.service';
import { Subscription } from 'rxjs';
import {OfferDetailMessagesDialog} from "./offer_detail_messages.dialog";

@Component({
  selector: 'app-home_screen_messages',
  templateUrl: 'offer_detail_messages.component.html'
})
export class OfferDetailMessagesComponent implements OnInit
{
    OfferDetailMessage: any;
	appSelectorSubscription: Subscription;

	constructor(protected mainApiService: MainService,
		protected appSelectorService: UserAppSelectorService, 
		protected dialog: MatDialog, 
		protected loaderService: BaseLoaderService) 
	{
        this.OfferDetailMessage = null;
		this.appSelectorSubscription = this.appSelectorService.selectedApp.subscribe((response: any) =>
        {
			this.getHomeScreenMessagesList();
		});
	}

	ngOnDestroy(): void 
	{
		this.appSelectorSubscription.unsubscribe();	
	}
    

	ngOnInit() 
	{
		this.getHomeScreenMessagesList();
	}

	onEditSetting(type : any): void 
	{
        let dialogRef = this.dialog.open(OfferDetailMessagesDialog, {autoFocus: false});
		dialogRef.componentInstance.OfferDetailMessage = this.OfferDetailMessage.offers.offers_text;
		if(this.OfferDetailMessage.offers.status == '1')
		{
			dialogRef.componentInstance.offer_status = true	
		}
		else
		{
			dialogRef.componentInstance.offer_status = false
		}
        // dialogRef.componentInstance.offer_status = this.OfferDetailMessage.offers.status;
		 dialogRef.afterClosed().subscribe(result => {
			 if(result)
			 {
				this.getHomeScreenMessagesList();
			 }
		 })
	}

	SettingChange()
	{
		this.getHomeScreenMessagesList();
	}

	getHomeScreenMessagesList(isLoaderHidden?: boolean): void
	{
		this.OfferDetailMessage = null;
		if(isLoaderHidden)
		{
			this.loaderService.setLoading(false);
		}
		else
		{
			this.loaderService.setLoading(true);
		}
		let url = 'getDefaults';
		
		this.mainApiService.getList(appConfig.base_url_slug + url, true)
		.then(result => {
			if (result.status == 200  && result.data) 
			{
                this.OfferDetailMessage = result.data;
				this.loaderService.setLoading(false);
			}
			else
			{
				this.OfferDetailMessage = null;
				this.loaderService.setLoading(false);
			}
		});
	}
}
