import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';

@Component({
	selector: 'app-reset-password',
	templateUrl: './reset-password.component.html',
	styleUrls: ['../auth.css']
})
export class ResetPasswordComponent implements OnInit {
	token: any;
	type: any;
	failureAlert = false;
	alertMsg = "";
	Form: FormGroup;
	showSuccess: boolean;

	constructor(private router: Router, private authService: AuthService, protected formbuilder: FormBuilder) {
		this.Form = this.formbuilder.group({
			password: [null, [Validators.required]],
			confirm_password: [null, [Validators.required]],
			type: [null],
            password_reset_token: [null]
		});
		this.showSuccess = false;
	}

	closealert() 
	{
	
	}

	ngOnInit()
	{

		let url = this.router.url;
		let urlparts = url.split('?')
		let vals = urlparts[1].split('&')

		vals.forEach((element, index) => 
		{
			let item = element.split('=');
			if(index == 0)
			{
				this.token = item[1]
			}
			else if(index == 1)
			{
				this.type = item[1]
			}
		});

		this.Form.get('password_reset_token')?.setValue(this.token);
		this.Form.get('type')?.setValue(this.type);
	}

	get password() 
	{
		return this.Form.get('password');
	}

	get confirm_password() 
	{
		return this.Form.get('confirm_password');
	}

	doSubmit() 
	{
		this.failureAlert = false;

		if(this.Form.get('password_reset_token')?.value == null || this.Form.get('password_reset_token')?.value == null)
		{
			this.failureAlert = true;
            this.alertMsg = "Token is expired.";
			return;
		}
		this.authService.resetPassword(this.Form.value).then(response => 
		{
			if (response.status == 200) 
            {
				// log here(response);
				if(this.type == 'user')
				{
					this.showSuccess = true;
				}
				else
				{
					this.router.navigateByUrl('/auth/login');
				}
               
            }
            else 
            {
				// log here('else',response);
				// this.router.navigateByUrl('/auth/reset-password');
                this.failureAlert = true;
                this.alertMsg = response.error.message;

                // setTimeout(function ()
                // {
                //     this.failureAlert = false;
                // }.bind(this), 10000);
				setTimeout(() => {
					this.failureAlert = false;
				}, 10000);
            }
		},
		error => {
			// log here("forgotPassword: ", error);
            this.failureAlert = true;
            this.alertMsg = "Email is incorrect.";

            // setTimeout(function () 
            // {
            //     this.failureAlert = false;
            // }.bind(this), 10000);
			setTimeout(() => {
				this.failureAlert = false;
			}, 10000);
		});
	}
}


