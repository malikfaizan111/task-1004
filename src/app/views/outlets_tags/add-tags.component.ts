import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AlertDialog } from 'src/app/lib';
import { BaseLoaderService, MainService } from 'src/app/services';
import { appConfig } from 'src/config';

@Component({
  selector: 'app-add-tags',
  templateUrl: './add-tags.component.html',
  styles: [
    '.tag_btn[disabled] {color: #1F1F1F}'
  ]
})
export class AddTagsComponent implements OnInit {

  form: FormGroup;
  categoryTags: any = [];
  constructor(protected mainService:MainService, protected dialog: MatDialog,protected baseLoaderService: BaseLoaderService, protected router: Router) {

   }

  ngOnInit(): void {
    this.addNewTags();
    this.getTagCategory();
    this.categoryTags = [  
        {"id": 17, "name": "Food & Drink"},
        {"id": 15,"name": "Fun & Leisure"}
    ];
    console.log(this.categoryTags);
  }


  addNewTags()
  {
    this.form = new FormGroup({
      'tag': new FormControl('', Validators.required),
      'category_id': new FormControl('', Validators.required)
    })
  }

  getValue(name: any) {
    return this.form.get(name);
}


  onLocationBack(): void {
    window.history.back();
}

getTagCategory(){
  let url = 'getcategories';

  this.mainService.getList(appConfig.base_urlV2 + url, false , 2)
  .then(result =>{
    if(result.status == 200 && result.data)
    {
      this.categoryTags = result.data;
    }
    else
    {
      // this.categoryTags = [];

      // let dialogRef = this.dialog.open(AlertDialog, {autoFocus: false});
      // let cm = dialogRef.componentInstance;
      // cm.heading = 'ERROR';
      // cm.message = result.error.message;
      // cm.cancelButtonText = 'Ok';
      // cm.type = 'error';

    }
  })
}

doSubmit()
{
  let  url = 'addtag';
  console.log('form values...', this.form.value);
  this.mainService.postData(appConfig.base_url_slug + url, this.form.value, 2).then(result =>{
    
    if(result.status == 200 || result.status == 201)
    {
      this.router.navigateByUrl('main/outlets_tags');
      let dialogRef = this.dialog.open(AlertDialog, {autoFocus: false});
      let cm = dialogRef.componentInstance;
      cm.heading = 'SUCCESS';
      cm.message = 'Tag has Added';
      cm.cancelButtonText = 'Ok';
      cm.type = 'info';
    }
    else{
      let dialogRef = this.dialog.open(AlertDialog, { autoFocus: false });
      let cm = dialogRef.componentInstance;
      cm.heading = 'Error';
      cm.message = result.error.message;
      cm.cancelButtonText = 'Ok';
      cm.type = 'error';
    }
  },
  Error =>{
    let dialogRef = this.dialog.open(AlertDialog, { autoFocus: false });
    let cm = dialogRef.componentInstance;
    cm.heading = 'Error';
    cm.message = "Internal Server Error.";
    cm.cancelButtonText = 'Ok';
    cm.type = 'error';
  }
  )

}

}
