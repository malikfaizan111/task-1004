import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';

@Component({
	selector: 'app-forgot-password',
	templateUrl: './forgot-password.component.html',
	styleUrls: ['../auth.css']
})
export class ForgotPasswordComponent implements OnInit 
{
	showSuccess: boolean;
	alertMsg = "";
	Form: FormGroup;
	failureAlert = false;
    btnLoading = false;

	constructor(private router: Router, private authService: AuthService, protected formbuilder: FormBuilder) 
	{
		this.Form = this.formbuilder.group({
			email: [null, [Validators.required, Validators.email]],
			type: ['admin'],
			token: ['1234567']
		});
		this.showSuccess = false;
	}

	ngOnInit() 
	{
	}

	get email() 
	{
		return this.Form.get('email');
	}

	doSubmit() 
	{
		this.authService.forgotPassword(this.Form.value).then(response => 
		{
			if (response.status == 200) 
            {
				// log here(response);
				this.showSuccess = true;
				this.failureAlert = false;
				// this.router.navigateByUrl('/auth/reset-password');
               
            }
            else 
            {
				// log here('else',response);
				// this.router.navigateByUrl('/auth/reset-password');
				this.btnLoading = false;
				this.showSuccess = false;
                this.failureAlert = true;
                this.alertMsg = response.error.message;

                // setTimeout(function ()
                // {
                //     this.failureAlert = false;
                // }.bind(this), 2500);
				setTimeout(() => {
					this.failureAlert = false;
				}, 2500);
            }
		},
		error => {
			// log here("forgotPassword: ", error);
			this.btnLoading = false;
			this.showSuccess = false;
            this.failureAlert = true;
            this.alertMsg = "Email is incorrect.";

            // setTimeout(function () 
            // {
            //     this.failureAlert = false;
            // }.bind(this), 3000);
			setTimeout(() => {
				this.failureAlert = false;
			}, 3000);
		});
	}
}


