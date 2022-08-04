import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AlertDialog } from '../../lib';
import { MainService } from '../../services';
import { appConfig } from '../../../config';

@Component({
	selector: 'app-sms-form',
	templateUrl: './sms-form.component.html'
})
export class SmsFormComponent implements OnInit
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
			phones: [null],
			type: ['general'],
		});

		this.isLoading = false;
	}

	ngOnInit()
	{
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
		if(this.Form.get('phones')?.value == null || this.Form.get('phones')?.value == null)
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

		var headers = lines[0].split(",");

		for (var i = 0; i < lines.length - 1; i++)
		{
			var obj : any= {};
			var currentline = lines[i].split("\r");

			for (var j = 0; j < headers.length; j++)
			{
				obj['phone'] = currentline[j];
			}
			result.push(obj);
		}
		var myJsonString = JSON.stringify(result);
		// this.specificPhones = myJsonString;
		this.Form.get('phones')?.setValue(myJsonString);
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
