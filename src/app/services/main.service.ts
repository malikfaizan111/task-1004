import { Injectable } from '@angular/core';
// import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpResponse } from '@angular/common/http';

import { Router } from '@angular/router';
import { Observable, Subject, Subscription } from 'rxjs';
// import 'rxjs/add/operator/map';
// import 'rxjs/add/observable/throw';
import { throwError } from 'rxjs';
import { map } from 'rxjs/operators';
// import 'rxjs/add/operator/timeoutWith';
import {timeout} from 'rxjs/operators';
import { appConfig } from '../../config';
import { BaseLoaderService } from '../services/base-loader.service';
import { UserAppSelectorService } from '../lib/app-selector/app-selector.service';

@Injectable()
export class MainService
{
	UrbanpointAdmin: any;
	// options: RequestOptions;  whatsapp call rkle
	// baseUrl: string;

	headers: HttpHeaders;
	headersOld: HttpHeaders = new HttpHeaders;
	options: any;
	optionsOld : any;
    public auth_key: string = '';
	public baseUrl: string;
	public baseUrlV2: string;

	appSelectorSubscription: Subscription;
	user_app: any;

	constructor(private http: HttpClient, private router: Router, protected loaderService: BaseLoaderService, protected appSelectorService: UserAppSelectorService)
	{
		let abc = localStorage.getItem('UrbanpointAdmin') as string;
		this.UrbanpointAdmin = JSON.parse(abc);

        this.baseUrl = appConfig.base_url;
        this.baseUrlV2 = appConfig.base_urlV2;

		this.headers = new HttpHeaders({ 'Authorization': this.UrbanpointAdmin.auth_key, 'Cache-Control': 'no-cache',});

		this.options = {headers: this.headers, observe: 'response'};

		this.appSelectorSubscription = this.appSelectorService.selectedApp.subscribe((response: any) =>
        {
			this.user_app = response;
		});
	}

	public getList(params: string, isSingle?: boolean, urlVersion?: number): Promise<any>
    {
		this.user_app = this.appSelectorService.getApp();

		let url = '';
		if(urlVersion == 2)
		{
			url = this.baseUrlV2;
		}
		else
		{
			url = this.baseUrl;
		}

		if(isSingle)
		{
			url = url + params + '?user_app_id=' + this.user_app.user_app_id;
		}
		else
		{
			url = url + params + this.user_app.url;
		}

        return this.http.get(url, this.options)
        .toPromise().then((response: any) =>
        {
            if (response.status === 401)
			{
				localStorage.clear();
				// this.router.navigate(['auth/login']);
				window.location.reload();
			}
			else
			{
				return response.body;
			}
        },
        (reason: any) =>
        {
			if (reason.error.status === 401)
			{
				localStorage.clear();
				// this.router.navigate(['auth/login']);
				window.location.reload();
				return reason;
			}
			return reason;

        }).catch(this.handleError);
    }


	public getCreditCardPackages(params: string, isSingle?: boolean, urlVersion?: number): Promise<any>
    {
		this.user_app = this.appSelectorService.getApp();

		let url = '';
		if(urlVersion == 2)
		{
			url = this.baseUrlV2;
		}
		else
		{
			url = this.baseUrl;
		}

		if(isSingle)
		{
			url = url + params + '?user_app_id=' + this.user_app.user_app_id;
		}
		else
		{
			url = url + params + this.user_app.url;
		}
	

        return this.http.get(url, this.options)
        .toPromise().then((response: any) =>
        {
            if (response.status === 401)
			{
				localStorage.clear();
				// this.router.navigate(['auth/login']);
				window.location.reload();
			}
			else
			{
				return response.body;
			}
        },
        (reason: any) =>
        {
			if (reason.error.status === 401)
			{
				localStorage.clear();
				// this.router.navigate(['auth/login']);
				window.location.reload();
				return reason;
			}
			return reason;

        }).catch(this.handleError);
    }

