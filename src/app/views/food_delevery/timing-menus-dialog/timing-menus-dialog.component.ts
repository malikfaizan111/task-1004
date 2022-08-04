import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
	import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { appConfig } from '../../../../config';
import { AlertDialog } from '../../../lib';
import { MainService } from '../../../services';
import { TimingOutletDialog } from '../../outlets/timing.dialog';

interface DAY {
	id: any,
	day: any,
	start_time: any,
	end_time: any,
}
@Component({
	selector: 'app-timing-menus-dialog',
	templateUrl: './timing-menus-dialog.component.html',
	styleUrls: ['./timing-menus-dialog.component.css']
})

export class TimingMenusDialogComponent implements OnInit {

	isLoading: boolean;
	showLoading: boolean;
	Form: FormGroup;
	data: any = [];
	updatedData: any = []
	menuId: any;
	menuType: any;
	mode = 'add';
	days: any = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday", "everyday"];
	MondayObj: DAY;
	TuesdayObj: DAY;
	WednesdayObj: DAY;
	ThursdayObj: DAY;
	FridayObj: DAY;
	SaturdayObj: DAY;
	SundayObj: DAY;
	EverydayObj: DAY;
	// MondayObj =
	// 	{
	// 		id: null,
	// 		day: null,
	// 		start_time: null,
	// 		end_time: null,
	// 	}
	// TuesdayObj =
	// 	{
	// 		id: null,
	// 		day: null,
	// 		start_time: null,
	// 		end_time: null,
	// 	}
	// WednesdayObj =
	// 	{
	// 		id: null,
	// 		day: null,
	// 		start_time: null,
	// 		end_time: null,
	// 	}
	// ThursdayObj =
	// 	{
	// 		id: null,
	// 		day: null,
	// 		start_time: null,
	// 		end_time: null,
	// 	}
	// FridayObj =
	// 	{
	// 		id: null,
	// 		day: null,
	// 		start_time: null,
	// 		end_time: null,
	// 	}
	// SaturdayObj =
	// 	{
	// 		id: null,
	// 		day: null,
	// 		start_time: null,
	// 		end_time: null,
	// 	}
	// SundayObj =
	// 	{
	// 		id: null,
	// 		day: null,
	// 		start_time: null,
	// 		end_time: null,
	// 	}
	// EverydayObj =
	// 	{
	// 		id: null,
	// 		day: null,
	// 		start_time: null,
	// 		end_time: null,
	//   }

	filteredOptions?: Observable<string[]>;
	startTimeMon: any;
	menuTiming: any;
	dataitems?: { day: any; start_time: any; end_time: any; };
	dataitemsUpdate?: { day: any; start_time: any; end_time: any; };
	start_time: any;

	constructor(protected mainApiService: MainService, protected dialogRef: MatDialogRef<TimingOutletDialog>, protected dialog: MatDialog, protected formbuilder: FormBuilder) {
		this.isLoading = false;
		this.showLoading = false;
		this.MondayObj = {} as DAY;
		this.TuesdayObj = {} as DAY;
		this.WednesdayObj = {} as DAY;
		this.ThursdayObj = {} as DAY;
		this.FridayObj = {} as DAY;
		this.SaturdayObj = {} as DAY;
		this.SundayObj = {} as DAY;
		this.EverydayObj = {} as DAY;

		this.Form = this.formbuilder.group({
			parentOutlet: ['', [Validators.required, Validators.maxLength(50)]],
		});

	}

	ngOnInit() {
		this.getMenuTimings();
	}

	onCancelClick(): void {
		this.dialogRef.close(false);
	}

	onSubmitClick(): void {
		this.isLoading = true;
		let parent = this.Form.get('parentOutlet')?.value;
		let data =
		{
			outlet_id: this.menuId,

		}
		this.mainApiService.postData(appConfig.base_url_slug + 'addOutletParent', data)
			.then(result => {
				if ((result.status == 200 || result.status == 201) && result.data) {
					this.dialogRef.close(true);
					this.isLoading = false;
				}
				else {
					this.isLoading = false;
					let dialogRef = this.dialog.open(AlertDialog, { autoFocus: false });
					let cm = dialogRef.componentInstance;
					cm.heading = 'Error';
					cm.message = 'Internal Server Error';
					cm.cancelButtonText = 'Ok';
					cm.type = 'error';
				}
			});
	}

