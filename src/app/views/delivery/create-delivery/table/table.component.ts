import { Component, Input } from '@angular/core';
import { City } from '../../../../types/city';

@Component({
  selector: 'app-delivery-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent {
  columns = ['name', 'value'];

  data: {
    price: number;
    vat: number;
  } | null = null;

  @Input() set cities(cities: { pickup: City; dropoff: City } | null) {
    if (cities) {
      let price = cities.pickup.price;
      if (cities.pickup.enName !== cities.dropoff.enName) {
        price += cities.dropoff.price + 10;
      }
      this.data = {
        price,
        vat: price * 0.17,
      };
    } else {
      this.data = null;
    }
  }
}
