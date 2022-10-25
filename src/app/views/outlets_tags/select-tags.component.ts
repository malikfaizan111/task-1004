import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-select-tags',
  templateUrl: './select-tags.component.html',
  styles: [
    
  ]
})
export class SelectTagsComponent implements OnInit {

  form: FormGroup = new FormGroup({})
  arr: Array<any> = []
  constructor(private formBuilder : FormBuilder) { 
    this.arr = [
      { food: 'dgfdgdgfd', beauty: 'dfdfdsfds', fun : 'dfdsfdsfds', retail: 'dsgdsgdsg', cuisine: 'dsfdsgdsg', attributes: 'dgdsgds'},
      { food: 'dgfdgdgfd', beauty: 'dfdfdsfds', fun : 'dfdsfdsfds', retail: 'dsgdsgdsg', cuisine: 'dsfdsgdsg', attributes: 'dgdsgds'},
      { food: 'dgfdgdgfd', beauty: 'dfdfdsfds', fun : 'dfdsfdsfds', retail: 'dsgdsgdsg', cuisine: 'dsfdsgdsg', attributes: 'dgdsgds'},
      { food: 'dgfdgdgfd', beauty: 'dfdfdsfds', fun : 'dfdsfdsfds', retail: 'dsgdsgdsg', cuisine: 'dsfdsgdsg', attributes: 'dgdsgds'},
      { food: 'dgfdgdgfd', beauty: 'dfdfdsfds', fun : 'dfdsfdsfds', retail: 'dsgdsgdsg', cuisine: 'dsfdsgdsg', attributes: 'dgdsgds'},
      { food: 'dgfdgdgfd', beauty: 'dfdfdsfds', fun : 'dfdsfdsfds', retail: 'dsgdsgdsg', cuisine: 'dsfdsgdsg', attributes: 'dgdsgds'}
    ]

    
  }

  ngOnInit(): void {
    this.creatSelectForm()
  }



  creatSelectForm()
  {
    this.form = this.formBuilder.group({
      health : this.formBuilder.array([]),
      beauty: this.formBuilder.array([]),
      fun: this.formBuilder.array([]),
      retail: this.formBuilder.array([]),
      cuisine: this.formBuilder.array([]),
      attributes: this.formBuilder.array([])
    })
    
  }

  get health() {
    return this.form.controls.health as FormArray;
  }
  get beauty() {
    return this.form.controls.beauty as FormArray;
  }
  get fun() {
    return this.form.controls.fun as FormArray;
  }
  get retail() {
    return this.form.controls.retail as FormArray;
  }
  get cuisine() {
    return this.form.controls.cuisine as FormArray;
  }
  get attributes() {
    return this.form.controls.attributes as FormArray;
  }



  

//   convertToValue(key: string) {
//     debugger
//   return this.form.value[key].map((x, i) => x && this[key][i]).filter(x => !!x);
// }

  // get tags() {
  //   return this.form.get("tags") as FormArray
  // }

  

  onLocationBack(): void 
  {
    window.history.back();
  }

  doSubmit()
  {
    // const valueToStore = Object.assign({}, this.form.value, {
    //   health: this.convertToValue('health'),
    //   beauty: this.convertToValue('beauty'),
    //   fun: this.convertToValue('fun'),
    //   retail: this.convertToValue('retail'),
    //   cuisine: this.convertToValue('cuisine'),
    //   attributes: this.convertToValue('attributes')

    // });
    // console.log(valueToStore);
    console.log(this.form.value)
  }


  

}
