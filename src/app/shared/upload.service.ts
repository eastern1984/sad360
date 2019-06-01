import { Injectable } from '@angular/core';
import { Upload } from '../models/upload.model';
import * as firebase from 'firebase';
import { AngularFirestore } from 'angularfire2/firestore';
import { Subject } from 'rxjs';
import { AuthService } from '../auth/auth.service';


@Injectable()
export class UploadService {

  private basePath = '/uploads';
  downloadEnd = new Subject<string>();

  constructor(private db: AngularFirestore) { }

  uploadFile(upload: Upload, subDir: string) {
    let storageRef = firebase.storage().ref();
    let date = new Date(); 
    let unicName = date.getTime() + upload.file.name;
    let uploadTask = storageRef.child(this.basePath + subDir + '/' + unicName).put(upload.file);

    uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
      (snapshot) =>  {
        // upload in progress
        upload.progress = parseInt(((uploadTask.snapshot.bytesTransferred / uploadTask.snapshot.totalBytes) * 100).toFixed(1));
      },
      (error) => {
        // upload failed
        console.log(error);
      },
      () => {
        upload.name = upload.file.name;
        this.downloadEnd.next(unicName);
      }
    );
  }
}
