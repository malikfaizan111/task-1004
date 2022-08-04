import { OnInit, Component } from "@angular/core";
import { MatDialogRef, MatDialog } from "@angular/material/dialog";
import { MainService } from "../../services";
import { AlertDialog } from "../../lib";
import { Validators, FormBuilder, FormGroup } from "@angular/forms";
import { Observable } from "rxjs";
import { map, startWith } from 'rxjs/operators';

import { appConfig } from "../../../config";


@Component({
	selector: 'assign_parent',
	templateUrl: './assign_parent.dialog.html'
})
export class AssignParentOutletDialog implements OnInit 
{
	isLoading: boolean;
	showLoading: boolean;
    Form: FormGroup;

    OutletID: any;
    Merchants: any[] = [];
	searchTimer: any;
	parentsList: any;
    filteredOptions: Observable<string[]> = new Observable();
	name: any;

	constructor(protected mainApiService: MainService, protected dialogRef: MatDialogRef<AssignParentOutletDialog>, protected dialog: MatDialog, protected formbuilder: FormBuilder ) 
	{
		this.isLoading = false;
        this.showLoading  = false;
        
        this.Form = this.formbuilder.group({
			// parentOutlet: ['', [Validators.required, Validators.maxLength(50)]],
			parent_outlet_id: [''],
			name: [''],
        });
	}

	ngOnInit() 
	{
        
	}

	onCancelClick(): void
	{
		this.dialogRef.close(false);
    }
    
    getValue(name : any) 
    {
        return this.Form.get(name);
    }

	onSubmitClick(): void
	{
        this.isLoading = true;
        let parent = this.Form.get('parent_outlet_id')?.value;
		
        let data = {
            outlet_id: this.OutletID,
            parent_id:parent,
        }

		this.mainApiService.postData(appConfig.base_url_slug + 'addOutletParent', data)
		.then(result => {
			if ((result.status == 200 || result.status == 201)  && result.data) 
			{
				this.dialogRef.close(true);
				this.isLoading = false;
			}
			else 
			{
				this.isLoading = false;
				let dialogRef = this.dialog.open(AlertDialog, { autoFocus: false });
				let cm = dialogRef.componentInstance;
				cm.heading = 'Error';
				cm.message = 'Internal Server Error';
				cm.cancelButtonText = 'Ok';
				cm.type = 'error';
			}
		});
    }
    
	selectEvent(item : any)
	{
		
		if (item)
		{
			
			this.Form.get('name')?.setValue(item.name);
			this.Form.get('parent_outlet_id')?.setValue(item.id);
			
		}
	}

	onCleared(item : any)
	{
		this.name=item;
		this.Form.get('parent_outlet_id')?.setValue(null);
	}

	onChangeSearch(val: string)
	{
		var url = "getParents?search=" + val;

		clearTimeout(this.searchTimer);
		this.searchTimer = setTimeout(() =>
		{
			this.mainApiService.getList(appConfig.base_url_slug + url).then(response =>
			{
				console.log('onChangeSearch', response);

				this.parentsList = response.data.parents;
			})
		}, 700);
	}
}
