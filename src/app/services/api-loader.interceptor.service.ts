import { Injectable, Injector } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable, pipe } from 'rxjs';
import { tap, timeout } from 'rxjs/operators';
import { ApiLoaderService } from './api-loader.service';


@Injectable()
export class ApiLoaderInterceptorService implements HttpInterceptor {
	constructor(private loaderService: ApiLoaderService) {

	}

	intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		let url = req.url.split('?');
		if (req.url.includes('sendSms')) {
			return next.handle(req).pipe(timeout(300000), tap((event: HttpEvent<any>) => {
				if (event instanceof HttpResponse) {
				}
			},
				(err: any) => {
					// this.onEnd();
					// this.history = false;
				}));
		}
		else if (req.url.includes('getSubscriptions')) {
			return next.handle(req).pipe(timeout(3600000), tap((event: HttpEvent<any>) => {
				if (event instanceof HttpResponse) {
				}
			},
				(err: any) => {
					// this.onEnd();
					// this.history = false;
				}));
		}
		else if (req.url.includes('generateVoucher')) {
			return next.handle(req).pipe(timeout(300000), tap((event: HttpEvent<any>) => {
				if (event instanceof HttpResponse) {
				}
			},
				(err: any) => {
					// this.onEnd();
					// this.history = false;
				}));
		}
		 else{
			return next.handle(req).pipe(timeout(50000), tap((event: HttpEvent<any>) => {
				if (event instanceof HttpResponse) {
				}
			},
				(err: any) => {
				}));
		}
		// console.log("SPLIT : ", url);

		// if (url.length > 1) {
		// 	let url2 = url[1].split('?');
		// 	// console.log("SPLIT 2: ", url2);
		// 	if (url2[0] == '/orders') {

		// 	}
		// 	else {
		// 		this.showLoader();
		// 	}
		// }
		// if(url[1] == 'order_status=pending'){

		// }
		// else {
		// this.showLoader();
		// }


	}

	// private onEnd(): void {
	// 	this.hideLoader();
	// }

	// private showLoader(): void {
	// 	this.loaderService.show();
	// }

	// private hideLoader(): void {
	// 	this.loaderService.hide();
	// }
}
