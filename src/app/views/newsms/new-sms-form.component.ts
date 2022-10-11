import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AlertDialog } from '../../lib';
import { MainService } from '../../services';
import { appConfig } from '../../../config';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
	selector: 'app-new-sms-form',
	templateUrl: './new-sms-form.component.html'
})
export class NewSmsFormComponent implements OnInit {
	Form: FormGroup;
	isLoading: boolean;
	csvFile: any;
	csvJSON: any;
	specificPhones: string = '';
	isEditing: any;
	arrSms: Array<any> = []
	blockSms: any
	headersms: HttpHeaders
	token = 'UP!and$'
	option: any
	constructor(protected router: Router,
		protected _route: ActivatedRoute,
		protected mainApiService: MainService,
		protected formbuilder: FormBuilder, protected dialog: MatDialog,
		private http: HttpClient) {
		this.Form = this.formbuilder.group({
			message: [null, [Validators.required, Validators.maxLength(1000)]],
			phones: [null],
			type: [null],
		});

		this.isLoading = false;
		// this.mainApiService.smsStatus().then((x) => {
		// 	console.log(x)
		// })
		// this.smsStatus()
	}

	ngOnInit() {
	}

	getValue(name: any) {
		return this.Form.get(name);
	}

	onLocationBack(): void {
		window.history.back();
	}

	doSubmit(): void {
		if (this.Form.get('phones')?.value == null || this.Form.get('phones')?.value == null) {
			let dialogRef = this.dialog.open(AlertDialog, { autoFocus: false });
			let cm = dialogRef.componentInstance;
			cm.heading = 'Error';
			cm.message = "Please select CSV file.";
			cm.cancelButtonText = 'Ok';
			cm.type = 'error';
			return;
		}

		let sms = this.arrSms.map((x) => {
			let obj: sms = {
				type: x.type.replace('\r', ''),
				phone: x.phone,
				message: this.Form.value.message
			}
			return obj
		})


		this.isLoading = true;

		let url = 'sendBulkSms'

		this.mainApiService.postSms(url, sms).then(response => {
			if (response.statusCode == 200 || response.statusCode == 201) {
				// this.router.navigateByUrl('/main/sms/list');
				this.isLoading = false;
			}
			else {
				this.isLoading = false;
				let dialogRef = this.dialog.open(AlertDialog, { autoFocus: false });
				let cm = dialogRef.componentInstance;
				cm.heading = 'Error';
				cm.message = 'Error while saving data.';
				cm.cancelButtonText = 'Ok';
				cm.type = 'error';
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

			let dialogRef = this.dialog.open(AlertDialog, { autoFocus: false });
			let cm = dialogRef.componentInstance;
			cm.heading = 'Success';
			cm.message = "Your Request has been sent.";
			cm.cancelButtonText = 'Ok';
			cm.type = 'success';
			dialogRef.afterClosed().subscribe(result => {
				this.router.navigateByUrl('/main/newsms/list');
			})
	}

	public csv_JSON(csv: any) {
		// var lines = csv.split("\n");
		// var result = [];

		// var headers = lines[0].split(",");
		// console.log('head', headers)

		// for (var i = 0; i < lines.length ; i++)
		// {
		// 	var obj : any= {};
		// 	var currentline = lines[i];
		// 	for (var j = 0; j < headers.length; j++)
		// 	{
		// 		obj['phone'] = currentline[j];
		// 		console.log('cc', currentline[j])
		// 		this.arrSms.push(currentline[j])
		// 		// obj['type'] = currentline[j]
		// 	}
		// 	result.push(obj);
		// }
		// var myJsonString = JSON.stringify(result);
		// // this.specificPhones = myJsonString;
		// this.Form.get('phones')?.setValue(myJsonString);
		// this.Form.get('type').setValue(myJsonString)
		var lines = csv.split("\n");
		for (let index = 0; index < lines.length; index++) {
			if (lines[index] != '') {
				let row = lines[index].split(",");
				this.arrSms.push({ phone: row[0], type: row[1] })
			}
		}
		this.Form.get('phones').setValue(this.arrSms)
	}

	convertFile(event: any) {
		this.arrSms = []
		this.csvJSON = event.target.files;
		let file: File = this.csvJSON[0];
		if (file != undefined) {
			var reader: FileReader = new FileReader();
			reader.readAsText(file);
			reader.onload = (event: any) => {
				let text: any = reader.result;
				text.substring(0);
				this.csv_JSON(text);
				console.log('text', text)
			};
		}
		else {

		}
	}
}

export interface sms {
	type: string,
	phone: number,
	message: string
}

