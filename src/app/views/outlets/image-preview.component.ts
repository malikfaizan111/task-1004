import {Component, Inject} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { appConfig } from 'src/config';

@Component({
    selector:'image-preview',
    templateUrl:'./image-preview.component.html'
})
export class imagePreviewComponent{

    img: any;
    fileurl:any;
    constructor(protected dialogRef: MatDialogRef<imagePreviewComponent>, @Inject(MAT_DIALOG_DATA) public data: any){
        this.img = data.pageValue;
        this.fileurl = appConfig.file_urlV2;
    }

    onClose(){
        this.dialogRef.close();
    }
}