import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';

import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireAuthModule } from 'angularfire2/auth';

import { AppComponent } from './app.component';
import { MaterialModule } from './material.module';
import { WelcomeComponent } from './welcome/welcome.component';
import { AppRoutingModule } from './app-routing.module';
import { HeaderComponent } from './navigation/header/header.component';
import { SidenavListComponent } from './navigation/sidenav-list/sidenav-list.component';
import { AuthService } from './auth/auth.service';
import { environment } from '../environments/environment';
import { UIService } from './shared/ui.service';
import { AuthModule } from './auth/auth.module';
import {UploadService} from './shared/upload.service';
import {GardensComponent} from './gardens/gardens.component';
import { CreateGardenComponent } from './gardens/create-garden.component';
import { GardenDetailsComponent } from './garden-details/garden-details.component';
import { CurrentGardenService } from './gardens/current-garden.service';
import { CreateDescriptionComponent } from './garden-details/create-description.component';

@NgModule({
  declarations: [
    AppComponent,
    WelcomeComponent,
    GardensComponent,
    CreateGardenComponent,
    CreateDescriptionComponent,
    HeaderComponent,
    SidenavListComponent,
    GardenDetailsComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModule,
    AppRoutingModule,
    FlexLayoutModule,
    AngularFireModule.initializeApp(environment.firebase),
    AuthModule,
    AngularFirestoreModule,
    AngularFireAuthModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [AuthService, UIService, UploadService, CurrentGardenService],
  bootstrap: [AppComponent],
  entryComponents: [CreateGardenComponent, CreateDescriptionComponent]
})
export class AppModule { }
