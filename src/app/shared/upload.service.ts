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

  constructor(/*private ngFire: AngularFireModule,*/ private db: AngularFirestore) { }

  uploadFile(upload: Upload, email) {
    let storageRef = firebase.storage().ref();
    let uploadTask = storageRef.child(`${this.basePath}/${upload.file.name}`).put(upload.file);

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
        this.saveFileData(upload, email);
        this.downloadEnd.next('');
      }
    );
  }

  private saveFileData(upload: Upload, email: string) {
    this.db.collection('gardens/'+ email+'/data').add({name: upload.name, text: upload.text, items: []})
                .then(() => {})
                .catch((error) => {
                });
  }

}
