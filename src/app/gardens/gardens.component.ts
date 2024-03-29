import { Component, OnInit, OnChanges, OnDestroy } from '@angular/core';
import {Observable, Subscription, Subject} from '../../../node_modules/rxjs';
import { AuthService } from '../auth/auth.service';
import { CreateGardenComponent } from './create-garden.component';
import { MatDialog } from '@angular/material';
import { AngularFirestore } from 'angularfire2/firestore';
import * as firebase from 'firebase';
import { Garden } from '../models/garden.model';
import { CurrentGardenService } from './current-garden.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-gardens',
  templateUrl: './gardens.component.html',
  styleUrls: ['./gardens.component.css']
})
export class GardensComponent implements OnInit, OnChanges, OnDestroy {
  
  private gardens: Garden[] = [];
  imageSrc: string;
  images: string[];
  imagesSubscription: Subscription;
  gardensChanged = new Subject<any>();
  private fbSubs: Subscription[] = [];

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private db: AngularFirestore,
    private auth: AuthService,
    private currentGarden: CurrentGardenService
    ) {}

  ngOnInit() {
    this.fetchGardens(this.auth.getEmail());
  }

  ngOnChanges() {
  }

  createGarden() {
    const dialogRef = this.dialog.open(CreateGardenComponent, {});
  }

  fetchGardens(email) {
    this.fbSubs.push(this.db
        .collection('gardens/'+ email + '/data')
        .snapshotChanges()
        .subscribe((items) => {
          let ref = firebase.storage().ref();
          this.gardens = [];
          items.forEach((item) => {
            this.gardens.push(new Garden(item.payload.doc.id, item.payload.doc.data().text, item.payload.doc.data().name, null, item.payload.doc.data().items));
          });

          this.gardens.forEach((item: Garden) => {
            ref.child('resize-' + item.name).getDownloadURL().then((res) => item.url = res).catch(()=>{
              ref.child('uploads/' + item.name).getDownloadURL().then((res) => item.url = res);
            })
          });

          this.gardensChanged.next(items);
        }));
  }

  showGardenDetails(item) {
    this.currentGarden.id = item.id;
    this.currentGarden.name = item.name;
    this.currentGarden.text = item.text;
    this.currentGarden.items = item.items;
    this.router.navigate(['/garden-details']);
  }

  ngOnDestroy() {
    this.fbSubs.forEach((sub) => sub.unsubscribe());
  }
}
