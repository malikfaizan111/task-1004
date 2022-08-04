import { Component, OnInit, EventEmitter, Input, Output, NgZone, ViewEncapsulation, OnDestroy, ElementRef  } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { GoogleMapsAPIWrapper, MapsAPILoader } from '@agm/core';

declare var google: any;

@Component({
    templateUrl: './map-location.dialog.html',
    styleUrls: ['./map-location.dialog.css'],
    encapsulation: ViewEncapsulation.None
})
export class MapLocationDialog implements OnInit
{
    @Input()
    initialLocation: string = '';
    initialZoom: number = 16;
    currentLocation: {lat: number, lng: number} = {lat : 1 , lng : 1};

    map: any;
    marker: any;

    constructor(private elRef:ElementRef, private _loader: MapsAPILoader,
        private _zone: NgZone,
        public dialogRef: MatDialogRef<MapLocationDialog>,
        public gMaps: GoogleMapsAPIWrapper)
    {
        this.map = null;
        this.marker = null;
    }

    ngAfterViewInit()
    {
        this.elRef.nativeElement.parentElement.classList.add("mat-dialog-containerss");
    }

    ngOnInit(): void
    {
        let loc = {lat: 0, lng: 0};

        if(this.initialLocation != null)
        {
            let coords = this.initialLocation.split(',');
            if (coords.length == 2)
            {
                loc.lat = +coords[0];
                loc.lng = +coords[1];
            }
        }

        this.currentLocation = loc;

        this.marker =
        {
            lat: this.currentLocation.lat,
            lng: this.currentLocation.lng,
            label: '',
        }
    }

    onLocation()
    {
        this.dialogRef.close(null)
    }
}
