import { Injectable } from '@angular/core';
import { Action, State, StateContext } from '@ngxs/store';
import { tap } from 'rxjs';
import { Cities } from './cities.actions';
import { City } from '../../types/city';
import { DeliveryService } from '../../services/delivery.service';

@State<City[]>({
  name: 'cities',
  defaults: [],
})
@Injectable()
export class CitiesState {
  constructor(private deliveryService: DeliveryService) {}

  @Action(Cities.Fetch)
  fetchCities(context: StateContext<City[]>) {
    return this.deliveryService.getCities().pipe(
      tap(cities => {
        context.setState(cities);
      })
    );
  }
}
