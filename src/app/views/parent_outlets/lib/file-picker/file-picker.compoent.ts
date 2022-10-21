import { Component, OnInit, ElementRef, ViewChild, Output, EventEmitter, Input } from '@angular/core';
import { MainService } from '../../services/main.service';
import { MatDialog } from '@angular/material/dialog';
import { AlertDialog } from '../alert.dialog';


declare let $: any;

@Component({
	selector: 'file-picker',
	templateUrl: './file-picker.component.html'
})
export class FilePickerComponent implements OnInit {

	@Input() image: any;
    @ViewChild('fileInput') fileInput?: ElementRef;
    
    @Output() onFileSelect:  EventEmitter<any> = new EventEmitter;
    @Input() description: string = '';
    @Input() isIconHidden: boolean = true;
    @Input() type: string = '';
    @Input() size: {width: number, height: number};
    @Input() controlName: string = '';

    constructor() 
    {
        this.size = { width: 0, height: 0};
        this.image = '';
	}

    ngOnInit() 
    {

	}

	onFileChange(event : any) {
		let reader: any = new FileReader();
		if (event.target.files && event.target.files.length > 0) {
			let file = event.target.files[0];
			reader.readAsDataURL(file);
			reader.onload = (event: any) => {
				// this.Form.get('avatar').setValue({
				// 	filename: file.name,
				// 	filetype: file.type,
				// 	value: reader.result.split(',')[1]
				// })
				var img: any = new Image();

				img.onload = () => {
					// log here(img.width);
                    // log here(img.height);
                    
                    let dict = {
                        filename: file.name,
                        filetype: file.type,
                        value: reader.result.split(',')[1],
                        valid: false,
                        imagePreview: event.target.result,
                        file: file,
                        controlName: this.controlName
                    }

                    if(this.type == 'Square')
                    {
                        if(Math.floor(img.width) == Math.floor(img.height))
                        {
                            // log here('Square pefect');
                            dict.valid = true;
                            this.onFileSelect.emit(dict);
                            this.image = event.target.result;
                        }
                        else
                        {
                            // log here('Square not perfect')
                            dict.valid = false;
                            this.onFileSelect.emit(dict);
                            this.image = '';
                        }
                    }
                    else if (this.type == 'Custom')
                    {   img.height=img.height;
                        img.width=img.width;
                        dict.valid = true;
                        this.onFileSelect.emit(dict);
                        this.image = event.target.result;
                    }
                    else
                    {
                        if(Math.floor((img.height/ img.width) * this.size.width) == this.size.height)
                        {
                            // log here('Rect pefect', Math.floor((img.height/ img.width) * 310));
                            dict.valid = true;
                            this.onFileSelect.emit(dict);
                            this.image = event.target.result;
                        }
                        else if(img.width == 600 && img.height == 900)
                        {
                            // console.log('Rect pefect', Math.floor((img.height/ img.width) * 310));
                            dict.valid = true;
                            this.onFileSelect.emit(dict);
                            this.image = event.target.result;
                        }
                        else
                        {
                            
                            // dict.valid = false;
                            dict.valid = true;
                            this.onFileSelect.emit(dict);
                            this.image = event.target.result;
                            // this.image = '';
                        }
                    }
				};

				img.src = reader.result;
			};
		}
	}
}
