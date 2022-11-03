import { Injectable } from '@angular/core';
import { Subject, Observable, BehaviorSubject } from 'rxjs';

@Injectable()
export class SharedService {

  private siblingVar:any
  private product$ = new BehaviorSubject<any>({});
  selectedProduct$ = this.product$.asObservable();
  constructor() { }


  setProduct(product: any) {
    this.product$.next(product);
  }

  // public getVariable(){
  //   return this.siblingVar
  // }

  // public setVariable(data: any): void {
  //   this.siblingVar = data
  //   console.log('gg', this.siblingVar)
  // }
}
