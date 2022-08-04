import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class UserAppSelectorService 
{
    selectedApp: Subject<any> = new Subject<any>();
    userAppData: any;

	constructor() 
	{
        // this.isLoadingEvent.next(false);
        this.userAppData = null;
	}

	setApp(val)
	{
        this.userAppData = val;
		this.selectedApp.next(val);
    }
    
    getApp()
	{
        if(this.userAppData != null)
        {
            return this.userAppData;
        }
	}
}
