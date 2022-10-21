import { Component, OnInit, Output, EventEmitter, Input, OnChanges } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';


@Component({
	selector: 'multi-text-input',
    templateUrl: './multi-text-input.component.html',
    styleUrls: ['./multi-text-input.component.css']
})
export class MultiTextInputComponent implements OnInit, OnChanges {

    @Input() placeholder: any;
    @Input() required: any;
    @Output() onTagAdd:  EventEmitter<any> = new EventEmitter;
	
    Form: FormGroup;
    @Input() texts: string;
    textArray: string[];

	constructor(protected formbuilder: FormBuilder) 
	{
        this.Form = this.formbuilder.group({
            name: [null, [Validators.required]],
        });
        this.texts = "";
        this.textArray = [];
	}

	ngOnInit() 
	{
        if(this.texts != '' && this.texts != null)
        {
            this.textArray = this.texts.split(',');
        }
    }

    ngOnChanges() 
	{
        if(this.texts != '' && this.texts != null)
        {
            this.textArray = this.texts.split(',');
        }
        else
        {
            this.textArray = [];
            this.onTagAdd.emit('');
        }
    }

    getValue(name : any) 
    {
        return this.Form.get(name);
    }

	onSubmitClick(): void
	{
        if(!this.textArray.includes(this.Form.get('name')?.value))
        {
            this.textArray.unshift(this.Form.get('name')?.value);
            this.Form.get('name')?.setValue(null);
    
            let text = this.textArray.join(',');
            this.onTagAdd.emit(text);
        }
    }
    
    onDelete(idx : any): void
    {
        this.textArray.splice(idx, 1);
        let text = this.textArray.join(',');
        this.onTagAdd.emit(text);
    }

    onEdit(item : any, idx :any): void
    {
        if(this.Form.get('name')?.value != null && this.Form.get('name')?.value != '')
        {
            return;
        }
        this.Form.get('name')?.setValue(item);
        this.onDelete(idx)
    }
}
