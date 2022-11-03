import { Component, OnInit, ViewChild, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { AlertDialog, GetLocationDialog } from '../../lib';
import { MainService } from '../../services';
import { appConfig } from '../../../config';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { ImportCSVComponent } from '../../lib/import_csv.component';
import { BaseLoaderService } from 'src/app/services';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { DomSanitizer } from '@angular/platform-browser';
import { MatSelectChange } from '@angular/material/select';
declare var $: any;

@Component({
    selector: 'app-outlets-form',
    templateUrl: './outlets-form.component.html',
    styles: ['li{margin: 7px 0px;} a{color:#148F96; font-weight:600; font-size:13px; cursor:pointer;} ::ng-deep .mat-form-field.mat-focused .mat-form-field-label {color: #af1f70 !important;} :host ::ng-deep .mat-form-field .mat-form-field-flex {border-radius: 9px !important;} ::ng-deep .mat-checkbox-checked.mat-primary .mat-checkbox-background {background-color: #148f96 !important;}::ng-deep .mat-primary .mat-pseudo-checkbox-checked {background: #328F96;}']
})
export class OutletsFormComponent extends ImportCSVComponent implements OnInit, OnChanges {
    id: any = 'add';
    // type: any;
    sub: Subscription = new Subscription();
    Form: FormGroup;
    isLoading: boolean;
    isEditing: boolean;
    outlet: any;
    search: any = '';
    startTiming: any;
    endTiming: any;
    errorMsg: string = '';
    errorMsglogo: string = '';
    errorMsgimage: string = '';
    Merchants: any[];
    Parents: any[];
    Categories: any[] = [];
    PopularCategories: any[] = [];
    CollectionOnly: any[] = [];
    file_url: any = appConfig.file_urlV2;
    // csvFile: any;
    // outletsJSON: string;
    showError: any = null;
    status: any = null;
    Offers: any;
    searchTimer: any;
    filteredOptions: Observable<string[]> = new Observable();
    filteredParentOptions: Observable<string[]> = new Observable();
    Outlets: any [];
    menudata: any;
    menudatatype: any;
    urltext: boolean = false;
    pdftext: boolean = false;
    imagetext: boolean = false;
    file_type: string = '';
    urlType: string = '';
    imageLoad: any;
    imageUpdate:any;
    ImageFormPicture: any;
    imageExist: boolean;
    // errorCounter: number;
    // errorMessageForCSV: string;
    // @ViewChild('selectTo') selectTo: any;

    @Input() is_heading_shown: boolean = true;
    @Input() is_button_shown: boolean = true;
    @Input() heading_label: string = 'Outlet';
    @Input() is_child: boolean = false;
    @Input() parent_key: number = 0;
    @Output() onFormChanges: EventEmitter<any> = new EventEmitter<any>();
    @Output() onOutletSuccess: EventEmitter<any> = new EventEmitter<any>();
    @Input() isMultiple: boolean = false;
    isGenderDisabled: boolean;
    PlaylistOnly: any;
    pcat_ids: any;
    collect_ids: any;
    fooddrinks: any;
    cuisine: any;
    beauty: any;
    attribute: any;
    funLeisure: any;
    retailServices: any;
    userAppId:boolean = false;
    // food:any = '';
    // fun:any
    

    constructor(protected router: Router,
        protected _route: ActivatedRoute,
        protected baseloader: BaseLoaderService,
        protected mainApiService: MainService,
        protected formbuilder: FormBuilder, protected dialog: MatDialog, private _sanitizer: DomSanitizer) {
        super(mainApiService, dialog);
        this.Form = this.formbuilder.group({
            name: [null, [Validators.required, Validators.maxLength(50)]],
            phone: [null, [Validators.required, Validators.maxLength(100), Validators.minLength(7)]],
            address: [null, [Validators.required]],
            neighborhood: [null],
            description: [null, [Validators.required]],
            // neighborhood: [null, [Validators.required, Validators.maxLength(50)]],
            pin: [null, [Validators.required, Validators.maxLength(4)]],
            timings: [null, [Validators.required, Validators.maxLength(100)]],
            latlng: [null, [Validators.required]],
            SKU: [null],
            emails: [null, [Validators.required]],
            delivery_radius: [null],
            logo: [null],
            // logo_name: [null, [Validators.required]],
            image: [null],
            // image_name: [null, [Validators.required]],
            type: [null],
            special: [null, [Validators.maxLength(50)]],
            search_tags: [null, [Validators.required]],
            delivery_status: [null],
            merchant_id: [null],
            parent_id: [null],
            category_ids: [null, [Validators.required]],
            popular_category_ids: [null],
            collection_ids: [null],
            playlist_id: [null],
            parentObject: ['', Validators.required],
            merchantObject: ['', Validators.required],
            pending_emails_body: ['',],
            menu_card: ['',],
            pdf_file: [''],
            file_type: [''],
            foodanddrinks_tags: [''],
            cuisine_tags: [''],
            beautyandhealth_tags: [''],
            attribute_tags: [''],
            funandleisure_tags: [''],
            retailandservices_tags: [''],
            

        });

        this.isLoading = false;
        this.isEditing = false;
        // this.outletsJSON = '';
        this.Offers = [];
        this.Merchants = [];
        this.Parents = [];
        this.errorMessageForCSV = 'Invalid CSV File. <br>';
        this.isGenderDisabled = true;
        this.methodOfCsv = 'addOutlets';

        this.Form.valueChanges.subscribe(response => {
            if (response.category_ids != null) {
                if (response.category_ids.includes('64')) {
                    this.isGenderDisabled = false;
                }
                else {
                    this.isGenderDisabled = true;
                }
            }

            if (this.Form.valid) {
                this.onFormChanges.emit(this.Form);
            }
            else {
                this.onFormChanges.emit(false);
            }
        });

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
       
        // this.baseloader.outletImage.subscribe(res =>{
        //     this.imageUpdate = res;
        // })
        // this.baseloader.outletfile.subscribe(result => {
        //     this.ImageFormPicture= result;
        //     console.log(result);
        // })
        // this.menudata = this.baseloader.menudata;

        this.imageExist = false;
    }

    equals(objOne: any, objTwo: any) {
        if (typeof objOne != 'undefined' && typeof objTwo != 'undefined') {
            return objOne.id == objTwo.id;
        }
        return;
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (this.parent_key != void 0 && this.Form.valid) {
            this.Form.get('merchant_id')?.setValue(this.parent_key);
            this.Form.get('merchantObject')?.setValue(this.parent_key);
            this.doSubmit();
        }

    }

    // getSelected(event: MatSelectChange, category:string): void {
    //     if(category == 'food'){
    //         event.value.forEach((x) => {
    //             this.food += x + ','
    //         })
    //     }
    //     console.log('food', this.food)

    //     if(category == 'fun')[
    //         this.fun = event.value
    //     ]
    //     console.log('fun', this.fun)
    //   }

    ngOnInit() {

        if (this.is_child == false) {
            this.Form.get('merchantObject')?.valueChanges.subscribe(response => {
                if (response == null) {
                    return
                }
                if (typeof response != 'object') {
                    this.Form.get('merchantObject')?.setErrors(Validators.requiredTrue);
                }
                else {
                    this.Form.get('merchant_id')?.setValue(response.id);
                }
            })

            this.filteredOptions = this.Form.get('merchantObject')!.valueChanges.pipe(
                startWith<any>(''),
                map(value => typeof value == 'string' ? value : value.name),
                map(name => name ? this._filter(name) : this.Merchants.slice())
            );
            // Parent Data

            this.Form.get('parentObject')?.valueChanges.subscribe(response => {
                if (response == null) {
                    return
                }
                if (typeof response != 'object') {
                    this.Form.get('parentObject')?.setErrors(Validators.requiredTrue);
                }
                else {
                    this.Form.get('parent_id')?.setValue(response.id);
                }
            })

            this.filteredParentOptions = this.Form.get('parentObject')!.valueChanges.pipe(
                startWith<any>(''),
                map(value => typeof value == 'string' ? value : value.name),
                map(name => name ? this._filterParent(name) : this.Parents.slice())
            );

            this.sub = this._route.params.subscribe(params => {
                this.id = params['id'];
                this.gerOutletsList(this.id);
                if (this.id != 'add') {
                    this.Form.addControl('id', new FormControl(this.id));
                    let abc = localStorage.getItem('Outlet') as string;
                    this.outlet = JSON.parse(abc);
                    this.Form.patchValue(this.outlet);
                        this.Form.addControl('image', new FormControl(this.imageLoad));
                    // if (this.Outlets.outletMenu[0].type == 'pdf') {
                    //     this.pdftext = true;
                    //     this.urltext = false;
                    //     this.imagetext = false;
                    // }
                    // else if (this.Outlets.outletMenu[0].type == 'link') {
                    //     this.urltext = true;
                    //     this.pdftext = false;
                    //     this.imagetext = false;
                    // }
                    // else if (this.Outlets.outletMenu[0].type == 'image') {
                    //     this.imagetext = true;
                    //     this.pdftext = false;
                    //     this.urltext = false;
                    // }
                    // else { }
                    // if(this.imageUpdate)
                    // {
                    //     console.log((localStorage.getItem('OutletImage')));
                    //     this.imageLoad = (localStorage.getItem('OutletImage'));
                    //   console.log(this.imageLoad);
                    //     this.Form.get('image').patchValue(this.ImageFormPicture);
                        
                    // }
                    // else{
                    //         localStorage.removeItem("OutletImage");
                    //     }
                    
                    // this.Form.get('image').patchValue( 'data:image/jpg;base64,' + localStorage.getItem('OutletImage'));
                    let fooddrinks="";
                    if(this.outlet.foodanddrinks_tags)
                    {
                        this.fooddrinks = this.outlet.foodanddrinks_tags;
                        this.fooddrinks.forEach(element => {
                            fooddrinks += element.id + ','
                        });
                        console.log('Food List:',this.fooddrinks.map((x) => x.id));
                        console.log('food string:',fooddrinks);
                    }
                    this.Form.get('foodanddrinks_tags')?.setValue(this.fooddrinks.map((x) => x.id));

                    let cuisine="";
                    if(this.outlet.cuisine_tags)
                    {
                        this.cuisine = this.outlet.cuisine_tags;
                        this.cuisine.forEach(element => {
                            cuisine += element.id + ','
                        });
                        console.log('cuisine List:',this.cuisine);
                        console.log('cuisine string:',cuisine);
                    }
                    this.Form.get('cuisine_tags')?.setValue(this.cuisine.map((x) => x.id));

                    let beauty="";
                    if(this.outlet.beautyandhealth_tags)
                    {
                        this.beauty = this.outlet.beautyandhealth_tags;
                        this.beauty.forEach(element => {
                            beauty += element.id + ','
                        });
                        console.log('beauty List:',this.beauty);
                        console.log('beauty string:',beauty);
                    }
                    this.Form.get('beautyandhealth_tags')?.setValue(this.beauty.map((x) => x.id));

                    let attribute="";
                    if(this.outlet.attribute_tags)
                    {
                        this.attribute = this.outlet.attribute_tags;
                        this.attribute.forEach(element => {
                            attribute += element.id + ','
                        });
                        console.log('attribute List:',this.attribute);
                        console.log('attribute string:',attribute);
                    }
                    this.Form.get('attribute_tags')?.setValue(this.attribute.map((x) => x.id));

                    let funLeisure="";
                    if(this.outlet.funandleisure_tags)
                    {
                        this.funLeisure = this.outlet.funandleisure_tags;
                        this.funLeisure.forEach(element => {
                            funLeisure += element.id + ','
                        });
                        console.log('funLeisure List:',this.funLeisure);
                        console.log('funLeisure string:',funLeisure);
                    }
                    this.Form.get('funandleisure_tags')?.setValue(this.funLeisure.map((x) => x.id));

                    let retailServices="";
                    if(this.outlet.retailandservices_tags)
                    {
                        this.retailServices = this.outlet.retailandservices_tags;
                        this.beauty.forEach(element => {
                            beauty += element.id + ','
                        });
                        console.log('retailServices List:',this.retailServices);
                        console.log('retailServices string:',retailServices);
                    }
                    this.Form.get('retailandservices_tags')?.setValue(this.retailServices.map((x) => x.id));

                    let cart: any;
                    if (this.outlet.category_ids) {
                        cart = this.outlet.category_ids.split(',');

                    }
                    this.Form.get('category_ids')?.setValue(cart);
                    let pcart: any;

                    if (this.outlet.popular_category_ids) {
                        pcart = this.outlet.popular_category_ids.split(',');

                    }
                    this.Form.get('popular_category_ids')?.setValue(pcart);

                    let collect_ids: any;
                    if (this.outlet.collection_ids) {
                        collect_ids = this.outlet.collection_ids.split(',');

                    }
                    this.Form.get('collection_ids')?.setValue(collect_ids);

                    this.isEditing = true;

                    this.Form.get('merchantObject')?.setValue({
                        id: this.outlet.merchant_id, name: this.outlet.merchant_name
                    });

                    // this.Form.get('parentObject').setValue({
                    //     id: this.outlet.outletParent.id, name: this.outlet.outletParent.name
                    // })
                    if (this.outlet.outlets_parents) {
                        this.Form.get('parentObject')?.setValue({
                            id: this.outlet.outlets_parents.id, name: this.outlet.outlets_parents.name
                        })
                        this.search = this.outlet.outlets_parents.name;
                    }

                    this.Form.get('latlng')?.setValue(this.outlet.latitude + ',' + this.outlet.longitude);
                    
                    let formTest =   JSON.parse(localStorage.getItem('outletForm') as string);
                    console.log(formTest);
                      if(formTest !== null){
                      let xyz = (JSON.parse(localStorage.getItem('outletForm') as string));
                      this.Form.patchValue(xyz);
                      localStorage.removeItem('outletForm');
                         }
                }
                else {
                    this.isEditing = false;
                    this.Form.reset();
                  let formTest =   JSON.parse(localStorage.getItem('outletForm') as string);
                  console.log(formTest);
                    if(formTest !== null){
                    let xyz = (JSON.parse(localStorage.getItem('outletForm') as string));
                    this.Form.patchValue(xyz);
                    localStorage.removeItem('outletForm');
                }
                else{
                    this.Form.reset();
                }
            }
            });
            this.gerMerchantsList();
            // this.gerParentsList();

        }
        else {
            if (!this.isMultiple) {
                this.Form.get('merchant_id')?.setValidators(null);
                this.Form.get('merchantObject')?.setValidators(null);
            }
            else {
                this.Form.get('merchant_id')?.setValue(this.parent_key);
                this.Form.get('merchantObject')?.setValue(this.parent_key);
            }
        }

        this.getCategoriesList();
        this.viewPopularCategoryOnly();
        this.viewCollectionOnly();
        this.viewPlaylistOnly();
        this.getOffers();
    }
    // dataURItoBlob(dataURI) {
    //     const byteString = window.atob(dataURI);
    //     const arrayBuffer = new ArrayBuffer(byteString.length);
    //     const int8Array = new Uint8Array(arrayBuffer);
    //     for (let i = 0; i < byteString.length; i++) {
    //       int8Array[i] = byteString.charCodeAt(i);
    //     }
    //     const blob = new Blob([int8Array], { type: 'image/png' });    
    //     return blob;
    //  }

    gerOutletsList(id): void {

        let url = 'getOutletsNew?outlet_id=' + id;

        this.mainApiService.getList(appConfig.base_url_slug + url, this.userAppId, 2)
            .then(result => {
                if (result.status == 200 && result.data) {
                    this.Outlets = result.data.outlets[0];
                    result.data.outlets.forEach(element => {
                        this.menudatatype = element.outletMenu[0]?.type;
                        console.log("first one: ", element.outletImages[0]);
                        this.imageLoad = element.outletImages[0]?.file;
                        if(this.imageLoad)
                        {
                            this.imageExist = true;
                        }
                        else{
                            this.imageExist = false;
                        }
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

    onTagAdd(event: any): void {
        this.Form.get('emails')?.setValue(event);
    }

    getValue(name: any) {
        return this.Form.get(name);
    }

    getImage(item: any): any {
        if (this.id != 'add') {
            if(this.outlet[item] !== "null" && this.outlet[item]){
            return this.file_url + this.outlet[item];
            }
        }
        else {
            return '';
        }
    }

    onLocationBack(): void {
        window.history.back();
        // this.baseloader.UpdateOutletImage(false);
    }

    doSubmit(): void {
        // debugger;
        this.isLoading = true;
        let method = '';
        console.log('my form',this.Form.value);
        let formData = new FormData();
        if (this.id == 'add') {
            method = 'addOutlet';
        }
        else {
            formData.append('id', this.Form.get('id')?.value);
            method = 'updateOutlet';
        }

        formData.append('name', this.Form.get('name')?.value);
        formData.append('delivery_status', this.Form.get('delivery_status')?.value);
        formData.append('delivery_radius', this.Form.get('delivery_radius')?.value);
        formData.append('phone', this.Form.get('phone')?.value);
        formData.append('address', this.Form.get('address')?.value);
        formData.append('neighborhood', this.Form.get('neighborhood')?.value);
        formData.append('description', this.Form.get('description')?.value);
        // formData.append('neighborhood', this.Form.get('neighborhood').value);
        formData.append('pin', this.Form.get('pin')?.value);
        formData.append('timings', this.Form.get('timings')?.value);

        formData.append('logo', this.Form.get('logo')?.value);
        formData.append('SKU', this.Form.get('SKU')?.value);
        formData.append('image', this.Form.get('image')?.value);
        if (this.menudata.url) {
            formData.append('menu_card', this.menudata.menu_card);
            formData.append('file_type', this.file_type);
        }
        else {
        }
        if (this.menudata.pdf_file) {
            formData.append('pdf_file', this.menudata.pdf_file);
            formData.append('file_type', this.file_type);
        }
        else {
        }
        if (this.menudata.imagesarray) {
            formData.append('images_count', this.menudata.images_count);            
            formData.append('file_type', this.file_type);
            for( let i =0; i <this.menudata.images_count ; i++){
                formData.append('image_' + [i + 1], this.menudata.imagesarray[i]);
            }
        }
        else {
        }
        // formData.append('logo_name', this.Form.get('logo_name').value);
        // formData.append('image_name', this.Form.get('image_name').value);

        formData.append('type', this.Form.get('type')?.value);
        formData.append('special', this.Form.get('special')?.value);
        formData.append('search_tags', this.Form.get('search_tags')?.value);
        formData.append('merchant_id', this.Form.get('merchant_id')?.value);
        formData.append('parents_id', this.Form.get('parent_id')?.value);
        formData.append('emails', this.Form.get('emails')?.value);
        formData.append('pending_emails_body', this.Form.get('pending_emails_body')?.value);
        // formData.append('collection_id', this.Form.get('collection_id').value);
        formData.append('playlist_id', this.Form.get('playlist_id')?.value);
        if (this.Form.get('latlng')?.value != null || this.Form.get('latlng')?.value != '') {
            let latlng = this.Form.get('latlng')?.value.split(',')
            formData.append('latitude', latlng[0]);
            formData.append('longitude', latlng[1]);
        }

        let cat_ids = this.Form.get('category_ids')?.value.join();
        formData.append('category_ids', cat_ids);

        if (this.Form.get('popular_category_ids')?.value != null) {
            this.pcat_ids = this.Form.get('popular_category_ids')?.value.join();
            formData.append('popular_category_ids', this.pcat_ids);
        }
        else {
            formData.append('popular_category_ids', "");
        }
        if (this.Form.get('collection_ids')?.value != null) {
            this.collect_ids = this.Form.get('collection_ids')?.value.join();
            formData.append('collection_ids', this.collect_ids);
        }
        else {
            formData.append('collection_ids', "");
        }

        // new logic
        let food = []
        if(this.Form.get('foodanddrinks_tags')?.value != undefined && this.Form.get('foodanddrinks_tags')?.value != '')
        {
            food = this.Form.value['foodanddrinks_tags']
        }
        let cuisine= []
        if(this.Form.get('cuisine_tags')?.value != undefined && this.Form.get('cuisine_tags')?.value != '')
        {
            cuisine = this.Form.get('cuisine_tags')?.value
        }
        let beautyandhealth=[]
        if(this.Form.get('beautyandhealth_tags')?.value != undefined && this.Form.get('beautyandhealth_tags')?.value != '')
        {
            beautyandhealth = this.Form.get('beautyandhealth_tags')?.value
        }
        let attribute=[]
        if(this.Form.get('attribute_tags')?.value != undefined && this.Form.get('attribute_tags')?.value != '')
        {
            attribute = this.Form.get('attribute_tags')?.value
        }
        let funandleisure=[]
        if(this.Form.get('funandleisure_tags')?.value != undefined && this.Form.get('funandleisure_tags')?.value != '')
        {
            funandleisure = this.Form.get('funandleisure_tags')?.value
        }
        let retailandservices=[]
        if(this.Form.get('retailandservices_tags')?.value != undefined && this.Form.get('retailandservices_tags')?.value != '')
        {
            retailandservices = this.Form.get('retailandservices_tags')?.value
        }

        let tags: Array<any> = [].concat.apply([], [food, cuisine, beautyandhealth, attribute, funandleisure, retailandservices]);

        let tags_id = ""
        tags.forEach((x) => {
            tags_id += x + ','
        })

        tags_id = tags_id.replace(/,\s*$/, "");

        formData.append('tags', tags_id);
        // formData.append('cuisine_tags', this.Form.get('cuisine_tags')?.value);
        // formData.append('beautyandhealth_tags', this.Form.get('beautyandhealth_tags')?.value);
        // formData.append('attribute_tags', this.Form.get('attribute_tags')?.value);
        // formData.append('funandleisure_tags', this.Form.get('funandleisure_tags').value);
        // formData.append('retailandservices_tags', this.Form.get('retailandservices_tags').value)

        // console.log('formdata....', )
        this.mainApiService.postFormData(appConfig.base_url_slug + method, formData).then(response => {
            if (response.status == 200 || response.status == 201) {

                if (this.is_child == false) {
                    this.router.navigateByUrl('/main/outlets');
                }
                else {
                    if (this.isMultiple) {
                        this.onOutletSuccess.emit(this.Form.value);
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

    getCategoriesList(): void {
        this.mainApiService.getList(appConfig.base_url_slug + 'getCategories' + '?per_page=500', false)
            .then(result => {
                if (result.status == 200 && result.data) {
                    this.Categories = result.data.categories;
                    // console.log("cat", this.Categories)
                }
                else {
                    this.Categories = [];
                }
            });
    }
    viewPopularCategoryOnly(): void {
        this.mainApiService.getList(appConfig.base_url_slug + 'viewPopularCategoryOnly' + '?per_page=500', false, 2)
            .then(result => {
                if (result.status == 200 && result.data) {
                    this.PopularCategories = result.data;
                    // console.log("pop cat",this.PopularCategories)
                    this.PopularCategories.forEach(element => {
                        element.id = element.id.toString();
                    });
                }
                else {
                    this.PopularCategories = [];
                }
            });
    }
    viewCollectionOnly(): void {
        let x = 'no'
        let url = 'viewCollectionOnly?for_delivery=' + x + '&per_page=500';
        this.mainApiService.getList(appConfig.base_url_slug + url, false, 2)
            .then(result => {
                if (result.status == 200 && result.data) {
                    this.CollectionOnly = result.data;
                    this.CollectionOnly.forEach(element => {
                        element.id = element.id.toString();
                    });
                }
                else {
                    this.CollectionOnly = [];
                }
            });
    }
    viewPlaylistOnly(): void {
        this.mainApiService.getList(appConfig.base_url_slug + 'viewPlaylistOnly' + '?per_page=500', false, 2)
            .then(result => {
                if (result.status == 200 && result.data) {
                    this.PlaylistOnly = result.data;
                    this.PlaylistOnly.forEach((element: any) => {
                        element.id = element.id.toString();
                    });
                }
                else {
                    this.PlaylistOnly = [];
                }
            });
    }


    gerMerchantsList(): void {
        let url = 'getAllMerchants';

        this.mainApiService.getList(appConfig.base_url_slug + url).then(result => {
            if (result.status == 200 && result.data) {
                // this.Outlets = result.data;

                result.data.forEach((element: any) => {
                    if (element.id != null && element.name != null) {
                        this.Merchants.push(element);
                    }
                });

                this.filteredOptions = this.Form.get('merchantObject')!.valueChanges.pipe(
                    startWith<any>(''),
                    map(value => typeof value == 'string' ? value : value.name),
                    map(name => name ? this._filter(name) : this.Merchants.slice())
                );
            }
            else {
                this.Merchants = [];
                this.filteredOptions = this.Form.get('merchantObject')!.valueChanges.pipe(
                    startWith<any>(''),
                    map(value => typeof value == 'string' ? value : value.name),
                    map(name => name ? this._filter(name) : this.Merchants.slice())
                );
            }
        });
    }

    onSearchParentOutlets(): void {
        clearTimeout(this.searchTimer);
        this.searchTimer = setTimeout(() => {

            this.gerParentsList();

        }, 700);

    }

    gerParentsList(): void {
        this.Parents = [];
        let url = 'getParents' + '?index2=100';
        if (this.Form.get('parentObject')?.value != '') {
            url = url + '&search=' + this.Form.get('parentObject')?.value;
        }

        this.mainApiService.getList(appConfig.base_url_slug + url).then(result => {
            if (result.status == 200 && result.data) {
                // this.Outlets = result.data;

                result.data.parents.forEach((element: any) => {
                    if (element.id != null && element.name != null) {
                        this.Parents.push(element);
                    }
                });

                this.filteredParentOptions = this.Form.get('parentObject')!.valueChanges.pipe(
                    startWith<any>(''),
                    map(value => typeof value == 'string' ? value : value.name),
                    map(name => name ? this._filterParent(name) : this.Parents.slice())
                );
            }
            else {
                this.Parents = [];
                this.filteredParentOptions = this.Form.get('parentObject')!.valueChanges.pipe(
                    startWith<any>(''),
                    map(value => typeof value == 'string' ? value : value.name),
                    map(name => name ? this._filterParent(name) : this.Parents.slice())
                );
            }
        });
    }

    displayFn(user?: any): string {
        return user ? user.name : undefined;
    }

    private _filter(name: string): any[] {
        const filterValue = name.toLowerCase();
        return this.Merchants.filter(option => option.name.toLowerCase().indexOf(filterValue) == 0);
    }

    displayFnParent(user?: any): string {
        return user ? user.name : undefined;
    }

    private _filterParent(name: string): any[] {
        const filterValue = name.toLowerCase();
        return this.Parents.filter(option => option.name.toLowerCase().indexOf(filterValue) == 0);
    }

    onFileSelect(event: any) {
        if (event.controlName == 'logo') {
            if (event.valid) {
                this.Form.get(event.controlName)?.patchValue(event.file);
                this.errorMsglogo = '';
            }
            else {
                this.errorMsglogo = 'Please select square logo'
            }
        }
        if (event.controlName == 'image') {
            // if (event.valid) {
            //     this.Form.get(event.controlName)?.patchValue(event.file);
            //     this.errorMsgimage = '';
            //     this.baseloader.UpdateOutletImage(true);
            //     this.baseloader.updateFileImage(event.file);
            //     if(this.Form.get(event.controlName).value !== '')
            //     {
            //         console.log(event.file);
            //         var reader = new FileReader();
            //             reader.onload = (event: any) => {
            //                 localStorage.setItem("OutletImage", event.target.result);

            //             }
            //             reader.readAsDataURL(event.file);
                    
            //         var check =(localStorage.getItem("OutletImage"));
            //         console.log(check);

            //         this.router.navigateByUrl('main/outletImage/' + this.id + '/' + event.controlName);
            //     }
            // }
            // else {
            //     this.baseloader.UpdateOutletImage(false);
            //     this.errorMsgimage = 'Please select square image'
            // }
            
        }
    } 

    onImageSelect(){
        localStorage.setItem('outletForm', JSON.stringify(this.Form.value));
        this.router.navigateByUrl('main/outletImage/' + this.id + '/' + 'image');
    }
    onGetLocation(): void {
        let dialogRef = this.dialog.open(GetLocationDialog, { autoFocus: false });
        if (this.Form.get('latitude')?.value != null && this.Form.get('longitude')?.value != null) {
            dialogRef.componentInstance.initialLocation = this.Form.get('latitude')?.value + ',' + this.Form.get('longitude')?.value;
        }

        dialogRef.afterClosed().subscribe(result => {
            // log here(result);
            if (result) {
                this.Form.get('latitude')?.setValue(result.lat);
                this.Form.get('longitude')?.setValue(result.lng);
                this.Form.get('address')?.setValue(result.formatted_address);
            }
        })
    }

    getOffers(): void {
        if (this.isEditing == false) {
            return;
        }
        this.mainApiService.getList(appConfig.base_url_slug + 'getOffers?outlet_id=' + this.outlet.id)
            .then(result => {
                if (result.status == 200 && result.data) {
                    // this.Offers = result.data.offers;

                    let Offers: any = result.data.offers;

                    Offers.forEach((element: any) => {
                        if (element.active == 1) {
                            element['slide'] = true;
                        }
                        else if (element.active == 0) {
                            element['slide'] = false;
                        }
                    });
                    // log here('dsdsd')
                    this.Offers = Offers;
                }
                else {
                    this.Offers = [];
                }
            });
    }

    onDealNameClick(deal: any): void {
        localStorage.setItem('Deal', JSON.stringify(deal));
        this.router.navigateByUrl('main/deals/' + deal.id);
    }

    onChangeDealStatus(deal: any): void {
        let active: any;
        if (deal.slide) {
            active = 1;
        }
        else {
            active = 0;
        }
        let Data = {
            id: deal.id,
            active: active
        };

        let dialogRef = this.dialog.open(AlertDialog, { autoFocus: false });
        let cm = dialogRef.componentInstance;
        cm.heading = 'Change Deal';
        cm.message = 'Are you sure to Update Deal';
        cm.submitButtonText = 'Yes';
        cm.cancelButtonText = 'No';
        cm.type = 'ask';
        cm.methodName = appConfig.base_url_slug + 'ADOffer';
        cm.dataToSubmit = Data;
        cm.showLoading = true;

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.getOffers();
            }
            else {
                this.status = !this.status;
            }
        })
    }

    afterSelectionCsv(result: any, headersObj: any, objTemp: any): void {
        // console.log(result);
        for (let key in headersObj) {
            if (!headersObj.hasOwnProperty('merchant_id') && !objTemp.hasOwnProperty('merchant_id')) {
                objTemp['merchant_id'] = null;
                this.errorMessageForCSV = this.errorMessageForCSV + '<b>merchant_id</b> is missing,<br> ';
                this.errorCounter++;
            }
            //adding header object which is shown on the top of the list
            if (!headersObj.hasOwnProperty('parents_id') && !objTemp.hasOwnProperty('parents_id')) {
                objTemp['parents_id'] = null;
                this.errorMessageForCSV = this.errorMessageForCSV + '<b>parents_id</b> is missing,<br> ';
                this.errorCounter++;
            }
            else if (!headersObj.hasOwnProperty('category_ids') && !objTemp.hasOwnProperty('category_ids')) {
                objTemp['category_ids'] = null;
                this.errorMessageForCSV = this.errorMessageForCSV + '<b>category_ids</b> is missing,<br> ';
                this.errorCounter++;
            }
            else if (!headersObj.hasOwnProperty('logo_name') && !objTemp.hasOwnProperty('logo_name')) {
                objTemp['logo_name'] = null;
                this.errorMessageForCSV = this.errorMessageForCSV + '<b>logo_name</b> is missing,<br> ';
                this.errorCounter++;
            }
            else if (!headersObj.hasOwnProperty('image_name') && !objTemp.hasOwnProperty('image_name')) {
                objTemp['image_name'] = null;
                this.errorMessageForCSV = this.errorMessageForCSV + '<b>image_name</b> is missing,<br> ';
                this.errorCounter++;
            }
            else if (!headersObj.hasOwnProperty('name') && !objTemp.hasOwnProperty('name')) {
                objTemp['name'] = null;
                this.errorMessageForCSV = this.errorMessageForCSV + '<b>name</b> is missing,<br> ';
                this.errorCounter++;
            }
            else if (!headersObj.hasOwnProperty('phone') && !objTemp.hasOwnProperty('phone')) {
                objTemp['phone'] = null;
                this.errorMessageForCSV = this.errorMessageForCSV + '<b>phone</b> is missing,<br> ';
                this.errorCounter++;
            }
            else if (!headersObj.hasOwnProperty('address') && !objTemp.hasOwnProperty('address')) {
                objTemp['address'] = null;
                this.errorMessageForCSV = this.errorMessageForCSV + '<b>address</b> is missing,<br> ';
                this.errorCounter++;
            }
            else if (!headersObj.hasOwnProperty('description') && !objTemp.hasOwnProperty('description')) {
                objTemp['description'] = null;
                this.errorMessageForCSV = this.errorMessageForCSV + '<b>description</b> is missing,<br> ';
                this.errorCounter++;
            }
            else if (!headersObj.hasOwnProperty('timings') && !objTemp.hasOwnProperty('timings')) {
                objTemp['timings'] = null;
                this.errorMessageForCSV = this.errorMessageForCSV + '<b>timings</b> is missing,<br> ';
                this.errorCounter++;
            }
            else if (!headersObj.hasOwnProperty('latitude') && !objTemp.hasOwnProperty('latitude')) {
                objTemp['latitude'] = null;
                this.errorMessageForCSV = this.errorMessageForCSV + '<b>latitude</b> is missing,<br> ';
                this.errorCounter++;
            }
            else if (!headersObj.hasOwnProperty('longitude') && !objTemp.hasOwnProperty('longitude')) {
                objTemp['longitude'] = null;
                this.errorMessageForCSV = this.errorMessageForCSV + '<b>longitude</b> is missing,<br> ';
                this.errorCounter++;
            }
            else if (!headersObj.hasOwnProperty('pin') && !objTemp.hasOwnProperty('pin')) {
                objTemp['pin'] = null;
                this.errorMessageForCSV = this.errorMessageForCSV + '<b>pin</b> is missing,<br> ';
                this.errorCounter++;
            }
            else if (!headersObj.hasOwnProperty('search_tags') && !objTemp.hasOwnProperty('search_tags')) {
                objTemp['search_tags'] = null;
                this.errorMessageForCSV = this.errorMessageForCSV + '<b>search_tags</b> is missing,<br> ';
                this.errorCounter++;
            }
            else if (!headersObj.hasOwnProperty('special') && !objTemp.hasOwnProperty('special')) {
                objTemp['special'] = null;
                this.errorMessageForCSV = this.errorMessageForCSV + '<b>special</b> is missing,<br> ';
                this.errorCounter++;
            }
            else if (!headersObj.hasOwnProperty('emails') && !objTemp.hasOwnProperty('emails')) {
                objTemp['emails'] = null;
                this.errorMessageForCSV = this.errorMessageForCSV + '<b>emails</b> is missing,<br> ';
                this.errorCounter++;
            }

            if (headersObj.hasOwnProperty('category_ids')) {
                if (!headersObj.hasOwnProperty('type') && !objTemp.hasOwnProperty('type')) {
                    objTemp['type'] = null;
                    this.errorMessageForCSV = this.errorMessageForCSV + '<b>type</b> is missing,<br> ';
                    this.errorCounter++;
                }
            }
        }

        if (this.errorCounter == 0) {
            result.forEach((element: any, index: any) => {
                if (element['merchant_id'] == null || element['merchant_id'] == '') {
                    this.errorMessageForCSV = this.errorMessageForCSV + '<b>merchant_id</b> is empty on line number ' + (index + 1) + ',<br> ';
                    this.errorCounter++;
                }

                // adding parent outlet id
                if (element['parents_id'] == null || element['parents_id'] == '') {
                    this.errorMessageForCSV = this.errorMessageForCSV + '<b>parents_id</b> is empty on line number ' + (index + 1) + ',<br> ';
                    this.errorCounter++;
                }
                if (element['logo_name'] == null || element['logo_name'] == '') {
                    this.errorMessageForCSV = this.errorMessageForCSV + '<b>logo_name</b> is empty on line number ' + (index + 1) + ',<br> ';
                    this.errorCounter++;
                }
                if (element['image_name'] == null || element['image_name'] == '') {
                    this.errorMessageForCSV = this.errorMessageForCSV + '<b>image_name</b> is empty on line number ' + (index + 1) + ',<br> ';
                    this.errorCounter++;
                }
                if (element['name'] == null || element['name'] == '') {
                    this.errorMessageForCSV = this.errorMessageForCSV + '<b>name</b> is empty on line number ' + (index + 1) + ',<br> ';
                    this.errorCounter++;
                }
                if (element['phone'] == null || element['phone'] == '') {
                    this.errorMessageForCSV = this.errorMessageForCSV + '<b>phone</b> is empty on line number ' + (index + 1) + ',<br> ';
                    this.errorCounter++;
                }
                if (element['address'] == null || element['address'] == '') {
                    this.errorMessageForCSV = this.errorMessageForCSV + '<b>address</b> is empty on line number ' + (index + 1) + ',<br> ';
                    this.errorCounter++;
                }
                if (element['description'] == null || element['description'] == '') {
                    this.errorMessageForCSV = this.errorMessageForCSV + '<b>description</b> is empty on line number ' + (index + 1) + ',<br> ';
                    this.errorCounter++;
                }
                if (element['timings'] == null || element['timings'] == '') {
                    this.errorMessageForCSV = this.errorMessageForCSV + '<b>timings</b> is empty on line number ' + (index + 1) + ',<br> ';
                    this.errorCounter++;
                }
                if (element['latitude'] == null || element['latitude'] == '') {
                    this.errorMessageForCSV = this.errorMessageForCSV + '<b>latitude</b> is empty on line number ' + (index + 1) + ',<br> ';
                    this.errorCounter++;
                }
                if (element['longitude'] == null || element['longitude'] == '') {
                    this.errorMessageForCSV = this.errorMessageForCSV + '<b>longitude</b> is empty on line number ' + (index + 1) + ',<br> ';
                    this.errorCounter++;
                }
                if (element['special'] == null || element['special'] == '') {
                    this.errorMessageForCSV = this.errorMessageForCSV + '<b>special</b> is empty on line number ' + (index + 1) + ',<br> ';
                    this.errorCounter++;
                }

                if (element['pin'] == null || element['pin'] == '') {
                    this.errorMessageForCSV = this.errorMessageForCSV + '<b>pin</b> is empty on line number ' + (index + 1) + ',<br> ';
                    this.errorCounter++;
                }
                if (element['search_tags'] == null || element['search_tags'] == '') {
                    this.errorMessageForCSV = this.errorMessageForCSV + '<b>search_tags</b> is empty on line number ' + (index + 1) + ',<br> ';
                    this.errorCounter++;
                }
                if (element['emails'] != null || element['emails'] != '') {
                    element['emails'] = element['emails'].split(';').join(',');
                }
                if (element['category_ids'] != null || element['category_ids'] != '') {
                    let category_ids = element['category_ids'].split(';');

                    if (category_ids.includes('64')) {
                        if (element['type'] == null || element['type'] == '') {
                            this.errorMessageForCSV = this.errorMessageForCSV + '<b>type</b> is empty on line number ' + (index + 1) + ',<br> ';
                            this.errorCounter++;
                        }
                    }
                    element['category_ids'] = element['category_ids'].split(';').join(',');
                }
                // if(element['popular_category_ids'] != null || element['popular_category_ids'] != '')
                // {
                //     let popular_category_ids = element['popular_category_ids'].split(';');

                //     if(popular_category_ids.includes('64'))
                //     {
                //         if(element['type'] == null || element['type'] == '')
                //         {
                //         	this.errorMessageForCSV = this.errorMessageForCSV + '<b>type</b> is empty on line number ' + (index + 1) + ',<br> ';
                //         	this.errorCounter++;
                //         }
                //     }
                //     element['popular_category_ids'] = element['popular_category_ids'].split(';').join(',');
                // }

            });
        }
        this.afterJSON = result;
    }

    onUploadCSV(): void {
        this.afterSelectionCsv(this.result, this.headersObj, this.objTemp);
        this.JsonToServer = { outlets: JSON.stringify(this.result) };
        // this.JsonToServer = { outlets: "[]" };
        // console.log(this.JsonToServer);
        super.onUploadCSV();
    }

    afterSuccess(): void {
        this.router.navigateByUrl('/main/outlets');
        this.isLoading = false;
    }

    uploadMenuSection(type) {
        localStorage.setItem('outletForm', JSON.stringify(this.Form.value));
        this.router.navigateByUrl('main/outlet/' + this.id + '/' + type);
    }
}