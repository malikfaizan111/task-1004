import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, FormControl, ControlContainer } from '@angular/forms';
import { AlertDialog } from '../../lib';
import { MainService } from '../../services';
import { appConfig } from '../../../config';
import { AddOutletDialogComponent } from './add-outlet-dialog.component';

@Component({
	selector: 'app-interest_tag-form',
	templateUrl: './interest_tag-form.component.html'
})
export class InterestTagFormComponent implements OnInit {
	id: any;
	sub: Subscription = new Subscription();
	Form: FormGroup;
	isLoading: boolean;
	isEditing: boolean;
	promoCode: any;
	isMultiple: boolean;
	expiryDatetime: any;
	currentDate: Date = new Date();
	codeGet: any;
	errorMsg: string = '';
	outletid: any[] = [];
	getoutletname: any;
	getoutletid: any[] = [];
	selectedOutletId: any = [];
	constructor(protected router: Router,
		protected _route: ActivatedRoute,
		protected mainApiService: MainService,
		protected formbuilder: FormBuilder, protected dialog: MatDialog) {
		this.Form = this.formbuilder.group({
			tags: [null, [Validators.required,]],
			title: [null, [Validators.required,]],
			image: [null, [Validators.required,]],
			outlet_ids: [null]
		});

		this.isLoading = false;
		this.isEditing = false;
		this.isMultiple = false;
		this.codeGet = '';
	}

	ngOnInit() {
		this.sub = this._route.params.subscribe(params => {
			this.id = params['id'];

			if (this.id) {
				this.isEditing = true;
				this.Form.addControl('id', new FormControl(this.id));
				let abc = localStorage.getItem('Interest_Tag') as string;
				this.codeGet = JSON.parse(abc);

				this.getoutletname = this.codeGet.outlet_interest_tags;
				this.getoutletname.forEach((element: any) => {
					// this.getoutletname1.push(element.outlets.name);
					this.getoutletid.push({
						id: element.outlets.id,
						name: element.outlets.name
					});
				});
				this.Form.patchValue(this.codeGet);
				//this.Form.get('outlet_ids').setValue(this.getoutletname1);
				this.expiryDatetime = new Date(this.codeGet.expiry_datetime);
			}
			else {
				this.isEditing = false;
				this.Form.reset();
			}
		});
	}

	getValue(name: any) {
		return this.Form.get(name);
	}

	onAddOutlets() {
		let dialogRef = this.dialog.open(AddOutletDialogComponent, { autoFocus: false, disableClose: true });
		dialogRef.componentInstance.formdataid = [];
		dialogRef.componentInstance.formdataid = [...this.getoutletid];

		dialogRef.afterClosed().subscribe(result => {
			if (result) {
				this.selectedOutletId = [];
				if (result != false) {
					this.getoutletid = [];
					for (let i = 0; i < result.length; i++) {
						this.getoutletid.push({
							id: result[i].id,
							name: result[i].name
						})
						this.selectedOutletId.push(result[i].id);
					}
				}
			}
			else {

			}
		});
	}

	onLocationBack(): void {
		window.history.back();
	}

	doSubmit(): void {
		this.isLoading = true;
		let method = '';
		let formData = new FormData();
		for (var key in this.Form.value) {
			formData.append(key, this.Form.value[key]);
		}
		formData.append('outlet_ids', this.selectedOutletId);
		if (!this.id) {
			method = 'addInterestTag';
		}
		else {
			method = 'editInterestTag';
			// this.router.navigateByUrl('/main/team/' + this.type );
		}
		// this.Form.get('type').setValue(this.type);

		this.mainApiService.postData(appConfig.base_url_slug + method, formData, 2).then(response => {
			if (response.status == 200 || response.status == 201) {
				this.router.navigateByUrl('/main/interest_tag');
				this.isLoading = false;
			}
			else {
				this.isLoading = false;
				let dialogRef = this.dialog.open(AlertDialog, { autoFocus: false });
				let cm = dialogRef.componentInstance;
				cm.heading = 'Error';
				cm.message = response.error.message;
				cm.cancelButtonText = 'Ok';
				cm.type = 'error';
			}
		})
	}
	onFileSelect(event: any) {
		if (event.valid) {
			this.Form.get(event.controlName)?.patchValue(event.file);
			console.log(event.file)
			this.errorMsg = '';
		}
		else {
			if (event.controlName == 'icon') {
				this.errorMsg = 'Please select square image.'
			}
			if (event.controlName == 'image') {
				this.errorMsg = 'Please select square image.'
			}
		}
	}
	getImage(item: any): any {
		if (this.id) {
			return appConfig.file_urlV2 + this.codeGet[item];
		}
		else {
			return '';
		}
	}
}