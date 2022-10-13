import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import * as moment from 'moment';
import { AlertDialog } from 'src/app/lib';
import { MainService } from '../../services';
import { appConfig } from '../../../config';
import { Router } from '@angular/router';

@Component({
  selector: 'app-upload-multiple-brands',
  templateUrl: './upload-multiple-brands.component.html',
  styles: [
  ]
})
export class UploadMultipleBrandsComponent implements OnInit {

  csvJSON: any;
  arrCsv: Array<any> = []
  CSVName: any;
  payload: any
  @ViewChild('uploadFile') clearInput!: ElementRef;
  constructor(protected dialog: MatDialog, protected mainApiService: MainService, protected router: Router,) {
    this.CSVName = ''
    var res = moment("2011-05-22").format('DD/MM/YYYY');
console.log('moment',res);
  }

  ngOnInit(): void {
  }

  onLocationBack(): void {
    window.history.back();
  }

  public csv_JSON(csv: any) {

    var lines = csv.split("\n");
    console.log('lines', lines)

    for (let index = 1; index < lines.length; index++) {
      if (lines[index] != '') {
        let row = lines[index].split(",");
        for (var i = 0; i < row.length; ++i) {
          row[i] = row[i].replace(/(\r\n|\n|\r)/gm, "")
        }
        console.log('row....', row);
        if(row[0] == '' && row[2] == '')
        {
          let dialogRef = this.dialog.open(AlertDialog, { autoFocus: false });
          let cm = dialogRef.componentInstance;
          cm.heading = 'Upload unsuccessful';
          cm.message = 'Please complete mandatory field/s: Brand, New Brand Status';
          cm.cancelButtonText = 'Ok';
          cm.type = 'error';
          this.arrCsv = []
          this.clearInput.nativeElement.value = ''
          this.CSVName = ''
          break;
        }
        else if (row[2] == 0 && row[3] != '' && row[4] != '') {
          let dialogRef = this.dialog.open(AlertDialog, { autoFocus: false });
          let cm = dialogRef.componentInstance;
          cm.heading = 'Upload unsuccessful';
          cm.message = 'Invalid Data';
          cm.cancelButtonText = 'Ok';
          cm.type = 'error';
          this.arrCsv = []
          this.clearInput.nativeElement.value = ''
          this.CSVName = ''
          break;
        }
        else if((row[2] == 1 &&
           (moment(row[3], "DD/MM/YYYY", true).isValid() == false ||
            moment(row[4], "DD/MM/YYYY", true).isValid() == false)) )
          {
          let dialogRef = this.dialog.open(AlertDialog, { autoFocus: false });
          let cm = dialogRef.componentInstance;
          cm.heading = 'Upload unsuccessful';
          cm.message = 'Please complete the date field in this format: DD/MM/YYYY.';
          cm.cancelButtonText = 'Ok';
          cm.type = 'error';
          this.arrCsv = []
          this.clearInput.nativeElement.value = ''
          this.CSVName = ''
          break;
        }
        else if((row[1] != 0 && row[1] != 1) || (row[2] != 0 && row[2] != 1))
        {
          let dialogRef = this.dialog.open(AlertDialog, { autoFocus: false });
          let cm = dialogRef.componentInstance;
          cm.heading = 'Upload unsuccessful';
          cm.message = 'Please complete the Delivery Status with entries “1” if enabled or “0” if disabled. ';
          cm.cancelButtonText = 'Ok';
          cm.type = 'error';
          this.arrCsv = []
          this.clearInput.nativeElement.value = ''
          this.CSVName = ''
          break;
        }
        else {
          this.arrCsv.push({
            "brand_name": row[0],
            "delivery_status": row[1],
            "new_brand_status": row[2],
            "new_brand_start": row[2] == 0 ? '' : row[3],
            "new_brand_end": row[2] == 0 ? '' : row[4]
          })
        }
        // this.arrCsv.push({ phone: row[0], type: row[1] })
      }
    }
    

    this.payload = {
      data : this.arrCsv,
    };

    // this.payload = JSON.stringify(abc)

    console.log('ohhh', this.payload)

    // this.Form.get('phones').setValue(this.arrSms)
  }

  convertFile(event: any) {
    this.arrCsv = []
    this.csvJSON = event.target.files;
    let file: File = this.csvJSON[0];
    if (file != undefined) {
      this.CSVName = file.name
      console.log('file', file)
      var reader: FileReader = new FileReader();
      reader.readAsText(file);
      reader.onload = (event: any) => {
        let text: any = reader.result;
        text.substring(0);
        this.csv_JSON(text);
        console.log('text', text[2])
      };
    }
    else {

    }
  }

  onUploadCSV()
  {
    let url = 'addBrandInBulk'
    this.mainApiService.postData(appConfig.base_url_slug + url, this.payload, 2).then((response) => {
      if (response.status == 200 || response.status == 201)
			{
				this.router.navigateByUrl('/main/brands' );
				// this.isLoading = false;
			}
			else
			{
				// this.isLoading = false;
				let dialogRef = this.dialog.open(AlertDialog, { autoFocus: false });
				let cm = dialogRef.componentInstance;
				cm.heading = 'Error';
				cm.message = response.error.message;
				cm.cancelButtonText = 'Ok';
				cm.type = 'error';
			}
    })
  }



}

export interface brands {
  brand_name: string,
  delivery_status: number,
  new_brand_status: number,
  new_brand_start: string,
  new_brand_end: string
}

