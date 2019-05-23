import { Component, OnInit, OnChanges } from '@angular/core';
import {ImageService} from '../shared/image.service';
import {Observable, Subscription, Subject} from '../../../node_modules/rxjs';
import { AuthService } from '../auth/auth.service';
import { CreateGardenComponent } from './create-garden.component';
import { MatDialog } from '@angular/material';
import { AngularFirestore } from 'angularfire2/firestore';
import * as firebase from 'firebase';
import { Garden } from '../models/garden.model';

@Component({
  selector: 'app-gardens',
  templateUrl: './gardens.component.html',
  styleUrls: ['./gardens.component.css']
})
export class GardensComponent implements OnInit, OnChanges {
  
  private gardens: Garden[] = [];
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

          let ref = firebase.storage().ref();
          this.gardens = [];
          items.forEach((item: Garden) => {
            console.log(item);
            this.gardens.push(new Garden(item.text, item.name, null));
          });

          this.gardens.forEach((item: Garden) => {
            console.log('resize-' + item.name);
            ref.child('resize-' + item.name).getDownloadURL().then((res) => item.url = res).catch(()=>{
              console.log(33322211);
              ref.child('uploads/' + item.name).getDownloadURL().then((res) => item.url = res);
            })
          });

          this.gardensChanged.next(items);

        }));
  }

}
