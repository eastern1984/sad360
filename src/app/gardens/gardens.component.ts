import { Component, OnInit } from '@angular/core';
import {ImageService} from '../shared/image.service';

@Component({
  selector: 'app-gardens',
  templateUrl: './gardens.component.html',
  styleUrls: ['./gardens.component.css']
})
export class GardensComponent implements OnInit {

  constructor(private imageService: ImageService) { }

  ngOnInit() {
  }

}
