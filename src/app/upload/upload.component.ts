import { Component } from '@angular/core';
import { UploadService } from '../shared/upload.service';
import { Upload } from '../models/upload.model';
import * as _ from 'lodash';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent {

  files: FileList;
  upload: Upload;

  constructor(private uploadServise: UploadService) { }

  uploadFiles() {
    var imageResizing = angular.module('imageResizingModule', []);
    console.log(111);
    const filesToUpload = this.files;
    const filesIdx = _.range(filesToUpload.length);
    _.each(filesIdx, (idx) => {
      this.upload = new Upload(filesToUpload[idx]);
      console.log(4444);
      console.log(this.upload);
      console.log(3333);
      this.uploadServise.uploadFile(this.upload);
    });
  }

  handleFiles(event) {
    this.files = event.target.files;
  }
}
