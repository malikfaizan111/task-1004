import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MainService, SharedService} from '../../services';
import { appConfig } from '../../../config';
import { MatDialog } from '@angular/material/dialog';
import { assignDialog } from '../../lib/Assign-Dialog/assign-dialog.component';
import { Router } from '@angular/router';



@Component({
  selector: 'app-select-tags',
  templateUrl: './select-tags.component.html',
  styles: [
    
  ]
})
export class SelectTagsComponent implements OnInit {

  form: FormGroup 
  userAppId: boolean = true
  data: Array<any> = []
  groupFormArray = {}
  outlets: any

    countarray =[];
    countOutlets = [];
    Color = {disable: '#757575', enable: '#FFFFFF'};
    btn = {'color': '#757575'};

    

  constructor(private formBuilder : FormBuilder, protected mainApiService: MainService,protected sharedService: SharedService, protected dialog: MatDialog,protected router: Router) { 
    this.gerOutletsTags()
 
    this.outlets = this.sharedService.getVariable()
    this.form = this.formBuilder.group(this.groupFormArray); 

    // let outletsArray = []
    if(this.outlets){
    for(let i = 0; i < this.outlets.length; i++)
    {
      this.countOutlets.push(parseInt(this.outlets[i]))
    }
  }
  }

  ngOnInit(): void {
    
  }


  get formArray()
  {
    let controls:FormArray
    let controlsArray = []
    for(let i=0; i < this.data.length; i++)
    {
      let name = this.data[i].id
      controls =  this.form.controls[name] as FormArray
      controlsArray.push(controls)
    }
    return controlsArray
  }

  addCheckboxes() 
  {
    for(let i=0; i < this.data.length; i++)
    {
      let categories = this.data[i].category_tags
      for(let j = 0; j < categories.length; j++){
          this.formArray[i].push(new FormControl(false))
      }
    }
  }

  getCount($event)
  {
    let isChecked = $event.checked
    if(isChecked == true){
      this.countarray.push(isChecked)
      
    } else 
    {
      this.countarray.pop()
    }
    if(this.countarray.length == 0)
    {
      this.btn = {'color': this.Color.disable}
    }else
    {
      this.btn = {'color': this.Color.enable}
    }
  }

  onLocationBack(): void 
  {
    window.history.back();
  }

  async gerOutletsTags()
  {
    let url = 'getTags';

    await this.mainApiService.getList(appConfig.base_url_slug + url, this.userAppId, 2 )
    .then((result) => {
      if (result.status == 200  && result.data) 
			{
        this.data = result.data;
        console.log('response', this.data)
			}
			else
			{
        console.log('no success')
			}
    })
    console.log('after', this.data)
    for(let i=0; i < this.data.length; i++){
      this.groupFormArray[this.data[i].id] = new FormArray([]) 
    }
    this.form = this.formBuilder.group(this.groupFormArray);

    this.addCheckboxes()
    console.log('form', this.groupFormArray)
    
  }

  doSubmit()
  {
    let idArray = []
    let selectedtagIds
    for(let i=0; i < this.data.length; i++)
    {
      let id = this.data[i].id
      let category_tags = this.data[i].category_tags
      for(let j =0; j < category_tags.length; j++)
      {
        let values = this.form.value[id]
       selectedtagIds = values.map((checked, j) => checked ? this.data[i].category_tags[j].id : null).filter(v => v !== null);
      }

      idArray.push(selectedtagIds)  
    }

    // debugger
    let mergeIds = [].concat.apply([], idArray);

    

    let payLoad = {
      'tags': mergeIds,
      'outlets': this.countOutlets
    }
    
    debugger;
    this.sharedService.setVariable(payLoad)
    let dialogRef = this.dialog.open(assignDialog, {autoFocus:false, panelClass: 'assignDialog'});
    let cm = dialogRef.componentInstance;
    cm.methodName = 'addOutletCategoryTags';
    // cm.datetoSubmit = mergeIds
    // cm.datetoSubmit = outlets;
    cm.tagsCount = mergeIds.length ;
    cm.outletsCount = this.countOutlets.length ;
  
    dialogRef.afterClosed().subscribe((result)=>{
      this.router.navigateByUrl('/main/outlets_tags');
    })



    }

}
