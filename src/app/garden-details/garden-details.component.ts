import { Component, OnInit, ElementRef, OnDestroy, ViewChild } from '@angular/core';
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
export class GardenDetailsComponent implements OnInit, OnDestroy {

  @ViewChild('wrapper') wrapper: ElementRef;
  @ViewChild('image') image: ElementRef;
  private sliderValue: number = 1;
  private screenSizeIndex: number = 10;
  private wrapperWidth: number = 100;
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
            coord: doc.payload.doc.data().coord,
            image: doc.payload.doc.data().image
          };
        });
      })
      .subscribe(data => {
        this.itemsDb = data;
    }));
  }

test3() {
  let naturalWidth = (this.image.nativeElement as HTMLImageElement).naturalWidth;
    let clientWidth = (this.image.nativeElement as HTMLImageElement).clientWidth;

    this.screenSizeIndex = 1 / (clientWidth / naturalWidth);
    console.log(this.screenSizeIndex);
}

  test(e) {
    //console.log(888);
  }

  test2(e) {
    console.log(e.value);
    this.wrapperWidth = 100 * e.value;
    console.log(this.screenSizeIndex, e.value);  
  }

  putItem(e) {
    if (e.target.tagName.toLowerCase() == 'img') {
        let rect = e.target.getBoundingClientRect();

        let deltaX = (10 / rect.width) * 100;
        let deltaY = (11 / rect.height) * 100;

        let x = (((e.clientX - rect.left) / rect.width) * 100) - deltaX; //x position within the element.
        let y = (((e.clientY - rect.top) / rect.height) * 100) - deltaY;
        this.items.push({coord : {x: x, y: y}});
      }
  }

  openItem(item) {
    const dialogRef = this.dialog.open(CreateDescriptionComponent, {
      data: {
        id: item.id,
        description: item.description,
        name: item.name,
        coord: item.coord,
        parent: this.id,
        image: item.image
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) 
      {
        if (result.type == 'delete') {
          if (result.id) {
            this.db.collection('gardens/' + this.auth.getEmail() +'/data/').doc(this.id).update({items: this.currentGarden.items.filter((item) => item != result.id)});
          } else {
            this.items = this.items.filter(item => (item.coord.x != result.coord.x) || (item.coord.y != result.coord.y));
          }
        } else {
          if (item.id) {
            this.db.collection('item').doc(item.id).update({name: result.name, description: result.description, image: result.image}).then((res) => {}).catch(error => console.log(333, error));
          } else {
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

  ngOnDestroy() {
    this.fbSubs.forEach((sub) => sub.unsubscribe());
  }
}
