import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';


@Component({
	selector: 'multi-tag-input',
    templateUrl: './multi-tag-input.component.html',
    styleUrls: ['./multi-tag-input.component.css']
})
export class MultiTagInputComponent implements OnInit {

    @Input() placeholder: any;
    @Input() pattenn: any;
    @Input() required: any;
    @Output() onTagAdd:  EventEmitter<any> = new EventEmitter;
	
    Form: FormGroup;
    @Input() emails: string;
    emailArray: string[];

	constructor(protected formbuilder: FormBuilder) 
	{
        this.Form = this.formbuilder.group({
            name: [null, [Validators.required, Validators.email]],
        });
        this.emails = "";
        this.emailArray = [];
	}

	ngOnInit() 
	{
        if(this.emails != '' && this.emails != null)
        {
            this.emailArray = this.emails.split(',');
        }
    }

    getValue(name : any) 
    {
        return this.Form.get(name);
    }

	onSubmitClick(): void
	{
        if(!this.emailArray.includes(this.Form.get('name')?.value))
        {
            this.emailArray.unshift(this.Form.get('name')?.value);
            this.Form.get('name')?.setValue(null);
    
            let email = this.emailArray.join(',');
            this.onTagAdd.emit(email);
        }
    }
    
    onDeleteEmail(idx : any): void
    {
        this.emailArray.splice(idx, 1);
        let email = this.emailArray.join(',');
        this.onTagAdd.emit(email);
    }

    onEditEmail(item : any, idx : any): void
    {
        if(this.Form.get('name')?.value != null && this.Form.get('name')?.value != '')
        {
            return;
        }
        this.Form.get('name')?.setValue(item);
        this.onDeleteEmail(idx)
    }
}
