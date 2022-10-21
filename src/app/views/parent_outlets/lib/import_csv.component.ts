import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { MainService } from '../services/main.service';
import { AlertDialog } from './alert.dialog';
import { appConfig } from '../../config';



@Component({
    template: ``
})
export class ImportCSVComponent implements OnInit {
    csvFile: any;
    errorCounter: number;
    errorMessageForCSV: string = '';
    isLoading: boolean = true;
    isCsv: boolean= false;
    afterJSON: string;
    methodOfCsv: string = '';
    JsonToServer: any;
    urlVersion: number = 1;
    result: any;
    headersObj: any;
    objTemp: any;

    constructor(protected mainApiService: MainService, protected dialog: MatDialog) {
        this.afterJSON = '';
        this.errorCounter = 0;
    }

    ngOnInit() {

    }

    convertFile(event: any) {
        this.errorCounter = 0;
        this.csvFile = event.target.files;
        let file: File = this.csvFile[0];
        if (file != undefined) {
            var reader: FileReader = new FileReader();
            reader.readAsText(file);
            reader.onload = (event: any) => {
                let text: any = reader.result;
                text.substring(0);
                this.onCsvToJson(text);
            };
        }
        else {
            // alert('FIle error.')
        }
    };

    public onCsvToJson(csv: any) {
        var lines = csv.split("\n");
        for (var i = 1; i < lines.length - 1; i++) {
            var headers = lines[0].split(",");
            let otherColumn = lines[i].split(",");
            if (headers.length != otherColumn.length) {
                this.errorCounter++;

            }
        }

        if (this.errorCounter == 0) {
            var result = [];
            var headers = lines[0].split(",");

            let arr : any= [];
            let headersObj : any = {};
            headers.forEach((element : any, index : any) => {
                if (index <= headers.length - 2) {
                    arr.push(element);
                    headersObj[element] = null;
                }
                else {
                    let newObj = element.split('\r');
                    arr.push(newObj[0]);
                    headersObj[newObj[0]] = null;
                }

            });

            for (var i = 1; i < lines.length -1; i++) {
                var obj : any= {};
                var currentline = lines[i].split(",");

                // arr.forEach((arElem, arIdx) => {
                //     if(arIdx <= arr.length - 2)
                //     {
                //         obj[arr[arIdx]] = currentline[arIdx];
                //     }
                //     else
                //     {
                //         let arNewObj = currentline[arIdx].split('\r');
                //         obj[arr[arIdx]] = arNewObj[0];
                //     }
                // });

                for (var j = 0; j < arr.length; j++) {
                    if (j <= arr.length - 2) {
                        obj[arr[j]] = currentline[j];
                    }
                    else {
                        let arNewObj = currentline[j].split('\r');
                        obj[arr[j]] = arNewObj[0];
                    }
                }
                result.push(obj);
            }
            console.log(result)

            this.errorCounter = 0;
            let objTemp = {};
            this.errorMessageForCSV = 'Invalid CSV File. <br>';

            // var mainHeader = lines[0].split(",");
            // var firstColumn = lines[1].split(",");
            // log here(mainHeader.length)
            // log here(firstColumn.length)

            // if(mainHeader.length == firstColumn.length)

            // for (let key in headersObj)
            // {
            // 	if(!headersObj.hasOwnProperty('name') && !objTemp.hasOwnProperty('name'))
            // 	{
            // 		objTemp['name'] = null;
            // 		this.errorMessageForCSV = this.errorMessageForCSV + '<b>name</b> is missing,<br> ';
            // 		this.errorCounter++;
            // 	}
            // }

            // if(this.errorCounter == 0)
            // {
            // 	result.forEach((element, index) =>
            // 	{
            // 		if(element['name'] == null || element['name'] == '')
            // 		{
            // 			this.errorMessageForCSV = this.errorMessageForCSV + '<b>name</b> is empty on line number ' + (index + 1) + ',<br> ';
            // 			this.errorCounter++;
            //         }
            //         if(element['email'] != null || element['email'] != '')
            // 		{
            // 			element['email'] = element['email'].split(';').join(',');
            // 		}
            //     });
            // }
            // this.afterJSON = JSON.stringify(result);

            this.result = result;
            this.headersObj = headersObj;
            this.objTemp = objTemp;
            this.afterSelectionCsv(result, headersObj, objTemp);
        }
        else {
            if (this.afterJSON == '' || this.errorCounter > 0) {
                this.errorMessageForCSV = 'CSV file is invalid, <br>please avoid using <b>comma (",")</b> use <b>semicolon (";")</b> instead in CSV <br>and do not press <b>Enter Key</b> in any column.';
                let dialogRef = this.dialog.open(AlertDialog, { autoFocus: false });
                let cm = dialogRef.componentInstance;
                cm.heading = 'Error';
                cm.message = this.errorMessageForCSV;
                cm.cancelButtonText = 'Ok';
                cm.type = 'error';
                return;
            }
        }
    }

