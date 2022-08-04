import { MatDialog } from '@angular/material/dialog';
import { LocationStrategy } from '@angular/common';
import { MainService } from './../../services/main.service';
import { Component, OnInit } from '@angular/core';
import { appConfig } from '../../../config';
import { Router } from '@angular/router';
import { AlertDialog } from '../../lib';

@Component({
  selector: 'app-delivery-kill-switch',
  templateUrl: './delivery-kill-switch.component.html',
  styleUrls: ['./delivery-kill-switch.component.css']
})
export class DeliveryKillSwitchComponent implements OnInit {

  isLoading = '';
  killSwitch = false;
  title = '';
  body = '';
  switches: any[] = [];
  myOptions = [
    {
      name: 'Parent Item',
      options: [
        {
          name: 'Child Item',
        },
        {
          name: 'Child Item 2',
        }
      ]
    }
  ];
  pokemonGroups: any[] = [{ name: 'pika', value: 'pik' }, { name: 'rods', value: '99', pokemon: [{ value: 'some', viewValue: 'Pokeman' }] }]

  constructor(private mainApiService: MainService, protected dialog: MatDialog, private router: Router, private location: LocationStrategy) { }

  ngOnInit() {
    this.getKillSwitchStatus();
  }

  onChangeSwitch(killSwitch: any) {

  }

  getKillSwitchStatus() {
    let url = 'viewKillSwitch';
    this.mainApiService.getList(appConfig.base_url_slug + url, true, 2).then(response => {
      if (response.status == 200 && response.data) {
        this.switches = response.data;
        this.switches.forEach(v => v.special_status = v.special_status == '0' ? false : true);
        console.log(this.switches);
        // let data = response.data;
        // this.title = data.title;
        // this.body = data.body;
        // this.killSwitch = data.special_status == '0' ? false : true;
      } else if (response.status == 404) {
        console.log(response);
      }
    });
  }

  back() {
    this.location.back();
  }

  updateKillSwitchStatus(switchData: any) {
    this.isLoading = switchData.id;
    let url = 'updateKillSwitch';
    let data: any = {};
    data = switchData;
    data['status'] = switchData.special_status ? '1' : '0';
    this.mainApiService.postData(appConfig.base_url_slug + url, data, 2).then(response => {
      if (response.status == 200) {
        this.isLoading = '';
        this.successPopUp(data);
      } else {
        this.errorPopUp();
      }
    });
  }

  successPopUp(data: any) {
    let deliveryName = data['type'] == 'kill_switch' ? 'UP' : data['type'] == 'bee_delivery_kill_switch' ? 'Bee' : 'Majoor';
    let dialogRef = this.dialog.open(AlertDialog, { autoFocus: false });
    let cm = dialogRef.componentInstance;
    cm.heading = 'Success';
    cm.message = `${deliveryName} delivery kill switch Updated`;
    cm.cancelButtonText = 'Okay';
    cm.type = 'success';
  }

  errorPopUp() {
    let dialogRef = this.dialog.open(AlertDialog, { autoFocus: false });
    let cm = dialogRef.componentInstance;
    cm.heading = 'Error';
    cm.message = `Something went wrong, Please contact support`;
    cm.cancelButtonText = 'Okay';
    cm.type = 'error';
  }
}