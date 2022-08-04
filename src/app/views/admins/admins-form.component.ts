import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { MainService } from '../../services';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { AlertDialog } from '../../lib';
import { MatDialog } from '@angular/material/dialog';
import { appConfig } from '../../../config';

@Component({
	selector: 'app-admins-form',
	templateUrl: './admins-form.component.html'
})
export class AdminsFormComponent implements OnInit 
{
	id: any;
	// type: any;
	sub: Subscription = new Subscription();
	Form: FormGroup;
	isLoading: boolean;
	isEditing: boolean;
	admin: any;
	role: any;
	
	constructor(protected router: Router,
		protected _route: ActivatedRoute,
		protected mainApiService: MainService,
		protected formbuilder: FormBuilder, protected dialog: MatDialog)	
	{
		this.Form = this.formbuilder.group({
			name: [null, [Validators.required, Validators.maxLength(50)]],
			email: [null, [Validators.required, Validators.email, Validators.maxLength(50)]],
			phone: [null, [Validators.required, Validators.maxLength(20), Validators.minLength(7)]],
			role: [null, [Validators.required]],
		});

		this.isLoading = false;
		this.isEditing = false;
	}

	ngOnInit() 
	{
		this.sub = this._route.params.subscribe(params => {
			this.id = params['id'];
				if (this.id != 'add') 
				{
					this.isEditing = true;
					this.Form.addControl('id', new FormControl(this.id));
					this.Form.addControl('password', new FormControl(null));
					this.Form.addControl('role', new FormControl(this.role));
					let abc = localStorage.getItem('Admin') as string;
					this.admin = JSON.parse(abc);
					this.Form.patchValue(this.admin);

					this.Form.get('password')?.valueChanges.subscribe(response => {
						if((response.length != 0 && response.length < 6) || response.length > 50)
						{
							this.Form.get('password')?.setErrors(Validators.required);
						}
						if (response.length == 0)
						{
							this.Form.get('password')?.setErrors(null);
						}
					})
				}
				else 
				{
					this.Form.addControl('password', new FormControl(null, [Validators.required, Validators.minLength(6), Validators.maxLength(50)]));
					this.isEditing = false;
					this.Form.reset();
					localStorage.removeItem('Admin');
				}
			// log here(params);
		});

	}

	getValue(name : any) 
    { 
        return this.Form.get(name); 
	}

	onLocationBack(): void
	{
		window.history.back();
	}

	doSubmit(): void 
	{
		this.isLoading = true;
		let method = '';
		
		if (this.id == 'add') 
		{
			method = 'addAdmin';
		}
		else 
		{
			method = 'updateAdmin';
		}

		this.mainApiService.postData(appConfig.base_url_slug +method, this.Form.value).then(response => {
			if (response.status == 200 || response.status == 201) 
			{
				this.router.navigateByUrl('/main/team' );
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

}
