import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
// import { forEach } from 'jszip';
import { Subscription } from 'rxjs';
import { BaseLoaderService, MainService } from 'src/app/services';
import { appConfig } from '../../../config';
import { AlertDialog } from '../../lib';
import { ChangeOutletImageComponent } from '../outlets/change-outlet-image.component';
import { changeParentOutletImageComponent } from './change-parentoutlet-image.component';

@Component({
    selector: 'parent-menu-outlet',
    templateUrl: './parent_menu_outlet.component.html',
    styles : ['']
})
export class parentMenuOutlet{
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
    brandCover: any;
    brandCoverData:any;
    errormesCover: boolean = false;

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
            console.log('cover....', this.type)
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
        else if (this.type == 'coverimages') {
            this.Form.addControl('image', new FormControl(null, [Validators.required]));
            this.Form.addControl('fileImage', new FormControl(null));
        }
        else {

         }
    }

    gerOutletsList(id): void {
        let url = 'getParents?id=' + id;

        this.mainApiService.getList(appConfig.base_url_slug + url)
            .then(result => {
                if (result.status == 200 && result.data) {
                    this.Outlets = result.data.parents[0];
                    console.log('idbase', this.Outlets)
                    result.data.parents.forEach(element => {
                        this.menudata = element.parentOutletMenu;
                        this.brandCoverData = element.parentImages;
                        this.brandCover = element.parentImages[0]?.type;
                        this.menudatatype = element.parentOutletMenu[0]?.type;
                        console.log('wowowowo...', this.menudatatype)
                    });
                    if (this.menudatatype == 'pdf' && this.type == 'pdf') {
                        this.checkPdf = true;
                        this.filename = this.menudata[0].file;
                    }
                    else if (this.menudatatype == 'url' && this.type == 'link') {
                        this.Form.get('menu_card').setValue(this.menudata[0].file);
                    }
                    else if (this.menudatatype == 'image' && this.type == 'image') {
                        this.imagesarray = this.menudata;
                    }
                    else if(this.brandCover == 'image' && this.type == 'coverimages')
                    {
                        this.imagesarray = this.brandCoverData;
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
        }
        if(this.type === 'image' ){
        if (filesAmount > 0 && filesAmount < 11) {
            this.images = [];
            this.errorMsgImages = false;
            this.imagesarray = event.target.files;
        }
        else{
            this.errorMsgImages = true;
        }
    }else{
        if (filesAmount > 0 && filesAmount < 6) {
            this.images = [];
            this.errormesCover = false;
            this.imagesarray = event.target.files;
        }
        else{
            this.errormesCover = true;
        }
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
            if(this.type !== 'coverimages'){
                method = 'updateOutletParentMenu';
            }
            else{
                method = 'updateOutletParentImages';
            }

            if (this.type == 'link') {
                this.Form.get('file_type').setValue('url');
                this.Form.get('id').setValue(this.id);
                this.mainApiService.postData(appConfig.base_url_slug + method, this.Form.value).then(response => {
                    if (response.status == 200 || response.status == 201) {

                        this.router.navigateByUrl('/main/brands/' + this.id);

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
            else if (this.type == 'pdf' || this.type == 'image' || this.type == 'coverimages') {
                let formData = new FormData();
                formData.append('id', this.id);
                if(this.type !== 'coverimages'){
                    formData.append('file_type', this.type);
                }

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
                else if (this.type == 'coverimages') {
                    formData.append('previous_images_remove', 'true');
                    formData.append('images_count', JSON.stringify(this.imagesarray.length));
                    for (let i = 0; i < this.imagesarray.length; i++) {
                        formData.append('image_' + [i + 1], this.imagesarray[i]);
                    }
                }

                this.mainApiService.postFormData(appConfig.base_url_slug + method, formData).then(response => {
                    if (response.status == 200 || response.status == 201) {
                        this.router.navigateByUrl('/main/brands/' + this.id);
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
                this.router.navigateByUrl('/main/brands/' + this.id);
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
                this.router.navigateByUrl('/main/brands/' + this.id);

            }
            else if (this.type == 'coverimages' && this.images.length > 0) {
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
                this.router.navigateByUrl('/main/brands/' + this.id);

            }
            else if (this.type == 'link' && this.Form.get('menu_card').value != null) {
                let data = {
                    type: this.type,
                    menu_card: this.Form.get('menu_card').value,
                }
                this.baseloader.sendMenuToOutlet(data);
                this.router.navigateByUrl('/main/brands/' + this.id);
            }
            else {
            }
        }
    }

    onEditArrangment() {
        if (this.imagesarray.length > 0) {

            let dialogRef = this.dialog.open(changeParentOutletImageComponent, { autoFocus: false, data: { pageValue: this.imagesarray, type: this.type } });
            dialogRef.afterClosed().subscribe(result => {
                if (result) {
                    window.location.reload();
                }
            })
        }
    }
}