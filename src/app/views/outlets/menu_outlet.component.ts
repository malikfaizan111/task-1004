import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
// import { forEach } from 'jszip';
import { Subscription } from 'rxjs';
import { BaseLoaderService, MainService } from 'src/app/services';
import { ChangeOutletImageComponent } from './change-outlet-image.component';
import { appConfig } from '../../../config';
import { AlertDialog } from '../../lib';

@Component({
    selector: 'menu-outlet',
    templateUrl: './menu_outlet.component.html'

})

export class menuOutletComponent implements OnInit {
    sub: Subscription;
    id: any;
    type: any;
    Form: FormGroup;
    filename: any;
    checkPdf: boolean = false;
    isLoading: boolean;
    outlet: any;
    imagesarray: any [] = [];
    Outlets: any;
    menudatatype: any;
    menudata: any;
    errorMsgImages: boolean = false;

    images: Array<{ name: string, path: string, source: any }> = [];
    constructor(private _route: ActivatedRoute, protected formbuilder: FormBuilder,
        protected dialog: MatDialog,
        protected baseloader: BaseLoaderService,
        protected mainApiService: MainService,
        protected router: Router) {
        this.Form = this.formbuilder.group({
            id: [null],
            file_type: [null],
            // fileSource: new FormControl(null),
            // fileImage: new FormControl(null)
        })
        this.isLoading = false;
    }

    ngOnInit(): void {
        this.sub = this._route.params.subscribe(params => {
            this.id = params['id'];
            this.type = params['type'];
            this.gerOutletsList(this.id);
        });
        if (this.type == 'link') {
            this.Form.addControl('menu_card', new FormControl(null, [Validators.required]));
        }
        else if (this.type == 'pdf') {
            this.Form.addControl('pdf', new FormControl(null, [Validators.required]));
            this.Form.addControl('fileSource', new FormControl(null, [Validators.required]));
        }
        else if (this.type == 'image') {
            this.Form.addControl('image', new FormControl(null, [Validators.required]));
            this.Form.addControl('fileImage', new FormControl(null));
        }
        else { }
        // let abc = localStorage.getItem('Outlet') as string;
        // this.outlet = JSON.parse(abc);
        // if (this.outlet.outletMenu[0].type == 'url' && this.type == 'link') {
        //     this.Form.get('menu_card').setValue(this.outlet.outletMenu[0].file);
        // }
        // else if (this.outlet.outletMenu[0].type == 'pdf' && this.type == 'pdf') {
        //     this.checkPdf = true;
        //     this.filename = this.outlet.outletMenu[0].file;
        // }
        // else if (this.outlet.outletMenu[0].type == 'image' && this.type == 'image') {
        //     this.checkPdf = true;
        //     this.filename = this.outlet.outletMenu[0].file;
        // }
    }

    gerOutletsList(id): void {
        let url = 'getOutlets?outlet_id=' + id;

        this.mainApiService.getList(appConfig.base_url_slug + url)
            .then(result => {
                if (result.status == 200 && result.data) {
                    this.Outlets = result.data.outlets[0];
                    result.data.outlets.forEach(element => {
                        this.menudata = element.outletMenu;
                        this.menudatatype = element.outletMenu[0]?.type;
                    });
                    if (this.menudatatype == 'pdf' && this.type == 'pdf') {
                        this.checkPdf = true;
                        this.filename = this.menudata[0].file;
                    }
                    else if (this.menudatatype == 'url' && this.type == 'link') {
                        this.Form.get('menu_card').setValue(this.menudata[0].file);
                    }
                    else if (this.menudatatype == 'image') {
                        this.imagesarray = this.menudata;
                        // this.Form.get('image').clearValidators();
                        // this.Form.get('image').updateValueAndValidity();
                        // this.Form.get('fileImage').clearValidators();
                        // this.Form.get('fileImage').updateValueAndValidity();
                    }
                    else { }
                }
                else {
                    this.Outlets = [];

                }
            });
    }


    getValue(control: any) {
        return this.Form.get(control);
    }

    onLocationBack() {
        window.history.back();
    }

