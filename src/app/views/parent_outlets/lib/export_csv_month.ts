import { OnInit, Component } from "@angular/core";
import { MatDialogRef } from "@angular/material/dialog";

import { MainService } from "../services/main.service";
import * as moment from 'moment';
import { FormBuilder, Validators, FormGroup } from "@angular/forms";

import { OwlDateTimeComponent, DateTimeAdapter, OWL_DATE_TIME_FORMATS, OWL_DATE_TIME_LOCALE } from 'ng-pick-datetime';
import * as _moment from 'moment';
import { Moment } from 'moment';

@Component({
    selector: 'export_csv_month',
    templateUrl: './export_csv_month.html'
})
export class ExportMonthDialog implements OnInit {
    isLoading: boolean;
    heading: string = '';
    message: string = '';
    showLoading: boolean;
    Form: FormGroup;
    selectedDateRange: any;
    filter_values: any[] = [];
    EndDate: any;
    StartDate: any;
    nextMonth: Date;
    isMonthYear: any;
    isOnlyMonth: any;
    DropDown: any;

    constructor(protected mainApiService: MainService, protected formbuilder: FormBuilder, protected dialogRef: MatDialogRef<ExportMonthDialog>) {
        this.isLoading = false;
        this.showLoading = false;

        this.Form = this.formbuilder.group({
            dateRange: [null, [Validators.required]],
            start_date: [null, [Validators.required]],
            end_date: [null, [Validators.required]],
            month: [null, [Validators.required]],
            year: [null, [Validators.required]],

        });


        this.nextMonth = new Date();
        this.nextMonth.setMonth(this.nextMonth.getMonth() + 1);

    }

    ngOnInit() {
    }

    onSelectDateRange(): void {
        let abc1 = moment(this.selectedDateRange).format('YYYY-MM-DD');
        this.Form.get('start_date').setValue(abc1);

        this.nextMonth.setMonth(new Date(abc1).getMonth() + 1);

        // let abc2 = moment(this.selectedDateRange[1]).format('YYYY-MM-DD');
        // this.Form.get('end_date').setValue(abc2);

    }
    onSelectMonthYear(): void {

            
             

        console.log("m", this.Form.get('month')?.value)

        console.log("y", this.Form.get('year').value)

    }


    onStartDate(): void {
        let abc = moment(this.StartDate).format('YYYY-MM-DD');
        this.Form.get('start_date')!.setValue(abc);
        this.nextMonth = new Date(abc);

        this.nextMonth.setMonth(this.nextMonth.getMonth() + 1);
    }

    onEndDate(): void {
        let abc = moment(this.EndDate).format('YYYY-MM-DD');
        this.Form.get('end_date')?.setValue(abc);

        



    }

    getValue(name: string | (string | number)[]) {
        return this.Form.get(name);
    }

    onCancelClick(): void {
        this.dialogRef.close(false);
    }

    onSubmitClick(): void {
      
        {
            let dict = {
                start_date: this.Form.get('start_date').value,
                end_date: this.Form.get('end_date').value,
                month:this.Form.get('month').value,
                year:this.Form.get('year').value,
            };
            this.dialogRef.close(dict);
        }
       
    }
}
