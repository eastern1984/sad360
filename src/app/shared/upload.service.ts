import { Injectable } from '@angular/core';
import { AngularFireModule } from 'angularfire2';
import { GalleryImage } from '../models/galleryImage.model';
import { AngularFireList} from 'angularfire2/database';
import { Upload } from '../models/upload.model';
import * as firebase from 'firebase';
import { AngularFirestore } from 'angularfire2/firestore';


@Injectable()
export class UploadService {

  private basePath = '/uploads';
  private uploads: AngularFireList<GalleryImage[]>;

  constructor(private ngFire: AngularFireModule, private db: AngularFirestore) { }

  uploadFile(upload: Upload) {
    let storageRef = firebase.storage().ref();
    let uploadTask = storageRef.child(`${this.basePath}/${upload.file.name}`).put(upload.file);

    uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
      (snapshot) =>  {
        // upload in progress
        upload.progress = (uploadTask.snapshot.bytesTransferred / uploadTask.snapshot.totalBytes) * 100;
      },
      (error) => {
        // upload failed
        console.log(error);
      },
      () => {
        // upload success
        uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
          upload.url = downloadURL;
          upload.name = upload.file.name;
          this.saveFileData(upload);
        });
      }
    );
  }

  private saveFileData(upload: Upload) {
    this.db.collection('uploads/').add(upload)
                .then(() => {})
                .catch((error) => {
                });
  }

}
