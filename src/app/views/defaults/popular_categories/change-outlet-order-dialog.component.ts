import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { appConfig } from '../../../../config';
import { MainService, BaseLoaderService, PaginationService } from '../../../services';
import { FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertDialog } from '../../../lib';
// import { Subscription } from 'rxjs';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-change-outlet-order-dialog',
  templateUrl: './change-outlet-order-dialog.component.html',
  styleUrls: ['./change-outlet-order-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ChangeOutletOrderDialogComponent implements OnInit {

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.Outlets, event.previousIndex, event.currentIndex);
    this.onDrop(event);
  }

  isLoading = false;
  formdataid: any = [];
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
  selectedItem: any = {};
  searchTimer: any;
  Isclose: boolean = false;
  // tempArray: any[] = [];
  options: any;

  constructor(protected router: Router, protected formbuilder: FormBuilder, protected dialog: MatDialog,
    protected loaderService: BaseLoaderService, private mainService: MainService, protected mainApiService: MainService,
    protected paginationService: PaginationService, protected dialogRef: MatDialogRef<ChangeOutletOrderDialogComponent>) {

  }

  ngOnInit() {
    this.getOutletsList(1);
    // this.tempArray = this.formdataid.slice();  

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
  getOutletsList(index: any, isLoaderHidden?: boolean): void {
    // this.loaderService.setLoading(true);
    let url = 'viewPopularCategory?page=' + index + '&per_page=' + this.perPage + '&sort_order=Desc' + '&status=active';
    if (this.search != '') {
      url = url + '&search=' + this.search;
    }
    if (this.sortby != '') {
      url = url + '&sortby=' + this.sortby;
    }
    this.mainApiService.getList(appConfig.base_url_slug + url, false, 2)
      .then(result => {
        if (result.status == 200 && result.data) {
          this.Outlets = result.data;
          for (let i = 0; i < this.Outlets.length; i++) {
            this.Outlets[i].position = i + 1;
          }
          this.outletsCount = result.pagination.count;
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

  onSelectChange(e: any) {
    this.Isclose == false;
    this.closedialog();
  }

  // Starting new swapping function
  onItemSelect(item: any) {
    if (item.mode != 'empty') {
      this.selectedItem = item;
    }
  }

  onDrop(e: any) {
    this.Outlets.map((opt, i) => {
      // console.log(i, opt);
      return opt.position = i + 1
    });
    // console.log('list after chaning position: ' , e)
    // console.log('list after chaning position: ' , this.Outlets)
    // this.onOrderChange.emit(this.options);
  }

  onSaveOrder() {
    let dataSend = [];
    for (let i = 0; i < this.Outlets.length; i++) {
      dataSend.push({
        popular_cat_id: this.Outlets[i].id,
        order_by: this.Outlets[i].position = i + 1
      })
    }
    let dataobject = {
      data: dataSend
    };
    var method = 'editPopularCategorySequence'
    this.mainApiService.postData(appConfig.base_url_slug + method, dataobject, 2).then(response => {
      if (response.status == 200 || response.status == 201) {

        this.router.navigateByUrl('/main/popularcategories');
        this.isLoading = false;

      }
      else {
        this.isLoading = false;
        let dialogRef = this.dialog.open(AlertDialog, { autoFocus: false });
        let cm = dialogRef.componentInstance;
        cm.heading = 'Error';
        cm.message = response.error.message;
        cm.cancelButtonText = 'Ok';
        cm.type = 'error';
      }
    },
      Error => {
        // log here(Error)
        this.isLoading = false;
        let dialogRef = this.dialog.open(AlertDialog, { autoFocus: false });
        let cm = dialogRef.componentInstance;
        cm.heading = 'Error';
        cm.message = "Internal Server Error.";
        cm.cancelButtonText = 'Ok';
        cm.type = 'error';
      })
  }
}
