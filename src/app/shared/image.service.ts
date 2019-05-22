import { Injectable } from '@angular/core';

import { AngularFireAuth } from 'angularfire2/auth';

import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs';

@Injectable()
export class ImageService {
  private uid: string;
imageChanged: Observable<any>;

  constructor(private afAuth: AngularFireAuth, private db: AngularFirestore) {
    this.afAuth.authState.subscribe(auth => {
      if (auth !== undefined && auth !== null) {
        this.uid = auth.uid;
      }
    });
  }

  getImages(email?){
    return this.db.collection('uploads');
  }
}
