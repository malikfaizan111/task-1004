import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-select-brands-or-outlets-list',
  templateUrl: './select-brands-or-outlets-list.component.html',
  styles: [
    '.mat-form-field-should-float .mat-form-field-label-wrapper {display: none;}'
  ]
})
export class SelectBrandsOrOutletsListComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }


  onLocationBack(): void {
    window.history.back();
}

}
