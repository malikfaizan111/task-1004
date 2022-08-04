import { FormBuilder } from '@angular/forms';
import { FormGroup, Validators } from '@angular/forms';
import { PaginationService } from './../../../services/pagination.service';
import { MainService } from './../../../services/main.service';
import { Component, OnInit } from '@angular/core';
import { appConfig } from '../../../../config';
import { BaseLoaderService } from '../../../services';
import { Router } from '@angular/router';

@Component({
  selector: 'app-spend-xylist',
  templateUrl: './spend-xylist.component.html',
  styleUrls: ['./spend-xylist.component.css']
})
export class SpendXylistComponent implements OnInit {

//   Form: FormGroup;
  index: any = 1;
  totalPages: number = 1;
  promoListCount: any;
	pages: any;
	totalItems: any;
	currentPage: any = 1;
	searchTimer: any;
  perPage = 20;
  search = '';
  promotionList: any[] = [];

  constructor(
    private mainApiService: MainService,
    private loaderService: BaseLoaderService,
    private router: Router,
    private paginationService: PaginationService)
  { }

  ngOnInit() {
    this.getPromoList(1);
  }

  addNew() {
    // this.router.navigate(['/main/spendXYList']);
  }

  getPromoList(index : any, single = false, isLoaderHidden?: boolean): void
	{
		this.loaderService.setLoading(true);
		let url = `viewAllPromotions?type=sxgyf&per_page=${this.perPage}&page=${this.currentPage}`;
		if (this.search != '')
		{
			url = url + '&search=' + this.search;
		}

		// localStorage.setItem('componentSettings', JSON.stringify(
		// 	{
		// 		name: 'RestaurantMenu',
		// 		paggination: this.index,
		// 		search: this.search
		// 	}
		// ));

		this.mainApiService.getList(appConfig.base_url_slug + url, single, 2)
			.then(result =>
			{
				if (result.status == 200 && result.data)
				{
          this.promotionList = result.data;
					this.promoListCount = result.pagination.count;
          this.currentPage = index;
					this.pages = this.paginationService.setPagination(this.promoListCount, index, this.perPage);
					this.totalPages = this.pages.totalPages;
					this.loaderService.setLoading(false);
				}
				else
				{
					this.promotionList = [];
					this.promoListCount = 0;
					this.currentPage = 1;
					this.pages = this.paginationService.setPagination(this.promoListCount, index, this.perPage);
					this.totalPages = this.pages.totalPages;
					this.loaderService.setLoading(false);
				}
			});
  }

  onSearchParentOutlet(): void
	{
		clearTimeout(this.searchTimer);
		this.searchTimer = setTimeout(() =>
		{
      let single = this.search != '' ? false : true;
			this.getPromoList(1, single);

		}, 700);

	}

  onEditPromo(promo : any) {
    localStorage.setItem('spendX', JSON.stringify(promo));
    this.router.navigate(['main/spendXYForm/' + promo.id]);
  }

  onAssignPromo(promo : any) {
    localStorage.setItem('spendX', JSON.stringify(promo));
    this.router.navigate(['main/assignPromotion']);
  }

  onDelete(promo : any) {

  }

  setPage(pageDate: any) {
		this.currentPage = pageDate.page;
		this.perPage = pageDate.perPage;
		this.index = this.currentPage;
		this.getPromoList(pageDate.page);
	}

	onLocationBack(): void {
    window.history.back();
  }

}
