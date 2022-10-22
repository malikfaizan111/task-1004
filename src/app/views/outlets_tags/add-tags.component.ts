import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-tags',
  templateUrl: './add-tags.component.html',
  styles: [
    '.tag_btn[disabled] {color: #1F1F1F}'
  ]
})
export class AddTagsComponent implements OnInit {

  form: FormGroup;
  constructor() { }

  ngOnInit(): void {
    this.addNewTags()
  }


  addNewTags()
  {
    this.form = new FormGroup({
      'tag_category': new FormControl('', Validators.required),
      'tag_name': new FormControl('', Validators.required)
    })
  }

  getValue(name: any) {
    return this.form.get(name);
}


  onLocationBack(): void {
    window.history.back();
}

doSubmit()
{
  console.log('form values...', this.form.value)
}

}
