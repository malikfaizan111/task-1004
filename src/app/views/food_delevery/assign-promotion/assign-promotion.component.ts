import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { appConfig } from '../../../../config';
import { MainService } from '../../../services';

@Component({
  selector: 'app-assign-promotion',
  templateUrl: './assign-promotion.component.html',
  styleUrls: ['./assign-promotion.component.scss']
})
export class AssignPromotionComponent implements OnInit {

  Form: FormGroup;
  parentsList: any = [];
  selectedOutlets: any[] = [];
  isLoading: boolean = true;
  isEditing = false;
  searchTimer: any;
  Promotion: any;
  selectedOutlet: any;
  constructor(private formbuilder: FormBuilder, private router: Router, private mainApiService: MainService) {
    this.Form = this.formbuilder.group({
      spend_x: ['', Validators.required],
      get_yf: ['', Validators.required],
      outlets_parent_name: [''],
      // getxy: this.formbuilder.array([])
    });
   }

  ngOnInit() {
    // this.createForm();
    let abc = localStorage.getItem('spendX') as string;
    this.Promotion = JSON.parse(abc);
    if (this.Promotion.outlets_parents.length != 0) {
      //---------------Multiple---------------//
      // this.selectedOutlets = this.Promotion.outlets_parents;
      //---------------Multiple End---------------//
      this.selectedOutlet = this.Promotion.outlets_parents[0];
    }
  }

  // isEditing() {

  // }

  getValue(name: any) {
    return this.Form.get(name);
  }

  doSubmit() {
    this.isLoading = true;
    let method = 'addPromotionToParentOutlet';
    //---------------Multiple-------------------//
    // let parentIds = this.selectedOutlets.map(outlet => outlet.id );
    // let ids = parentIds.join(',');
    // let data = {promotion_id: this.Promotion.id, parent_outlet_id: ids};
    //---------------Multiple End-------------------//
    let data = { promotion_id: this.Promotion.id, parent_outlet_id: this.selectedOutlet.id };
    this.mainApiService.postData(appConfig.base_url_slug + method, data, 2).then(response => {
      if (response.status == 200) {
        this.router.navigate(['/main/spendXYList']);
      }
      this.isLoading = false;
    });
  }

  selectEvent(item: any) {
    console.log('selectEvent', item);
    this.selectedOutlet = item;
    //-----------Multiple-------------//
    // if (!this.selectedOutlets.find(outlet => outlet.id == item.id)){
    //   this.selectedOutlets.push(item);
    // }
    // this.Form.get('outlets_parent_name').setValue(null);
    //-----------Multiple End-------------//

    // if (item) {
    // 	this.Form.get('outlets_parent_id').setValue(item.id);
    // 	this.getOutletsList(item.id);
    // }
  }

  removeOutlet(outlet: any) {
    this.selectedOutlets.splice(this.selectedOutlets.indexOf(outlet), 1);
  }

  onCleared(item: any) {
    // console.log('onCleared', item);
    // this.Form.get('outlets_parent_id').setValue(null);
  }

  onChangeSearch(val: string) {
    var url = "getParents?search=" + val + '&per_page=500';

    clearTimeout(this.searchTimer);
    this.searchTimer = setTimeout(() => {
      this.mainApiService.getList(appConfig.base_url_slug + url).then(response => {
        console.log('onChangeSearch', response);

        this.parentsList = response.data.parents;
      })
    }, 700);
  }

  // createForm() {
    
  // }

  onLocationBack(): void {
    window.history.back();
  }
}
