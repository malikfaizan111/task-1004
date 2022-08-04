import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';


import { AlertDialog } from '../../lib';
import { MainService } from '../../services';
import * as moment from 'moment';
import { appConfig } from '../../../config';

@Component({
	selector: 'app-customers-form',
	templateUrl: './customers-form.component.html'
})
export class CustomersFormComponent implements OnInit {
	id: any;
	// type: any;
	sub: Subscription = new Subscription();
	Form: FormGroup;
	isLoading: boolean;
	// isEditing: boolean;
	customer: any;
	Countries: any;

	constructor(protected router: Router,
		protected _route: ActivatedRoute,
		protected mainApiService: MainService,
		protected formbuilder: FormBuilder, protected dialog: MatDialog) {
		this.Form = this.formbuilder.group({
			// pin: [null, [Validators.maxLength(4), Validators.minLength(4)]],
			email: [null],
			nationality: [null],
			gender: [null, [Validators.required]],
		});

		this.isLoading = false;
		// this.isEditing = false;

		this.Countries = ["Afghanistan", "Aland Islands", "Albania", "Algeria", "American Samoa", "Andorra", "Angola",
			"Anguilla", "Antarctica", "Antigua and Barbuda", "Argentina", "Armenia", "Aruba", "Ascension Island", "Australia",
			"Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize",
			"Benin", "Bermuda", "Bhutan", "Bolivia", "Bosnia & Herzegovina", "Botswana", "Bouvet Island", "Brazil",
			"British Indian Ocean Territory", "British Virgin Islands", "Brunei", "Bulgaria", "Burkina Faso", "Burundi",
			"Cambodia", "Cameroon", "Canada", "Canary Islands", "Cape Verde", "Caribbean Netherlands", "Cayman Islands",
			"Central African Republic", "Ceuta", "Chad", "Chile", "China", "Christmas Island", "Clipperton Island",
			"Cocos (Keeling) Islands", "Colombia", "Comoros", "Congo - Brazzaville", "Congo - Kinshasa", "Cook Islands",
			"Costa Rica", "Cote d'Ivoire", "Croatia", "Curacao", "Cyprus", "Czech Republic", "Denmark", "Diego Garcia Djibouti",
			"Dominica", "Dominican Republic", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia",
			"Ethiopia", "Falkland Islands", "Faroe Islands", "Fiji", "Finland", "France", "French Guiana", "French Polynesia",
			"French Southern Territories", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Gibraltar", "Greece", "Greenland",
			"Grenada", "Guadeloupe", "Guam", "Guatemala", "Guernsey", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Heard & McDonald Islands",
			"Honduras", "Hong Kong (China)", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Isle of Man",
			"Israel", "Italy", "Jamaica", "Japan", "Jersey", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Kosovo", "Kuwait", "Kyrgyzstan",
			"Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Macau", "Macedonia", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands",
			"Martinique", "Mauritania", "Mauritius", "Mayotte", "Melilla", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia",
			"Montenegro", "Montserrat", "Morocco", "Mozambique", "Myanmar (Burma)", "Namibia", "Nauru", "Nepal", "Netherlands", "New Caledonia", "New Zealand", "Nicaragua", "Niger", "Nigeria", "Niue",
			"Norfolk Island", "North Korea", "Northern Mariana Islands", "Norway", "Oman", "Pakistan", "Palau", "Palestinian Territories",
			"Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Pitcairn Islands", "Poland", "Portugal", "Puerto Rico",
			"Qatar", "Reunion", "Romania", "Russia", "Rwanda", "St. Helena", "St. Pierre & Miquelon", "St. Kitts & Nevis", "St. Lucia",
			"St. Vincent & Grenadines", "Samoa", "San Marino", "Sao Tome & Prfncipe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles",
			"Sierra Leone", "Singapore", "Sint Maarten", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "So. Georgia & So. Sandwich Isl.",
			"South Africa", "South Korea", "South Sudan", "Spain", "Sri Lanka", "St. Barthelemy", "Sudan", "Suriname", "Svalbard & Jan Mayen",
			"Swaziland", "Sweden", "Switzerland", "Syria", "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo",
			"Tokelau", "Tonga", "Trinidad & Tobago", "Tristan da Cunha", "Tunisia", "Turkey", "Turkmenistan", "Turks & Caicos Islands",
			"Tuvalu", "U.S. Virgin Islands", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "Uraguay", "United States",
			"U.S. Outlying Islands", "Uzbekistan", "Vanuatu", "Vatican City", "Venezuela", "Vietnam", "Wallis & Futuna", "Western Sahara",
			"Yemen", "Zambia", "Zimbabwe"]
	}

	ngOnInit() {
		this.sub = this._route.params.subscribe(params => {
			this.id = params['id'];
			if (this.id != 'add') {
				// this.isEditing = true;
				this.Form.addControl('id', new FormControl(this.id));
				let abc = localStorage.getItem('Customer') as string;
				this.customer = JSON.parse(abc);
				this.Form.patchValue(this.customer);
			}
			else {
				this.router.navigateByUrl('/main/customers/registered');
			}
		});

		this.Form.get('email')?.valueChanges.subscribe(response => {
			if (response.length != 0) {
				this.Form.get('email')?.setValidators([Validators.email, Validators.required]);
			}
			if (response.length == 0) {
				this.Form.get('email')?.setErrors(null);
			}
		})

	}

	getValue(name: any) {
		return this.Form.get(name);
	}

	onLocationBack(): void {
		window.history.back();
	}

	doSubmit(): void {
		this.isLoading = true;

		this.mainApiService.postData(appConfig.base_url_slug + 'updateUser', this.Form.value).then(response => {
			if (response.status == 200 || response.status == 201) {
				this.router.navigateByUrl('/main/customers/registered');
				this.isLoading = false;
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