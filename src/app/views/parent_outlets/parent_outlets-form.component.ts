import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { BaseLoaderService, MainService } from '../../services';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { AlertDialog } from '../../lib';
import { MatDialog } from '@angular/material/dialog';
import { appConfig } from '../../../config';
import * as moment from 'moment';
@Component({
	selector: 'app-parent_outlets-form',
	templateUrl: './parent_outlets-form.component.html',
	styles: ['.container {display: block;position: relative;padding-left: 35px;margin-bottom: 12px;cursor: pointer;font-size: 15px;-webkit-user-select: none;-moz-user-select: none;-ms-user-select: none;user-select: none;} .container input {position: absolute;opacity: 0;cursor: pointer;height: 0;width: 0;}.checkmark {position: absolute;top: 0;left: 0;height: 23px;width: 23px;background-color: #eee;}.container:hover input ~ .checkmark {background-color: #ccc;}.container input:checked ~ .checkmark {background-color: #148F96;}.checkmark:after {content: "";position: absolute;display: none;}.container input:checked ~ .checkmark:after {display: block;} li{margin: 7px 0px;} a{color:#148F96; font-weight:600; font-size:14px; cursor:pointer;} ::ng-deep .mat-form-field.mat-focused .mat-form-field-label {color: #af1f70 !important;} :host ::ng-deep .mat-form-field .mat-form-field-flex {border-radius: 9px !important;}.container .checkmark:after {left: 9px;top: 5px;width: 5px;height: 10px;border: solid white;border-width: 0 3px 3px 0;-webkit-transform: rotate(45deg);-ms-transform: rotate(45deg);transform: rotate(45deg);color: #148F96}']
})
export class ParentOutletsFormComponent implements OnInit
{
	id: any;
	// type: any;
	sub: Subscription = new Subscription();
	Form: FormGroup;
	isLoading: boolean;
	isEditing: boolean;
	parentOutlet: any;
	Outlets: any [];
	StartDate: any;
	EndDate: any;
    menudata: any;
    menudatatype: any;
	status: boolean = true;
    urltext: boolean = false;
    pdftext: boolean = false;
    imagetext: boolean = false;
	file_type: string = '';
    urlType: string = '';
	enableBrandNewDate: boolean = false;
	currentDate: Date = new Date();
	constructor(protected router: Router,
		protected _route: ActivatedRoute,
		protected mainApiService: MainService,
		protected formbuilder: FormBuilder, protected dialog: MatDialog, protected baseloader : BaseLoaderService)
	{
		this.Form = this.formbuilder.group({
			name: [null, [Validators.required, Validators.maxLength(50)]],
			delivery_status: [null, [Validators.required]],
			featured : [null],
			isnewbrand_expiry : [null],
			isnew_brand: [null]
		});
		this.isLoading = false;
		this.isEditing = false;
		this.baseloader.menudata.subscribe(d => {
            console.log('checking the data ', d)
            this.menudata = d;
            if (this.menudata.menu_card) {
                if (this.menudata.type = 'link') {
                    this.urltext = true;
                    this.pdftext = false;
                    this.imagetext = false;
                    this.file_type = 'url';
                }
                else {
                   
                }
            }
            else if (this.menudata.pdf_file) {
                if (this.menudata.type = 'pdf') {
                    this.pdftext = true;
                    this.file_type = 'pdf';
                    this.urltext = false;
                    this.imagetext = false;
                }
            }
            else if (this.menudata.imagesarray) {
                if (this.menudata.type = 'image' && this.menudata.imagesarray) {
                    this.pdftext = false;
                    this.file_type = 'image';
                    this.urltext = false;
                    this.imagetext = true;
                }
            }
            else{
                this.urltext = false;
                this.imagetext = false;
                this.pdftext = false;
            }
        });
	}
	ngOnInit()
	{
		this.sub = this._route.params.subscribe(params => {
			this.id = params['id'];
			this.gerOutletsList(this.id);
				if (this.id != 'add')
				{
					this.Form.addControl('id', new FormControl(this.id));
					this.isEditing = true;
					let abc = localStorage.getItem('ParentOutlet') as string;
					console.log(abc);
					this.parentOutlet = JSON.parse(abc);
					this.Form.patchValue(this.parentOutlet);
					if(this.parentOutlet.featured == '1' || this.parentOutlet.featured == 1){
						this.status = true
					}
					else{
						this.status = false;
					}
					if(this.parentOutlet.isnew_brand == '1' || this.parentOutlet.isnew_brand == 1){
						this.enableBrandNewDate = true;
					}
					else{
						this.enableBrandNewDate = false;
					}
					 if(this.enableBrandNewDate && this.parentOutlet.isnewbrand_expiry !== ''){
						this.StartDate = new Date(this.parentOutlet.isnewbrand_expiry);
					 }

					 let formTest =   JSON.parse(localStorage.getItem('brandForm') as string);
					 console.log(formTest);
					   if(formTest !== null){
					   let xyz = (JSON.parse(localStorage.getItem('brandForm') as string));
					   this.Form.patchValue(xyz);
					   if(xyz.featured == '1')
					   {
						this.status = true;
					   }
					   if(xyz.isnew_brand == '1')	{
						this.enableBrandNewDate = true;
					   }
					   if(this.enableBrandNewDate){
						// this.StartDate = moment(xyz.isnewbrand_expiry).format('YYYY-MM-DD HH:mm:ss');
						this.StartDate = new Date(xyz.isnewbrand_expiry);
						}
					   localStorage.removeItem('brandForm');
				   }

				}
				else
				{
					this.isEditing = false;
                    this.Form.reset();
                //   let formTest =   JSON.parse(localStorage.getItem('brandForm') as string);
                //   console.log(formTest);
                //     if(formTest !== null){
                //     let xyz = (JSON.parse(localStorage.getItem('brandForm') as string));
                //     this.Form.patchValue(xyz);
                //     localStorage.removeItem('brandForm');
                // }
				let formTest =   JSON.parse(localStorage.getItem('brandForm') as string);
				console.log(formTest);
				  if(formTest !== null){
				  let xyz = (JSON.parse(localStorage.getItem('brandForm') as string));
				  this.Form.patchValue(xyz);
				  if(xyz.featured == '1')
				  {
				   this.status = true;
				  }
				  if(xyz.isnew_brand == '1')	{
				   this.enableBrandNewDate = true;
				  }
				  if(this.enableBrandNewDate){
				   // this.StartDate = moment(xyz.isnewbrand_expiry).format('YYYY-MM-DD HH:mm:ss');
				   this.StartDate = new Date(xyz.isnewbrand_expiry);
				   }
				  localStorage.removeItem('brandForm');
			  }
                else{
                    this.Form.reset();
                }
					localStorage.removeItem('ParentOutlet');
				}
		});
	}
	onStartDate(): void {
		let abc = moment(this.StartDate).format('YYYY-MM-DD HH:mm:ss');
		this.Form.get('isnewbrand_expiry')?.setValue(abc);
		console.log(this.Form.get('isnewbrand_expiry').value);
	}
	getValue(name : any)
    {
        return this.Form.get(name);
	}
	checkNewBrand($event){
		if($event.target.checked)
		{
			this.enableBrandNewDate = true;
			this.Form.get('isnew_brand').setValue(1);
			this.Form.addControl('isnewbrand_expiry', new FormControl(null, [Validators.required]));
		}
		else
		{
			this.enableBrandNewDate = false;
			this.Form.get('isnew_brand').setValue(0);
			this.Form.removeControl('isnewbrand_expiry');
		}
	}
	toggleView() {
		console.log(this.status);
		if(this.status == true){
			this.Form.get('featured').setValue(1);
		}
		else{
			this.Form.get('featured').setValue(0);
		}
		// console.log(item.status);
		// if (item.status) {
		// 	this.status = 'active';
		// }
		// else {
		// 	this.status = 'not_active';
		// }
		// var data = {
		// 	status: this.status,	
		// 	id: item.id
		// }
		// var url = 'editPopularCategory';
		// this.mainApiService.postData(appConfig.base_url_slug + url, data, 2).then(response => {
		// 	if (response.status == 200 || response.status == 201) {
		// 	}
		// 	else {
		// 		item.status = !item.status
		// 	}
		// },
		// 	Error => {
		// 		let dialogRef = this.dialog.open(AlertDialog, { autoFocus: false });
		// 		let cm = dialogRef.componentInstance;
		// 		cm.heading = 'Error';
		// 		cm.message = 'Internal Server Error';
		// 		cm.cancelButtonText = 'Close';
		// 		cm.type = 'error';
		// 	});
	}
	onLocationBack(): void
	{
		window.history.back();
	}
	gerOutletsList(id): void {
        let url = 'getParents?id=' + id;
        this.mainApiService.getList(appConfig.base_url_slug + url)
            .then(result => {
                if (result.status == 200 && result.data) {
                    this.Outlets = result.data.parents[0];
					console.log(this.Outlets);
                    result.data.parents.forEach(element => {
                        this.menudatatype = element.parentOutletMenu[0]?.type;
                    });
                     if (this.menudatatype == 'pdf') {
                        this.pdftext = true;
                        this.urltext = false;
                        this.imagetext = false;
                    }
                    else if (this.menudatatype == 'url') {
                        this.urltext = true;
                        this.pdftext = false;
                        this.imagetext = false;
                    }
                    else if (this.menudatatype == 'image') {
                        this.imagetext = true;
                        this.pdftext = false;
                        this.urltext = false;
                    }
                    else { }
                }
                else {
                    this.Outlets = [];
                }
            });
    }
	doSubmit(): void
	{
		this.isLoading = true;
		let method = '';
		if (this.id == 'add')
		{
			method = 'addParent';
		}
		else
		{
			method = 'updateParent';
		}
		this.mainApiService.postData(appConfig.base_url_slug +method, this.Form.value).then(response => {
			if (response.status == 200 || response.status == 201)
			{
				this.router.navigateByUrl('/main/brands' );
				this.isLoading = false;
			}
			else
			{
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
	uploadMenuSection(type: any){
		localStorage.setItem('brandForm', JSON.stringify(this.Form.value));
		this.router.navigateByUrl('main/brands/'+ this.id + '/' + type);
	}
}