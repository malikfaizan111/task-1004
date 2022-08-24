import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MainService, BaseLoaderService, PaginationService } from '../../services';
import { AppLoaderService } from '../../lib/app-loader/app-loader.service';
import { ExportCSVComponent } from '../../lib/export_csv.component';
import { AlertDialog } from '../../lib/alert.dialog';
import { MatDialog } from '@angular/material/dialog';
import { UserAppSelectorService } from '../../lib/app-selector/app-selector.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-sms-detail',
  templateUrl: './sms-detail.component.html',
  styles: [
    '.form-control {border-radius: 10px !important;}'
  ]
})
export class SmsDetailComponent extends ExportCSVComponent implements OnInit {

  smsId: any
  search: string;
  index: any = 1;
	totalPages: number = 1;
	pages: any;
  perPage: any;
	totalItems: any;
	currentPage: any = 1;
  searchTimer: any;
  smsCount: any;
  Sms: any;
  smsInfo: any;
  sent_Status: string 
  componentSettings: any = {
		name: null,
		paggination: null,
		search: null
	};
  channel: any
  message: any
  appSelectorSubscription: Subscription;

  constructor(protected route: ActivatedRoute,
     protected mainApiService: MainService,
      protected appLoaderService: AppLoaderService,
       protected dialog: MatDialog,
       protected paginationService: PaginationService,
       protected loaderService: BaseLoaderService,
       protected appSelectorService: UserAppSelectorService) {
    super(mainApiService, appLoaderService, dialog);
    this.search = '';
    this.sent_Status = ''
    this.Sms = [];
    this.smsInfo = []
		this.perPage = 20;
    this.isNeededDate = false;
    

    this.appSelectorSubscription = this.appSelectorService.selectedApp.subscribe((response: any) =>
        {
			this.gerSmsDetailList(1);
		});
   }

  ngOnInit(): void {
    this.smsId = this.route.snapshot.paramMap.get('id')
    // console.log('check', this.smsId)
    let abcd = localStorage.getItem('componentSmsSettings') as string;
		this.componentSettings = JSON.parse(abcd)
    if(this.componentSettings)
		{
			if(this.componentSettings.name != null && this.componentSettings.name == 'Sms')
			{
				this.currentPage = this.componentSettings.paggination;
				this.index = this.componentSettings.paggination;
				this.search = this.componentSettings.search;
			}
		}
		this.gerSmsDetailList(this.currentPage);
  }

  onLocationBack()
  {
    window.history.back()
  }

  onSearchPhoneNumber(): void
  {
    clearTimeout(this.searchTimer);
		this.searchTimer = setTimeout(() => {
			this.gerSmsDetailList(1);
		}, 700);
  }

  gerSmsDetailList(index: any, isLoaderHidden?: boolean): void
  {
    // this.url_values = [
		// 	{key: 'sentstatus', value: this.sent_Status, title: 'Sent Status'},
		// ];
    
    
    this.loaderService.setLoading(true);

    let url = 'getCampaignDetails?campaign_id='+ this.smsId + 'page='  + index + '&index2=' + this.perPage;

		if(this.search != '')
		{
			url = url + '&search=' + this.search;
		}

    if(this.sent_Status != '')
    {
      url = url + '&status=' + this.sent_Status
    }


		localStorage.setItem('componentSmsSettings', JSON.stringify(
			{
				name: 'Sms',
				paggination: this.index,
				search: this.search
			}
        ));

        this.mainApiService.getSms(url)
        .then(result => {

          console.log('res', result)
          if (result.statusCode === 200  && result.data) 
          {
            let Sms : any = result.data.campaign_details;
            this.smsInfo = result.data.campaign_info;
            this.smsCount = result.data.pagination.count;
            this.currentPage = index;
            this.pages = this.paginationService.setPagination(this.smsCount, index, this.perPage);
            this.totalPages = this.pages.totalPages;
            console.log('page', this.totalPages)
            this.loaderService.setLoading(false);
    
            this.Sms = Sms;
          }
          else
          {
            this.Sms = [];
            this.smsCount = 0;
            this.currentPage = 1;
            this.pages = this.paginationService.setPagination(this.smsCount, index, this.perPage);
            this.totalPages = this.pages.totalPages;
            console.log('page', this.totalPages)
            this.loaderService.setLoading(false);
          }
        });

  }

  setPage(pageDate: any) 
	{
		this.currentPage = pageDate.page;
		this.perPage = pageDate.perPage;
		this.index = this.currentPage;
		this.gerSmsDetailList(pageDate.page);
	}

  ngOnDestroy(): void 
	{
		this.appSelectorSubscription.unsubscribe();	
    localStorage.removeItem('componentSmsSettings')
	}

  onRefresh()
  {
    this.gerSmsDetailList(1)
  }

}

