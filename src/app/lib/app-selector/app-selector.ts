import { OnInit, Component, OnDestroy, Input, Output, EventEmitter } from "@angular/core";
import { appConfig } from "../../../config";
import { UserAppSelectorService } from "./app-selector.service";
// import { Subscription } from "rxjs";

@Component({
	selector: 'user-app-selector',
	templateUrl: './app-selector.html'
})
export class AppSelectorComponent implements OnInit, OnDestroy
{
	@Output() onAppSelect:  EventEmitter<any> = new EventEmitter;
	appID: any = 2;
	UserApps: any;
	UrbanpointAdmin: any;
	// loaderSubscription: Subscription;

	constructor(protected appSelectorService: UserAppSelectorService)
	{
		this.UserApps = [
			{key: 1, title: 'Urban Point'},
			{key: 2, title: 'Doha Insurance'},
			{key: 3, title: 'Doha Takaful'},
			{key: 4, title: 'UP Kuwait'},
			{key: 5, title: 'UP Oman'}
		];
		let abc = localStorage.getItem('UrbanpointAdmin') as string;
		this.UrbanpointAdmin = JSON.parse(abc);
		// log here('UrbanpointAdmin', this.UrbanpointAdmin);

		if(this.UrbanpointAdmin)
		{
			this.appID = this.UrbanpointAdmin.name;
		}

		let dict = {
			user_app_id: this.appID,
			url : '&user_app_id=' + this.appID
		}

		this.appSelectorService.setApp(dict);
	}

	ngOnInit()
	{
		// this.UserApps = JSON.parse(localStorage.getItem('UserApps'));
	}

	onAppChange(): void
	{
		let dict = {
			user_app_id: this.appID,
			url : '&user_app_id=' + this.appID
  }
    this.setCurrency();
		this.appSelectorService.setApp(dict);
		// let dict = {
		// 	user_app_id: this.appID,
		// 	url : '&user_app_id=' + this.appID
		// }
		// this.onAppSelect.emit(dict)
  }

  setCurrency() {
    switch (this.appID.toString()) {
      case '1':
        appConfig.currency = 'QAR';
        break;

      case '5':
        appConfig.currency = 'OMR';
        break;

      default:
        break;
    }
  }

	ngOnDestroy(): void
	{
		// this.loaderSubscription.unsubscribe();
	}
}
