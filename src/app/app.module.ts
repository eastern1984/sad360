import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';

import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireDatabase} from 'angularfire2/database';
//import { AngularFireAuthModule} from 'angularfire2/auth';
import { AngularFirestoreModule, AngularFirestore } from 'angularfire2/firestore';

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
import {ImageService} from './shared/image.service';
import {UploadService} from './shared/upload.service';
import {UploadComponent} from './upload/upload.component';
import {GardensComponent} from './gardens/gardens.component';

@NgModule({
  declarations: [
    AppComponent,
    WelcomeComponent,
    GardensComponent,
    HeaderComponent,
    SidenavListComponent,
      UploadComponent
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
    AngularFireDatabaseModule
  ],
  providers: [AuthService, UIService, ImageService, UploadService, AngularFireDatabase, AngularFirestore],
  bootstrap: [AppComponent]
})
export class AppModule { }
