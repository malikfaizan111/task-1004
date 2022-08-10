import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sms-detail',
  templateUrl: './sms-detail.component.html',
  styles: [
    '.form-control {border-radius: 10px !important;}'
  ]
})
export class SmsDetailComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  onLocationBack()
  {
    window.history.back()
  }

}
