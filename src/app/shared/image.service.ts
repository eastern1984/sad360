import { Injectable } from '@angular/core';

import { AngularFireAuth } from 'angularfire2/auth';

import { AngularFirestore } from 'angularfire2/firestore';

@Injectable()
export class ImageService {
  private uid: string;

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
