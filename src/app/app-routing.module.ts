import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WelcomeComponent } from './welcome/welcome.component';
import { AuthGuard } from './auth/auth.guard';
import {GardensComponent} from './gardens/gardens.component';
import { GardenDetailsComponent } from './garden-details/garden-details.component';

const routes: Routes = [
  { path: '', component: WelcomeComponent } ,
  { path: 'gardens', component: GardensComponent, canActivate: [AuthGuard] },
  { path: 'garden-details', component: GardenDetailsComponent, canActivate: [AuthGuard] },
  {path: '404', component: WelcomeComponent},
  {path: '**', redirectTo: '/404'}
 // { path: 'training', loadChildren: './training/training.module#TrainingModule', canLoad: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule {}
