import { Component, OnInit, ViewChild,Inject, OnDestroy, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { MainService } from 'src/app/services/main.service';
import { MatDialog } from '@angular/material/dialog';
import { AlertDialog } from '../../lib';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';
import {MatDatepicker} from '@angular/material/datepicker';
import * as moment from 'moment';
import { Moment } from 'moment';
import { MatDateFormats, MAT_DATE_FORMATS } from '@angular/material/core';

export const MONTH_YEAR_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-kpi-report',
  templateUrl: './kpi-report.component.html',
  styles: [
    ':host::ng-deep .mat-icon-button {color: rgb(20,143,150)}',
    '.input{text-align: start}'
  ],
  providers: [DatePipe]
})
export class KpiReportComponent implements OnInit , OnDestroy {


  @ViewChild('formDirective') protected formDirective: FormGroupDirective;
  form: FormGroup;
  enableBrandNewDate: boolean = false;
  btn: boolean = true
  today: any = new Date()
  // startDate: any = new Date('2022-01-02')
  startDate = new FormControl(moment([2020, 0, 1]));
  isDate:boolean;
  date = new FormControl();

  constructor(private datePipe: DatePipe, protected mainApiService: MainService, protected dialog: MatDialog,
    @Inject(MAT_DATE_FORMATS) private dateFormats) {
      this.isDate = false;
     }


  getMonth(): string {
    let out = this.startDate.value;
    console.log(out);
    return JSON.stringify(out);

  }



  ngOnInit(): void {

    // this.dateFormats = MONTH_YEAR_FORMATS;
    // console.log(this.dateFormats);
    // this.dateFormats.display.dateInput = 'YYYY';
    // this.form = new FormGroup({
    //   'date': new FormControl(null, [Validators.required]),
    //   // 'start': new FormControl(null, [Validators.required]),
    //   // 'end': new FormControl(null, [Validators.required])
    // })
  }


  chosenMonthHandler(
    normalizedMonth: Moment,
    datepicker: MatDatepicker<Moment>,
    inputValue?: 'start' | 'end'
  ) {
    console.log(normalizedMonth);
    this.startDate.setValue(moment(normalizedMonth).endOf('month'));
    this.date = new FormControl(new Date(this.startDate.value));
    console.log(this.date);
    this.isDate = true;
    datepicker.close();
  }

  ngOnDestroy(): void {
      this.isDate = false;
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


    var date = this.datePipe.transform(this.startDate.value, "yyyy-MM-dd")
    // var abc = this.datePipe.transform(this.form.value.start, "yyyy-MM-dd")
    // var bcd = this.datePipe.transform(this.form.value.end, "yyyy-MM-dd")
    console.log('start', date)
    // this.formDirective.resetForm()

    // satatic api
    let url = 'controlTowerReport?report_date=' + date

    this.mainApiService.postcsv(url).then((result) => {
      console.log('api res', result)
      this.generateCsvData(result.data);
      this.isDate = false;
    })

  }