    afterSelectionCsv(result : any, headersObj : any, objTemp : any): void {

    }

    onUploadCSV(): void {
        this.isLoading = true;
        if (this.afterJSON == '' || this.errorCounter > 0) {
            let dialogRef = this.dialog.open(AlertDialog, { autoFocus: false });
            let cm = dialogRef.componentInstance;
            cm.heading = 'Error';
            cm.message = this.errorMessageForCSV;
            cm.cancelButtonText = 'Ok';
            cm.type = 'error';
            return;
        }
        console.log(this.JsonToServer);
        this.mainApiService.postData(appConfig.base_url_slug + this.methodOfCsv, this.JsonToServer, this.urlVersion).then(response => {
          if(!this.isCsv)
          {
              console.log("this.isCsvthis.isCsv",!this.isCsv)
            if (response.status == 200 || response.status == 201) {
                let dialogRef = this.dialog.open(AlertDialog, { autoFocus: false });
                let cm = dialogRef.componentInstance;
                cm.heading = 'Message';
                cm.message = 'CSV Added Successfully';
                cm.cancelButtonText = 'Ok';
                cm.type = 'success';
                console.log('checking csv uploaded', response)
                dialogRef.afterClosed().subscribe(result => {
                    // this.router.navigateByUrl('/main/merchants');
                    // this.isLoading = false;

                    this.afterSuccess();
                })
            }
            else if (response.status == 409) {
                console.log('checking 409 : ' , response)
                let dialogRef = this.dialog.open(AlertDialog, { autoFocus: false });
                let cm = dialogRef.componentInstance;
                cm.heading = 'Message';
                cm.message = response.error.message;
                cm.cancelButtonText = 'Ok';
                cm.type = 'error';
                dialogRef.afterClosed().subscribe(result => {
                    // this.router.navigateByUrl('/main/merchants');
                    // this.isLoading = false;

                    this.afterSuccess();
                })
            }
            else if(response.status == 404)
            {
                console.log('checking 400 : ' , response)
                let dialogRef = this.dialog.open(AlertDialog, { autoFocus: false });
                let cm = dialogRef.componentInstance;
                cm.heading = 'Message';
                cm.message = response.error.message;
                cm.cancelButtonText = 'Ok';
                cm.type = 'error';
                dialogRef.afterClosed().subscribe(result => {
                    // this.router.navigateByUrl('/main/merchants');
                    // this.isLoading = false;

                    this.afterSuccess();
                })
            }


            else {
                this.isLoading = false;
                let errormsg: any;
                if (response.error.data.name != false) {
                    errormsg = 'Name: ' + response.error.data.name.split(',').join(',<br> ');
                }
                else if (response.error.data.image != false) {
                    errormsg = 'Image: ' + response.error.data.image.split(',').join(',<br> ');
                }
                let dialogRef = this.dialog.open(AlertDialog, { autoFocus: false });
                let cm = dialogRef.componentInstance;
                cm.heading = 'Error';
                cm.message = response.error.message + '  "' + errormsg + '"';
                cm.cancelButtonText = 'Ok';
                cm.type = 'error';
            }
        }


        },
            Error => {
                this.isLoading = false;
                let dialogRef = this.dialog.open(AlertDialog, { autoFocus: false });
                let cm = dialogRef.componentInstance;
                cm.heading = 'Error';
                cm.message = "Internal Server Error.";
                cm.cancelButtonText = 'Ok';
                cm.type = 'error';
            })
            if(this.isCsv)
            {
                console.log("this.isCsvthis.isCsv direct navgateeeeeee",this.isCsv)
                this.directSuccess()
            }
    }



    afterSuccess(): void {

    }
    directSuccess(): void {

    }

}
