import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth-guard.service';

const routes: Routes = [
  {
    path: 'auth',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./views/auth/auth.module').then(m => m.AuthModule),
    data: { protected: false },
  },
  {
    path: 'login',
    redirectTo: '/auth/login',
  },
  {
    path: '',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./views/delivery/delivery.module').then(m => m.DeliveryModule),
    data: { protected: true },
  },
  {
    path: '**',
    redirectTo: '/',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
