import { Component, OnInit, ElementRef, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MainService, BaseLoaderService } from '../../services';
import { AlertDialog } from '../../lib';
import { appConfig } from '../../../config';

@Component({
	selector: 'app-credit-card-details',
	templateUrl: './credit-card-details.component.html'
})
export class CreditCardDetailsComponent implements OnInit, AfterViewInit {
	CreditCard: any;

	constructor(private elRef: ElementRef,
		protected dialog: MatDialog, protected dialogRef: MatDialogRef<CreditCardDetailsComponent>) {
		this.CreditCard = null;
	}

	ngOnInit() {

	}

	ngAfterViewInit() {
		this.elRef.nativeElement.parentElement.classList.add("mat-dialog-changes-1");
	}
}