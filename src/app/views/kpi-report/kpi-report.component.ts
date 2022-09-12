import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { MainService } from 'src/app/services/main.service';
import { MatDialog } from '@angular/material/dialog';
import { AlertDialog } from '../../lib';


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


  constructor(private datePipe: DatePipe, protected mainApiService: MainService, protected dialog: MatDialog,) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      'date': new FormControl(null, [Validators.required]),
      // 'start': new FormControl(null, [Validators.required]),
      // 'end': new FormControl(null, [Validators.required])
    })
  }

  getValue(name: any) {
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
      console.log('api res', result)
      this.generateCsvData(result.data)
    })

  }

  generateCsvData(data: any) {
    if (data.length > 0) {

      console.log('kpi data response: ' + data);
      var tempData = [];
      //rows length //    6 = additional sub categories for default values array (firstColumnData)
      const objLength = Object.keys(data[0].report).length + 6;
      console.log('obejct length: ' + objLength)

      //1st column default values
      let firstColumnData = ["Acquisition A: Registration", "Total # of new registration", "growth as %", "Acquisition B: Subscription", "Total # of new subscriptions", "growth as %", "as % of total # of new registrations",
        "Activation: 1st time Usage", "Total # of new activations - 1st time offer usage", "growth as % ", "as % of total # of new subscriptions", "Retention & Engagement", "In-Store Offer Redemptions", "Total # of In-Store Offer Redemptions",
        "growth as %", "Total # of Unique Users who Redeemed an Offer", "Avg. # of redemptions per user", "Days in month", "Avg Daily Redemptions",
        "Highest Redemption within 1 Day", "Total Approximate Savings", "Avg. approximate savings per user", "Delivery Orders", "Total # of Delivery Orders",
        " growth as % ", "Total # of Unique Users who Placed an Order", "Avg. # of orders per user", "Days in month", "Avg Daily Orders", "Avg Order Amount",
        "Total Revenue", "Highest # of Orders within 1 Day", "Total # of cancelled orders", "Total # of refunded orders", "Total amount refunded"] 

        let key = ["A.", "", "", "B.", "", "", "","C.", "", "", "", "D.", "D.I.", "D.I.a.","", "D.I.b.", "", "", "",
        "", "D.I.c.", "", "D.II.", "D.II.a.", "","D.II.b.", "", "", "", "", "","", "D.II.c.", "", "", ""]

      var mainObj = {} //initialize empty object on every iteration

      //rows iteration on single object length from api response object
      for (var i = 0; i < objLength; i++) 
      {
        mainObj = {}

        //default value from firstColumnData array.
        mainObj[""] = key[i]
        mainObj["name"] = firstColumnData[i]

        //iterate on api response every object to get the values for row conversion      
        for (var j = 0; j < data.length; j++) {
          var value: any;

          //get month from api data
          const month_date = data[j].month_name
          // const newDate = date.split("-")
          // const month_date = newDate[0]+"("+newDate[1]+")"

          //get report object from api data
          const tempReportObj = data[j].report

          //handle sub category additions in updated rows
          if (i == 0 || i == 3 || i == 7 || i == 11 || i == 12 || i == 22) 
          {
            //empty fields
            mainObj[month_date] = ""
            console.log('if called: ' + i)
          } else {
            //handle single object length with subcategory indexes additions
            var tempIndex = i;
            if (i > 0 && i < 3) 
            {
              tempIndex = i - 1;
            }
            if (i > 3 && i < 7) 
            {
              tempIndex = i - 2;
            }

            if (i > 7 && i < 11) 
            {
              tempIndex = i - 3;
            }
            // if (i > 11 && i < 12) {
            //   tempIndex = i - 4;
            // }
            if (i > 12 && i < 22) 
            {
              tempIndex = i - 5;
            }
            if (i > 22) 
            {
              tempIndex = i - 6;
            }
            console.log('else called: ' + tempIndex)
            // var keyName = Object.keys(tempReportObj)[tempIndex];

            //get value from api data object at specific index
            value = Object.values(tempReportObj)[tempIndex];

            //add value to updates object as  months values e.g {monthName : "value"}
            mainObj[month_date] = value == null ? "--" : value
          }
        }
        //push object to aarray
        tempData.push(mainObj)
      }
      console.log('new object: ' + JSON.stringify(tempData));
      this.downloadFile(tempData, 'Monthly kpi Report');
    } 
    else 
    {
      //show error
      let dialogRef = this.dialog.open(AlertDialog, { autoFocus: false });
			let cm = dialogRef.componentInstance;
			cm.heading = 'Error';
			cm.message = "No Data Found";
			cm.cancelButtonText = 'Ok';
			cm.type = 'error';
    }

  }

  downloadFile(data: any, fileName: any) {
    const replacer = (key, value) => (value === null ? '' : value); // specify how you want to handle null values here
    const header = Object.keys(data[0]);
    console.log('head', header)
    const csv = data.map((row) =>
      header
        .map((fieldName) => JSON.stringify(row[fieldName], replacer))
        .join(',')
    );
    csv.unshift(header.join(','));
    console.log('vvv', csv)
    const csvArray = csv.join('\r\n');
    console.log('array', csvArray)

    const a = document.createElement('a');
    const blob = new Blob([csvArray], { type: 'text/csv;charset=UTF-8' });
    const url = window.URL.createObjectURL(blob);

    a.href = url;
    a.download = fileName;
    a.click();
    window.URL.revokeObjectURL(url);
    a.remove();
  }



}
