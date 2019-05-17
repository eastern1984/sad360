import { Component, OnInit, OnChanges } from '@angular/core';
import {ImageService} from '../shared/image.service';
import {Observable, Subscription} from '../../../node_modules/rxjs';
import {GalleryImage} from '../models/galleryImage.model';

@Component({
  selector: 'app-gardens',
  templateUrl: './gardens.component.html',
  styleUrls: ['./gardens.component.css']
})
export class GardensComponent implements OnInit, OnChanges {
  
  images: string[];
  imagesSubscription: Subscription;
 // @Output() openNote = new EventEmitter<string>();
  
  images: Observable<GalleryImage[]>;

  constructor(private imageService: ImageService) { }

  ngOnInit() {
    this.imagesSubscription = this.imageService
    this.images = this.imageService.getImages();
  }

  ngOnChanges() {
      this.images = this.imageService.getImages();
  }
}
