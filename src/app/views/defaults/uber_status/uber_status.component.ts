import { Component, OnInit } from '@angular/core';
import { MainService } from '../../../services/main.service';
import { MatDialog } from '@angular/material/dialog';
import { BaseLoaderService } from '../../../services';
import { appConfig } from '../../../../config';
import { UserAppSelectorService } from '../../../lib/app-selector/app-selector.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-uber_status',
  templateUrl: './uber_status.component.html'
})
export class UberStatusComponent implements OnInit 
{
	UberStatus: any;
	uberValue: any;
	appSelectorSubscription: Subscription;

	constructor(protected mainApiService: MainService, 
		protected dialog: MatDialog, 
		protected appSelectorService: UserAppSelectorService, 
		protected loaderService: BaseLoaderService) 
	{
		this.UberStatus = null;
		
		this.appSelectorSubscription = this.appSelectorService.selectedApp.subscribe((response: any) =>
        {
			this.getUberStatusList();
		});
	}
	
	ngOnDestroy(): void 
	{
		this.appSelectorSubscription.unsubscribe();	
	}
    

	ngOnInit() 
	{
		this.getUberStatusList();
	}

	getUberStatusList(isLoaderHidden?: boolean): void
	{
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
                this.UberStatus = result.data;
				this.loaderService.setLoading(false);
				if(this.UberStatus.uber == 0)
				{
					this.uberValue = false;
				}
				else
				{
					this.uberValue = true;
				}
			}
			else
			{
				this.UberStatus = null;
				this.loaderService.setLoading(false);
			}
		});
	}

	updateUberStatusList(): void
	{
		let url = 'addUpdateDefault';

		let dict = {
			type: 'uber',
			uber: 0,
			status: 1
		}

		if(this.uberValue)
		{
			dict.uber = 1;
		}
		else
		{
			dict.uber = 0;
		}
		
		this.mainApiService.postData(appConfig.base_url_slug + url, dict)
		.then(result => {
			if (result.status == 200  && result.data) 
			{
                this.UberStatus = result.data;
			}
			else
			{
				this.UberStatus = null;
			}
		});
	}
}
