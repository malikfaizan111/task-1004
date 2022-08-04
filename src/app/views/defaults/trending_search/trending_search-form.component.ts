import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { AlertDialog } from '../../../lib';
import { MainService } from '../../../services';
import * as moment from 'moment';
import { appConfig } from '../../../../config';

@Component({
	selector: 'app-trending-search-form',
	templateUrl: './trending_search-form.component.html'
})
export class TrendingSearchFormComponent implements OnInit {
	id: any;
	name: any;
	sub: Subscription = new Subscription();
	Form: FormGroup;
	isLoading: boolean;
	bulk_data: any = null;
	isEditing: boolean;
	promoCode: any;
	isMultiple: boolean;
	expiryDatetime: any;
	currentDate: Date = new Date();
	codeGet: any;
	discount_type: Date = new Date();
	image: any;
	isDiscountType: boolean = false;
	CreditCardPackagesItem: any[] = [];
	scenario: any;
	logo: string = '';
	errorMsg: string = '';
	catArray: any = [];
	errorMsgimage: string = '';
	errorMsglogo: string = '';
	Categories: any;
	constructor(protected router: Router,
		protected _route: ActivatedRoute,
		protected mainApiService: MainService,
		protected formbuilder: FormBuilder, protected dialog: MatDialog) {
		this.Form = this.formbuilder.group({
			// category_id: [null, [Validators.required]],
			tag: [null, [Validators.required]],

		});

		this.isLoading = false;
		this.isEditing = false;
		this.isMultiple = false;
		this.codeGet = '';

	}

	ngOnInit() {
		// this.sub = this._route.params.subscribe(params => {
		// 	this.id = params['id'];

		// 	if (this.id != 'add') {
		// 		this.isEditing = true;
		// 		this.Form.addControl('id', new FormControl(this.id));
		// 		this.codeGet = JSON.parse(localStorage.getItem('Playlist'));
		// 		this.Form.patchValue(this.codeGet);

		// 	}
		// else {
		this.isEditing = false;
		this.Form.reset();
		// }

		// });
		// this.gerCategoriesList();
		// this.onChanges();
	}
	onChanges(): void {
		this.Form.valueChanges.subscribe(val => {
			console.log(`newValue: `, val.image)
		})
	}

	onChangeMultiple(event: any): void {
		// log here(event);
		// if (this.isMultiple) {
		// 	this.Form.removeControl('code');
		// 	this.Form.addControl('number', new FormControl(null, [Validators.required]));
		// }
		// else {
		// 	this.Form.removeControl('number');
		// 	this.Form.addControl('code', new FormControl(null, [Validators.maxLength(6), Validators.minLength(6)]));
		// }
	}

	getValue(name: any) {
		return this.Form.get(name);
	}

	onLocationBack(): void {
		window.history.back();
	}

	doSubmit(): void {
		this.isLoading = true;
		// let formData = new FormData();
		// for (var key in this.Form.value) {
		// 	formData.append(key, this.Form.value[key]);
		// };

		this.mainApiService.postData(appConfig.base_url_slug + 'addTrendingSearchTag', this.Form.value, 2).then(response => {
			if (response.status == 200 || response.status == 201) {

				this.router.navigateByUrl('/main/trending_search');
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
		},
			Error => {
				// log here(Error)
				this.isLoading = false;
				let dialogRef = this.dialog.open(AlertDialog, { autoFocus: false });
				let cm = dialogRef.componentInstance;
				cm.heading = 'Error';
				cm.message = "Internal Server Error.";
				cm.cancelButtonText = 'Ok';
				cm.type = 'error';
			})
	}

	gerCategoriesList(): void {
		let url = 'getCategories' + '?per_page=500';

		this.mainApiService.getList(appConfig.base_url_slug + url)
			.then(result => {
				if (result.status == 200 && result.data) {
					this.Categories = result.data.categories;

				}
				else {
					this.Categories = [];

				}
			});
	}
}