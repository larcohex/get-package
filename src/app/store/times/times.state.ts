import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { tap } from 'rxjs';
import { DeliveryService } from '../../services/delivery.service';
import { Times } from './times.actions';
import { Time } from '../../types/time';

@State<Time[]>({
  name: 'times',
  defaults: [],
})
@Injectable()
export class TimesState {
  constructor(private deliveryService: DeliveryService) {}

  @Action(Times.Fetch)
  fetchTimes(context: StateContext<Time[]>) {
    return this.deliveryService.getTimes().pipe(
      tap(times => {
        context.setState(times);
      })
    );
  }

  @Selector()
  static timeByWeekday(state: Time[]) {
    return (weekday: string) =>
      state.find(time => time.day === weekday)?.times || [];
  }
}