  generateCsvData(data: any) {
    if (data.length > 0) {

      console.log('kpi data response: ' + data);
      var tempData = [];
      //rows length //    6 = additional sub categories for default values array (firstColumnData)
      const objLength = Object.keys(data[0].report).length + 18;
      console.log('obejct length: ' + objLength)

      //1st column default values
      let firstColumnData = ["","Acquisition A: Registration", "Total # of new registration", "growth as %","", "Acquisition B: Subscription", "Total # of new subscriptions", "growth as %", "as % of total # of new registrations","",
        "Activation: 1st time Usage", "Total # of new activations - 1st time offer usage", "growth as % ", "as % of total # of new subscriptions","", "Retention & Engagement","", "In-Store Offer Redemptions","" ,"Total # of In-Store Offer Redemptions",
        "growth as %","", "Total # of Unique Users who Redeemed an Offer", "Avg. # of redemptions per user", "Days in month", "Avg Daily Redemptions",
        "Highest Redemption within 1 Day","", "Total Approximate Savings", "Avg. approximate savings per user","", "Delivery Orders","", "Total # of Delivery Orders",
        " growth as % ","","Total # of Unique Users who Placed an Order", "Avg. # of orders per user", "Days in month", "Avg Daily Orders", "Avg Order Amount",
        "Total Revenue", "Highest # of Orders within 1 Day", "","Total # of cancelled orders", "Total # of refunded orders", "Total amount refunded"] 

        let key = ["","A.", "", "", "","B.", "", "", "","","C.", "", "", "","", "D.","", "D.I.","", "D.I.a.","","", "D.I.b.", "", "", "",
        "","", "D.I.c.", "","", "D.II.","", "D.II.a.","", "","D.II.b.", "", "", "", "", "","", "","D.II.c.", "", "", ""]

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
          let tempvalueStore = data[j].report;

          debugger
          Object.keys(data[j].report).forEach((key,index)=>{
            if(i == 0){
            if(key == 'Activation growth as %')
            {
                data[j].report[key] = data[j].report[key] + '%';
            }
            if(key == 'growth as %')
            {
                data[j].report[key] = data[j].report[key] + '%';
            }
            if(key == 'Delivery growth as %')
            {
                data[j].report[key] = data[j].report[key] + '%';
            }
            if(key == 'Instore growth as %')
            {
                data[j].report[key] = data[j].report[key] + '%';
            }
            if(key == 'Subscription growth as %')
            {
                data[j].report[key] = data[j].report[key] + '%';
            }
            if(key == 'as % of total # of new registrations')
            {
                data[j].report[key] = data[j].report[key] + '%';
            }
            if(key == 'as % of total # of new subscriptions')
            {
                data[j].report[key] = data[j].report[key] + '%';
            }
            if(key == 'Total Approximate Savings')
            {
                data[j].report[key] =  'QAR' +  data[j].report[key] ;
            }
            if(key == 'Total amount refunded')
            {
                data[j].report[key] =  'QAR' +  data[j].report[key] ;
            }
            if(key == 'Total Revenue')
            {
                data[j].report[key] =  'QAR' +  data[j].report[key] ;
            }
            if(key == 'Avg Order Amount')
            {
                data[j].report[key] =  'QAR' +  data[j].report[key] ;
            }
            if(key == 'Avg. approximate savings per user')
            {
                data[j].report[key] =  'QAR' +  data[j].report[key] ;
            }


          }
          })
          console.log(data[j].report);


          const tempReportObj = tempvalueStore;

          //handle sub category additions in updated rows
          if (i == 0 || i == 1 || i ==4 || i == 5 || i== 9  || i== 10 || i == 14 || i ==15 || i == 16 || i== 17 || i== 18 || i ==21 || i == 27 || i == 30 || i ==31 || i== 32 || i == 35 || i == 43 ) 
          {
            //empty fields
            mainObj[month_date] = ""
            console.log('if called: ' + mainObj );
          } else {
            //handle single object length with subcategory indexes additions
            var tempIndex = i;

            if(i> 1 && i <4)
            {
              tempIndex = i - 2;
            }
            if(i>5 && i< 9)
            {
              tempIndex = i - 4;
            }
            if(i>10 && i<14)
            {
              tempIndex = i - 6;
            }
            if(i>18 && i<21)
            {
              tempIndex = i - 11;
            }
            if(i>21 && i<27)
            {
              tempIndex = i - 12;
            }
            if(i>27 && i<30)
            {
              tempIndex = i - 13;
            }
            if(i>32 && i<35)
            {
              tempIndex = i - 16;
            }
            if(i>35 && i<43)
            {
              tempIndex = i - 17;
            }
            if(i>43)
            {
              tempIndex = i - 18;
            }
            // if (i > 0 && i < 3) 
            // {
            //   tempIndex = i - 1;
            // }
            // if (i > 3 && i < 7) 
            // {
            //   tempIndex = i - 2;
            // }

            // if (i > 7 && i < 11) 
            // {
            //   tempIndex = i - 3;
            // }
            // // if (i > 11 && i < 12) {
            // //   tempIndex = i - 4;
            // // }
            // if (i > 12 && i < 22) 
            // {
            //   tempIndex = i - 5;
            // }
            // if (i > 22) 
            // {
            //   tempIndex = i - 6;
            // }

            console.log('else called: ' + tempIndex)
            // var keyName = Object.keys(tempReportObj)[tempIndex];

            //get value from api data object at specific index
            value = Object.values(tempReportObj)[tempIndex];

            //add value to updates object as  months values e.g {monthName : "value"}
            mainObj[month_date] = value == null || value == 'null%' || value == 'QARnull' ? "--" : value
          }
        }
        //push object to aarray
        tempData.push(mainObj)
      }
      console.log('new object: ' + JSON.stringify(tempData));
      // this.downloadFile(tempData, 'Monthly kpi Report');
      this.exportAsExcelFile(tempData, 'Monthly kpi Report');
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

  // downloadFile(data: any, fileName: any) {
  //   const replacer = (key, value) => (value === null ? '' : value); // specify how you want to handle null values here
  //   const header = Object.keys(data[0]);
  //   console.log('head', header)
  //   const csv = data.map((row) =>
  //     header
  //       .map((fieldName) => JSON.stringify(row[fieldName], replacer))
  //       .join(',')
  //   );
  //   csv.unshift(header.join(','));
  //   console.log('vvv', csv)
  //   const csvArray = csv.join('\r\n');
  //   console.log('array', csvArray)

  //   const a = document.createElement('a');
  //   const blob = new Blob([csvArray], { type: 'text/csv;charset=UTF-8' });
  //   const url = window.URL.createObjectURL(blob);

  //   a.href = url;
  //   a.download = fileName;
  //   a.click();
  //   window.URL.revokeObjectURL(url);
  //   a.remove();
  // }

  public exportAsExcelFile(json: any[], excelFileName: string): void {
    
		const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
		console.log('worksheet',worksheet);
		const workbook: XLSX.WorkBook = { Sheets: { 'sheet1': worksheet }, SheetNames: ['sheet1']};
		const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
		//const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });
		this.saveAsExcelFile(excelBuffer, excelFileName);
	  }
	
	  private saveAsExcelFile(buffer: any, fileName: string): void {
		const data: Blob = new Blob([buffer], {
		  type: EXCEL_TYPE
		});
		FileSaver.saveAs(data, fileName + EXCEL_EXTENSION);
	  }



}
