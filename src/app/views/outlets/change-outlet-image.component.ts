import { Component, Inject, OnInit, Optional, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { appConfig } from './../../../config';
import { MainService, BaseLoaderService, PaginationService } from './../../services';
import { FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertDialog } from './../../lib';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { ChangeOutletOrderDialogComponent } from '../defaults/popular_categories/change-outlet-order-dialog.component';
import { imagePreviewComponent } from './image-preview.component';

@Component({
  selector: 'app-change-image-order-dialog',
  templateUrl: './change-outlet-image.component.html',
  styleUrls: ['./change-outlet-image.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ChangeOutletImageComponent implements OnInit {

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
  Isclose: boolean = false;
  options: any;
  fileurl: any;
  copyarrayOfImages : any;

  constructor(protected router: Router, protected formbuilder: FormBuilder, protected dialog: MatDialog,
    protected loaderService: BaseLoaderService, private mainService: MainService, protected mainApiService: MainService,
    protected paginationService: PaginationService, protected dialogRef: MatDialogRef<ChangeOutletImageComponent>, @Optional() @Inject(MAT_DIALOG_DATA) public data: any) {
    this.Outlets = data.pageValue;
    this.fileurl = appConfig.file_urlV2;
  }

  ngOnInit() {
    this.copyarrayOfImages = this.data.pageValue.slice(); 

  }

  closingdialog() {
    this.Isclose = true;
      this.dialogRef.close(this.copyarrayOfImages);
  }

  closedialog() {
    if (this.Isclose) {
      this.dialogRef.close(this.copyarrayOfImages);
    }
    // else {
    //   if (this.formdataid.length != 0) {
    //     this.dialogRef.close(this.formdataid);
    //   }
    //   else {
    //     this.formdataid = [];
    //     this.dialogRef.close(this.formdataid);
    //   }
    // }
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
      return opt.position = i + 1
    });
  }

  onSaveOrder() {
    let dataSend = [];
    for (let i = 0; i < this.Outlets.length; i++) {
      dataSend.push({
        file_id: this.Outlets[i].id,
        orderBy: this.Outlets[i].position = i + 1
      })
    }
    let dataobject = {
      data: dataSend,
    };
    var method = 'outletMenuImagesArrangment'
    this.mainApiService.postData(appConfig.base_url_slug + method, dataobject, 2).then(response => {
      if (response.status == 200 || response.status == 201) {
        // this.closedialog();
        this.dialogRef.close();
        // this.router.navigateByUrl('main/outlet/' + this.id + '/' + type);
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

  openPicture(outlet) {
    let dialogRef = this.dialog.open(imagePreviewComponent, { autoFocus: false, data: { pageValue: outlet.file } });
  }
}