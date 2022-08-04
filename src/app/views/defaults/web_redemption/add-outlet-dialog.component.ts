import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { appConfig } from '../../../../config';
import { MainService, BaseLoaderService, PaginationService } from '../../../services';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-add-outletDialog',
  templateUrl: './add-outlet-dialog.component.html',
  styleUrls: ['./add-outlet-dialog.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class AddOutletDialogWebComponent implements OnInit {

  isEdit = false;
  isLoading = false;
  orderby: string = 'ASC';
  search: string = "";
  perPage: number = 20;
  Outlets: any[] = [];
  totalPages: number = 1;
  pages: any;
  totalItems: any;
  currentPage: any = 1;
  outletsCount: number = 0;
  index: any = 1;
  searchTimer: any;
  selectedoutlet: any;
  temparray: any;

  constructor(protected formbuilder: FormBuilder, protected dialog: MatDialog,
    protected loaderService: BaseLoaderService, private mainService: MainService, protected mainApiService: MainService,
    protected paginationService: PaginationService, protected dialogRef: MatDialogRef<AddOutletDialogWebComponent>) {

  }

  ngOnInit() {
  }


  setPage(pageDate: any) {
    this.currentPage = pageDate.page;
    this.perPage = pageDate.perPage;
    this.index = this.currentPage;
    this.getOutletsList(pageDate.page);
  }

  onSearchOutlet(): void {
    clearTimeout(this.searchTimer);
    this.searchTimer = setTimeout(() => {
      if (this.search != null && this.search != '') {
        this.getOutletsList(1);
      }
      else {
        this.temparray = [];
      }
    }, 800);
  }

  onSelect(item) {
    this.selectedoutlet = item;
    this.dialogRef.close(this.selectedoutlet);
  }

  getOutletsList(index: any, isLoaderHidden?: boolean): void {
    let url = 'getOutletsParents?index=' + index + '&index2=' + this.perPage + '&orderby=' + this.orderby;
    if (this.search != '') {
      url = url + '&search=' + this.search;
    }

    this.mainApiService.getList(appConfig.base_url_slug + url, false, 2)
      .then(result => {
        if (result.status === 200 && result.data) {
          // result.data.forEach(element => {
          //   this.temparray = {
          //     id: element.id,
          //     name: element.name,
          //   }
          // this.temparray.push(element.id);
          // this.temparray.push(element.name);
          // });
          this.temparray = result.data;
          // for (let i = 0; i < this.Outlets.length; i++) {
          //   this.Outlets[i].checked = false;
          //   for (let j = 0; j < this.formdataid.length; j++) {
          //     if (this.Outlets[i].id == this.formdataid[j].id) {
          //       this.Outlets[i].checked = true;
          //     }
          //   }
          // }
          this.outletsCount = result.data.length;
          this.currentPage = index;
          this.pages = this.paginationService.setPagination(this.outletsCount, index, this.perPage);
          this.totalPages = this.pages.totalPages;
          this.loaderService.setLoading(false);
          console.log('outlets after search', this.outletsCount)
        }
        else {
          this.Outlets = [];
          this.outletsCount = 0;
          this.currentPage = 1;
          this.pages = this.paginationService.setPagination(this.outletsCount, index, this.perPage);
          this.totalPages = this.pages.totalPages;
          this.loaderService.setLoading(false);
        }
      });
  }
}