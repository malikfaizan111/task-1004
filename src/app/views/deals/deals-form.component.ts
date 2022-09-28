import { OutletListDialogComponent } from './../../dialogs/outlet-list-dialog/outlet-list-dialog.component';
import { Component, OnInit, EventEmitter, Output, Input, SimpleChanges, OnChanges, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import * as moment from 'moment';

import { AlertDialog } from '../../lib';
import { MainService } from '../../services';
import { appConfig } from '../../../config';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { ImportCSVComponent } from '../../lib/import_csv.component';
// import { TouchSequence } from 'selenium-webdriver';

@Component({
	selector: 'app-deals-form',
	templateUrl: './deals-form.component.html',
	// encapsulation: ViewEncapsulation.None
})
export class DealsFormComponent extends ImportCSVComponent implements OnInit, OnChanges {
	id: any = 'add';
	sub: Subscription = new Subscription();
	Form: FormGroup;
	// isLoading: boolean;
	isEditing: boolean;
	Offer: any;
	Outlets: any;
	errorMsg: string = '';
	StartDate: any;
	EndDate: any;
	showError: any = null;
	// dealsJSON: any;
	// csvFile: any
	currentDate: Date = new Date();
	filteredOptions: Observable<string[]> = new Observable();
	searchTimer: any;
	// trendingSearch: any=[];
	// errorCounter: number;
	// errorMessageForCSV: string;

	@Input() is_heading_shown: boolean = true;
	@Input() is_button_shown: boolean = true;
	@Input() heading_label: string = 'Offer';
	@Input() is_child: boolean = false;
	@Input() parent_key: number = 0;
	@Output() onFormChanges: EventEmitter<any> = new EventEmitter<any>();
	@Output() onOfferSuccess: EventEmitter<any> = new EventEmitter<any>();
	@Input() isMultiple: boolean = false;


	constructor(protected router: Router,
		protected _route: ActivatedRoute,
		protected mainApiService: MainService,
		protected formbuilder: FormBuilder, protected dialog: MatDialog) {
		super(mainApiService, dialog);
		this.Form = this.formbuilder.group({
			title: [null, [Validators.required]],
			description: [null, [Validators.required, Validators.maxLength(500)]],
			search_tags: [null, [Validators.required, Validators.maxLength(1000)]],
			interest_tags: [null, [Validators.maxLength(1000)]],
			image: [null],
			// trending_search: [null],
			approx_saving: [null, [Validators.required, Validators.maxLength(20)]],
			start_datetime: [null, [Validators.required]],
			end_datetime: [null, [Validators.required]],
			special: [null, [Validators.required]],
			special_type: [null],
			// price: [null, [Validators.required]],
			// special_price: [null, [Validators.required]],
			valid_for: [null],
			renew: ['1', [Validators.required]],
			redemptions: [null],
			SKU: [null, [Validators.required]],
			rules_of_purchase: [null],
			usage_allowance: [null],
			per_user: ['1', [Validators.required, Validators.maxLength(50)]],
			outletObject: ['', [Validators.required, Validators.maxLength(50)]],
			outletName: ['', [Validators.required, Validators.maxLength(50)]],
			outlet_id: ['', [Validators.required, Validators.maxLength(50)]],

		});

		this.isLoading = false;
		this.isEditing = false;
		this.Outlets = [];
		// this.dealsJSON = '';
		this.errorMessageForCSV = 'Invalid CSV File. <br>';
		this.methodOfCsv = 'addOffers';

		this.Form.valueChanges.subscribe(response => {
			if (this.Form.valid) {
				this.onFormChanges.emit(this.Form);
			}
			else {
				this.onFormChanges.emit(false);
			}
		})
	}

	ngOnInit() {
		if (this.is_child == false) {
			this.Form.get('outletObject')?.valueChanges.subscribe(response => {
				if (response == null) {
					return
				}

				if (typeof response != 'object') {
					this.Form.get('outletObject')?.setErrors(Validators.requiredTrue);
				}
				else {
					this.Form.get('outlet_id')?.setValue(response.id);
				}
			})

			this.filteredOptions = this.Form.get('outletObject')!.valueChanges.pipe(
				startWith<any>(''),
				map(value => typeof value == 'string' ? value : value.name),
				map(name => name ? this._filter(name) : this.Outlets.slice())
			);

			this.sub = this._route.params.subscribe(params => {
				this.id = params['id'];
				if (this.id != 'add') {
					this.Form.addControl('id', new FormControl(this.id));
					let abc = localStorage.getItem('Deal') as string;
					this.Offer = JSON.parse(abc);
					this.Form.patchValue(this.Offer);
					if (this.Offer.renew == '' || this.Offer.renew == null) {
						this.Form.get('renew')?.setValue('1');
					}

					if (this.Offer.renew == 0) {
						this.Form.addControl('redemptions', new FormControl(null, [Validators.required]));
						this.Form.get('redemptions')?.setValue(this.Offer.redemptions);
					}

					if (this.Offer.special == 1) {
						this.Form.addControl('special_type', new FormControl(null, [Validators.required]));
						this.Form.get('special_type')?.setValue(this.Offer.special_type);
					}

					this.isEditing = true;

					this.StartDate = new Date(this.Offer.start_datetime);
					this.EndDate = new Date(this.Offer.end_datetime);

					this.Form.get('outletName')?.setValue(this.Offer.outlet_name);
					this.Form.get('outletObject')?.setValue({
						id: this.Offer.outlet_id, name: this.Offer.outlet_name
					})
				}
				else {
					this.isEditing = false;
					this.Form.reset();
					this.Form.get('per_user')?.setValue('1');
				}
			});
			this.gerOutletsList();
		}
		else {
			if (!this.isMultiple) {
				this.Form.get('outlet_id')?.setValidators(null);
				this.Form.get('outletObject')?.setValidators(null);
			}
			else {
				this.Form.get('outlet_id')?.setValue(this.parent_key);
				this.Form.get('outletObject')?.setValue(this.parent_key);
			}
		}

		// this.gettrendingSearchList();
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (this.parent_key != void 0 && this.Form.valid) {
			this.Form.get('outlet_id')?.setValue(this.parent_key);
			this.Form.get('outletObject')?.setValue(this.parent_key);
			this.doSubmit();
		}

	}

	private _filter(name: string): any[] {
		const filterValue = name.toLowerCase();
		return this.Outlets.filter((option: any) => option.name.toLowerCase().indexOf(filterValue) == 0);
	}

	displayFn(user?: any): string | undefined {
		return user ? user.name : undefined;
	}

	getValue(name: any) {
		return this.Form.get(name);
	}

	getImage(item: any): any {
		if (this.id != 'add') {
			return appConfig.file_urlV2 + this.Offer[item];
		}
		else {
			return '';
		}
	}

	onStartDate(): void {
		let abc = moment(this.StartDate).format('YYYY-MM-DD HH:mm:ss');
		this.Form.get('start_datetime')?.setValue(abc);
	}

	onEndDate(): void {
		let abc = moment(this.EndDate).format('YYYY-MM-DD HH:mm:ss');
		this.Form.get('end_datetime')?.setValue(abc);
	}

	showValue(): void {
		// log here(this.Form.value);
	}

	gerOutletsList(): void {
		let url = 'getAllOutlets';
		this.mainApiService.getList(appConfig.base_url_slug + url).then(result => {
			if (result.status == 200 && result.data) {
				result.data.forEach((element: any) => {
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
			else {
				this.Outlets = [];
				this.filteredOptions = this.Form.get('outletObject')!.valueChanges.pipe(
					startWith<any>(''),
					map(value => typeof value == 'string' ? value : value.name),
					map(name => name ? this._filter(name) : this.Outlets.slice())
				);
			}
		});
	}

	openOutletList() {
		let dialogRef = this.dialog.open(OutletListDialogComponent, { autoFocus: false, width: '450px', maxHeight: '500px' });
		setTimeout(() => {
			document.getElementsByClassName("mat-dialog-container")[0].className += ' roundedd';
		}, 0);

		dialogRef.afterClosed().subscribe((outlet) => {
			this.Form.get('outletName')?.setValue(outlet.name);
			this.Form.get('outletObject')?.setValue(outlet);
		})
	}

	onLocationBack(): void {
		window.history.back();
	}

	onSelectChange(event: any): void {
		if (event.value == 0) {
			this.Form.addControl('redemptions', new FormControl(null, [Validators.required]));
		}
		else {
			this.Form.removeControl('redemptions');
		}
	}

	onSpecialChange(event: any): void {
		if (event.value == 1) {
			this.Form.addControl('special_type', new FormControl(null, [Validators.required]));
		}
		else {
			this.Form.removeControl('special_type');
		}
	}

	doSubmit(): void {
		this.isLoading = true;
		let method = '';

		if (this.id == 'add') {
			method = 'addOffer';
		}
		else {
			method = 'updateOffer';
		}

		let formData = new FormData();

		for (var key in this.Form.value) {
			formData.append(key, this.Form.value[key]);
		}

		formData.append('outletObject', this.Form.value['outletObject']);

		this.mainApiService.postFormData(appConfig.base_url_slug + method, formData).then(response => {
			if (response.status == 200 || response.status == 201) {

				if (this.is_child == false) {
					this.router.navigateByUrl('/main/deals');
				}
				else {
					if (this.isMultiple) {
						this.onOfferSuccess.emit(this.Form.value);
					}
					else {
						window.history.back();
					}
				}


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
				this.isLoading = false;
				let dialogRef = this.dialog.open(AlertDialog, { autoFocus: false });
				let cm = dialogRef.componentInstance;
				cm.heading = 'Error';
				cm.message = "Internal Server Error.";
				cm.cancelButtonText = 'Ok';
				cm.type = 'error';
			})
	}

	onFileSelect(event: any) {
		if (event.valid) {
			this.Form.get(event.controlName)?.patchValue(event.file);
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

	afterSelectionCsv(result: any, headersObj: any, objTemp: any): void {
		for (let key in headersObj) {
			if (!headersObj.hasOwnProperty('title') && !objTemp.hasOwnProperty('title')) {
				objTemp['title'] = null;
				this.errorMessageForCSV = this.errorMessageForCSV + '<b>title</b> is missing,<br> ';
				this.errorCounter++;
			}
			else if (!headersObj.hasOwnProperty('description') && !objTemp.hasOwnProperty('description')) {
				objTemp['description'] = null;
				this.errorMessageForCSV = this.errorMessageForCSV + '<b>description</b> is missing,<br> ';
				this.errorCounter++;
			}
			else if (!headersObj.hasOwnProperty('search_tags') && !objTemp.hasOwnProperty('search_tags')) {
				objTemp['search_tags'] = null;
				this.errorMessageForCSV = this.errorMessageForCSV + '<b>search_tags</b> is missing,<br> ';
				this.errorCounter++;
			}
			// else if(!headersObj.hasOwnProperty('interest_tags') && !objTemp.hasOwnProperty('interest_tags'))
			// {
			// 	objTemp['interest_tags'] = null;
			// 	this.errorMessageForCSV = this.errorMessageForCSV + '<b>interest_tags</b> is missing,<br> ';
			// 	this.errorCounter++;
			// }
			else if (!headersObj.hasOwnProperty('image') && !objTemp.hasOwnProperty('image')) {
				objTemp['image'] = null;
				this.errorMessageForCSV = this.errorMessageForCSV + '<b>image</b> is missing,<br> ';
				this.errorCounter++;
			}
			else if (!headersObj.hasOwnProperty('approx_saving') && !objTemp.hasOwnProperty('approx_saving')) {
				objTemp['approx_saving'] = null;
				this.errorMessageForCSV = this.errorMessageForCSV + '<b>approx_saving</b> is missing,<br> ';
				this.errorCounter++;
			}
			else if (!headersObj.hasOwnProperty('start_datetime') && !objTemp.hasOwnProperty('start_datetime')) {
				objTemp['start_datetime'] = null;
				this.errorMessageForCSV = this.errorMessageForCSV + '<b>start_datetime</b> is missing,<br> ';
				this.errorCounter++;
			}
			else if (!headersObj.hasOwnProperty('end_datetime') && !objTemp.hasOwnProperty('end_datetime')) {
				objTemp['end_datetime'] = null;
				this.errorMessageForCSV = this.errorMessageForCSV + '<b>end_datetime</b> is missing,<br> ';
				this.errorCounter++;
			}
			// else if(!headersObj.hasOwnProperty('renew') && !objTemp.hasOwnProperty('renew'))
			// {
			// 	objTemp['renew'] = null;
			// 	this.errorMessageForCSV = this.errorMessageForCSV + '<b>renew</b> is missing,<br> ';
			// 	this.errorCounter++;
			// }
			// else if(!headersObj.hasOwnProperty('per_user') && !objTemp.hasOwnProperty('per_user'))
			// {
			// 	objTemp['per_user'] = null;
			// 	this.errorMessageForCSV = this.errorMessageForCSV + '<b>per_user</b> is missing,<br> ';
			// 	this.errorCounter++;
			// }
			else if (!headersObj.hasOwnProperty('outlet_id') && !objTemp.hasOwnProperty('outlet_id')) {
				objTemp['outlet_id'] = null;
				this.errorMessageForCSV = this.errorMessageForCSV + '<b>outlet_id</b> is missing,<br> ';
				this.errorCounter++;
			}
			// else if(!headersObj.hasOwnProperty('special') && !objTemp.hasOwnProperty('special'))
			// {
			// 	objTemp['special'] = null;
			// 	this.errorMessageForCSV = this.errorMessageForCSV + '<b>special</b> is missing,<br> ';
			// 	this.errorCounter++;
			// }
			else if (!headersObj.hasOwnProperty('special_type') && !objTemp.hasOwnProperty('special_type')) {
				objTemp['special_type'] = null;
				this.errorMessageForCSV = this.errorMessageForCSV + '<b>special_type</b> is missing,<br> ';
				this.errorCounter++;
			}
		}

		if (this.errorCounter == 0) {
			result.forEach((element: any, index: any) => {
				let idx = index + 1;
				if (element['title'] == null || element['title'] == '') {
					this.errorMessageForCSV = this.errorMessageForCSV + '<b>title</b> is empty on line number ' + (idx + 1) + ',<br> ';
					this.errorCounter++;
				}
				if (element['description'] == null || element['description'] == '') {
					this.errorMessageForCSV = this.errorMessageForCSV + '<b>description</b> is empty on line number ' + (idx + 1) + ',<br> ';
					this.errorCounter++;
				}
				if (element['search_tags'] == null || element['search_tags'] == '') {
					this.errorMessageForCSV = this.errorMessageForCSV + '<b>search_tags</b> is empty on line number ' + (idx + 1) + ',<br> ';
					this.errorCounter++;
				}
				if (element['interest_tags'] == null || element['interest_tags'] == '') {
					this.errorMessageForCSV = this.errorMessageForCSV + '<b>interest_tags</b> is empty on line number ' + (idx + 1) + ',<br> ';
					this.errorCounter++;
				}
				if (element['image'] == null || element['image'] == '') {
					this.errorMessageForCSV = this.errorMessageForCSV + '<b>image</b> is empty on line number ' + (idx + 1) + ',<br> ';
					this.errorCounter++;
				}
				if (element['approx_saving'] == null || element['approx_saving'] == '') {
					this.errorMessageForCSV = this.errorMessageForCSV + '<b>approx_saving</b> is empty on line number ' + (idx + 1) + ',<br> ';
					this.errorCounter++;
				}
				if (element['special'] == null || element['special'] == '') {
					// this.errorMessageForCSV = this.errorMessageForCSV + '<b>special</b> is empty on line number ' + (index + 1) + ',<br> ';
					// this.errorCounter++;
					element['special'] = 0;
				}
				if (element['special_type'] == null || element['special_type'] == '') {
					this.errorMessageForCSV = this.errorMessageForCSV + '<b>special_type</b> is empty on line number ' + (index + 1) + ',<br> ';
					this.errorCounter++;

				}
				if (element['start_datetime'] == null || element['start_datetime'] == '') {
					this.errorMessageForCSV = this.errorMessageForCSV + '<b>start_datetime</b> is empty on line number ' + (idx + 1) + ',<br> ';
					this.errorCounter++;
				}
				if (element['end_datetime'] == null || element['end_datetime'] == '') {
					this.errorMessageForCSV = this.errorMessageForCSV + '<b>end_datetime</b> is empty on line number ' + (idx + 1) + ',<br> ';
					this.errorCounter++;
				}
				if (element['renew'] == null || element['renew'] == '') {
					// this.errorMessageForCSV = this.errorMessageForCSV + '<b>renew</b> is empty on line number ' + (idx + 1) + ',<br> ';
					// this.errorCounter++;
					element['renew'] = 1;
				}
				else {
					if (element['renew'] == 'Yes') {
						element['renew'] = 1;
					}
					else if (element['renew'] == 'No') {
						element['renew'] = 0;
						if (element['total_redemptions'] == null || element['total_redemptions'] == '') {
							this.errorMessageForCSV = this.errorMessageForCSV + '<b>total_redemptions</b> is empty on line number ' + (idx + 1) + ',<br> ';
							this.errorCounter++;
						}
					}
				}
				if (element['per_user'] == null || element['per_user'] == '') {
					// this.errorMessageForCSV = this.errorMessageForCSV + '<b>per_user</b> is empty on line number ' + (idx + 1) + ',<br> ';
					// this.errorCounter++;
					element['per_user'] = 1;
				}
				if (element['outlet_id'] == null || element['outlet_id'] == '') {
					this.errorMessageForCSV = this.errorMessageForCSV + '<b>outlet_id</b> is empty on line number ' + (idx + 1) + ',<br> ';
					this.errorCounter++;
				}
			});
		}
		this.afterJSON = JSON.stringify(result);
	}

	onUploadCSV(): void {
		this.JsonToServer = { offers: this.afterJSON };
		super.onUploadCSV();
	}

	afterSuccess(): void {
		this.router.navigateByUrl('/main/deals');
		this.isLoading = false;
	}

	check() {
		console.log(this.Form);
	}

	// gettrendingSearchList(): void {
	//     this.mainApiService.getList(appConfig.base_url_slug + 'getDefaults', true)
	//         .then(result => {
	//             if (result.status == 200 && result.data) {
	//                 this.trendingSearch = result.data.trending_search;
	//             }
	//             else {
	//                 this.trendingSearch = [];
	//             }
	//         });
	// }
}