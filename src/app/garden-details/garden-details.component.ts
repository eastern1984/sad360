import { Component, OnInit } from '@angular/core';
import { CurrentGardenService } from '../gardens/current-garden.service';
import * as firebase from 'firebase';
import { MatDialog } from '@angular/material';
import { CreateDescriptionComponent } from './create-description.component';
import { AngularFirestore } from 'angularfire2/firestore';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-garden-details',
  templateUrl: './garden-details.component.html',
  styleUrls: ['./garden-details.component.css']
})
export class GardenDetailsComponent implements OnInit {
  private id: string;
  private text: string;
  private imageSrc: string;
  private items: any[] = [];
  private itemsDb: any = [];
  private ChoosingItems: any[] = [];
  private fbSubs: Subscription[] = [];

  constructor(
    private currentGarden: CurrentGardenService,
    private dialog: MatDialog,
    private db: AngularFirestore,
    private auth: AuthService
    ) {}

  ngOnInit() {
    console.log(7777, this.db);
    this.text = this.currentGarden.text;
    this.id = this.currentGarden.id;
    let ref = firebase.storage().ref();
    ref.child('uploads/' + this.currentGarden.name).getDownloadURL().then((res) => this.imageSrc = res);

    this.fbSubs.push(this.db
      .collection('item', ref => ref.where('parent', '==', this.id))
      .snapshotChanges()
      .map(docArray => {
        // throw(new Error());
        return docArray.map(doc => {
          return {
            id: doc.payload.doc.id,
            name: doc.payload.doc.data().name,
            description: doc.payload.doc.data().description,
            coord: doc.payload.doc.data().coord
          };
        });
      })
      .subscribe(data => {
        this.itemsDb = data;
    }));
  }

  putItem(e) {console.log(e.target.tagName);
    if (e.target.tagName.toLowerCase() == 'img') {
        let rect = e.target.getBoundingClientRect();
        let deltaX = (2 / rect.width) * 100;
        let deltaY = (11 / rect.height) * 100;

        let x = (((e.clientX - rect.left) / rect.width) * 100) - deltaX; //x position within the element.
        let y = (((e.clientY - rect.top) / rect.height) * 100) - deltaY;
        this.items.push({coord : {x: x, y: y}});
      }
  }

  openItem(item) {
    console.log(44444, item);
    const dialogRef = this.dialog.open(CreateDescriptionComponent, {
      data: {
        id: item.id,
        description: item.description,
        name: item.name,
        coord: item.coord,
        parent: this.id
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) 
      {
        if (item.id) {
          console.log('update');
          this.db.collection('item').doc(item.id).update({name: result.name, description: result.description}).then((res) => {console.log(77777)});
         // this.db.collection('item').doc(item.id).set(result).then(res => console.log(123, res));
        } else {
          console.log('new');
          this.db.collection('item').add(result).then((res) => {
            if (this.currentGarden.items) { 
              this.currentGarden.items.push(res.id); 
            } else { 
              this.currentGarden.items = [res.id]; 
            }
            this.db.collection('gardens/' + this.auth.getEmail() +'/data/').doc(this.id).update({items: this.currentGarden.items});
          });
        }
      }
    });
  }

  clearNew(type) {
    if (type) {
      this.items = [];
    } else {
      this.items.pop();
    }
  }

  clearChoosing() {
    this.ChoosingItems = [];
  }

  deleteChoosing() {

  }
}
