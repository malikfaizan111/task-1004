import { OnInit, Component } from "@angular/core";
import { MatDialogRef, MatDialog } from "@angular/material/dialog";

import { FormBuilder, Validators, FormGroup } from "@angular/forms";
import { EligibilityService } from "./eligilibity.service";
import { AlertDialog } from "../../lib";

@Component({
	selector: 'app-check-eligibility',
    templateUrl: './check-eligibility.component.html',
    providers: [EligibilityService]
})
export class CheckEligibilityComponent implements OnInit 
{
	isLoading: boolean;
    Form: FormGroup;

    // {
    //     "msisdn":"97455359163",
    //     "productId": "7207"
    // }

	constructor(protected apiService: EligibilityService,protected dialog: MatDialog, protected formbuilder: FormBuilder, protected dialogRef: MatDialogRef<CheckEligibilityComponent>) 
	{
		this.isLoading = false;
        
        this.Form = this.formbuilder.group({
            phone: [null, [Validators.required, Validators.minLength(7)]],
        });
	}

	ngOnInit() 
	{
		//do nothing
    }
    
    getValue(name : any) 
    {
        return this.Form.get(name);
    }

	onCancelClick(): void
	{
		this.dialogRef.close(false);
	}

	onSubmitClick(): void
	{
		this.apiService.CheckEligibilityComponent(this.Form.value).then(response => {
			if (response.status == 200 || response.status == 201) {
                this.isLoading = false;
                
				// log here(response)
				let dialogRef = this.dialog.open(AlertDialog, { autoFocus: false });
				let cm = dialogRef.componentInstance;
				cm.heading = 'Success';
				cm.message ='This phone number is Eligible.';
				cm.cancelButtonText = 'Ok';
				cm.type = 'success';
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
