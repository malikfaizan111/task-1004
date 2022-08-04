import { Component, OnInit, ElementRef, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';

import { MainService, BaseLoaderService } from '../../services';
import { AlertDialog } from '../../lib';
import { appConfig } from '../../../config';


@Component({
	selector: 'app-eligible-test',
	templateUrl: './eligible-test.component.html',
	styleUrls: ['./eligible.component.scss']
})
export class EligibleTestComponent implements OnInit {
	CreditCard: any;
	Form: FormGroup;
	isEditing: boolean;
	sub: Subscription;
	scenario: any;
	id: any;
	mainArray: any = [];
	imagePath: string = '';
	errorMsgimage: string = '';
	isLoading: boolean;
	dataCount: number = 0;

	constructor(private elRef: ElementRef,
		protected router: Router,
		protected dialog: MatDialog, protected formbuilder: FormBuilder, protected mainApiService: MainService,
		protected _route: ActivatedRoute, protected loaderService: BaseLoaderService,) {
		this.Form = this.formbuilder.group({
			id: [null, [Validators.required]],
			type: [null, [Validators.required]],
			image: [null, [Validators.required]],
		});
		this.CreditCard = null;
		this.isEditing = false;
	}

	ngOnInit() {
		this.sub = this._route.params.subscribe(params => {
			this.scenario = params['scenario'];
		});


		// this.sub = this._route.params.subscribe(params => {
		// 	this.id = params['id'];
		// 	if (this.id != 'add') {
		// 		this.isEditing = true;
		// 	}
		// 	else {
		// 		this.isEditing = false;
		// 		this.Form.reset();
		// 	}
		// });
		this.getImageOnce();

	}
	getImageOnce(): any {

		this.loaderService.setLoading(true);
		let url = 'viewInAppBanner';
		url = url + '?search=' + this.scenario;

		this.mainApiService.getList(appConfig.base_url_slug + url, false, 2).then(result => {
			if (result.status == 200 && result.data) {

				this.mainArray = result.data;
				this.dataCount = result.pagination.count;
				this.loaderService.setLoading(false);
				if (this.dataCount != 0) {
					this.id = 'edit'
					this.imagePath = appConfig.file_urlV2 + this.mainArray[0].image;
					var data = this.mainArray[0];
					this.Form.patchValue(data);
					this.Form.addControl('id', new FormControl(data.id));
				}
				else {
					this.imagePath = '';
					this.id = 'add';
				}
			}
			else {
				this.imagePath = '';
			}
		});
	}

	onLocationBack(): void {
		window.history.back();
	}

	onFileSelect(event) {
		if (event.controlName == 'image') {

			if (event.valid) {
				this.Form.get(event.controlName).patchValue(event.file);
				this.errorMsgimage = '';
			}
			else {
				this.errorMsgimage = 'Please select image'
			}
		}
		else {
			this.errorMsgimage = 'Please select square IMAGE '
		}
	}

	doSubmit(): void {
		this.isLoading = true;
		let method = '';

		if (this.id == 'add') {
			method = 'addInAppBanner';
		}
		else {
			method = 'editInAppBanner';
		}
		let formData = new FormData();
		this.Form.get('type').setValue(this.scenario);
		
		for (var key in this.Form.value) {
			formData.append(key, this.Form.value[key]);
		}

		this.Form.get('type').setValue(this.scenario);
		this.mainApiService.postData(appConfig.base_url_slug + method, formData, 2).then(response => {
			if (response.status == 200 || response.status == 201) {
				this.router.navigateByUrl('/main/subscription-packages/' + this.scenario);
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
}