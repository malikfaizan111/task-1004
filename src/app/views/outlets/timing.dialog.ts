import { OnInit, Component } from "@angular/core";
import { MatDialogRef, MatDialog } from "@angular/material/dialog";
import { MainService } from "../../services";
import { AlertDialog } from "../../lib";
import { Validators, FormBuilder, FormGroup } from "@angular/forms";
import { Observable } from "rxjs";
import { map, startWith } from 'rxjs/operators';

import { appConfig } from "../../../config";
// import { executeViewHooks } from "@angular/core/src/render3/instructions";


@Component({
	selector: 'timing',
	templateUrl: './timing.dialog.html'
})
export class TimingOutletDialog implements OnInit 
{
	[x: string]: any;
	isLoading: boolean;
	showLoading: boolean;
	Form: FormGroup;
	data: any = []
	OutletID: any;
	days: any = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday", "everyday"];
	MondayObj =
		{
			id: null,
			day: null,
			start_time: null,
			end_time: null,
		}
	TuesdayObj =
		{
			id: null,
			day: null,
			start_time: null,
			end_time: null,
		}
	WednesdayObj =
		{
			id: null,
			day: null,
			start_time: null,
			end_time: null,
		}
	ThursdayObj =
		{
			id: null,
			day: null,
			start_time: null,
			end_time: null,
		}
	FridayObj =
		{
			id: null,
			day: null,
			start_time: null,
			end_time: null,
		}
	SaturdayObj =
		{
			id: null,
			day: null,
			start_time: null,
			end_time: null,
		}
	SundayObj =
		{
			id: null,
			day: null,
			start_time: null,
			end_time: null,
		}
	EverydayObj =
		{
			id: null,
			day: null,
			start_time: null,
			end_time: null,
		}


	filteredOptions?: Observable<string[]>;
	startTimeMon: any;
	OutletTiming: any;
	dataitems?: { day: any; start_time: any; end_time: any; };
	dataitemsUpdate?: { day: any; start_time: any; end_time: any; };
	start_time: any;

	constructor(protected mainApiService: MainService, protected dialogRef: MatDialogRef<TimingOutletDialog>, protected dialog: MatDialog, protected formbuilder: FormBuilder) 
	{
		this.isLoading = false;
		this.showLoading = false;

		this.Form = this.formbuilder.group({
			parentOutlet: ['', [Validators.required, Validators.maxLength(50)]],
		});

	}

	ngOnInit() 
	{
		this.getOutletTiming();
	}

	onCancelClick(): void
	{
		this.dialogRef.close(false);
	}

