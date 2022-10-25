import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSelectionList } from '@angular/material/list';

@Component({
  selector: 'app-select-brands-or-outlets-list',
  templateUrl: './select-brands-or-outlets-list.component.html',
  styleUrls: ['./select-brands-or-outlets-list.component.scss']
})
export class SelectBrandsOrOutletsListComponent implements OnInit {

  // selectedOptions = { '1': { name: 'Boots', id: 1 } };
  objectKeys = Object.keys;
  compareFunction = (o1: any, o2: any) => o1.id === o2.id;
  perPage:any;
  index:any;
  selectedOptions:any = {}
  typesOfShoes: { name: string; id: number }[] = [
    { name: 'Boots', id: 1 }, 
    { name: 'Clogs', id: 2 },
    { name: 'Loafers', id: 3 },
    { name: 'Moccasins', id: 4 },
    { name: 'Sneakers', id: 5 },
  ];

  form: FormGroup;

  @ViewChild('selectionList') selectionList: MatSelectionList;

  constructor(private formBuilder: FormBuilder) {
    this.index= 1;
    this.perPage = 20;
   }

  
  ngOnInit(): void {
    this.form = this.formBuilder.group({
      selected: [Object.values(this.selectedOptions)],
    });
  }

  switchPage(page: number) {
    if (page === 1) {
      this.typesOfShoes = [
        { name: 'Boots', id: 1 },
        { name: 'Clogs', id: 2 },
        { name: 'Loafers', id: 3 },
        { name: 'Moccasins', id: 4 },
        { name: 'Sneakers', id: 5 },
      ];
    } else {
      this.typesOfShoes = [
        { name: 'Flyers', id: 6 },
        { name: 'Dr.Martens', id: 7 },
      ];
    }
    this.form.setValue({
      selected: Object.values(this.selectedOptions),
    });
  }

  onLocationBack(): void {
    window.history.back();
}

onSelectionChanged(event) {
  const isSelected = event.option.selected;
  const value = event.option.value;

  if (isSelected) {
    this.selectedOptions[value.id] = value;
  } else {
    delete this.selectedOptions[value.id];
  }

  this.form.setValue({
    selected: Object.values(this.selectedOptions),
  });
  console.log(this.form.get('selected').value.length);
}

setPage(pageDate: any)
{
  this.perPage = pageDate.perPage;
}

}
