import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-delivery-map',
  template: `
    <p-gmap
      [options]="options"
      [overlays]="overlays"
      [style]="{ width: '100%', height: '20rem' }"
      (onMapReady)="setMap($event)"
    ></p-gmap>
  `,
})
export class MapComponent {
  private _senderAddress: google.maps.places.PlaceResult | null = null;
  private _receiverAddress: google.maps.places.PlaceResult | null = null;
  private _senderAddressPrediction: google.maps.places.AutocompletePrediction | null =
    null;
  private _receiverAddressPrediction: google.maps.places.AutocompletePrediction | null =
    null;

  @Input() set senderAddress(
    prediction: google.maps.places.AutocompletePrediction | null
  ) {
    this._senderAddressPrediction = prediction;
    if (this.placesService && prediction) {
      this.getDetails(prediction.place_id).then((response: any) => {
        this._senderAddress = response;
        this.showPath();
      });
    } else {
      this._senderAddress = null;
    }
  }

  @Input() set receiverAddress(
    prediction: google.maps.places.AutocompletePrediction | null
  ) {
    this._receiverAddressPrediction = prediction;
    if (this.placesService && prediction) {
      this.getDetails(prediction.place_id).then((response: any) => {
        this._receiverAddress = response;
        this.showPath();
      });
    } else {
      this._receiverAddress = null;
    }
  }

  options = {
    center: { lat: 31.771959, lng: 35.217018 },
    zoom: 12,
    gestureHandling: 'cooperative',
    restriction: {
      latLngBounds: {
        west: 34.21861299681395,
        east: 35.68422,
        north: 33.29083254342484,
        south: 29.480762492189573,
      },
      strictBounds: true,
    },
  };
  overlays: google.maps.Marker[] = [];

  map?: google.maps.Map;
  placesService?: google.maps.places.PlacesService;
  directionsService?: google.maps.DirectionsService;
  directionsRenderer?: google.maps.DirectionsRenderer;

  getDetails(placeId: string) {
    return new Promise((resolve, reject) => {
      if (this.placesService) {
        this.placesService.getDetails({ placeId }, (response: any) => {
          resolve(response);
        });
      } else {
        reject();
      }
    });
  }

  setMap(event: { map: google.maps.Map }) {
    this.map = event.map;
    this.placesService = new google.maps.places.PlacesService(event.map);
    this.directionsService = new google.maps.DirectionsService();
    this.directionsRenderer = new google.maps.DirectionsRenderer();
    const promises = [];
    if (this._senderAddressPrediction) {
      promises.push(
        this.getDetails(this._senderAddressPrediction.place_id).then(
          (response: any) => {
            this._senderAddress = response;
            return null;
          }
        )
      );
    }
    if (this._receiverAddressPrediction) {
      promises.push(
        this.getDetails(this._receiverAddressPrediction.place_id).then(
          (response: any) => {
            this._receiverAddress = response;
            return null;
          }
        )
      );
    }
    if (promises.length) {
      Promise.all(promises).then(() => {
        this.showPath();
      });
    }
  }

  showPath() {
    this.overlays = [];
    this.directionsRenderer?.setMap(null);
    const senderMarker = this._senderAddress
      ? new google.maps.Marker({
          position: this._senderAddress.geometry?.location,
          title: this._senderAddressPrediction?.description,
        })
      : null;
    const receiverMarker = this._receiverAddress
      ? new google.maps.Marker({
          position: this._receiverAddress.geometry?.location,
          title: this._receiverAddressPrediction?.description,
        })
      : null;
    const result = [];
    if (senderMarker && receiverMarker && this.map) {
      this.directionsRenderer?.setMap(this.map);
      this.directionsService?.route(
        {
          origin: senderMarker.getPosition() as google.maps.LatLng,
          destination: receiverMarker.getPosition() as google.maps.LatLng,
          travelMode: google.maps.TravelMode.DRIVING,
        },
        (response, status) => {
          if (status === 'OK') {
            this.directionsRenderer?.setDirections(response);
          }
        }
      );
    } else {
      if (senderMarker) {
        result.push(senderMarker);
      }
      if (receiverMarker) {
        result.push(receiverMarker);
      }
      this.overlays = result;
    }
  }
}
