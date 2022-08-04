import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { MainService } from './../../../services/main.service';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { appConfig } from '../../../../config';
// import moment = require('moment');
import * as moment from 'moment';

@Component({
  selector: 'app-spend-xyform',
  templateUrl: './spend-xyform.component.html',
  styleUrls: ['./spend-xyform.component.css']
})
export class SpendXyformComponent implements OnInit {

  Form: FormGroup;
  isLoading: boolean = false;
  isEditing = false;
  currentDate = new Date();
  StartDate: any;
  EndDate: any;
  isInvalid: boolean = false;
  flag: any = null;
  sub: Subscription = new Subscription();
  id: any;
  Promotion: any;
  isInvalidForOptional: any;
  constructor(private formbuilder: FormBuilder, private _route: ActivatedRoute , private router: Router, private mainApiService: MainService) {
    this.Form = this.formbuilder.group({
      name: ['', Validators.required],
      type: ['sxgyf'],
      calculation_type: ['general'],
      per_user: ['', Validators.required],
      exclusion_status: ['', Validators.required],
      renew: ['', Validators.required],
      spend1: ['', Validators.required],
      get1: ['', Validators.required],
      spend2: ['', Validators.required],
      get2: ['', Validators.required],
      spend3: ['', Validators.required],
      get3: ['', Validators.required],
      spend4: ['', Validators.required],
      get4: ['', Validators.required],
      spend5: [''],
      get5: [''],
      from_date: [null, [Validators.required]],
			to_date: [null, [Validators.required]],
			from_time: ['',],
			to_time: ['',],
			// getxy: this.formbuilder.array([])
		});
   }

  ngOnInit() {
    // this.createForm();

    this.sub = this._route.params.subscribe(params =>
      {
        this.id = params['id'];

        if (this.id != 'add')
        {
          this.isEditing = true;
          this.Form.addControl('id', new FormControl(this.id));
          let abc = localStorage.getItem('spendX') as string;
          this.Promotion = JSON.parse(abc);
          console.log(this.Promotion);
          this.Form.patchValue(this.Promotion);
          this.StartDate =  new Date( this.Form.get('from_date')?.value + ' ' + this.Form.get('from_time')?.value );
          this.EndDate = new Date(this.Form.get('to_date')?.value + ' ' + this.Form.get('to_time')?.value);

          this.Promotion.promotion_sxgyf.forEach((element : any, index : any) => {
            this.Form.get('spend' + (index + 1))?.setValue(element.spend_x);
            this.Form.get('get' + (index + 1))?.setValue(element.get_yf);
          });
          // this.Form.patchValue({
          //   from_date: this.Promotion.from_date,
          //   from_time: this.Promotion.from_time,
          //   to_date: this.Promotion.to_date,
          //   to_time: this.Promotion.to_time,
          // });

          console.log(this.Form.value);

          if (this.Promotion.renew == 0) {
            this.Form.addControl('redemptions', new FormControl(null, [Validators.required]));
            this.Form.get('redemptions')?.setValue(this.Promotion.redemptions);
          }
        }
        else
        {
          this.isEditing = false;
          this.Form.reset();
        }

      });
  }

  // isEditing() {

  // }

  getValue(name : any) {
		return this.Form.get(name);
  }

  doSubmit() {
    this.isLoading = true;
    let method: any;
    if (!this.isEditing) {
      method = 'addPromotion';
    } else {
      method = 'updatePromotion/' + this.Promotion.id;
    }

    let data = {...this.Form.value};
    this.setSXGY(data);
    this.clearAllKeys(data);
    console.log(data);
    this.mainApiService.postData(appConfig.base_url_slug + method, data, 2).then(response => {
      this.isLoading = false;
      if (response.status == 200) {
        this.router.navigate(['/main/spendXYList']);
      }
    });
  }

  setSXGY(data : any) {

    data['sxgyf_data'] = [
    {spend_x: this.Form.get('spend1')?.value, get_yf: this.Form.get('get1')?.value},
    {spend_x: this.Form.get('spend2')?.value, get_yf: this.Form.get('get2')?.value},
    {spend_x: this.Form.get('spend3')?.value, get_yf: this.Form.get('get3')?.value},
    {spend_x: this.Form.get('spend4')?.value, get_yf: this.Form.get('get4')?.value},
  ];

   if (this.Form.get('spend5')?.value && this.Form.get('get5')?.value) {
     data['sxgyf_data'].push({spend_x: this.Form.get('spend5')?.value, get_yf: this.Form.get('get5')?.value});
   }
   data['calculation_type'] = 'general';
   data['type'] = 'sxgyf';
  }

