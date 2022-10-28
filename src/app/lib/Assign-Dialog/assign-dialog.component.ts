import {Component, OnInit} from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MainService } from 'src/app/services';
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

    constructor(protected mainService: MainService,protected dialogRef: MatDialogRef<assignDialog>, protected dialog: MatDialog)
    {

    }

    ngOnInit(): void {
        
    }

    onCancelClick(): void {
		this.dialogRef.close(true);
	}

    onSubmitClick()
    {
        this.dialogRef.close(true);
        let data = {
            outlets: this.datetoSubmit
        }
        this.mainService.postData(this.methodName, data, this.urlVersion)
            .then(result =>{
                if(result.status == 200 || result.status == 201)
                {
                    this.dialogRef.close(true);
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
}