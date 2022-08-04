import { Component, OnInit, ViewChild } from '@angular/core';
import { observable, Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';


import { AlertDialog } from '../../lib';
import { MainService } from '../../services';
import * as moment from 'moment';
import { appConfig } from '../../../config';
import { UserAppSelectorService } from '../../lib/app-selector/app-selector.service';

import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
declare var $: any;


@Component({
	selector: 'campaign-form',
	templateUrl: './campaign-form.component.html'
})
export class CampaignFormComponent implements OnInit {
	id: any;
	sub: Subscription = new Subscription();
	Form: FormGroup;
	isLoading: boolean;
	isEditing: boolean;
	admin: any;
	showLess: any = null;
	showGreater: any = null;

	csvFile: any;
	csvJSON: any;
	select_opt: any = null;
	specificUsers: string = '';
	push: any;
	Notification: any;
	isTypeDays: any = false;
	scenario: any;
	appSelectorSubscription: Subscription = new Subscription();
	selectedApp: any;
	StartDate: any;

	EndDate: any;
	data: any;
	currentDate: Date = new Date();
	selectVariable: any;
	array = [];
	arr : any[]= [];
	errorMsg: string = '';
	Offer: any;
	hex_code: any;
	Outlet: any;
	ali: any;
	Campaign: any = '';  // ambigous change 	Campaign: { [key: string]: any; };
	show: any;
	Gainaccessvalue: boolean;
	Categories: any;
	CategoriesCount: any;
	method: any;
	filteredOptions: Observable<string[]> = new Observable();
	Outlets: any = [];
	Offers: any = [];
	// Outletid: any;
	// Offerid: any;

	constructor(protected router: Router,
		protected _route: ActivatedRoute,
		protected mainApiService: MainService,
		protected formbuilder: FormBuilder, protected dialog: MatDialog, protected appSelectorService: UserAppSelectorService) {
		this.Form = this.formbuilder.group({
			campaign_name: [null, [Validators.required, Validators.maxLength(50)]],
			start_date: [null, [Validators.required]],
			end_date: [null, [Validators.required]],
			hex_code: [null, [Validators.required]],
			user_type: [null, [Validators.required]],
			package_name: [null, [Validators.required]],
			image: [null, [Validators.required]],
			navigation: [null, [Validators.required]],
			outletObject: ['', [Validators.required]],
			outlet_id: ['', [Validators.required]],
			// offerObject: ['', [Validators.required, Validators.maxLength(50)]],
			offer_id: ['', [Validators.required, Validators.maxLength(50)]],
		});


		this.Gainaccessvalue = false;
		this.isLoading = false;
		this.isEditing = false;
		this.currentDate.setDate(this.currentDate.getDate() - 1);

		// let resp = this.appSelectorService.getApp();
		// this.selectedApp = parseInt(resp.user_app_id);

		// this.appSelectorSubscription = this.appSelectorService.selectedApp.subscribe((response: any) => {
		// 	this.selectedApp = parseInt(response.user_app_id);
		// });
	}



	ngOnInit() {
		this.sub = this._route.params.subscribe(params => {
			this.id = params['id'];
			//	console.log("fthis.idnce",this.id)
		});
		if (this.id != 'add') {
			this.isEditing = true;
			let abc = localStorage.getItem('Campaign') as string;
			this.Campaign = JSON.parse(abc);
			this.Form.patchValue(this.Campaign);
			this.Form.addControl('campaign_id', new FormControl(this.Campaign['id']));

			this.StartDate = this.Campaign['start_date'];
			this.EndDate = this.Campaign['end_date'];
			this.Form.get('outlet_id')?.setValue(this.Campaign['outlet_id']);
			this.onGetDropdownValues("outlets");

			// this.Form.get('outletObject').setValue({
			// 	id: this.Campaign.outlet_id, name: this.Campaign.outlet_name
			// })

		}
		else {
			this.isEditing = false;
			this.Form.reset();
		};

		this.onChanges();


		this.Form.get('outletObject')?.valueChanges.subscribe(response => {
			//console.log("first responce",response)
			if (response == null) {
				this.Offers = [];
				this.Form.get('offer_id')?.setValue(null);
				this.Form.get('outlet_id')?.setValue(null);
				return;
			}

			if (typeof response != 'object') {
				this.Offers = [];
				this.Form.get('offer_id')?.setValue(null);
				this.Form.get('outlet_id')?.setValue(null);
				this.Form.get('outletObject')?.setErrors(Validators.requiredTrue);
			}
			else {
				this.Form.get('outlet_id')?.setValue(response.id);
				if (this.Form.get('navigation')?.value == 'outlets') {
					this.Form.get('offer_id')?.setErrors(null);
				}
				else if (this.Form.get('navigation')?.value == 'offers') {
					this.Form.get('offer_id')?.setErrors(Validators.requiredTrue);
				}
			}
		});

		this.Form.get('outlet_id')?.valueChanges.subscribe(val => {
			if (val) {
				this.onGetDropdownValues('offers');
			}
		});


	}
	onChanges(): void {
		this.Form.valueChanges.subscribe(val => {
			//console.log(`newValue: `, val)


			if (val.hex_code && val.hex_code.length == 7) {
				this.hex_code = val.hex_code;
			}
			else {
				this.hex_code = '#ffffff'
			};
			if (val.user_type) {
				this.getUsertype(val.user_type);

			}
		})

	}
	onChangeColor(): void {
		this.Form.get('hex_code')?.setValue(this.hex_code);
	}

	ngOnDestroy() {
		// this.sub.unsubscribe();
		// this.appSelectorSubscription.unsubscribe();
	}

	onChange(event : any): void {
		// if (event.checked) {
		// 	this.Form.get('push').setValue(1);
		// }
		// else {
		// 	this.Form.get('push').setValue(0);
		// }
	}

	onChangeType(event : any) {

	}

	getValue(name : any) {
		return this.Form.get(name);
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
		if (this.id == 'add') {
			method = "addCampaign";
		}
		else {

			method = 'updateCampaign';
		}


		this.mainApiService.postData(appConfig.base_url_slug + method, formData).then(response => {
			if (response.status == 200 || response.status == 201) {
				console.log(response)
				this.router.navigateByUrl('/main/campaign');
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

	onStartDate(): void {
		let abc = moment(this.StartDate).format('YYYY-MM-DD');
		this.Form.get('start_date')?.setValue(abc);
	}

	onEndDate(): void {
		let abc = moment(this.EndDate).format('YYYY-MM-DD');
		this.Form.get('end_date')?.setValue(abc);
	}

	onFileSelect(event : any) {
		if (event.controlName == 'image') {
			if (event.valid) {
				this.Form.get(event.controlName)?.patchValue(event.file);
				this.errorMsg = '';
			}
			else {
				if (event.controlName == 'icon') {
					this.errorMsg = 'Please select 600*900 image.'
				}
				if (event.controlName == 'image') {
					this.errorMsg = 'Please select 600*900 image.'
				}
			}
		}


	}

	getImage(item : any) {
		if (this.id != 'add') {
			return appConfig.file_url + this.Campaign[item];
		}
		else {
			return '';
		}
	}

	getUsertype(user_type : any): void {
		let url = "getUsertype" + '?per_page=500';
		this.mainApiService.getList(appConfig.base_url_slug + url).then(result => {
			if (result.status == 200 && result.data) {
				if (user_type == 'ooredoo') {
					this.Gainaccessvalue = true;
					this.arr = [];
					result.data.forEach((element : any) => {
						if (element.user_type == 'ooredoo') {
							this.arr.push(element.package_name)
						}

					});

				}

				else if (user_type == 'non_ooredoo') {
					this.Gainaccessvalue = false;
					this.arr = [];
					result.data.forEach((element : any) => {
						if (element.user_type == 'non_ooredoo') {
							this.arr.push(element.package_name)
						}

					});

				} else {
          this.getValue('package_name')?.setValue(' ');
        }


			}

		});

	}

	modo(event: any) {
		switch (event.value) {
			case "new_offers":
				this.Form.get('outletObject')?.setErrors(null);
				this.Form.get('outlet_id')?.setErrors(null);
				this.Form.get('offer_id')?.setErrors(null);
				break;
			case "favourites":
				this.Form.get('outletObject')?.setErrors(null);
				this.Form.get('outlet_id')?.setErrors(null);
				this.Form.get('offer_id')?.setErrors(null);

				break;
			case "gain_access":
				this.Form.get('outletObject')?.setErrors(null);
				this.Form.get('outlet_id')?.setErrors(null);
				this.Form.get('offer_id')?.setErrors(null);

				break;
			case "ooredoo_cc":
				this.Form.get('outletObject')?.setErrors(null);
				this.Form.get('outlet_id')?.setErrors(null);
				this.Form.get('offer_id')?.setErrors(null);
        break;
      case "unsub_premier":
        this.Form.get('outletObject')?.setErrors(null);
        this.Form.get('outlet_id')?.setErrors(null);
        this.Form.get('offer_id')?.setErrors(null);
        break;
			case "non_ooredoo_cc":
				this.Form.get('outletObject')?.setErrors(null);
				this.Form.get('outlet_id')?.setErrors(null);
				this.Form.get('offer_id')?.setErrors(null);
				break;
			case "outlets":
				this.onGetDropdownValues("outlets");
				// this.Form.get('outletObject').setErrors(Validators.required);
				this.Form.get('offer_id')?.setErrors(null);
				// this.Form.get('outletObject').setErrors(null);
				// this.Form.get('outlet_id').setErrors(Validators.requiredTrue);

				if (!this.Form.get('outlet_id')?.value) {
					this.Form.get('outletObject')?.setErrors(Validators.requiredTrue);
					this.Form.get('outlet_id')?.setErrors(Validators.requiredTrue);
				}

				break;
			case "offers":
				this.onGetDropdownValues("outlets");

				if (!this.Form.get('outlet_id')?.value) {
					this.Form.get('outletObject')?.setErrors(Validators.requiredTrue);
					this.Form.get('outlet_id')?.setErrors(Validators.requiredTrue);
				}
				else {
					if (this.Offers.length == 0) {
						this.Form.get('offer_id')?.setErrors(Validators.requiredTrue);
						let dialogRef = this.dialog.open(AlertDialog, { autoFocus: false });
						let cm = dialogRef.componentInstance;
						cm.heading = 'Error';
						cm.message = 'No offers available. 1';
						cm.cancelButtonText = 'Ok';
						cm.type = 'error';
					}
				}

				this.Form.get('offer_id')?.setErrors(Validators.requiredTrue);

				break;
			case "default":
		}

	}

	private _filter(name: string): any[] {
		const filterValue = name.toLowerCase();
		return this.Outlets.filter((option : any) => option.name.toLowerCase().indexOf(filterValue) == 0);

	}

	displayFn(user?: any): string {
		return user ? user.name : undefined;
	}

	onGetDropdownValues(value: string): void {
		let url = ''

		if (value == "offers") {
			url = 'getAllActiveOffers?outlet_id=' + this.Form.get('outlet_id')?.value;
		}
		else if (value == "outlets") {
			url = 'getAllActiveOutlets' + '?per_page=500';
		}

		this.mainApiService.getList(appConfig.base_url_slug + url)
			.then(result => {
				if (result.status == 200 && result.data) {
					if (value == "offers") {
						this.Offers = result.data;
					}
					else if (value == "outlets") {
						result.data.forEach((element : any) => {
							if (element.id != null && element.name != null) {
								this.Outlets.push(element);
							}
						});

						this.filteredOptions = this.Form.get('outletObject')!.valueChanges.pipe(
							startWith<any>(''),
							map(value => typeof value == 'string' ? value : value.name),
							map(name => name ? this._filter(name) : this.Outlets.slice())
						);
					}
				}
				else {
					if (value == "offers") {
						this.Offers = [];
						if (this.Form.get('navigation')?.value == 'outlets') {
							this.Form.get('offer_id')?.setErrors(null);
						}
						else if (this.Form.get('navigation')?.value == 'offers') {
							this.Form.get('offer_id')?.setErrors(Validators.requiredTrue);
							let dialogRef = this.dialog.open(AlertDialog, { autoFocus: false });
							let cm = dialogRef.componentInstance;
							cm.heading = 'Error';
							cm.message = 'No offers available. 2';
							cm.cancelButtonText = 'Ok';
							cm.type = 'error';
						}
					}
					else if (value == "outlets") {
						this.Outlets = [];
						this.filteredOptions = this.Form.get('outletObject')!.valueChanges.pipe(
							startWith<any>(''),
							map(value => typeof value == 'string' ? value : value.name),
							map(name => name ? this._filter(name) : this.Outlets.slice())
						);
					}
				}

			});
	}

	toTitleCase(str : any)
	{
		str = str.split('_').join(' ');
		return str.replace(/\w\S*/g, function(txt : any)
		{
			return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
		});
	}
}
