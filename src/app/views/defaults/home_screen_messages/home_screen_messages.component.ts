import { Component, OnInit } from '@angular/core';
import { MainService } from '../../../services/main.service';
import { MatDialog } from '@angular/material/dialog';
import { HomeScreenMessagesDialog } from './home_screen_messages.dialog';
import { BaseLoaderService } from '../../../services';
import { appConfig } from '../../../../config';
import { UserAppSelectorService } from '../../../lib/app-selector/app-selector.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home_screen_messages',
  templateUrl: './home_screen_messages.component.html'
})
export class HomeScreenMessagesComponent implements OnInit 
{
    HomeScreenMessage: any;
	appSelectorSubscription: Subscription;

	constructor(protected mainApiService: MainService,
		protected appSelectorService: UserAppSelectorService, 
		protected dialog: MatDialog, 
		protected loaderService: BaseLoaderService) 
	{
        this.HomeScreenMessage = null;
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
        let dialogRef = this.dialog.open(HomeScreenMessagesDialog, {autoFocus: false});
        dialogRef.componentInstance.homeScreenMessage = this.HomeScreenMessage.home_page_text;
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
		this.HomeScreenMessage = null;
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
                this.HomeScreenMessage = result.data;
				this.loaderService.setLoading(false);
			}
			else
			{
				this.HomeScreenMessage = null;
				this.loaderService.setLoading(false);
			}
		});
	}
}
