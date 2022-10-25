import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-select-brands-or-outlets-list',
  templateUrl: './select-brands-or-outlets-list.component.html',
  styles: [
    '.mat-form-field-should-float .mat-form-field-label-wrapper {display: none;}'
  ]
})
export class SelectBrandsOrOutletsListComponent implements OnInit {

  constructor(protected router: Router,) { }

  ngOnInit(): void {
  }


onLocationBack(): void 
{
    window.history.back();
}

onSelectTag()
{
  this.router.navigateByUrl('main/outlets_tags/select/select_tags');
}

}
