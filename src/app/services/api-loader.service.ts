import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { LoaderState } from './loader';

@Injectable()
export class ApiLoaderService 
{
    private loaderSubject = new Subject<LoaderState>();
    loaderState = this.loaderSubject.asObservable();
    
    constructor() 
    {

    }

    show()
    {
        this.loaderSubject.next(<LoaderState>{ show: true });
    }

    hide() 
    {
        this.loaderSubject.next(<LoaderState>{ show: false });
    }
}