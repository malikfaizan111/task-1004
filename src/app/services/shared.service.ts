import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable()
export class SharedService {

  private siblingVar:any
  constructor() { }


  public getVariable(){
    return this.siblingVar
  }

  public setVariable(data: any): void {
    this.siblingVar = data
    console.log('gg', this.siblingVar)
  }
}