    onFileChange(event: any) {
        if (event.target.files.length > 0) {
            const file = event.target.files[0];
            this.checkPdf = true;
            this.filename = file.name;
            this.Form.patchValue({
                fileSource: file
            })
        }
    }

    onFileImageChange(event) {
        if (event.target.files && event.target.files[0]) {
            var filesAmount = event.target.files.length;
            // if(this.images.length < 11)
            // {
            // filesAmount = 11 - this.images.length;
            // for (let i = 0; i < 10; i++) {
            //     var reader = new FileReader();
            //     reader.onload = (event2: any) => {
            //         this.images.push({
            //             path: event2.target.result,
            //             name: event.target.files[i].name,
            //             source: event.target.files[i]
            //         });
            //     }
            //     reader.readAsDataURL(event.target.files[i]);
            // }
            // }
        }
        if (filesAmount > 0 && filesAmount < 11) {
            this.images = [];
            this.errorMsgImages = false;
            this.imagesarray = event.target.files;
        }
        else{
            this.errorMsgImages = true;
        }

        if (filesAmount != 0) {
            this.Form.get('image').clearValidators();
            this.Form.get('image').updateValueAndValidity();
            this.Form.get('fileImage').clearValidators();
            this.Form.get('fileImage').updateValueAndValidity();
        }
    }
    doSubmit() {
        let imagesdata = [];
        if (this.id != 'add') {
            this.isLoading = true;
            let method = '';
            method = 'updateOutletMenu';

            if (this.type == 'link') {
                this.Form.get('file_type').setValue('url');
                this.Form.get('id').setValue(this.id);
                this.mainApiService.postData(appConfig.base_url_slug + method, this.Form.value).then(response => {
                    if (response.status == 200 || response.status == 201) {

                        this.router.navigateByUrl('main/outlets/' + this.id);

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
            else if (this.type == 'pdf' || this.type == 'image') {
                let formData = new FormData();
                formData.append('id', this.id);
                formData.append('file_type', this.type);

                if (this.type == 'pdf' && this.Form.get('fileSource').value != null) {
                    formData.append('pdf_file', this.Form.get('fileSource').value);
                }
                else if (this.type == 'image') {
                    formData.append('previous_images_remove', 'true');
                    formData.append('images_count', JSON.stringify(this.imagesarray.length));
                    for (let i = 0; i < this.imagesarray.length; i++) {
                        formData.append('image_' + [i + 1], this.imagesarray[i]);
                    }
                }

                this.mainApiService.postFormData(appConfig.base_url_slug + method, formData).then(response => {
                    if (response.status == 200 || response.status == 201) {
                        this.router.navigateByUrl('main/outlets/' + this.id);
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
        }
        else {
            if (this.type == 'pdf' && this.Form.get('fileSource').value != null) {
                let data = {
                    type: 'pdf',
                    pdf_file: this.Form.get('fileSource').value,
                }
                this.baseloader.sendMenuToOutlet(data);
                this.router.navigateByUrl('main/outlets/' + this.id);
                // console.log(this.Form.get('fileSource').value);

            }
            else if (this.type == 'image' && this.images.length > 0) {
                for (let i = 0; i < this.images.length; i++) {
                    imagesdata[i] = this.imagesarray[i];
                }
                let data = {
                    type: 'image',
                    previous_images_remove: 'true',
                    images_count: JSON.stringify(this.images.length),
                    imagesarray: imagesdata,
                }
                this.baseloader.sendMenuToOutlet(data);
                this.router.navigateByUrl('main/outlets/' + this.id);

            }
            else if (this.type == 'link' && this.Form.get('menu_card').value != null) {
                let data = {
                    type: this.type,
                    menu_card: this.Form.get('menu_card').value,
                }
                this.baseloader.sendMenuToOutlet(data);
                this.router.navigateByUrl('main/outlets/' + this.id);
            }
            else {
            }
        }
    }

    onEditArrangment() {
        if (this.imagesarray.length > 0) {

            let dialogRef = this.dialog.open(ChangeOutletImageComponent, { autoFocus: false, data: { pageValue: this.imagesarray } });
            dialogRef.afterClosed().subscribe(result => {
                if (result) {
                    window.location.reload();
                }
            })
        }
    }
}