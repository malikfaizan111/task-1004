import {Component, OnInit} from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MainService } from 'src/app/services';

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

    constructor(protected mainService: MainService,protected dialogRef: MatDialogRef<assignDialog>, protected dialog: MatDialog)
    {

    }

    ngOnInit(): void {
        
    }

    onCancelClick(): void {
		this.dialogRef.close(false);
	}
}