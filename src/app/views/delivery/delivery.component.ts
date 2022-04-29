import { Component } from '@angular/core';
import { Store } from '@ngxs/store';
import { Cities } from '../../store/cities/cities.actions';
import { Times } from '../../store/times/times.actions';

@Component({
  selector: 'app-delivery',
  template: `
    <div
      class="flex justify-content-center align-items-center"
      *ngIf="loading; else body"
    >
      <p-progressSpinner></p-progressSpinner>
    </div>
    <ng-template #body>
      <router-outlet></router-outlet>
    </ng-template>
  `,
})
export class DeliveryComponent {
  loading = true;

  constructor(private store: Store) {
    this.store
      .dispatch([new Cities.Fetch(), new Times.Fetch()])
      .subscribe(() => {
        this.loading = false;
      });
  }
}
