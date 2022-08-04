import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class AppLoaderService 
{
	isLoadingEvent: Subject<any> = new Subject<any>();

	constructor() 
	{
		this.isLoadingEvent.next(false);
	}

	setLoading(val)
	{
		this.isLoadingEvent.next(val);
	}
}