	getMenuTimings() {

		let data = {
			"menu_id": this.menuId,
			"menu_type": this.menuType,
			"data_ids": ""
		};
		let url = 'viewMenuTimings';

		this.mainApiService.postData(appConfig.base_url_slug + url, data, 2)
			.then(result => {
				if ((result.status == 200 || result.status == 201) && result.data) {
					if (result.status == 200 && result.data) {
						if (result.data.length != 0) {
							this.mode = 'edit';
						}
						this.menuTiming = result.data;
						this.updatedData = result.data;
						this.menuTiming.forEach((element: any) => {
							console.log("elementday", element.day)

							if (element.day == this.days[0]) {
								this.MondayObj = element;
							}
							else if (element.day == this.days[1]) {
								this.TuesdayObj = element;
							}
							else if (element.day == this.days[2]) {
								this.WednesdayObj = element;
							}
							else if (element.day == this.days[3]) {
								this.ThursdayObj = element;
							}
							else if (element.day == this.days[4]) {
								this.FridayObj = element;
							}
							else if (element.day == this.days[5]) {
								this.SaturdayObj = element;
							}
							else if (element.day == this.days[6]) {
								this.SundayObj = element;
							}
							else if (element.day == this.days[7]) {
								this.EverydayObj = element;
							}
						});
					}
					else {
						this.menuTiming = [];
					}
				}
				else {

				}
			});

	}

	onAddClick(): void {
		this.addTimingData();
		var tempArray = [];
		// this.data.push(this.dataitems);
		for (let i = 0; i < this.data.length; i++) {
			if (this.data[i].start_time != null && this.data[i].end_time != null && this.data[i].start_time != "" && this.data[i].end_time != "") {
				tempArray.push(this.data[i]);
			}
		}

		let data = { "data": tempArray, "menu_id": this.menuId, "menu_type": this.menuType };

		console.log('DATA: ', data)
		let url = 'addMenuTimings'
		this.mainApiService.postData(appConfig.base_url_slug + url, data, 2)
			.then(result => {
				if ((result.status == 200 || result.status == 201) && result.data) {
					this.getMenuTimings();
					// this.dialogRef.close(false);
					this.isLoading = false;
					let dialogRef = this.dialog.open(AlertDialog, { autoFocus: false });
					let cm = dialogRef.componentInstance;
					cm.heading = 'SUCCESS';
					cm.message = 'ADDED SUCCESSFULLY';
					cm.cancelButtonText = 'Ok';
					cm.type = 'success';
				}
				else {
					this.isLoading = false;
					let dialogRef = this.dialog.open(AlertDialog, { autoFocus: false });
					let cm = dialogRef.componentInstance;
					cm.heading = 'Error';
					cm.message = 'Internal Server Error';
					cm.cancelButtonText = 'Ok';
					cm.type = 'error';
				}
			});

	}
	onUpdateClick(): void {
		this.updateTimingData();
		var tempArray: any[] = [];

		for (let i = 0; i < this.data.length; i++) {
			if (this.data[i].start_time != null && this.data[i].end_time != null && this.data[i].start_time != "" && this.data[i].end_time != "") {
				tempArray.push(this.data[i]);
			}
		}
		let addObjs: any[] = [];
		let days = this.updatedData.map((obj: any) => obj.day);
		tempArray.forEach(element => {
			if (!days.includes(element.day)) {
				addObjs.push(element);
				tempArray.splice(tempArray.indexOf(element));
			}
		});

		if (addObjs.length != 0) {
			let url = 'addMenuTimings'
			let data = { "data": addObjs, "menu_id": this.menuId, "menu_type": this.menuType };
			this.mainApiService.postData(appConfig.base_url_slug + url, data, 2)
				.then(result => {
					if ((result.status == 200 || result.status == 201) && result.data) {
					}
					else {
						this.isLoading = false;
						let dialogRef = this.dialog.open(AlertDialog, { autoFocus: false });
						let cm = dialogRef.componentInstance;
						cm.heading = 'Error';
						cm.message = 'Internal Server Error';
						cm.cancelButtonText = 'Ok';
						cm.type = 'error';
					}
				});
		}
		console.log(addObjs);

		let data = { "data": tempArray, "menu_id": this.menuId, "menu_type": this.menuType };
		console.log('DATA: ', this.data)
		let url = 'updateMenuTimings'
		this.mainApiService.postData(appConfig.base_url_slug + url, data, 2)
			.then(result => {
				if ((result.status == 200 || result.status == 201) && result.data) {
					this.getMenuTimings();
					// this.dialogRef.close(false);
					this.isLoading = false;
					let dialogRef = this.dialog.open(AlertDialog, { autoFocus: false });
					let cm = dialogRef.componentInstance;
					cm.heading = 'SUCCESS';
					cm.message = 'UPDATED SUCCESSFULLY';
					cm.cancelButtonText = 'Ok';
					cm.type = 'success';
				}
				else {
					this.isLoading = false;
					let dialogRef = this.dialog.open(AlertDialog, { autoFocus: false });
					let cm = dialogRef.componentInstance;
					cm.heading = 'Error';
					cm.message = 'Internal Server Error';
					cm.cancelButtonText = 'Ok';
					cm.type = 'error';
				}
			});

	}

