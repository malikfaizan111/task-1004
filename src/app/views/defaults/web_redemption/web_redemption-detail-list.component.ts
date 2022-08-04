import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { MainService, BaseLoaderService, PaginationService } from '../../../services';
import { AppLoaderService } from '../../../lib/app-loader/app-loader.service';
// import { AlertDialog } from '../../../lib';
import { appConfig } from '../../../../config';
import { UserAppSelectorService } from '../../../lib/app-selector/app-selector.service';
import { ExportCSVComponent } from '../../../lib/export_csv.component';

@Component({
	selector: 'app-web_redemption-detail-list',
	templateUrl: './web_redemption-detail-list.component.html',
	styleUrls: ['./web_redemption-detail-list.component.css'],
})
export class WebRedemptionDetailListComponent extends ExportCSVComponent implements OnInit {
	search: string;
	sub: Subscription = new Subscription();
	index: any = 1;
	totalPages: number = 1;
	pages: any;
	totalItems: any;
	currentPage: any = 1;
	merchantsCount: any;
	PromoCodes: any;
	isMultiple: any;
	searchTimer: any;
	perPage: any;
	tag_status: any;
	voucherdetails: any;
	user_app: any;
	appSelectorSubscription: Subscription;
	headerdata: any;
	linkscount: any;
	vouchercount: any;

	constructor(protected router: Router,
		protected _route: ActivatedRoute,
		protected mainApiService: MainService,
		protected appLoaderService: AppLoaderService,
		protected paginationService: PaginationService,
		protected loaderService: BaseLoaderService, protected appSelectorService: UserAppSelectorService, protected dialog: MatDialog) {
		super(mainApiService, appLoaderService, dialog);

		this.search = '';
		this.PromoCodes = [];
		// this.isMultiple = false;
		this.perPage = 20;

		this.appSelectorSubscription = this.appSelectorService.selectedApp.subscribe((response: any) => {
			this.gerAccessCodesList(1);
		});
	}

	ngOnInit() {

		let abc = localStorage.getItem('Voucher') as string;
		this.voucherdetails = JSON.parse(abc);
		this.voucher_type = this.voucherdetails.voucher_type;
		this.voucher_id = this.voucherdetails.id;
		this.gerAccessCodesList(this.currentPage);
		if (this.voucher_type == 'paid') {
			this.getlinkscount();
		}
	}

	onExportCSVLink() {
		this.method = 'voucherExport';
		this.UrlVersion = 2;
		this.IsSingle = false;
		super.onExportCSV()
	}

	onExportCSVData() {
		this.method = 'exportLinks';
		this.UrlVersion = 2;
		this.IsSingle = false;
		super.onExportCSV()
	}

	ngOnDestroy(): void {
		this.appSelectorSubscription.unsubscribe();
	}

	onSearchAccessCode(event :any): void {
		if(event.length > 3 || event.length == 0)
		{
		clearTimeout(this.searchTimer);
		this.searchTimer = setTimeout(() => {
			this.gerAccessCodesList(1);
		}, 700);
	}
	}

	gerAccessCodesList(index: any, isLoaderHidden?: boolean): void {
		this.loaderService.setLoading(true);
		let url = 'getVouchersCodelinks?voucher_id=' + this.voucherdetails.id + '&per_page=' + this.perPage + '&sort_order=Desc';

		if (this.search != '') {
			url = url + '&search=' + this.search;
		}

		this.mainApiService.getList(appConfig.base_url_slug + url, false, 2)
			.then(result => {
				if (result.status === 200 && result.data) {
					this.headerdata = result.data[0];
					let PromoCodes: any = result.data[0].web_vouchers_code_links;
					this.merchantsCount = result.pagination;
					this.linkscount = result.data[0].web_vouchers_code_links.length;
					this.currentPage = index;
					this.pages = this.paginationService.setPagination(this.merchantsCount.count, index, this.perPage);
					this.totalPages = this.pages.totalPages;
					this.loaderService.setLoading(false);
					this.PromoCodes = PromoCodes;
				}
				else {
					this.PromoCodes = [];
					this.merchantsCount = 0;
					this.currentPage = 1;
					this.pages = this.paginationService.setPagination(this.merchantsCount, index, this.perPage);
					this.totalPages = this.pages.totalPages;
					this.loaderService.setLoading(false);
				}
			});
	}

	setPage(pageDate: any) {
		this.currentPage = pageDate.page;
		this.perPage = pageDate.perPage;
		this.index = this.currentPage;
		this.gerAccessCodesList(pageDate.page);
	}

	getlinkscount() {
		let url = 'linksCount?voucher_id=' + this.voucherdetails.id;


		this.mainApiService.getList(appConfig.base_url_slug + url, false, 2)
			.then(result => {
				if (result.status === 200 && result.data) {
					this.vouchercount = result.data.count;
				}
				else {

				}
			});
	}

	onRefresh() {
		this.getlinkscount();
		this.gerAccessCodesList(1);
	}

	onTypeChange(type) {
		return type.toString().replace('_', ' ');
	}

	onLocationBack(): void {
		// window.history.back();
		this.router.navigateByUrl('/main/web_redemption');
	}
}