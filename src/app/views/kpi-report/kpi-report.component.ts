import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import {DatePipe} from '@angular/common';
import { MainService } from 'src/app/services/main.service';


@Component({
  selector: 'app-kpi-report',
  templateUrl: './kpi-report.component.html',
  styles: [
    ':host::ng-deep .mat-icon-button {color: rgb(20,143,150)}',
    '.input{text-align: start}'
  ],
  providers: [DatePipe]
})
export class KpiReportComponent implements OnInit {


  @ViewChild('formDirective') protected formDirective: FormGroupDirective;
  form: FormGroup;
  enableBrandNewDate: boolean = false;
  btn: boolean = true
  today: any = new Date()
  startDate: any = new Date('2022-01-02')
  
  
  constructor(private datePipe: DatePipe, protected mainApiService: MainService,) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      'date': new FormControl(null, [Validators.required]),
      // 'start': new FormControl(null, [Validators.required]),
      // 'end': new FormControl(null, [Validators.required])
    })
  }

  getValue(name : any)
  {
        return this.form.get(name);
	}

  // checkBox(event: any,text:any) {
  //   console.log(text)
  //   this.system = text.system_selected
  //   this.user = text.user_selected
  //   var myDate = this.datePipe.transform(new Date(), "yyyy-MM-dd")
  //   if(event.checked ==true && text == 'system_selected'){
  //     this.form.get('isChecked').setValue(myDate);
  //     this.btn = false;
  //     this.form.get('date').setValue(null)
  //     this.disable_check = !this.disable_check
  //   }else{
  //     this.form.get('date').setValue(myDate);
  //     this.btn = false;
  //     this.form.get('isChecked').setValue(null)
  //     this.disable_check = !this.disable_check
  //   }
  // }

  
  doSubmit() {
    
   
    var date = this.datePipe.transform(this.form.value.date, "yyyy-MM-dd")
    // var abc = this.datePipe.transform(this.form.value.start, "yyyy-MM-dd")
    // var bcd = this.datePipe.transform(this.form.value.end, "yyyy-MM-dd")
    console.log('start', date)
    this.formDirective.resetForm()

    // satatic api
    let url = 'controlTowerReport?report_date=' + date
    

    this.mainApiService.postcsv(url).then((result) => {
      console.log('api res',result)
    })
    



  }




}
