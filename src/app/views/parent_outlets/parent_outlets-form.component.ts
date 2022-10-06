import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { BaseLoaderService, MainService } from '../../services';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { AlertDialog } from '../../lib';
import { MatDialog } from '@angular/material/dialog';
import { appConfig } from '../../../config';
import * as moment from 'moment';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
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
	logoName: any;
	url: any;
	imageUrl: any;
	mat_toggle = {'color': '#757575',}
	feature_toggle = {'color': '#148F96'};
	// static data for image
	coverImage = new Array();
	movies: any
	coverImageText: boolean = false;
	logoText: boolean = false;
	fileUrl:any;
	formData: any;
	imageFile: any[] = [];
	logo:any
	brandInfo: any;
	featureInfo:any
	constructor(protected router: Router,
		protected _route: ActivatedRoute,
		protected mainApiService: MainService,
		protected formbuilder: FormBuilder, protected dialog: MatDialog, protected baseloader : BaseLoaderService)
	{
		this.coverImage = []
			this.Form = this.formbuilder.group({
			name: [null, [Validators.required, Validators.maxLength(50)]],
			delivery_status: [null, [Validators.required]],
			featured : [null],
			isnewbrand_expiry : [null],
			isnew_brand: [null]
		});
		this.isLoading = false;
		this.isEditing = false;
		this.fileUrl = appConfig.file_urlV2;
		this.formData = new FormData();
		// debugger;
		this.baseloader.menudata.subscribe(d => {
            console.log('checking the data ', d)
            this.menudata = d;
			console.log('my check', this.menudata)
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
		// for cover image title
		// let abc = localStorage.getItem('ParentOutlet') as string;
		// 			console.log(abc);
		// 			let parentOutletCoverImage = JSON.parse(abc);
		// 			if(parentOutletCoverImage == null){
		// 				this.coverImageText = false
		// 			}else if (parentOutletCoverImage.parentImages.length != 0){
		// 				this.coverImageText = true
		// 			}else{
		// 				this.coverImageText = false
		// 			}
		console.log('logo....', this.logoText)
					
					
	}
	ngOnInit()
	{
		this.sub = this._route.params.subscribe(params => {
			this.id = params['id'];
			// console.log('id', this.id)
			this.gerOutletsList(this.id);
			console.log('covercheck....', this.coverImage)
				if (this.id != 'add')
				{
					this.Form.addControl('id', new FormControl(this.id));
					this.isEditing = true;
					let abc = localStorage.getItem('ParentOutlet') as string;
					console.log(abc);
					this.parentOutlet = JSON.parse(abc);
					console.log(this.parentOutlet);
					if(this.parentOutlet?.logo !== null || this.parentOutlet?.logo !== '')
					{
						this.url = this.parentOutlet?.logo;
						this.url = this.fileUrl + this.url;
					}	
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
		// console.log('toggle', $event)
		if($event.checked == true)
		{
			this.mat_toggle = {'color': '#148F96'}
			this.enableBrandNewDate = true;
			this.Form.get('isnew_brand').setValue(1);
			this.Form.addControl('isnewbrand_expiry', new FormControl(null, [Validators.required]));
		}
		else
		{
			this.mat_toggle = {'color': '#757575'}
			this.enableBrandNewDate = false;
			this.Form.get('isnew_brand').setValue(0);
			this.Form.removeControl('isnewbrand_expiry');
		}
	}
	toggleView() {
		// console.log(this.status);
		if(this.status == true){
			this.feature_toggle = {'color': '#148F96'}
			this.Form.get('featured').setValue(1);
		}
		else{
			this.feature_toggle = {'color': '#757575'}
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
					// console.log('my second check', this.Outlets);
                    result.data.parents.forEach(element => {
                        this.menudatatype = element.parentOutletMenu[0]?.type;
						this.coverImage = element.parentImages
						this.logo = element.logo
						this.brandInfo = element.isnew_brand
						this.featureInfo = element.featured
                    });
					if (this.logo !== null){
						this.logoText = true;
					}
					if (this.brandInfo == 1){
						this.mat_toggle = {'color': '#148F96'}
					}
					if (this.coverImage.length != 0){
						this.coverImageText = true;
					}
					if (this.featureInfo == 0){
						this.feature_toggle = {'color': '#757575'}
					}
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
		this.formData.append('logo', this.imageFile[0]);
		this.formData.append('delivery_status', this.Form.get('delivery_status').value);
		this.formData.append('featured', this.Form.get('featured').value);
		this.formData.append('isnewbrand_expiry', this.Form.get('isnewbrand_expiry').value);
		this.formData.append('isnew_brand', this.Form.get('isnew_brand').value);
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

	// new screen loigcs

	onFileImageChange(event:any)
	{
		this.imageFile = [];
		this.imageFile.push(event.target.files[0]);
		console.log(this.formData);
		console.log(this.imageFile);
		let abc = event.target.files[0];
		this.logoName = abc.name
		if (event.target.files && event.target.files[0]) {
            var reader = new FileReader();
            reader.onload = (event: any) => {
                this.url = event.target.result;
            }
            reader.readAsDataURL(event.target.files[0]);
        }
		else{

		}
		
	}


}