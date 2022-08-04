// import { Component, OnInit, EventEmitter, Input, Output, NgZone, ViewEncapsulation, OnDestroy, ElementRef  } from '@angular/core';
// import { MatDialog, MatDialogRef } from '@angular/material';

// import { GoogleMapsAPIWrapper, MapsAPILoader } from '@agm/core';

// declare var google: any;

// @Component({
//     templateUrl: './get-location.dialog.html',
//     styleUrls: ['./get-location.dialog.css'],
//     encapsulation: ViewEncapsulation.None
// })
// export class MapLocationDialog implements OnInit
// {
//     @Input()
//     initialLocation: string;
//     initialZoom: number = 16;
//     currentLocation: {lat: number, lng: number};

//     map: any;
//     marker: any;

//     constructor(private elRef:ElementRef, private _loader: MapsAPILoader,
//         private _zone: NgZone,
//         public dialogRef: MatDialogRef<MapLocationDialog>,
//         public gMaps: GoogleMapsAPIWrapper)
//     {
//         this.map = null;
//         this.marker = null;
//     }

//     ngAfterViewInit()
//     {
//         this.elRef.nativeElement.parentElement.classList.add("mat-dialog-containerss");
//     }

//     ngOnInit(): void
//     {
//         let loc = {lat: 0, lng: 0};

//         if(this.initialLocation != null)
//         {
//             let coords = this.initialLocation.split(',');
//             if (coords.length == 2)
//             {
//                 loc.lat = +coords[0];
//                 loc.lng = +coords[1];
//             }
//         }

//         this.currentLocation = loc;

//         this.marker =
//         {
//             lat: this.currentLocation.lat,
//             lng: this.currentLocation.lng,
//             label: '',
//         }
//     }

//     onLocation()
//     {
//         this.dialogRef.close(null)
//     }
// }

import { Component, OnInit, EventEmitter, Input, Output, NgZone, ViewEncapsulation, OnDestroy, ElementRef, AfterViewInit  } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { GoogleMapsAPIWrapper, MapsAPILoader } from '@agm/core';


declare var google: any;

@Component({
    templateUrl: './get-location.dialog.html',
    styleUrls: ['./get-location.dialog.css'],
    encapsulation: ViewEncapsulation.None
})
export class GetLocationDialog implements OnInit, AfterViewInit
{
    initialLocation: string = '';
    initialZoom: number = 4;
    currentLocation: {lat: number, lng: number} = { lat : 1, lng : 1};

    marker: any;
    formatted_address: string;

    constructor( private elRef:ElementRef, private _loader: MapsAPILoader,
        private _zone: NgZone,
        public dialogRef: MatDialogRef<GetLocationDialog>,
        public gMaps: GoogleMapsAPIWrapper)
    {
        this.marker = null;
        this.formatted_address = 'No Address';
    }

    ngOnInit(): void
    {
        let loc = {lat: 33.771, lng: 73.09};
        // let loc = {lat: 0, lng: 0};

        if(this.initialLocation != null)
        {
            let coords = this.initialLocation.split(',');
            if (coords.length == 2)
            {
                loc.lat = +coords[0];
                loc.lng = +coords[1];
            }
            this.initialZoom = 16;
        }

        this.currentLocation = loc;

        this.formatteAddress(loc, (location : any) => {
            this.formatted_address = location;
        });

        this.marker =
        {
            lat: this.currentLocation.lat,
            lng: this.currentLocation.lng,
            label: '',
            draggable: true
        }

        this.onAutoComplete();
    }

    
    ngAfterViewInit()
    {
        this.elRef.nativeElement.parentElement.classList.add("padding-0");
    }

    onAutoComplete()
    {
        this._loader.load().then(() =>
        {
            const autoCompleteInput = new google.maps.places.Autocomplete(document.getElementById('autocompleteInput'), {});

            google.maps.event.addListener(autoCompleteInput, 'place_changed', () =>
            {
                this._zone.run(() =>
                {
                    const place = autoCompleteInput.getPlace();

                    this.currentLocation.lat = place.geometry.location.lat(),
                    this.currentLocation.lng = place.geometry.location.lng(),
                    this.formatted_address = place.formatted_address;

                    this.initialZoom = 16;
                    this.gMaps.panTo(this.currentLocation);

                    this.marker =
                    {
                        lat: place.geometry.location.lat(),
                        lng: place.geometry.location.lng(),
                        label: '',
                        draggable: true
                    };
                });
            });
        });
    }

    markerDragEnd(m : any, $event: any)
    {
        this.currentLocation.lat = $event.coords.lat;
        this.currentLocation.lng = $event.coords.lng;
        this.gMaps.panTo(this.currentLocation);
        this.formatteAddress(this.currentLocation, (location : any) => {
            this.formatted_address = location;
        });
    }

    setLocation()
    {
        let loc = {lat: this.currentLocation.lat, lng: this.currentLocation.lng, formatted_address: this.formatted_address};
        this.dialogRef.close(loc)
    }

    cancelLocation()
    {
        this.dialogRef.close(null)
    }

    formatteAddress(location : any, callback : any) {
        
        this._loader.load().then(() =>
        {
            location.lat = parseFloat(location.lat);
            location.lng = parseFloat(location.lng);

            let geoCoder = new google.maps.Geocoder();
            geoCoder.geocode({ 'location': location }, (responses : any, status : any) => {
                if (status == google.maps.GeocoderStatus.OK)
                {
                    let address = this.makeFormattedAddress(responses);
                    callback(address);
                }
                else
                {
                    callback('Unnamed Location');
                    // var title = "Error";
                    // var msg = "Address location not found.";
                    // SweetAlerts.error(title, msg).catch();
                }
            });
        });
    }

    makeFormattedAddress(responses : any): string
    {
        let address = null;
        if (responses && responses.length > 0)
        {
            // // log here(responses[0]);
            let formattedArray :any [] = [];

            responses[0].address_components.forEach((value : any, index : any) =>
            {
                if (value.types.indexOf("route") > -1)
                {
                    formattedArray.push(value.short_name);
                }
                else if (value.types.indexOf("street_number") > -1)
                {
                    formattedArray.push(value.long_name);
                }
                else if (value.types.indexOf("sublocality_level_1") > -1)
                {
                    formattedArray.push(value.long_name);
                }
                else if (value.types.indexOf("subpremise") > -1)
                {
                    formattedArray.push(value.long_name);
                }
                else if (value.types.indexOf("locality") > -1)
                {
                    formattedArray.push(value.short_name);
                }
                else if (value.types.indexOf("postal_code") > -1)
                {
                    formattedArray.push(value.short_name);
                }
                else if (value.types.indexOf("administrative_area_level_1") > -1)
                {
                    formattedArray.push(value.long_name);
                }
                else if (value.types.indexOf("country") > -1)
                {
                    formattedArray.push(value.long_name);
                }
            });
            // // log here('formattedArray', formattedArray);
            // // log here(formattedArray.join(', '));
            address = formattedArray.join(',');
        }

        return address as string;
    }
}
