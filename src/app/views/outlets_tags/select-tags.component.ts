import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';

@Component({
  selector: 'app-select-tags',
  templateUrl: './select-tags.component.html',
  styles: [
    
  ]
})
export class SelectTagsComponent implements OnInit {

  form: FormGroup 

  data = [ 

            { 
    
                "id": 17, 
    
                "name": "Food & Drink", 
    
                "category_tags": [ 
    
                    { 
    
                        "id": 2, 
    
                        "tag": "Fun" 
    
                    }, 
    
                    { 
    
                        "id": 4, 
    
                        "tag": "Outdoor" 
    
                    },
    
    
                ], 
    
                "logo": "", 
    
                "image": "", 
    
                "description": "" 
    
            }, 
    
            { 
    
                "id": 15, 
    
                "name": "Beauty & Health", 
    
                "category_tags": [ 
    
                    { 
    
                        "id": 7, 
    
                        "tag": "test" 
    
                    },
    { 
    
                          "id": 1, 
      
                          "tag": "test" 
      
                      } 
    
                ], 
    
                "logo": "", 
    
                "image": "", 
    
                "description": "" 
    
            },
    { 
    
                  "id": 19, 
      
                  "name": "Fun & leasure", 
      
                  "category_tags": [ 
      
                      { 
      
                          "id": 10, 
      
                          "tag": "cool" 
      
                      }, 
      
                      { 
      
                          "id": 13, 
      
                          "tag": "Outdoor cool" 
      
                      },
      
      
                  ], 
      
                  "logo": "", 
      
                  "image": "", 
      
                  "description": "" 
      
              }, 
    
        ];

    countarray =[];
    countOutlets = 12;
    Color = {disable: '#757575', enable: '#FFFFFF'};
    btn = {'color': '#757575'};

    

  constructor(private formBuilder : FormBuilder) { 

    let groupFormArray = {}

    for(let i=0; i < this.data.length; i++){
      groupFormArray[this.data[i].id] = new FormArray([]) 
    }

    this.form = this.formBuilder.group(groupFormArray);

     this.addCheckboxes()
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
    let mergeIds = [].concat.apply([], idArray);

    let arrstring = mergeIds.map((x) => String(x))

    let payLoad = {
      'tags': arrstring
    }

    console.log('mazhar', payLoad)
    }

}
