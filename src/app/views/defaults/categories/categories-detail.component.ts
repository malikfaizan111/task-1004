import { Component, OnInit, ElementRef, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';


import { MainService, BaseLoaderService } from '../../../services';
import { AlertDialog } from '../../../lib';
import { appConfig } from '../../../../config';


@Component({
	selector: 'app-categories-details',
	templateUrl: './categories-detail.component.html'
})
export class CategoriesDetailsComponent implements OnInit, AfterViewInit
{
	
	sub: Subscription = new Subscription();
	Deal: any;
    Offers: any;
    status: boolean;
    Categories: any = [];
    catArray: any = [];
    CategoriesCount: any;
    isLoading: boolean;

	constructor(private elRef: ElementRef, protected router: Router,
		protected mainApiService: MainService,
		protected loaderService: BaseLoaderService, protected dialog: MatDialog, protected dialogRef: MatDialogRef<CategoriesDetailsComponent>)	
	{	this.isLoading = false;
        this.Deal = null;
        this.Offers = [];
        this.status = false;
	}

	ngOnInit() 
    {   

        console.log('CAT ARRAY: ',this.catArray);
      
    }

    ngAfterViewInit()
    {
        this.elRef.nativeElement.parentElement.classList.add("mat-dialog-changes-1");
    }

    onSubmitData(){
        console.log('CAT ARRAY: ',this.catArray);

        let arrayOfIdsWithDuplicate = this.catArray.map((value : any)=>{
            return value.orderby;
         })
         
         let idSetFromArrayWithDuplicate = new Set(arrayOfIdsWithDuplicate);

         console.log('CAT ARRAY=>>>>: ',arrayOfIdsWithDuplicate);
         console.log('CAT ARRAY=>>>>: ',idSetFromArrayWithDuplicate);
         
         if(idSetFromArrayWithDuplicate.size  < arrayOfIdsWithDuplicate.length){
           
            let dialogRef = this.dialog.open(AlertDialog, { autoFocus: false });
            let cm = dialogRef.componentInstance;
            cm.heading = 'Error';
            cm.message = "Dublicate order by values";
            cm.cancelButtonText = 'Ok';
            cm.type = 'error';
         }
         else{
         
            this.isLoading = true;
            let method = 'updateCategory';
                let data = {
                    'data': this.catArray,
                    'bulk_data' : true,
                }

            this.mainApiService.postData(appConfig.base_url_slug + method, data).then(response => {
                if (response.status == 200 || response.status == 201) {
                    this.isLoading = true;
                    this.dialogRef.close(true);

                }
                else {
                    this.isLoading = false;
                    let dialogRef = this.dialog.open(AlertDialog, { autoFocus: false });
                    let cm = dialogRef.componentInstance;
                    cm.heading = 'Error';
                    cm.message = response.error.message;
                    cm.cancelButtonText = 'Ok';
                    cm.type = 'error';
                }
            },
                Error => {
                    // log here(Error)
                    this.isLoading = false;
                    let dialogRef = this.dialog.open(AlertDialog, { autoFocus: false });
                    let cm = dialogRef.componentInstance;
                    cm.heading = 'Error';
                    cm.message = "Internal Server Error.";
                    cm.cancelButtonText = 'Ok';
                    cm.type = 'error';
                })
         }
    }



	
    onEditDeal(event : any): void 
	{
		localStorage.setItem('Deal', JSON.stringify(this.Deal));
        this.router.navigateByUrl('main/deals/' + this.Deal.id);
        this.dialogRef.close();
		event.stopPropagation();
    }
    
    onChangeStatus(): void 
	{
		let active: any;
		if(this.status)
		{
			active = 1;
		}
		else
		{
			active = 0;
		}
		let Data = {
			id: this.Deal.id,
			active: active
		};

		let dialogRef = this.dialog.open(AlertDialog, {autoFocus: false});
		let cm = dialogRef.componentInstance;
		cm.heading = 'Change Deal';
		cm.message = 'Are you sure to Update Deal';
		cm.submitButtonText = 'Yes';
		cm.cancelButtonText = 'No';
		cm.type = 'ask';
		cm.methodName = appConfig.base_url_slug + 'ADOffer';
		cm.dataToSubmit = Data;
		cm.showLoading = true;

		dialogRef.afterClosed().subscribe(result => {
			if(result)
			{
                // this.status = !this.status;
            }
            else
            {
                this.status = !this.status;
            }
		})
	}

	getOffers(): void
	{
		// this.mainApiService.getsList(appConfig.base_url_slug + 'getOffers?deal_id=' + this.Deal.id)
		// .then(result => {
		// 	if (result.status == 200  && result.data) 
		// 	{
		// 		this.Offers = result.data.offers;
		// 	}
		// 	else
		// 	{
		// 		this.Offers = [];
		// 	}
		// });
    }
    gerCategoriesList(index : any, isLoaderHidden?: boolean): void
	{
		this.loaderService.setLoading(true);
		let url = 'getCategories';

	

		localStorage.setItem('componentSettings', JSON.stringify(
			{
				name: 'Categories',
				
			}
        ));
		
		this.mainApiService.getList(appConfig.base_url_slug + url)
		.then(result => {
			if (result.status == 200  && result.data) 
			{
				this.Categories  = result.data.categories;
				this.CategoriesCount = result.data.categoriesCount;
				
				this.loaderService.setLoading(false);

			}
			else
			{
				this.Categories = [];
				this.CategoriesCount = 0;
				this.loaderService.setLoading(false);
			}
		});
    }
    onCloseClick(): void
    {
        this.dialogRef.close(false);
    }
}
