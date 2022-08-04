import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { AlertDialog } from '../../../lib';
import { MainService } from '../../../services';
import { AppLoaderService } from '../../../lib/app-loader/app-loader.service';
// import * as moment from 'moment';
import { appConfig } from '../../../../config';
import { ImportCSVComponent } from '../../../lib/import_csv.component';
// import { element } from 'protractor';

@Component({
	selector: 'app-popularcategories-form',
	templateUrl: './popularcategories-form.component.html',
	styleUrls: ['./popularcategories.component.css']
})
export class PopularCategoriesFormComponent extends ImportCSVComponent implements OnInit {
	id: any;
	name: any;
	sub: Subscription = new Subscription();
	Form: FormGroup;
	isLoading: boolean;
	bulk_data?: boolean;
	isEditing: boolean;
	promoCode: any;
	ArrayCSV: any[] = [];
	ArrayCSVCount: any;
	loaderMessage: string;
	isMultiple: boolean;
	expiryDatetime: any;
	currentDate: Date = new Date();
	Popularcategoriesdata: any;
	discount_type: Date = new Date();
	image: any;
	isDiscountType: boolean = false;
	CreditCardPackagesItem: any[] = [];
	scenario: any;
	logo: string = '';
	errorMsg: string = '';
	status: any = true;
	categories: any = '';  // ambigous change 	categories: { [key: string]: any; };
	catArray: any = [];
	errorMsgimage: string = '';
	formData?: FormData;
	method: string = '';
	errorMsglogo: string = '';
	ForArrayCSV: any[] = [];
	constructor(protected router: Router, protected appLoaderService: AppLoaderService,
		protected _route: ActivatedRoute,
		protected mainApiService: MainService,
		protected formbuilder: FormBuilder, protected dialog: MatDialog) {
		super(mainApiService, dialog);
		this.ArrayCSV = [];
		this.ArrayCSVCount = 0;
		this.loaderMessage = "Please wait CSV file is preparing to download.";
		this.Form = this.formbuilder.group({
			name: [null, [Validators.required]],
			// description: [null],
			image: [null, [Validators.required]],
			name_ar: [null, [Validators.required]],
		});
		this.isLoading = false;
		this.isEditing = false;
		this.isMultiple = false;
		this.Popularcategoriesdata = '';
	}

	ngOnInit() {
		this.sub = this._route.params.subscribe(params => {
			this.id = params['id'];
			if (this.id != 'add') {
				this.isEditing = true;
				this.Form.addControl('id', new FormControl(this.id));
				let abc = localStorage.getItem('popularcategories') as string;
				this.Popularcategoriesdata = JSON.parse(abc);
				this.ForArrayCSV = this.Popularcategoriesdata.popular_category_outlets;
				this.ForArrayCSV.forEach(element => {
					if (element.outlets) {
						this.ArrayCSV.push({
							id: element.outlets.id,
							name: element.outlets.name
						});
					}
				});
				this.ArrayCSVCount = this.ArrayCSV.length;
				this.Form.patchValue(this.Popularcategoriesdata);
			}
			else {
				this.isEditing = false;
				this.Form.reset();
			}
		});

		this.onChanges();
		this.methodOfCsv = "editPopularCategory";
		this.urlVersion = 2;
	}
	onChanges(): void {
		this.Form.valueChanges.subscribe(val => {
			console.log(`newValue: `, val.image)
		})
	}

	getValue(name : any) {
		return this.Form.get(name);
	}

	afterSelectionCsv(result : any, headersObj : {}, objTemp : any): void {
		// for (let key in headersObj) {
		// 	if (!headersObj.hasOwnProperty('outlet id') && !objTemp.hasOwnProperty('outlet_id')) {
		// 		objTemp['outlet_id'] = null;
		// 		this.errorMessageForCSV = this.errorMessageForCSV + '<b>Outlet ID</b> is missing,<br> ';
		// 		this.errorCounter++;
		// 	}
		// }

		if (this.errorCounter == 0) {
			result.forEach((element : any, index : any) => {
				if (element == null || element == '') {
					this.errorMessageForCSV = this.errorMessageForCSV + '<b>Outlet ID</b> is empty on line number ' + (index + 1) + ',<br> ';
					this.errorCounter++;
				}
				// if(element['outlet name'] != null || element['outlet name'] != '')
				// {
				// 	element['outlet name'] = element['outlet name'].split(';').join(',');
				// }
			});
		}
		this.afterJSON = result;
	}

	onUploadCSV(): void {
		this.JsonToServer = { outlet_ids: this.afterJSON, id: this.Popularcategoriesdata.id };
		this.onPopluarUploadCSV();
	}

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

