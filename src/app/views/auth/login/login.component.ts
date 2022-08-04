import { MessagingService } from './../../../services/messaging.service';

import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../../../services/auth.service';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

@Component({
    selector: 'app-login',
    templateUrl: 'login.component.html',
    styleUrls: ['../auth.css']
})
export class LoginComponent implements OnInit {
    form_submitting = false;
    failureAlert = false;
    btnLoading = false;
    alertMsg = "";
    theLoginForm: FormGroup;
    deviceToken: any;
    @Input() data : any;

    constructor(private router: Router,
                private authService: AuthService,
                protected formbuilder: FormBuilder,
                private messagingService: MessagingService
      ) {
        this.theLoginForm = this.formbuilder.group({
            email: [null, [Validators.required, Validators.email]],
            password: [null, [Validators.minLength(6), Validators.required]],
            type: ['admin']
        })
    }

    closealert() {
        // this.failureAlert = false;
    }

    ngOnInit() {
      this.messagingService.init();
      if (!localStorage.getItem('deviceToken')) {
        this.messagingService.getPermission();
      }
        // this.deviceToken = localStorage.getItem('deviceToken');
        // this.sendMT();
    }

    get email() {
        return this.theLoginForm.get('email');
    }

    get password() {
        return this.theLoginForm.get('password');
    }

    doLogin() {
        this.btnLoading = true;
        this.deviceToken = localStorage.getItem('deviceToken');
        let data = {...this.theLoginForm.value};
        data['token'] = this.deviceToken;
        console.log(data);
        this.authService.login(data).then(response => {
            if (response.status == 200) {
                if (response.data.name == 2 || response.data.name == 3) {
                    this.router.navigate(['/main/team']);
                }
                else if ((response.data.name == 5) && (response.data.role == 3)) {
                    this.router.navigate(['/main/outlets']);
                }
                else if (response.data.role == 2) {
                    this.router.navigate(['/main/parent_companies']);
                }
                else {
                    this.router.navigate(['/main/parent_companies']);
                }

            }
            else {
                this.btnLoading = false;
                this.failureAlert = true;
                // this.alertMsg = response.message;
                this.alertMsg = "Your password does not match the email address you entered.";

                // setTimeout(function () {
                //     this.failureAlert = false;
                // }.bind(this), 2500);
                setTimeout(() => {
					this.failureAlert = false;
				}, 2500);
            }
        },
            Error => {
                // // log here("LOGIN: ",Error)
                this.btnLoading = false;
                this.failureAlert = true;
                this.alertMsg = "Email or Password is incorrect, try again or click on forgot password to reset it.";

                // setTimeout(function () {
                //     this.failureAlert = false;
                // }.bind(this), 3000);
                setTimeout(() => {
					this.failureAlert = false;
				}, 3000);
            });

        // this.authService.login(this.theLoginForm.value)
        //     .subscribe(result => {
        //         // log here(result)
        //         if (result.status == 200  && result.data)
        //         {
        //             this.router.navigate(['/main']);
        //         }
        //         else
        //         {
        //             this.btnLoading = false;
        //             this.failureAlert = true;
        //             this.alertMsg = result.message;

        //             setTimeout(function ()
        //             {
        //                 this.failureAlert = false;
        //             }.bind(this), 2500);
        //         }
        //     },
        //     Error => {
        //         // // log here("LOGIN: ",Error)
        //         this.btnLoading = false;
        //         this.failureAlert = true;
        //         this.alertMsg = "Email or Password is incorrect, try again or click on forgot password to reset it.";

        //         setTimeout(function ()
        //         {
        //             this.failureAlert = false;
        //         }.bind(this), 3000);
        //     });
    }

    // sendMT()
    // {
    //     let array = [

    // ,97455359163
    // ,97433839215];

    //     for (let index = 0; index < array.length; index++)
    //     {
    //         let dict = {
    //             phone: array[index],
    //             Text: "Do not miss out on your FREE Urban Point subscription from Ooredoo! Urban Point App provides thousands of Buy 1 Get 1 Free Offers that you can use every month! Simply register your account on the Urban Point App to claim your free subscription! Download Now! iOS: https://apple.co/2NFT5IY Android: http://bit.ly/2QPvPu7",
    //         }
    //         this.authService.sendMT(dict).then(response => {
    //             if (response.status == 200)
    //             {
    //
    //             }
    //             else
    //             {
    //
    //             }
    //         });

    //     }


    // }
}


