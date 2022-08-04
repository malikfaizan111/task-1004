import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';

import { ExportCSVComponent } from '../../../lib/export_csv.component';
import { MainService, PaginationService, BaseLoaderService } from '../../../services';
import { AppLoaderService } from '../../../lib/app-loader/app-loader.service';
import { UserAppSelectorService } from '../../../lib/app-selector/app-selector.service';
import { appConfig } from '../../../../config';



@Component({
	selector: 'app-reports-list',
	templateUrl: './reports.component.html'
})
export class ReportsComponent extends ExportCSVComponent implements OnInit {
	report_type: any = 'interest_tags';
	tags: any = '';

	appSelectorSubscription?: Subscription;

	constructor(protected router: Router,
		protected _route: ActivatedRoute,
		protected mainApiService: MainService,
		protected paginationService: PaginationService,
		protected loaderService: BaseLoaderService, protected appLoaderService: AppLoaderService, protected appSelectorService: UserAppSelectorService, protected  dialog: MatDialog) {
		super(mainApiService, appLoaderService, dialog);
		this.method = 'getTagsCustomers';

	}

	ngOnDestroy(): void {
	}

	ngOnInit() {
		this.url_values = [
			{ key: 'search', value: this.tags, title: 'Search Tags' },
		];
	}

	onTagAdd(event: any): void {
		this.tags = event;
		this.url_values = [
			{ key: 'search', value: this.tags, title: 'Search Tags' },
		];
	}

	onReportTypeChange(): void {
		this.tags = '';
		this.url_values = [
			{ key: 'search', value: this.tags, title: 'Search Tags' },
		];
	}
}