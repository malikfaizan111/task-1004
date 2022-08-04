import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder } from '@angular/forms';

import { MainService } from '../../services';

@Component({
	selector: 'app-multiple_outlets',
	templateUrl: './multiple_outlets.component.html'
})
export class MultipleOutletsFormComponent implements OnInit {
	id: any;
	sub: Subscription = new Subscription();
	Outlets: any[];
	isFormValid: boolean;

	constructor(protected router: Router, protected _route: ActivatedRoute, protected mainApiService: MainService, protected formbuilder: FormBuilder, protected dialog: MatDialog) {
		this.Outlets = [];
		this.isFormValid = true;
	}

	ngOnInit() {
		this.sub = this._route.params.subscribe(params => {
			this.id = params['id'];
		});
	}

	onOutletFormChanges(event: any): void {
		if (event == false) {
			this.isFormValid = true;
		}
		else {
			this.isFormValid = false;
		}
	}

	onOutletSuccess(event: any): void {
		this.Outlets.push(event);
	}

	onLocationBack(): void {
		window.history.back();
	}
}