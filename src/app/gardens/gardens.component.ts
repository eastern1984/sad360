import { Component, OnInit, OnChanges } from '@angular/core';
import {ImageService} from '../shared/image.service';
import {Observable, Subscription, Subject} from '../../../node_modules/rxjs';
import { AuthService } from '../auth/auth.service';
import { CreateGardenComponent } from './create-garden.component';
import { MatDialog } from '@angular/material';
import { AngularFirestore } from 'angularfire2/firestore';
import * as firebase from 'firebase';

@Component({
  selector: 'app-gardens',
  templateUrl: './gardens.component.html',
  styleUrls: ['./gardens.component.css']
})
export class GardensComponent implements OnInit, OnChanges {
  
  private gardens: any[];
  imageSrc: string;
  images: string[];
  imagesSubscription: Subscription;
  gardensChanged = new Subject<any>();
  private fbSubs: Subscription[] = [];

  constructor(
    private dialog: MatDialog,
    private db: AngularFirestore,
    private auth: AuthService
    ) {}

  ngOnInit() {
    let storage = firebase.storage();
    let ref = firebase.storage().ref();
    let ur = ref.child('uploads/Untitled.png').getDownloadURL().then((res) => this.imageSrc = res);
    this.fetchGardens(this.auth.getEmail());
  }

  ngOnChanges() {
    //  this.images = this.imageService.getImages();
  }

  createGarden() {
    const dialogRef = this.dialog.open(CreateGardenComponent, {});
  }

  fetchGardens(email) {
    console.log(5555+''+email);
    this.fbSubs.push(this.db
        .collection('gardens/'+ email + '/data')
        .valueChanges()
        .subscribe((items) => {
          items.forEach(item => {
            console.log(5544);
            console.log(item);
            this.gardens.push({ name: '123', url: null });
          });
          console.log(items.length);
          this.gardensChanged.next(items);

        }));
  }

}
