import { Component, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Select, Store } from '@ngxs/store';
import { MessageService } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { Loader } from '@googlemaps/js-api-loader';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import AutocompleteService = google.maps.places.AutocompleteService;
import LatLngBoundsLiteral = google.maps.LatLngBoundsLiteral;
import { DeliveryService } from '../../../services/delivery.service';
import { validPhone } from '../../../validators/valid-phone.directive';
import { CitiesState } from '../../../store/cities/cities.state';
import { City } from '../../../types/city';
import { TimesState } from '../../../store/times/times.state';
import days from '../../../constants/days';
import cityBounds from '../../../constants/cities';

@Component({
  selector: 'app-create-delivery',
  templateUrl: './create-delivery.component.html',
  providers: [MessageService],
})
export class CreateDeliveryComponent implements OnDestroy {
  @Select(CitiesState) cities$!: Observable<City[]>;
  times$: Observable<{ label: string; value: string }[]>;

  form = new FormGroup({
    sender: new FormGroup({
      name: new FormControl('', [Validators.required]),
      phone: new FormControl('', [Validators.required, validPhone]),
      address: new FormControl(null, [Validators.required]),
      city: new FormControl(null, [Validators.required]),
    }),
    receiver: new FormGroup({
      name: new FormControl('', [Validators.required]),
      phone: new FormControl('', [Validators.required, validPhone]),
      address: new FormControl(null, [Validators.required]),
      city: new FormControl(null, [Validators.required]),
    }),
    date: new FormControl(new Date(), [Validators.required]),
    time: new FormControl('', [Validators.required]),
  });

  cities: { pickup: City; dropoff: City } | null = null;

  loader: any;
  mapInit = false;
  autocompleteService: AutocompleteService | null = null;

  senderAddressSuggestions = [];
  receiverAddressSuggestions = [];

  get language() {
    return this.translateService.currentLang;
  }

  constructor(
    private store: Store,
    private messageService: MessageService,
    private translateService: TranslateService,
    private deliveryService: DeliveryService
  ) {
    const loadGoogleMaps = (language: string) =>
      new Loader({
        apiKey: 'AIzaSyCzzgmiPbFvuxfgVVv41aJhRpkyh72jRko',
        version: 'weekly',
        libraries: ['places'],
        language: language || 'en',
      });
    this.loader = loadGoogleMaps(this.translateService.currentLang);
    this.loader.load().then(() => {
      this.mapInit = true;
      this.autocompleteService = new google.maps.places.AutocompleteService();
    });
    this.translateService.onLangChange.subscribe(event => {
      this.mapInit = false;
      this.autocompleteService = null;
      (Loader as any).instance = null;
      delete (window as any).google;
      this.loader.deleteScript();
      this.loader = loadGoogleMaps(event.lang);
      this.loader.load().then(() => {
        this.mapInit = true;
        this.autocompleteService = new google.maps.places.AutocompleteService();
      });
    });
    this.times$ = combineLatest([
      this.store.select(TimesState.timeByWeekday),
      this.form.get('date')?.valueChanges!,
    ]).pipe(
      map(([filterFn, date]) =>
        filterFn(days[date.getDay()]).map(time => ({
          label: time,
          value: time,
        }))
      )
    );
    this.times$.subscribe(times => {
      this.form.patchValue({ time: times.length ? times[0].value : '' });
    });
    setTimeout(() => {
      this.form
        .get('date')
        ?.updateValueAndValidity({ onlySelf: true, emitEvent: true });
    });
    combineLatest([
      (this.form.controls['sender'] as FormGroup).controls['city'].valueChanges,
      (this.form.controls['receiver'] as FormGroup).controls['city']
        .valueChanges,
    ]).subscribe(([pickup, dropoff]) => {
      this.cities = { pickup, dropoff };
    });
    this.cities$.subscribe(cities => {
      const city = cities.length ? cities[0] : null;
      this.form.patchValue({ sender: { city }, receiver: { city } });
    });
  }

  orderDelivery() {
    if (this.form.valid) {
      this.deliveryService
        .createDelivery(this.form.value)
        .subscribe(response => {
          const status =
            response.res === 'unknown request' ? 'error' : 'success';
          this.translateService
            .get(`message.${status}.toast`)
            .subscribe(response => {
              this.messageService.add({
                severity: status,
                summary: response.title,
                detail: response.text,
              });
            });
          if (status === 'success') {
            this.form.reset({ date: new Date() });
          }
        });
    }
  }

  searchPlaces(query: string, bounds: LatLngBoundsLiteral) {
    return new Promise((resolve, reject) => {
      if (this.autocompleteService) {
        this.autocompleteService.getPlacePredictions(
          {
            input: query,
            componentRestrictions: { country: 'il' },
            bounds,
          },
          (predictions, status) => {
            if (
              status === google.maps.places.PlacesServiceStatus.OK &&
              predictions
            ) {
              resolve(predictions);
            }
            reject();
          }
        );
      } else {
        reject();
      }
    });
  }

  searchForSender(event: { originalEvent: Event; query: string }) {
    this.searchPlaces(
      event.query,
      cityBounds[this.form.value.sender.city.enName] as LatLngBoundsLiteral
    ).then(predictions => {
      const result = predictions as any;
      this.senderAddressSuggestions = result;
    });
  }

  searchForReceiver(event: { originalEvent: Event; query: string }) {
    this.searchPlaces(
      event.query,
      cityBounds[this.form.value.receiver.city.enName] as LatLngBoundsLiteral
    ).then(predictions => {
      const result = predictions as any;
      this.receiverAddressSuggestions = result;
    });
  }

  ngOnDestroy() {
    (Loader as any).instance = null;
    delete (window as any).google;
    this.loader.deleteScript();
  }
}