	postDataOld( apiSlug: string, formData: any, urlVersion?: number): Promise<any>
	{
		this.user_app = this.appSelectorService.getApp();
		this.headersOld = new HttpHeaders({ 'Authorization': this.UrbanpointAdmin.auth_key,'user_app_id':this.user_app.user_app_id.toString()});
		this.optionsOld = {headers: this.headersOld, observe: 'response'};
    formData['user_app_id'] = this.user_app.user_app_id;

		let url = '';
		if(urlVersion == 2)
		{
			url = this.baseUrlV2;
		}
		else
		{
			url = this.baseUrl;
		}
		return this.http.post(url + apiSlug, formData, this.optionsOld)
			.toPromise().then((response: any) =>
			{
				if (response.status === 401)
				{
					localStorage.clear();
					// this.router.navigate(['auth/login']);
					window.location.reload();
				}
				else
				{
					return response.body;
				}
			},
			(reason: any) =>
			{
				if (reason.error.status === 401)
				{
					localStorage.clear();
					// this.router.navigate(['auth/login']);
					window.location.reload();
					return reason;
				}
				return reason;

			}).catch(this.handleError);
	}

	postData( apiSlug: string, formData: any, urlVersion?: number): Promise<any>
	{

		this.user_app = this.appSelectorService.getApp();
    formData['user_app_id'] = this.user_app.user_app_id;
    console.log(this.headers);
    if (!this.headers.has('user_app_id')){
      this.headers = this.headers.append('user_app_id', this.user_app.user_app_id.toString());
      this.options = {headers: this.headers, observe: 'response'};
    }

		let url = '';
		if(urlVersion == 2)
		{
			url = this.baseUrlV2;
		}
		else
		{
			url = this.baseUrl;
		}
		return this.http.post(url + apiSlug, formData, this.options)
			.toPromise().then((response: any) =>
			{
				if (response.status === 401)
				{
					localStorage.clear();
					// this.router.navigate(['auth/login']);
					window.location.reload();
				}
				else
				{
					return response.body;
				}
			},
			(reason: any) =>
			{
				if (reason.error.status === 401)
				{
					localStorage.clear();
					// this.router.navigate(['auth/login']);
					window.location.reload();
					return reason;
				}
				return reason;

			}).catch(this.handleError);
	}

	postFormData( apiSlug: string, formData: any, urlVersion?: number): Promise<any>
	{
		this.user_app = this.appSelectorService.getApp();
		// formData['user_app_id'] = this.user_app.user_app_id;
		formData.append('user_app_id', this.user_app.user_app_id);

		let url = '';
		if(urlVersion == 2)
		{
			url = this.baseUrlV2;
		}
		else
		{
			url = this.baseUrl;
		}

		return this.http.post(url + apiSlug, formData, this.options)
			.toPromise().then((response: any) =>
			{
				if (response.status === 401)
				{
					localStorage.clear();
					// this.router.navigate(['auth/login']);
					window.location.reload();
				}
				else
				{
					return response.body;
				}
			},
			(reason: any) =>
			{
				if (reason.error.status === 401)
				{
					localStorage.clear();
					// this.router.navigate(['auth/login']);
					window.location.reload();
					return reason;
				}
				return reason;

			}).catch(this.handleError);
  }

  patch(endpoint : any, body : any,urlVersion = 2): Promise<any>
    {
      let url;
      if(urlVersion == 2)
      {
        url = this.baseUrlV2;
      }
      else
      {
        url = this.baseUrl;
      }
        return this.http.patch(url + endpoint, body, this.options)
        .toPromise().then((response: any) =>
        {
          if (response.status === 401)
          {
            localStorage.clear();
            window.location.reload();
          }
          else
          {
            return response;
          }
        },
          (reason: any) =>
          {
            if (reason.error.status === 401)
            {
              localStorage.clear();
              window.location.reload();
              return reason;
            }
            return reason;
          }).catch(this.handleError);
    }

