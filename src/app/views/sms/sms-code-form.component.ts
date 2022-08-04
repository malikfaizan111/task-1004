import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertDialog } from '../../lib';
import { MainService } from '../../services';
import { appConfig } from '../../../config';

@Component({
	selector: 'app-sms-code-form',
	templateUrl: './sms-code-form.component.html'
})
export class SmsCodeFormComponent implements OnInit
{
	Form: FormGroup;
	isLoading: boolean;
	csvFile: any;
	csvJSON: any;
	specificPhones: string = '';
	isEditing:any;
	constructor(protected router: Router,
		protected _route: ActivatedRoute,
		protected mainApiService: MainService,
		protected formbuilder: FormBuilder, protected dialog: MatDialog)
	{
		this.Form = this.formbuilder.group({
			message: [null, [Validators.required, Validators.maxLength(1000)]],
			phones: [null, [Validators.required]],
			codes: [null, [Validators.required]],
			type: ['sms_with_code'],

		});

		this.isLoading = false;
	}

	ngOnInit()
	{
		// var a =this.Form.get("message").value;
		// console.log("a",a)
	}

	getValue(name : any)
	{
		return this.Form.get(name);
	}

	onLocationBack(): void
	{
		window.history.back();
	}

	doSubmit(): void
	{
		if((this.Form.get('phones')?.value == null || this.Form.get('phones')?.value == ' ') && (this.Form.get('codes')?.value == null || this.Form.get('codes')?.value == ' '))
		{
			let dialogRef = this.dialog.open(AlertDialog, { autoFocus: false });
			let cm = dialogRef.componentInstance;
			cm.heading = 'Error';
			cm.message = "Please select CSV file.";
			cm.cancelButtonText = 'Ok';
			cm.type = 'error';
			return;
		}

		this.isLoading = true;
		if(!this.Form.get('message')?.value.includes('.code.'))
		{
			this.isLoading = false;
			let dialogRef = this.dialog.open(AlertDialog, { autoFocus: false });
			let cm = dialogRef.componentInstance;
			cm.heading = 'Error';
			cm.message = "Please Add .code. in your Message";
			cm.cancelButtonText = 'Ok';
			cm.type = 'error';
			return;

			}


		// this.Form.get("message").setValue('.code.'+ this.Form.get("message").value)
		this.mainApiService.postData(appConfig.base_url_slug + 'sendSms', this.Form.value, 2).then(response => {
			if (response.status == 200 || response.status == 201) {
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
				this.router.navigateByUrl('/main/sms/list');
			})
	}

	public csv_JSON(csv: any)
	{
		var lines = csv.split("\n");
		var result = [];
		var resultCode = [];

		var headers = lines[0].split(",");

		for (var i = 0; i < lines.length - 1; i++)
		{
			var obj : any= {};
			var objCode : any= {};

			var y = lines[i].split("\r");
			var currentline = y[0].split(",");

			for (var j = 1; j < headers.length; j++)
			{
				// console.log("currentline",currentline)
				// console.log("currentline[0]",currentline[0])
				// console.log("currentline[1]",currentline[1])

				obj['phone'] = currentline[0];
				// var x = currentline[1].split("\r");

				objCode['code'] =currentline[1];;
			}
			result.push(obj);
			resultCode.push(objCode);
		}
		var myJsonString = JSON.stringify(result);
		var myJsonStringCode = JSON.stringify(resultCode);
		// this.specificPhones = myJsonString;
		this.Form.get('phones')?.setValue(myJsonString);
		this.Form.get('codes')?.setValue(myJsonStringCode);
	}

	convertFile(event: any)
	{
		this.csvJSON = event.target.files;
		let file: File = this.csvJSON[0];
		if (file != undefined)
		{
			var reader: FileReader = new FileReader();
			reader.readAsText(file);
			reader.onload = (event: any) => {
				let text: any = reader.result;
				text.substring(0);
				this.csv_JSON(text);
			};
		}
		else
		{

		}
	}
}
