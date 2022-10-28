import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSelectionList } from '@angular/material/list';
import { ActivatedRoute, Router } from '@angular/router';
import { extend } from 'jquery';
import { assignDialog } from 'src/app/lib';
import { ImportCSVComponent } from 'src/app/lib/import_csv.component';
import { BaseLoaderService, MainService } from 'src/app/services';
import { appConfig } from 'src/config';

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
  currentPage:any;
  selectedOptions:any = {};
  outlets: any;
  search:any;
  methodName: any;
  searchTimer:any;
  // searchList: { name: string; id: number }[] = [
  //   { name: 'Boots', id: 1011 }, 
  //   { name: 'Clogs', id: 2011 },
  //   { name: 'Loafers', id: 3011 },
  //   { name: 'Moccasins', id: 4011 },
  //   { name: 'Sneakers', id: 5011 },
  // ];
  searchList:any = [];
  form: FormGroup;

  @ViewChild('selectionList') selectionList: MatSelectionList;

  constructor(protected router: Router,protected _route: ActivatedRoute,protected baseloader: BaseLoaderService,protected mainApiService: MainService,
    protected formBuilder: FormBuilder, protected dialog: MatDialog) {
      super(mainApiService, dialog);
    this.currentPage= 1;
    this.perPage = 20;
    this.result = 0;
    this.search = '';
   }

  
  ngOnInit(): void {
    this.form = this.formBuilder.group({
      selected: [Object.values(this.selectedOptions)],
    });
    // this.getBrandOrOutlets(this.currentPage);
  }

  onType(event:any){
    console.log(event);
    if(event == 1)
    {
      this.methodName = 'searchBrands';
      // this.getBrandOrOutlets(this.currentPage);
    }
    else if(event == 2)
    {
      this.methodName = 'searchOutlets';
      // this.getBrandOrOutlets(this.currentPage);
    }
    else{

    }
  }

  onSearchBrandOrOutlet()
  {

      clearTimeout(this.searchTimer);
      this.searchTimer = setTimeout(() => {
        this.getBrandOrOutlets(1);
      }, 800);
  }
  getBrandOrOutlets(index:any,isLoaderHidden?: boolean)
  {
      let url = '';
      url = this.methodName;

      if (this.search != '') {
        url = url + '?search=' + this.search;
      }

      url = url + '&page=' + index + '&per_page=' + this.perPage;


      this.mainApiService.getList(appConfig.base_url_slug + url,true, 2)
      .then(result =>{
        if(result.status == 200 && result.data)
        {
          this.searchList = result.data;
        }
        else {
          this.search = [];
          this.currentPage = 1;

        }
      })

  }

  setPage(pageDate: any) {
		this.perPage = pageDate.perPage;
		this.getBrandOrOutlets(this.currentPage);
	}

  // switchPage(page: number) {
  //   if (page === 1) {
  //     this.searchList = [
  //       { name: 'Boots', id: 1011 },
  //       { name: 'Clogs', id: 2011 },
  //       { name: 'Loafers', id: 3011 },
  //       { name: 'Moccasins', id: 4011 },
  //       { name: 'Sneakers', id: 5011 },
  //     ];
  //   } else {
  //     this.searchList = [
  //       { name: 'Flyers', id: 6011 },
  //       { name: 'Dr.Martens', id: 7011 },
  //     ];
  //   }
  //   this.form.setValue({
  //     selected: Object.values(this.selectedOptions),
  //   });
  // }

  onLocationBack(): void {
    window.history.back();
}

onTagSelect()
{
  
  // outlet import section
  var outlets:any;
  if(this.result.length > 0)
  {
    console.log('import outlets:',this.result);
    outlets = this.result.map((item)=> {
      return item['outlet_id'];
    });
    console.log(outlets);
    let dialogRef = this.dialog.open(assignDialog, {autoFocus:false, panelClass: 'assignDialog'},);
    let cm = dialogRef.componentInstance;
    cm.methodName = 'addoutlettags';
    cm.datetoSubmit = outlets;
    cm.tagsCount = this.result.length ;
    cm.outletsCount = this.result.length ;
  
    dialogRef.afterClosed().subscribe((result)=>{
      // this.router.navigateByUrl('/main/outlets_tags');
    })
  }
  else if (Object.keys(this.selectedOptions).length > 0){
    outlets = Object.keys(this.selectedOptions);
    console.log(this.selectedOptions);
    console.log(outlets);

    let dialogRef = this.dialog.open(assignDialog, {autoFocus:false, panelClass: 'assignDialog'},);
    let cm = dialogRef.componentInstance;
    cm.methodName = 'addoutlettags';
    cm.datetoSubmit = outlets;
    cm.tagsCount = outlets.length ;
    cm.outletsCount = outlets.length ;
  
    dialogRef.afterClosed().subscribe((result)=>{
      // this.router.navigateByUrl('/main/outlets_tags');
    })
  }
  else{

  }

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
  console.log('Selected outlets:', Object.keys(this.selectedOptions));
  console.log('import outlets:',Object.keys(this.result))
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
