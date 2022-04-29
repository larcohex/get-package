import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { NgxsModule } from '@ngxs/store';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { ToastModule } from 'primeng/toast';
import { GMapModule } from 'primeng/gmap';
import { HttpLoaderFactory } from '../../app.module';
import { CitiesState } from '../../store/cities/cities.state';
import { TimesState } from '../../store/times/times.state';
import { DeliveryRoutingModule } from './delivery-routing.module';
import { DeliveryComponent } from './delivery.component';
import { CreateDeliveryComponent } from './create-delivery/create-delivery.component';
import { TableComponent } from './create-delivery/table/table.component';
import { MapComponent } from './create-delivery/map/map.component';

@NgModule({
  declarations: [
    DeliveryComponent,
    CreateDeliveryComponent,
    TableComponent,
    MapComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DeliveryRoutingModule,
    NgxsModule.forFeature([CitiesState, TimesState]),
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
      extend: true,
    }),
    ProgressSpinnerModule,
    ButtonModule,
    InputTextModule,
    AutoCompleteModule,
    DropdownModule,
    CalendarModule,
    ToastModule,
    GMapModule,
  ],
})
export class DeliveryModule {}
