import { Component, OnInit } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { MainService } from '../../../../services';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { AlertDialog } from '../../../../lib';
import { MatDialog } from '@angular/material/dialog';
import { appConfig } from '../../../../../config';
import { map, startWith } from 'rxjs/operators';

@Component({
	selector: 'app-delivery_playlist_parentoutlet',
	templateUrl: './delivery_playlist_parentoutlet-form.component.html'
})
export class DeliveryPlaylistParentOutletFormComponent implements OnInit {
	id: any;
	// type: any;
	sub: Subscription = new Subscription();
	Form: FormGroup;
	isLoading: boolean;
	isEditing: boolean;
	merchantccount: any;
	filteredOptions: Observable<string[]> = new Observable();
	Merchants: any[] = [];
	RestaurantMenu: any;
	RestaurantsParentOutlets: any;
	filteredParentOptions: Observable<string[]> = new Observable();
	Parents: any;
	parentId: any = [];
	errorMsg: string = '';
	PlaylistOnly: any;
	playlist: any;
	searchTimer: any;
	parentsList: any;
	constructor(protected router: Router,
		protected _route: ActivatedRoute,
		protected mainApiService: MainService,
		protected formbuilder: FormBuilder, protected dialog: MatDialog) {
		this.Form = this.formbuilder.group({
			playlist_id: [null, [Validators.required]],
			parent_outlet_id: [null, [Validators.required]],
			name: [''],


		});

		this.isLoading = false;
		this.isEditing = false;
		this.Parents = [];
		this.RestaurantMenu = '';
	}

	ngOnInit() {
		this.viewPlaylistOnly();
	}

	getValue(name: any) {
		return this.Form.get(name);
	}

	onLocationBack(): void {
		window.history.back();
	}




	doSubmit(): void {
		this.isLoading = true;
		let method = '';
		method = 'addDeliveryPlaylistToParentOutlet';

		// if(this.Form.get('playlist_id').value != null || this.Form.get('playlist_id').value != '')
		// {
		// 	let playlists_ids = this.Form.get('playlist_id').value.join();
		// 	this.playlist = playlists_ids;
		// 	console.log("1st playlist",this.playlist)
		// 	let ali=this.Form.get('playlist_id').setValue(this.playlist);
		// 	console.log("2st playlist",ali)
		// }
		// else
		// {
		// 	this.Form.get('playlist_id').setValue( "");
		// }
		this.mainApiService.postData(appConfig.base_url_slug + method, this.Form.value, 2).then(response => {
			if (response.status == 200 || response.status == 201) {
				this.isLoading = false;
				this.router.navigateByUrl('/main/restaurants');
				this.Form.reset();


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

	viewPlaylistOnly(): void {
		this.mainApiService.getList(appConfig.base_url_slug + 'viewPlaylistOnly', true, 2)
			.then(result => {
				if (result.status == 200 && result.data) {
					this.PlaylistOnly = result.data;
					this.PlaylistOnly.forEach((element: any) => {
						element.id = element.id.toString();
					});
				}
				else {
					this.PlaylistOnly = [];
				}
			});
	}

	selectEvent(item: any) {
		console.log("selectEvent", item.id)
		if (item) {

			this.Form.get('name')?.setValue(item.name);
			this.Form.get('parent_outlet_id')?.setValue(item.id);
		}
	}

	onCleared(item: any) {

		this.Form.get('parent_outlet_id')?.setValue(null);
	}

	onChangeSearch(val: string) {
		var url = "getParents?search=" + val;

		clearTimeout(this.searchTimer);
		this.searchTimer = setTimeout(() => {
			this.mainApiService.getList(appConfig.base_url_slug + url).then(response => {
				console.log('onChangeSearch', response);

				this.parentsList = response.data.parents;
			})
		}, 700);
	}
}