			let arr : any[]= [];
			let headersObj : any = {};
			headers.forEach((element :any, index : any) => {
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

			for (var i = 1; i < lines.length - 1; i++) {
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

				for (var j = 0; j < 1; j++) {
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
			var x : any[]= [];
			result.forEach(element => {
				x.push(element['Id']);

			});
			this.errorCounter = 0;
			let objTemp = {};
			this.errorMessageForCSV = 'Invalid CSV File. <br>';

			this.result = result;
			this.headersObj = headersObj;
			this.objTemp = objTemp;
			this.afterSelectionCsv(x, headersObj, objTemp);
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

	onLocationBack(): void {
		window.history.back();
	}

	doSubmit(): void {
		this.isLoading = true;
		let method = '';
		let formData = new FormData();
		for (var key in this.Form.value) {
			formData.append(key, this.Form.value[key]);
		};

		if (this.id == 'add') {
			method = 'addPopularCategory';
		}
		else {
			method = 'editPopularCategory';
		}

		this.mainApiService.postData(appConfig.base_url_slug + method, formData, 2).then(response => {
			if (response.status == 200 || response.status == 201) {
				this.router.navigateByUrl('/main/popularcategories');
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

	onFileSelect(event : any) {
		if (event.controlName == 'image') {

			if (event.valid) {
				this.Form.get(event.controlName)?.patchValue(event.file);
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

	getImage1(item : any): any {
		if (this.id != 'add') {
			// console.log("getimage", this.Popularcategoriesdata[item])
			return appConfig.file_urlV2 + this.Popularcategoriesdata[item];
		}
		else {
			return '';
		}
	}
	onPopluarUploadCSV(): void {
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
			if (!this.isCsv) {
				console.log("this.isCsvthis.isCsv", !this.isCsv)
				if (response.status == 200 || response.status == 201) {
					let dialogRef = this.dialog.open(AlertDialog, { autoFocus: false });
					let cm = dialogRef.componentInstance;
					cm.heading = 'Message';
					cm.message = response.message;
					cm.cancelButtonText = 'Ok';
					cm.type = 'success';
					console.log('checking csv uploaded', response)
					dialogRef.afterClosed().subscribe(result => {
						this.afterSuccess();
					})
				}

				else {
					this.isLoading = false;
					let errormsg: any;
					// if (response.error.data.name != false) {
					//     errormsg = 'Name: ' + response.error.data.name.split(',').join(',<br> ');
					// }
					// else if (response.error.data.image != false) {
					//     errormsg = 'Image: ' + response.error.data.image.split(',').join(',<br> ');
					// }
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
		if (this.isCsv) {
			console.log("this.isCsvthis.isCsv direct", this.isCsv)
			this.directSuccess()
		}
	}

	onExportCSV(): void {
		this.getCountData();
	}

	getCountData(): void {
		//let url: any = appConfig.base_url_slug + this.method + '?index=' + 1 + '&index2=' + 5 + '&export=csv';


		// if (this.parent_id != null) {
		// 	url = url + '&id=' + this.parent_id;
		// }

		// if (this.url_values.length > 0) {
		// 	this.url_values.forEach(element => {
		// if(element.key != '' && element.value != '')
		// {
		// url = url + '&' + element.key + '=' + element.value;
		// }
		// 	});
		// }


		// this.mainApiService.getList(url).then(result => {
		if (this.ArrayCSVCount != 0 || this.ArrayCSVCount != null) {
			// if (this.method == 'getMerchants') {
			// 	this.ArrayCSVCount = result.data.merchantsCount;
			// }
			// else if (this.method == 'getOutlets') {
			// 	this.ArrayCSVCount = result.data.outletsCount;
			// }
			// else if (this.method == 'getOffers') {
			// 	this.ArrayCSVCount = result.data.offersCount;
			// }

			// this.ArrayCSV = [];
			let index = 1, perPage = 2000, loopIndex = 0;
			let totalCalls = Math.round(this.ArrayCSVCount / perPage);
			// perPage = Math.round(this.ArrayCSVCount / totalCalls);
			if (totalCalls < (this.ArrayCSVCount / perPage)) {
				totalCalls = totalCalls + 1;
			}

			if (this.ArrayCSVCount == 0 || this.ArrayCSVCount == null) {
				let dialogRef = this.dialog.open(AlertDialog, { autoFocus: false });
				let cm = dialogRef.componentInstance;
				cm.heading = 'Export CSV';
				cm.message = 'No records found.';
				cm.cancelButtonText = 'Ok';
				cm.type = 'error';
				return;
			}
			this.appLoaderService.setLoading(true);
			this.myLoop(loopIndex, index, totalCalls, perPage);
		}
		else {
			// this.ArrayCSV = [];
			let dialogRef = this.dialog.open(AlertDialog, { autoFocus: false });
			let cm = dialogRef.componentInstance;
			cm.heading = 'Export CSV';
			cm.message = 'No records found.';
			cm.cancelButtonText = 'Ok';
			cm.type = 'error';
		}
		// });
	}
	myLoop(loopIndex : any, index : any, totalCalls : any, perPage : any) {
		// log here(this.ArrayCSV);

		// this.otherPerPage = this.ArrayCSVCount - this.ArrayCSV.length;
		// if(this.otherPerPage < 2000)
		// {
		// 	perPage = this.otherPerPage;
		// }
		// let url = appConfig.base_url_slug +this.method + '?index='+ index + '&index2='+ perPage + '&start_date='+ this.start_date + '&end_date='+ this.end_date;
		// if(this.parent_id != null)
		// {
		// 	url = url + '&id=' + this.parent_id;
		// }

		// let url: any = appConfig.base_url_slug + this.method + '?index=' + index + '&index2=' + perPage + '&export=csv';

		// if (this.isNeededDate) {
		// 	url = url + '&start_date=' + this.start_date + '&end_date=' + this.end_date;
		// }

		// if (this.isMonthYear) {
		// 	if (this.isOnlyMonth) {
		// 		url = url + '&start_date=' + this.start_date + '&end_date=' + this.end_date;
		// 	}
		// 	else if (this.DropDown) {

		// 		url = url + '&year=' + this.year + '&month=' + this.month;
		// 	}
		// }

		// if (this.parent_id != null) {
		// 	url = url + '&id=' + this.parent_id;
		// }

		// if (this.url_values.length > 0) {
		// 	this.url_values.forEach(element => {
		// 		// if(element.key != '' && element.value != '')
		// 		// {
		// 		url = url + '&' + element.key + '=' + element.value;
		// 		// }
		// 	});
		// }

		// this.mainApiService.getList(url)
		// 	.then(result => {
		if (this.ArrayCSV != null) {
			let usersData: any = [], csvName: any;
			csvName = 'Popular Category Outlets.csv';
			usersData = [...this.ArrayCSV];

			// if (this.method == 'getMerchants') {
			// 	csvName = 'merchants.csv';
			// 	usersData = result.data.merchants;
			// }
			// else if (this.method == 'getOutlets') {
			// 	csvName = 'outlets.csv';
			// 	usersData = result.data.outlets;
			// }
			// else if (this.method == 'getOffers') {
			// 	csvName = 'deals.csv';
			// 	usersData = result.data.offers;
			// }
			// usersData.forEach(element => {
			// 	this.ArrayCSV.push(element);
			// });

			loopIndex++;
			index++;

			if (loopIndex < totalCalls) {
				this.myLoop(loopIndex, index, totalCalls, perPage);
				if (loopIndex == totalCalls - 1) {
					this.loaderMessage = "Your file is downloading."
				}
			}
			else {
				// console.log('Loop Finished, Your File is Downloading.');

				let csvContent = "";
				this.ArrayCSV.forEach((rowArray, index) => {
					var line = '';
					var header = ['Id','Name'];

					for (var key in rowArray) {
						if (rowArray[key] != null && typeof rowArray[key] == 'string') {
							try {
								rowArray[key] = rowArray[key].split(',').join(';');
								rowArray[key] = rowArray[key].split('"').join('');
								rowArray[key] = rowArray[key].split('\n').join('||');
								rowArray[key] = rowArray[key].split('\r').join('||');
							} catch (error) {
								// console.log(error);
								// console.log(key, rowArray[key])
							}
						}
						line += rowArray[key] + ',';
					}
					if (index == 0) {
						csvContent += header + '\r\n' + line + '\r\n';
					}
					else {
						csvContent += line + '\r\n';
					}
				});
				this.downloadFile(csvContent, csvName);
			}
		}
		else {
			this.ArrayCSV = [];
		}
		// });
	}
	downloadFile(data :any, fileName : any) {
		this.loaderMessage = "Please wait CSV file is preparing to download.";
		this.appLoaderService.setLoading(false);
		var BOM = "\uFEFF";  // For tackling non-english Characters
		var csvData = BOM + data;
		var blob = new Blob([csvData], {
			type: "application/csv;charset=utf-8;"
		});

		// if (window.navigator.msSaveBlob) {
		// 	navigator.msSaveBlob(blob, fileName);
		// }
		// else {
			// FOR OTHER BROWSERS
			var link = document.createElement("a");
			var csvUrl = URL.createObjectURL(blob);
			link.href = csvUrl;
			link.download = fileName;
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
		// }
	}
}
