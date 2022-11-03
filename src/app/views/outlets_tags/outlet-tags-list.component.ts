import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MainService, BaseLoaderService,} from '../../services';
import { appConfig } from '../../../config';

@Component({
  selector: 'app-outlet-tags-list',
  templateUrl: './outlet-tags-list.component.html',
  styles: [
  ]
})
export class OutletTagsListComponent implements OnInit {

  userAppId: boolean = true
  data:  Array<any> 
  isLoaderHidden: boolean 
  constructor(protected router: Router, protected mainApiService: MainService,
              protected loaderService: BaseLoaderService,) {
    
    this.data = []
    this.gerOutletsTags()
   }

  ngOnInit(): void {
  }


  onSelectBrandorOutlets()
	{
		this.router.navigateByUrl('main/outlets_tags/select');
	}

  addTags()
  {
    this.router.navigateByUrl('main/outlets_tags/add');
  }

  gerOutletsTags():void
  {
    // debugger
    // if(this.isLoaderHidden)
		// {
			// this.loaderService.setLoading(false);
		// }
		// else
		// {
			this.loaderService.setLoading(true);
		// }
    let url = 'getTags';

     this.mainApiService.getList(appConfig.base_url_slug + url, this.userAppId, 2 )
    .then((result) => {
      if (result.status == 200  && result.data) 
			{
        this.data = result.data;
        this.loaderService.setLoading(false);
        console.log('response', this.data)
				// this.Admins = result.data.admin;
				// this.adminsCount = result.data.adminsCount;
				// this.currentPage = index;
				// this.pages = this.paginationService.setPagination(this.adminsCount, index, this.perPage);
				// this.totalPages = this.pages.totalPages;
				// this.loaderService.setLoading(false);
			}
			else
			{
        this.loaderService.setLoading(true);
        console.log('no success')
				// this.Admins = [];
				// this.adminsCount = 0;
				// this.currentPage = 1;
				// this.pages = this.paginationService.setPagination(this.adminsCount, index, this.perPage);
				// this.totalPages = this.pages.totalPages;
				// this.loaderService.setLoading(false);
			}
    })

  }
  
  
}
