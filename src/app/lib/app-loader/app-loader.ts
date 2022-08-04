import { OnInit, Component, OnDestroy, Input } from "@angular/core";
import { Subscription } from "rxjs";
import { AppLoaderService } from "./app-loader.service";

@Component({
	selector: 'app-loader',
	templateUrl: './app-loader.html'
})
export class AppLoaderComponent implements OnInit, OnDestroy
{
	@Input() isLoading: boolean;
	@Input() totalRecords: any;
	@Input() completedRecords: any;
	@Input() loaderMessage: any;
	loaderSubscription: Subscription;

	constructor(protected appLoaderService: AppLoaderService) 
	{
		this.isLoading = false;
		this.totalRecords = 0;
		this.completedRecords = 0;
		this.loaderMessage = "Please wait CSV file is preparing to download.";
		// document.body.style.overflow = 'hidden';
		this.loaderSubscription = this.appLoaderService.isLoadingEvent.subscribe((response: any) =>
        {
			this.isLoading = response;
			if(response)
			{
				document.body.style.overflow = 'hidden';
			}
			else
			{
				document.body.style.overflow = 'auto';
			}
        });
	}

	ngOnInit() 
	{
	}

	ngOnDestroy(): void 
	{
		this.loaderSubscription.unsubscribe();
	}
}