	onSubmitClick(): void
	{
		this.isLoading = true;
		let parent = this.Form.get('parentOutlet')?.value;
		let data =
		{
			outlet_id: this.OutletID,

		}
		this.mainApiService.postData(appConfig.base_url_slug + 'addOutletParent', data)
			.then(result =>
			{
				if ((result.status == 200 || result.status == 201) && result.data) 
				{
					this.dialogRef.close(true);
					this.isLoading = false;
				}
				else 
				{
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
	getOutletTiming(): void 
	{

		let url = "viewOutletTiming/" + this.OutletID;
		this.mainApiService.getList(appConfig.base_url_slug + url, true, 2)
			.then(result =>
			{
				if (result.status == 200 && result.data) 
				{
					this.OutletTiming = result.data;
					this.OutletTiming.forEach((element : any) =>
					{
						console.log("elementday", element.day)
						// for (let i = 0; i <= this.days.length; i++)
						// {
						if (element.day == this.days[0])
						{
							this.MondayObj = element;
						}
						else if (element.day == this.days[1])
						{
							this.TuesdayObj = element;
						}
						else if (element.day == this.days[2])
						{
							this.WednesdayObj = element;
						}
						else if (element.day == this.days[3])
						{
							this.ThursdayObj = element;
						}
						else if (element.day == this.days[4])
						{
							this.FridayObj = element;
						}
						else if (element.day == this.days[5])
						{
							this.SaturdayObj = element;
						}
						else if (element.day == this.days[6])
						{
							this.SundayObj = element;
						}
						else if (element.day == this.days[7])
						{
							this.EverydayObj = element;
						}
						// }


					});
					// console.log("check on element MondayObj", this.MondayObj)
					// console.log("check on element TuesdayObj", this.TuesdayObj)
					// console.log("check on element WednesdayObj", this.WednesdayObj)
					// console.log("check on element thursdayObj", this.ThursdayObj)
					// console.log("check on element FridayObj", this.FridayObj)
					// console.log("check on element SaturdayObj", this.SaturdayObj)
					// console.log("check on element SundayObj", this.SundayObj)
					// console.log("check on element EverydayObj", this.EverydayObj)
				}
				else
				{
					this.OutletTiming = [];
				}
			});
	}
	onAddClick(): void
	{
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

		// ------------------------------------------------

		// if (items == "monday")
		// {
		// 	this.dataitems =
		// 	 {
		// 		"day": items,
		// 		"start_time": this.MondayObj.start_time,
		// 		"end_time": this.MondayObj.end_time,
		// 	}
		// }
		// else if (items == "tuesday")
		// {
		// 	this.dataitems = 
		// 	{
		// 		"day": items,
		// 		"start_time": this.TuesdayObj.start_time,
		// 		"end_time": this.TuesdayObj.end_time,
		// 	}
		// }
		// else if (items == "wednesday")
		// {
		// 	this.dataitems =
		// 	 {				
		// 		"day": items,
		// 		"start_time": this.WednesdayObj.start_time,
		// 		"end_time": this.WednesdayObj.end_time,
		// 	}
		// }
		// else if (items == "thursday")
		// {
		// 	this.dataitems = 
		// 	{				
		// 		"day": items,
		// 		"start_time": this.ThursdayObj.start_time,
		// 		"end_time": this.ThursdayObj.end_time,
		// 	}
		// }
		// else if (items == "friday")
		// {
		// 	this.dataitems = 
		// 	{				
		// 		"day": items,
		// 		"start_time": this.FridayObj.start_time,
		// 		"end_time": this.FridayObj.end_time,
		// 	}
		// }
		// else if (items == "saturday")
		// {
		// 	this.dataitems =
		// 	 {
		// 		"day": items,
		// 		"start_time": this.SaturdayObj.start_time,
		// 		"end_time": this.SaturdayObj.end_time,
		// 	}
		// }
		// else if (items == "sunday")
		// {
		// 	this.dataitems = 
		// 	{			
		// 		"day": items,
		// 		"start_time": this.SundayObj.start_time,
		// 		"end_time": this.SundayObj.end_time,
		// 	}
		// }
		// else if (items == "everyday")
		// {
		// 	this.dataitems =
		// 	{
		// 		"day": items,
		// 		"start_time": this.EverydayObj.start_time,
		// 		"end_time": this.EverydayObj.end_time,
		// 	}
		// }
		var tempArray = [];
		// this.data.push(this.dataitems);
		for (let i = 0; i < this.data.length; i++) {
			if(this.data[i].start_time != null && this.data[i].end_time != null  && this.data[i].start_time != "" && this.data[i].end_time != "" ){
				tempArray.push(this.data[i]);
			}
		}
	
		var x = { "data": tempArray, "outlet_id": this.OutletID };

		console.log('DATA: ', this.data)
		let url = 'addOutletTiming'
		this.mainApiService.postData(appConfig.base_url_slug + url, x, 2)
			.then(result =>
			{
				if ((result.status == 200 || result.status == 201) && result.data) 
				{
					this.getOutletTiming();
					// this.dialogRef.close(false);
					this.isLoading = false;
					let dialogRef = this.dialog.open(AlertDialog, { autoFocus: false });
					let cm = dialogRef.componentInstance;
					cm.heading = 'SUCCESS';
					cm.message = 'ADDED SUCCESSFULLY';
					cm.cancelButtonText = 'Ok';
					cm.type = 'success';
				}
				else 
				{
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
	onUpdateClick(): void
	{
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

		var tempArray = [];
	
		for (let i = 0; i < this.data.length; i++) {
			if(this.data[i].start_time != null && this.data[i].end_time != null  && this.data[i].start_time != "" && this.data[i].end_time != "" ){
				tempArray.push(this.data[i]);
			}
		}
	
		var x = { "data": tempArray, "outlet_id": this.OutletID };
		console.log('DATA: ', this.data)
		let url = 'updateOutletTiming'
		this.mainApiService.postData(appConfig.base_url_slug + url, x, 2)
			.then(result =>
			{
				if ((result.status == 200 || result.status == 201) && result.data) 
				{
					this.getOutletTiming();
					// this.dialogRef.close(false);
					this.isLoading = false;
					let dialogRef = this.dialog.open(AlertDialog, { autoFocus: false });
					let cm = dialogRef.componentInstance;
					cm.heading = 'SUCCESS';
					cm.message = 'UPDATED SUCCESSFULLY';
					cm.cancelButtonText = 'Ok';
					cm.type = 'success';
				}
				else 
				{
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

	onClose(): void
	{
		this.dialogRef.close(true);
	}

}