	onLogout(): Promise<any>
	{
		return this.http.get(this.baseUrl + appConfig.base_url_slug + 'logout', this.options)
			.toPromise().then((response: any) =>
			{
				if (response.status === 401)
				{
					localStorage.clear();
					// this.router.navigate(['auth/login']);
					window.location.reload();
				}
				else
				{
					return response.body;
				}
			},
			(reason: any) =>
			{
				if (reason.error.status === 401)
				{
					localStorage.clear();
					// this.router.navigate(['auth/login']);
					window.location.reload();
					return reason;
				}
				return reason;

			}).catch(this.handleError);
	}

	public handleError(error: any): Promise<any>
    {
        return error;
	}
	// FOR VERSION 2 these are the services

	// public getListV2(params: string, isSingle?: boolean): Promise<any>
    // {
	// 	this.user_app = this.appSelectorService.getApp();

	// 	let url = '';
	// 	if(isSingle)
	// 	{
	// 		url = this.baseUrlV2 + params + '?user_app_id=' + this.user_app.user_app_id;
	// 	}
	// 	else
	// 	{
	// 		url = this.baseUrlV2 + params + this.user_app.url;
	// 	}

    //     return this.http.get(url, this.options)
    //     .toPromise().then((response: any) =>
    //     {
    //         if (response.status === 401)
	// 		{
	// 			localStorage.clear();
	// 			// this.router.navigate(['auth/login']);
	// 			window.location.reload();
	// 		}
	// 		else
	// 		{
	// 			return response.body;
	// 		}
    //     },
    //     (reason: any) =>
    //     {
	// 		if (reason.error.status === 401)
	// 		{
	// 			localStorage.clear();
	// 			// this.router.navigate(['auth/login']);
	// 			window.location.reload();
	// 			return reason;
	// 		}
	// 		return reason;

    //     }).catch(this.handleError);
	// }


// version 2 post Formdata call

	// postFormDataV2( apiSlug: string, formData: any): Promise<any>
	// {
	// 	this.user_app = this.appSelectorService.getApp();
	// 	// formData['user_app_id'] = this.user_app.user_app_id;
	// 	formData.append('user_app_id', this.user_app.user_app_id);

	// 	return this.http.post(this.baseUrlV2 + apiSlug, formData, this.options)
	// 		.toPromise().then((response: any) =>
	// 		{
	// 			if (response.status === 401)
	// 			{
	// 				localStorage.clear();
	// 				// this.router.navigate(['auth/login']);
	// 				window.location.reload();
	// 			}
	// 			else
	// 			{
	// 				return response.body;
	// 			}
	// 		},
	// 		(reason: any) =>
	// 		{
	// 			if (reason.error.status === 401)
	// 			{
	// 				localStorage.clear();
	// 				// this.router.navigate(['auth/login']);
	// 				window.location.reload();
	// 				return reason;
	// 			}
	// 			return reason;

	// 		}).catch(this.handleError);
	// }


// Version 2 post data

	// postDataV2( apiSlug: string, formData: any): Promise<any>
	// {
	// 	this.user_app = this.appSelectorService.getApp();
	// 	formData['user_app_id'] = this.user_app.user_app_id;

	// 	return this.http.post(this.baseUrlV2 + apiSlug, formData, this.options)
	// 		.toPromise().then((response: any) =>
	// 		{
	// 			if (response.status === 401)
	// 			{
	// 				localStorage.clear();
	// 				// this.router.navigate(['auth/login']);
	// 				window.location.reload();
	// 			}
	// 			else
	// 			{
	// 				return response.body;
	// 			}
	// 		},
	// 		(reason: any) =>
	// 		{
	// 			if (reason.error.status === 401)
	// 			{
	// 				localStorage.clear();
	// 				// this.router.navigate(['auth/login']);
	// 				window.location.reload();
	// 				return reason;
	// 			}
	// 			return reason;

	// 		}).catch(this.handleError);
	// }






}
