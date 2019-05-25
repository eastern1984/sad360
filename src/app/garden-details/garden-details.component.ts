import { Component, OnInit } from '@angular/core';
import { CurrentGardenService } from '../gardens/current-garden.service';
import * as firebase from 'firebase';

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

  constructor(private currentGarden: CurrentGardenService) { 
    
  }

  ngOnInit() {
    this.text = this.currentGarden.text;
    this.id = this.currentGarden.id;
    let ref = firebase.storage().ref();
    ref.child('uploads/' + this.currentGarden.name).getDownloadURL().then((res) => this.imageSrc = res);
  }

  putItem(e) {console.log(e.target.tagName);
    if (e.target.tagName.toLowerCase() == 'img') {
    var rect = e.target.getBoundingClientRect();
    var x = e.clientX - rect.left - 2; //x position within the element.
    var y = e.clientY - rect.top - 11;
    this.items.push({x: x, y: y});
    console.log(this.items);
    }
  }

  openItem(item) {
    console.log(11111, item);
  }
}
