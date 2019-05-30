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
    private auth: AuthService,
    private router: Router
    ) {}

  ngOnInit() {
    if (!this.currentGarden.id) {
      this.router.navigate(['/gardens']);
    }
    window.addEventListener('scroll', this.test, true);
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

  test(e) {
    //console.log(888);
  }
  test2(e) {
    let divH = (this.wrapper.nativeElement as HTMLImageElement).clientHeight;
    let divW = (this.wrapper.nativeElement as HTMLImageElement).clientWidth;
    if (e.deltaY > 0) {
      if (this.image.nativeElement.width / this.image.nativeElement.naturalWidth < 3) {
        (this.image.nativeElement as HTMLImageElement).width = (this.image.nativeElement as HTMLImageElement).width + 50;
      }
    }
    else {

      if ((divH < (this.image.nativeElement as HTMLImageElement).height) || (divW < (this.image.nativeElement as HTMLImageElement).width)) {
        (this.image.nativeElement as HTMLImageElement).width = (this.image.nativeElement as HTMLImageElement).width - 50;
      }
    }
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
        parent: this.id
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) 
      {
        if (item.id) {
          this.db.collection('item').doc(item.id).update({name: result.name, description: result.description}).then((res) => {}).catch(error => console.log(error));
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
