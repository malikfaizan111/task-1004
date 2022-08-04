import { Component, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';


import { AlertDialog } from '../../lib';
import { MainService } from '../../services';
import * as moment from 'moment';
import { appConfig } from '../../../config';

declare var $: any;


@Component({
	selector: 'app-notifications-form',
	templateUrl: './notifications-form.component.html'
})
export class NotificationsFormComponent implements OnInit {
	id: any;
	sub: Subscription = new Subscription();
	Form: FormGroup;
	isLoading: boolean;
	isEditing: boolean;
	admin: any;
	showLess: any = null;
	showGreater: any = null;
	greaterDate: any;
	lessDate: any;
	csvFile: any;
	csvJSON: any;
	select_opt: any;
	specificUsers: string = '';
	push: any;
	Notification: any;
	toggled: boolean = false;

	constructor(protected router: Router,
		protected _route: ActivatedRoute,
		protected mainApiService: MainService,
		protected formbuilder: FormBuilder, protected dialog: MatDialog) {
		this.Form = this.formbuilder.group({
			title: [null, [Validators.required, Validators.maxLength(50)]],
			audience: [null, [Validators.required]],
			push: ['1', [Validators.required]],
			platform: [null, [Validators.required]],
			operator: [null, [Validators.required]],
			dates: [null],
			greater_than: [null],
			less_than: [null],
			archive: [null],
			message: ['', [Validators.required, Validators.maxLength(300)]],
			specificUsers: [null],
		});

		this.isLoading = false;
		this.isEditing = false;

		this.Form.get('audience')?.valueChanges.subscribe(response => {
			if (response == 'specificusers') {
				if (this.Form.contains('dates')) {
					this.Form.removeControl('dates');
				}
				this.select_opt = null;
			}
			if (response == 'userCreatedDate') {
				this.Form.addControl('dates', new FormControl(Validators.required));
			}
		});
		this.push = true;
	}

	onChange(event: any): void {
		if (event.checked) {
			this.Form.get('push')?.setValue(1);
		}
		else {
			this.Form.get('push')?.setValue(0);
		}
	}

	onLessDate(): void {
		let abc = moment(this.lessDate).format('YYYY-MM-DD HH:mm:ss');
		this.Form.get('less_than')?.setValue(abc);
	}

	onGreaterDate(): void {
		let abc = moment(this.greaterDate).format('YYYY-MM-DD HH:mm:ss');
		this.Form.get('greater_than')?.setValue(abc);
	}

	ngOnInit() {
		this.sub = this._route.params.subscribe(params => {
			this.id = params['id'];
			if (this.id != 'add') {
				this.isEditing = true;

				this.Form.addControl('id', new FormControl(this.id));
				let abc = localStorage.getItem('Notification') as string;
				this.Notification = JSON.parse(abc);
				this.Form.patchValue(this.Notification);
				this.select_opt = 1;

				if (this.Notification.specificUsers) {
					this.onTagAdd(this.Notification.specificUsers)
				}
			}
			else {
				this.isEditing = false;
				this.Form.reset();
			}
		});
		this.Form.get('push')?.setValue(1)
	}

	getValue(name: any) {
		return this.Form.get(name);
	}

	onLocationBack(): void {
		window.history.back();
	}

	handleSelection(event: any) {
		let msg = '';
		if (this.Form.get('message')?.value == null) {
			msg = '';
		}
		else {
			msg = this.Form.get('message')?.value;
		}
		msg += event.char;
		this.Form.get('message')?.setValue(msg);
	}

	onTagAdd(event: any): void {
		let newEmails = event.split(',');

		let arrEmails: any[] = [];
		newEmails.forEach((element: any) => {
			let objectEmails: any = {};
			objectEmails['email'] = element;
			arrEmails.push(objectEmails);
		});
		let jsonEmails = JSON.stringify(arrEmails);
		this.Form.get('specificUsers')?.setValue(jsonEmails);
	}

	doSubmit(archive: any): void {
		this.Form.get('archive')?.setValue(archive);

		if (this.Form.get('audience')?.value == 'specificusers' && this.select_opt == null) {
			let dialogRef = this.dialog.open(AlertDialog, { autoFocus: false });
			let cm = dialogRef.componentInstance;
			cm.heading = 'Error';
			cm.message = "Please select CSV file. or type emails.";
			cm.cancelButtonText = 'Ok';
			cm.type = 'error';
			return;
		}

		if (this.Form.get('audience')?.value == 'specificusers' && this.select_opt == 2) {
			// if(this.specificUsers == null)
			// {
			// 	let dialogRef = this.dialog.open(AlertDialog, { autoFocus: false });
			// 	let cm = dialogRef.componentInstance;
			// 	cm.heading = 'Error';
			// 	cm.message = "Please select CSV file. or type emails.";
			// 	cm.cancelButtonText = 'Ok';
			// 	cm.type = 'error';
			// 	return;
			// }
		}

		// if(this.Form.get('audience').value == 'specificusers' && this.select_opt == 1)
		// {
		// 	if(this.selectTo.nativeElement.value == null || this.selectTo.nativeElement.value == '')
		// 	{
		// 		let dialogRef = this.dialog.open(AlertDialog, { autoFocus: false });
		// 		let cm = dialogRef.componentInstance;
		// 		cm.heading = 'Error';
		// 		cm.message = "Please select CSV file. or type emails.";
		// 		cm.cancelButtonText = 'Ok';
		// 		cm.type = 'error';
		// 		return;
		// 	}
		// }

		let values = this.Form.value;
		for (let key in values) {
			if (values[key] == null) {
				delete this.Form.value[key];
			}
			if (values['audience'] == 'specificusers') {
				if (this.select_opt == 2) {
					values['specificUsers'] = this.specificUsers;
				}
			}
		}

		this.isLoading = true;
		let method = '';

		if (this.id == 'add') {
			method = 'addNotification';
		}
		else {
			method = 'updateNotification';
		}

		this.mainApiService.postData(appConfig.base_url_slug + method, this.Form.value).then(response => {
			if (response.status == 200 || response.status == 201) {
				this.router.navigateByUrl('/main/notifications');
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
	}

	public csv_JSON(csv: any) {
		let input = new FormData();

		var lines = csv.split("\n");
		var result = [];

		var headers = lines[0].split(",");

		for (var i = 0; i < lines.length - 1; i++) {

			var obj: any = {};
			var currentline = lines[i].split("\r");
			// log here(currentline);
			for (var j = 0; j < headers.length; j++) {
				obj['email'] = currentline[j];
			}
			result.push(obj);

		}
		var myJsonString = JSON.stringify(result);
		// input.append('csv', result);

		this.specificUsers = myJsonString;

		// this.formData.append('specificUsers', specific_users);
	}

	convertFile(event: any) {
		this.csvJSON = event.target.files;
		let file: File = this.csvJSON[0];
		if (file != undefined) {

			// this.formData.delete('csv');
			// this.formData.append('csv', file, file.name);


			var reader: FileReader = new FileReader();
			reader.readAsText(file);
			reader.onload = (event: any) => {

				let text: any = reader.result;
				text.substring(0);
				// conso/le.log('CSV: ',  + '...');
				this.csv_JSON(text);
			};

		} else {
			// this.formData.delete('csv');

		}
	}
}