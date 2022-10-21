import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-outlet-tags-list',
  templateUrl: './outlet-tags-list.component.html',
  styles: [
  ]
})
export class OutletTagsListComponent implements OnInit {

  
  constructor(protected router: Router,) { }

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

}
