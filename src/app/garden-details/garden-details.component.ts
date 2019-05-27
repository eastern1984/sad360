import { Component, OnInit } from '@angular/core';
import { CurrentGardenService } from '../gardens/current-garden.service';
import * as firebase from 'firebase';
import { MatDialog } from '@angular/material';
import { CreateDescriptionComponent } from './create-description.component';
import { AngularFirestore } from 'angularfire2/firestore';
import { AuthService } from '../auth/auth.service';

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

  constructor(
    private currentGarden: CurrentGardenService,
    private dialog: MatDialog,
    private db: AngularFirestore,
    private auth: AuthService
    ) {}

  ngOnInit() {
    this.text = this.currentGarden.text;
    this.id = this.currentGarden.id;
    console.log (this.currentGarden);
    let ref = firebase.storage().ref();
    ref.child('uploads/' + this.currentGarden.name).getDownloadURL().then((res) => this.imageSrc = res);

    this.db.collection('item', ref => ref.where('parent', '==', this.id)).valueChanges().subscribe(data => {
      this.itemsDb = data;
      console.log(55555, data);
      console.log(55555, this.itemsDb);
    });
  }

  putItem(e) {console.log(e.target.tagName);
    if (e.target.tagName.toLowerCase() == 'img') {
        let rect = e.target.getBoundingClientRect();
        let deltaX = (2 / rect.width) * 100;
        let deltaY = (11 / rect.height) * 100;

        let x = (((e.clientX - rect.left) / rect.width) * 100) - deltaX; //x position within the element.
        let y = (((e.clientY - rect.top) / rect.height) * 100) - deltaY;
        this.items.push({x: x, y: y});
      }
  }

  openItem(item) {
    const dialogRef = this.dialog.open(CreateDescriptionComponent, {
      data: {
        item: item,
        parent: this.id
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) 
      {
        this.currentGarden.items.push(result);
        this.db.collection('gardens/' + this.auth.getEmail() +'/data').doc(this.id).set({name: this.currentGarden.name, text: this.currentGarden.text, items: this.currentGarden.items});
        console.log(result);
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