	addTimingData() {
		this.data = [];
		this.data.push({
			"day": "monday",
			"start_time": this.MondayObj.start_time,
			"end_time": this.MondayObj.end_time,
		});
		this.data.push({
			"day": "tuesday",
			"start_time": this.TuesdayObj.start_time,
			"end_time": this.TuesdayObj.end_time,
		});
		this.data.push({
			"day": "wednesday",
			"start_time": this.WednesdayObj.start_time,
			"end_time": this.WednesdayObj.end_time,
		});
		this.data.push({
			"day": "thursday",
			"start_time": this.ThursdayObj.start_time,
			"end_time": this.ThursdayObj.end_time,
		});
		this.data.push({
			"day": "friday",
			"start_time": this.FridayObj.start_time,
			"end_time": this.FridayObj.end_time,
		});
		this.data.push({
			"day": "saturday",
			"start_time": this.SaturdayObj.start_time,
			"end_time": this.SaturdayObj.end_time,
		});
		this.data.push({
			"day": "sunday",
			"start_time": this.SundayObj.start_time,
			"end_time": this.SundayObj.end_time,
		});
		this.data.push({
			"day": "everyday",
			"start_time": this.EverydayObj.start_time,
			"end_time": this.EverydayObj.end_time,
		});
	}

	updateTimingData() {
		this.data = [];
		this.data.push({
			"id": this.MondayObj.id,
			"day": "monday",
			"start_time": this.MondayObj.start_time,
			"end_time": this.MondayObj.end_time,
		});
		this.data.push({
			"id": this.TuesdayObj.id,
			"day": "tuesday",
			"start_time": this.TuesdayObj.start_time,
			"end_time": this.TuesdayObj.end_time,
		});
		this.data.push({
			"id": this.WednesdayObj.id,
			"day": "wednesday",
			"start_time": this.WednesdayObj.start_time,
			"end_time": this.WednesdayObj.end_time,
		});
		this.data.push({
			"id": this.ThursdayObj.id,
			"day": "thursday",
			"start_time": this.ThursdayObj.start_time,
			"end_time": this.ThursdayObj.end_time,
		});
		this.data.push({
			"id": this.FridayObj.id,
			"day": "friday",
			"start_time": this.FridayObj.start_time,
			"end_time": this.FridayObj.end_time,
		});
		this.data.push({
			"id": this.SaturdayObj.id,
			"day": "saturday",
			"start_time": this.SaturdayObj.start_time,
			"end_time": this.SaturdayObj.end_time,
		});
		this.data.push({
			"id": this.SundayObj.id,
			"day": "sunday",
			"start_time": this.SundayObj.start_time,
			"end_time": this.SundayObj.end_time,
		});
		this.data.push({
			"id": this.EverydayObj.id,
			"day": "everyday",
			"start_time": this.EverydayObj.start_time,
			"end_time": this.EverydayObj.end_time,
		});
	}

	removeTime(day: any) {
		let obj = {};
		let dataId: any;
		this.isLoading = true;
		if (day == this.days[0]) {
			dataId = this.MondayObj.id;
			this.MondayObj = {} as DAY;
		}
		else if (day == this.days[1]) {
			dataId = this.TuesdayObj.id;
			this.TuesdayObj = {} as DAY;
		}
		else if (day == this.days[2]) {
			dataId = this.WednesdayObj.id;
			this.WednesdayObj = {} as DAY;
		}
		else if (day == this.days[3]) {
			dataId = this.ThursdayObj.id;
			this.ThursdayObj = {} as DAY;
		}
		else if (day == this.days[4]) {
			dataId = this.FridayObj.id;
			this.FridayObj = {} as DAY;
		}
		else if (day == this.days[5]) {
			dataId = this.SaturdayObj.id;
			this.SaturdayObj = {} as DAY;
		}
		else if (day == this.days[6]) {
			dataId = this.SundayObj.id;
			this.SundayObj = {} as DAY;
		}
		else if (day == this.days[7]) {
			dataId = this.EverydayObj.id;
			this.EverydayObj = {} as DAY;
		}

		let url = 'removeMenuTimings';
		let data = { "data_ids": dataId.toString(), "menu_id": this.menuId, "menu_type": this.menuType };
		this.mainApiService.postData(appConfig.base_url_slug + url, data, 2)
			.then(result => {
				if ((result.status == 200 || result.status == 201) && result.data) {
					this.getMenuTimings();
					this.isLoading = false;
				}
				else {
					this.isLoading = false;
					let dialogRef = this.dialog.open(AlertDialog, { autoFocus: false });
					let cm = dialogRef.componentInstance;
					cm.heading = 'Error';
					cm.message = 'Internal Server Error';
					cm.cancelButtonText = 'Ok';
					cm.type = 'error';
				}
			});
	}

	onClose(): void {
		this.dialogRef.close(true);
	}
}
