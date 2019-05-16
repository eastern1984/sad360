import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WelcomeComponent } from './welcome/welcome.component';
import { AuthGuard } from './auth/auth.guard';
import {GardensComponent} from './gardens/gardens.component';

const routes: Routes = [
  { path: '', component: WelcomeComponent } ,
  { path: 'gardens', component: GardensComponent, canLoad: [AuthGuard] }
 // { path: 'training', loadChildren: './training/training.module#TrainingModule', canLoad: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule {}
