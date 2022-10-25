import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSelectionList } from '@angular/material/list';
import { ActivatedRoute, Router } from '@angular/router';
import { extend } from 'jquery';
import { ImportCSVComponent } from 'src/app/lib/import_csv.component';
import { BaseLoaderService, MainService } from 'src/app/services';

@Component({
  selector: 'app-select-brands-or-outlets-list',
  templateUrl: './select-brands-or-outlets-list.component.html',
  styleUrls: ['./select-brands-or-outlets-list.component.scss']
})
export class SelectBrandsOrOutletsListComponent extends ImportCSVComponent implements OnInit {

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

  constructor(protected router: Router,protected _route: ActivatedRoute,protected baseloader: BaseLoaderService,protected mainApiService: MainService,
    protected formBuilder: FormBuilder, protected dialog: MatDialog) {
      super(mainApiService, dialog);
    this.index= 1;
    this.perPage = 20;
    this.result = 0;
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


afterSelectionCsv(result: any, headersObj: any, objTemp: any): void {
  // console.log(result);
  for (let key in headersObj) {
      if (!headersObj.hasOwnProperty('outlet_id') && !objTemp.hasOwnProperty('outlet_id')) {
          objTemp['outlet_id'] = null;
          this.errorMessageForCSV = this.errorMessageForCSV + '<b>outlet_id</b> is missing,<br> ';
          this.errorCounter++;
      }
  }

  if (this.errorCounter == 0) {
      result.forEach((element: any, index: any) => {
          if (element['outlet_id'] == null || element['outlet_id'] == '') {
              this.errorMessageForCSV = this.errorMessageForCSV + '<b>outlet_id</b> is empty on line number ' + (index + 1) + ',<br> ';
              this.errorCounter++;
          }
      });
  }
  this.afterJSON = result;
}


onUploadCSV(): void {
  this.afterSelectionCsv(this.result, this.headersObj, this.objTemp);
  this.JsonToServer = { outlets: JSON.stringify(this.result) };
  // this.JsonToServer = { outlets: "[]" };
  // console.log(this.JsonToServer);
  super.onUploadCSV();
}



}
