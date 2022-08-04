
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
// import 'rxjs/add/operator/map';
import { map } from 'rxjs/operators';


import { HttpClient, HttpHeaders } from '@angular/common/http';
import { appConfig } from '../../../config';


@Injectable()
export class EligibilityService
{
    headers: HttpHeaders;
    options: any;
    public auth_key: string = '';
    public baseUrl: string;
    // UrbanpointAdmin: any;

    constructor(private http: HttpClient, private router: Router)
    {
        this.baseUrl = 'https://adminurban.com/up_backend/api/v1/subscription/eligibilitychecker';

        // this.baseUrl = appConfig.base_url;
		// this.UrbanpointAdmin = JSON.parse(localStorage.getItem('UrbanpointAdmin'));

		// var headers = new Headers();
		// headers.append('Content-Type', 'application/json');
		// headers.append('Authorization', this.UrbanpointAdmin.auth_key);
		// this.options = new RequestOptions({ headers: headers });

        // this.baseUrl = appConfig.base_url;

		this.headers = new HttpHeaders({ 'Authorization': 'be26a77d41fba85c279ed1aa72c3001d'});
		// this.headers.append('Content-Type', 'multipart/form-data');
        // this.headers.append('Accept', 'application/json');
        this.options = {headers: this.headers, observe: 'response'};
    }

    public CheckEligibilityComponent(formData: any): Promise<any>
    {
        return this.http.post(this.baseUrl, formData, this.options)
        .toPromise().then((response: any) =>
        {
            let result: any = response.body;
            return result;
        },
        (reason: any) =>
        {
            return reason;
        }).catch(this.handleError);
    }

    public handleError(error: any): Promise<any>
    {
        // log here("handleError = " + error);
        return error;
    }

}

