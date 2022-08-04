import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable()
export class BaseLoaderService
{
  isLoadingEvent: Subject<any> = new Subject<any>();
  orders = new Subject<any>();
  orderCount = new Subject<any>();
  menudata = new BehaviorSubject<[]>([]);
  outletImage = new BehaviorSubject<[]>([]);
  outletfile = new BehaviorSubject<[]>([]);
  pushMsgRefresh = new Subject<any>();

	constructor()
	{
		this.isLoadingEvent.next(false);
    // this.UpdateOutletImage(false);
	}

	setLoading(val : any)
	{
		this.isLoadingEvent.next(val);
  }

  sendToUnAttendedOrders(arr : any) {
     this.orders.next(arr);
  }

  sendOrderCount(arr : any) {
    this.orderCount.next(arr);
  }

  sendMenuToOutlet(arr : any) {
    this.menudata.next(arr);
  }

  // UpdateOutletImage(val: any){
  //   this.outletImage.next(val);
  // }
  // updateFileImage(val:any)
  // {
  //   this.outletfile.next(val);
  // }

 sendPushMsgUpdate() {
  this.pushMsgRefresh.next(true);
 }
}
