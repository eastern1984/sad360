import { Component, OnInit, OnChanges } from '@angular/core';
import {ImageService} from '../shared/image.service';
import {Observable, Subscription, from} from '../../../node_modules/rxjs';
import {GalleryImage} from '../models/galleryImage.model';
import { AuthService } from '../auth/auth.service';
import { CreateGardenComponent } from './create-garden.component';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-gardens',
  templateUrl: './gardens.component.html',
  styleUrls: ['./gardens.component.css']
})
export class GardensComponent implements OnInit, OnChanges {
  
  images: string[];
  imagesSubscription: Subscription;
 // @Output() openNote = new EventEmitter<string>();
  
 // images: Observable<GalleryImage[]>;

  constructor(
    private imageService: ImageService, 
    private authService: AuthService,
    private dialog: MatDialog
    ) {}

  ngOnInit() {
    this.imagesSubscription = this.imageService.imageChanged.subscribe(
      (images) => {
          this.images = images;
          console.log(images);
      });
  //this.imageService.getImages(this.authService.getEmail());

  //  this.images = this.imageService.getImages();
  }

  ngOnChanges() {
    //  this.images = this.imageService.getImages();
  }

  createGarden() {
    const dialogRef = this.dialog.open(CreateGardenComponent, {
      data: {
        message: 'Message`123'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log(333);
      } else {
        console.log(222);
      }
    });
  }

  imageSrc: string;

  readURL(event: Event): void {
    console.log(55555555555555);
    console.log(event);
  }
}
