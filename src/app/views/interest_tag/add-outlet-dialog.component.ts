import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { appConfig } from '../../../config';
import { MainService, BaseLoaderService, PaginationService } from '../../services';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';


@Component({
  selector: 'app-add-outlet-dialog',
  templateUrl: './add-outlet-dialog.component.html',
  styleUrls: ['./add-outlet-dialog.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class AddOutletDialogComponent implements OnInit {

  token: any;
  isEdit = false;
  isLoading = false;
  // Form: FormGroup;
  formdataid: any = [];
  formdataname: any;
  adderrormessage: any;
  orderby: string = 'ASC';
  sortby: string = '';
  category_id: string = '';
  search: string = "";
  perPage: number = 20;
  Outlets: any[] = [];
  totalPages: number = 1;
  pages: any;
  totalItems: any;
  currentPage: any = 1;
  outletsCount: any;
  index: any = 1;
  outletselected: any;
  itemChecked: boolean = false;
  iddata: any;
  searchTimer: any;
  Isclose: boolean = false;
  tempArray: any[] = [];

  constructor(protected formbuilder: FormBuilder, protected dialog: MatDialog,
    protected loaderService: BaseLoaderService, private mainService: MainService, protected mainApiService: MainService,
    protected paginationService: PaginationService, protected dialogRef: MatDialogRef<AddOutletDialogComponent>) {

  }

  ngOnInit() {
    if (this.formdataid.length > 0) {
      this.tempArray = this.formdataid.slice();
    }
  }

  closingdialog() {
    this.Isclose = true;
    this.closedialog();
  }

  closedialog() {
    if (this.Isclose) {
      this.dialogRef.close(false);
    }
    else {
      if (this.formdataid.length != 0) {
        this.dialogRef.close(this.formdataid);
      }
      else {
        this.formdataid = [];
        this.dialogRef.close(this.formdataid);
      }
    }
  }

  setPage(pageDate: any) {
    this.currentPage = pageDate.page;
    this.perPage = pageDate.perPage;
    this.index = this.currentPage;
    this.getOutletsList(pageDate.page);
  }

  onChecked(item: any) {
    if (item.checked) {
      this.formdataid.push({
        id: item.id,
        name: item.name
      });
    }
    else {
      for (let j = 0; j < this.formdataid.length; j++) {
        if (item.id == this.formdataid[j].id) {
          this.formdataid.splice(j, 1);
        }
      }
    }
  }

  onSearchOutlet(): void {
    clearTimeout(this.searchTimer);
    this.searchTimer = setTimeout(() => {
      if (this.search != null && this.search != '') {
        this.getOutletsList(1);
      }
      else {
        this.Outlets = [];
      }
    }, 800);
  }

  onSelectChange(e: any) {
    this.Isclose == false;
    this.closedialog();
  }

  getOutletsList(index: any, isLoaderHidden?: boolean): void {
    let url = 'getOutlets?index=' + index + '&index2=' + this.perPage + '&orderby=' + this.orderby;
    if (this.search != '') {
      url = url + '&search=' + this.search;
    }
    if (this.sortby != '') {
      url = url + '&sortby=' + this.sortby;
    }
    this.mainApiService.getList(appConfig.base_url_slug + url)
      .then(result => {
        if (result.status == 200 && result.data) {
          this.Outlets = result.data.outlets;
          for (let i = 0; i < this.Outlets.length; i++) {

            this.Outlets[i].checked = false;
            for (let j = 0; j < this.formdataid.length; j++) {
              if (this.Outlets[i].id == this.formdataid[j].id) {
                this.Outlets[i].checked = true;
              }
            }
          }
          this.outletsCount = result.data.outletsCount;
          this.currentPage = index;
          this.pages = this.paginationService.setPagination(this.outletsCount, index, this.perPage);
          this.totalPages = this.pages.totalPages;
          this.loaderService.setLoading(false);
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