  clearAllKeys(data : any) {
    delete data['spend1'];
    delete data['get1'];
    delete data['spend2'];
    delete data['spend3'];
    delete data['spend4'];
    delete data['spend5'];
    delete data['get2'];
    delete data['get3'];
    delete data['get4'];
    delete data['get5'];
  }

  onSelectChange(event : any): void {
		if (event.value == 0) {
			this.Form.addControl('redemptions', new FormControl(null, [Validators.required]));
		}
		else {
			this.Form.removeControl('redemptions');
		}
  }

  onStartDate(): void
	{
		let abc = moment(this.StartDate).format('YYYY-MM-DD');
		let starttime = moment(this.StartDate).format('HH:mm:ss');

		this.Form.get('from_date')?.setValue(abc);
		this.Form.get('from_time')?.setValue(starttime);
	}

	onEndDate(): void
	{
		let abc = moment(this.EndDate).format('YYYY-MM-DD');
		let Endtime = moment(this.EndDate).format('HH:mm:ss');

		this.Form.get('to_date')?.setValue(abc);
		this.Form.get('to_time')?.setValue(Endtime);
	}

  // createForm() {
  //   this.Form = this.formbuilder.group({
  //     name: ['', Validators.required],
  //     type: ['sxgyf'],
  //     calculation_type: ['general'],
  //     per_user: ['', Validators.required],
  //     exclusion_status: ['', Validators.required],
  //     renew: ['', Validators.required],
  //     spend1: ['', Validators.required],
  //     get1: ['', Validators.required],
  //     spend2: ['', Validators.required],
  //     get2: ['', Validators.required],
  //     spend3: ['', Validators.required],
  //     get3: ['', Validators.required],
  //     spend4: ['', Validators.required],
  //     get4: ['', Validators.required],
  //     spend5: [''],
  //     get5: [''],
  //     from_date: [null, [Validators.required]],
	// 		to_date: [null, [Validators.required]],
	// 		from_time: ['',],
	// 		to_time: ['',],
	// 		// getxy: this.formbuilder.array([])
	// 	});
  // }

  onLocationBack(): void {
    window.history.back();
  }

  check() {

    console.log(this.getValue('spend5')?.value);
    console.log(this.getValue('get5')?.value);
    if (this.getValue('spend5')?.value == null && this.getValue('get5')?.value == null) {
      this.isInvalidForOptional = false;
      return;
    }

    if (this.getValue('spend5')?.value != '' || this.getValue('get5')?.value != '') {
      if (this.getValue('spend5')?.value < this.getValue('get5')?.value && this.getValue('spend5')?.value > this.getValue('spend4')?.value) {
        this.isInvalidForOptional = false;
      } else {
        this.isInvalidForOptional = true;
      }
    } else {
      this.isInvalidForOptional = false;
    }

    console.log(this.isInvalidForOptional)

  }

  checkValidity() {
    console.log('fired');
    if(this.getValue('spend2')?.value > this.getValue('spend1')?.value &&
       this.getValue('spend3')?.value > this.getValue('spend2')?.value &&
       this.getValue('spend4')?.value > this.getValue('spend3')?.value &&
       this.getValue('spend1')?.value < this.getValue('get1')?.value &&
       this.getValue('spend2')?.value < this.getValue('get2')?.value &&
       this.getValue('spend3')?.value < this.getValue('get3')?.value &&
       this.getValue('spend4')?.value < this.getValue('get4')?.value
       ) {
         this.isInvalid = false;
       } else {
         this.isInvalid = true;
       }
       console.log(this.isInvalid);
       console.log(this.Form)
  }



  validate(sp1 : any,sp2 : any) {
    // this.flag = false;
    // if (!sp1 || !sp2) {
    //   this.isInvalid = true;
    // } else {
    //   this.isInvalid = sp1 > sp2 ? true : false;
    //   if (this.isInvalid) {
    //      this.flag = true;
    //   }
    // }
    // console.log(this.isInvalid);
    return sp1 < sp2;
  }

  hasValue(spend : any, get : any) {
    return spend != null || get != null
  }


  validateSpendX(sp1 : any,sp2 : any) {
    // console.log(sp1 > sp2);
    return sp1 >= sp2;
  }

  unique(sp1 : any, sp2 : any) {
    console.log(sp1 > sp2);
  }

}
