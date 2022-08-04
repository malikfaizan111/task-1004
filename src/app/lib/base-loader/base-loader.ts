import { OnInit, Component, OnDestroy, Input } from "@angular/core";
import { BaseLoaderService } from "../../services";
import { Subscription } from "rxjs";


@Component({
	selector: 'base-loader',
	templateUrl: './base-loader.html'
})
export class BaseLoaderComponent implements OnInit, OnDestroy
{
	@Input() isLoading: boolean;
	loaderSubscription: Subscription;

	constructor(protected loaderService: BaseLoaderService) 
	{
		this.isLoading = false;

		this.loaderSubscription = this.loaderService.isLoadingEvent.subscribe((response: any) =>
        {
			this.isLoading = response;
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
