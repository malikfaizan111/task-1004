import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder} from '@angular/forms';

import { MainService } from '../../services';

@Component({
	selector: 'app-multiple_deals',
	templateUrl: './multiple_deals.component.html'
})
export class MultipleDealsFormComponent implements OnInit
{
	id: any;
	sub: Subscription = new Subscription();
	Deals: any[];
	isFormValid: boolean = true;

	constructor(protected router: Router, protected _route: ActivatedRoute, protected mainApiService: MainService, protected formbuilder: FormBuilder, protected dialog: MatDialog) 
	{
		this.Deals = [];
	}

	ngOnInit() 
	{
		this.sub = this._route.params.subscribe(params => {
			this.id = params['id'];
		});
	}

	onOfferFormChanges(event : any): void
	{
		if(event == false)
		{
			this.isFormValid = true;
		}
		else
		{
			this.isFormValid = false;
		}
	}

	onOfferSuccess(event : any): void
	{
		this.Deals.push(event);
	}

	onLocationBack(): void 
	{
		window.history.back();
	}
}
