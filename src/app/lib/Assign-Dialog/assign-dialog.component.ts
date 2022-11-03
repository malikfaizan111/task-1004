import {Component, OnInit} from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { borderTopRightRadius } from 'html2canvas/dist/types/css/property-descriptors/border-radius';
import { MainService, SharedService } from 'src/app/services';
import { appConfig } from 'src/config';
import { AlertDialog } from '../alert.dialog';


@Component({
    selector: 'app-assign',
    templateUrl: './assign-dialog.component.html',
    styleUrls: ['./assign-dialog.component.scss']
})
export class assignDialog implements OnInit
{

    methodName:any;
    outletsCount:number;
    tagsCount:number;
    urlVersion:number = 2;
    datetoSubmit:any;
    payload:any

    constructor(protected mainService: MainService,protected dialogRef: MatDialogRef<assignDialog>,
         protected dialog: MatDialog,protected sharedService: SharedService,protected router: Router)
    {
        // this.sharedService.selectedProduct$.subscribe((value) => {
        //     this.payload = value
        // })

        let abc = localStorage.getItem('payload') as string
        this.payload = JSON.parse(abc)
        
    }

    ngOnInit(): void {
        
    }

    onCancelClick(): void {
		this.dialogRef.close(true);
	}

    onSubmitClick()
    {

        // let url = 'addOutletCategoryTags'
        // this.dialogRef.close(true);
        // let data = {
        //     outlets: this.datetoSubmit
        // }
        console.log(this.methodName);
        this.mainService.postData(appConfig.base_url_slug +  this.methodName, this.payload, this.urlVersion)
            .then(result =>{
                if(result.status == 200 || result.status == 201)
                {
                    this.dialogRef.close(true);
                    this.router.navigateByUrl('/main/outlets_tags');
                }
                else if(result.status == 400)
                {
                    let dialogRef = this.dialog.open(AlertDialog, {autoFocus: false});
                    let cm = dialogRef.componentInstance;
                    cm.heading = 'Warning';
                    cm.message = result.error.message;
                    cm.cancelButtonText = 'Close';
                    cm.type = 'error';
                }
                else
                {
                    let dialogRef = this.dialog.open(AlertDialog, { autoFocus: false });
					let cm = dialogRef.componentInstance;
					cm.heading = 'Error';
					cm.message = 'Internal Server Error';
					cm.cancelButtonText = 'Ok';
					cm.type = 'error';
                }

            });
    }

    ngOnDestroy(): void {
        localStorage.removeItem('payload')
      }
}