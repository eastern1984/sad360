import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import * as _ from 'lodash';
import { MatDialogRef } from '@angular/material';
import { Subscription } from 'rxjs';
import { AngularFirestore } from 'angularfire2/firestore';
import { Upload } from '../models/upload.model';
import { AuthService } from '../auth/auth.service';
import { UploadService } from '../shared/upload.service';
import * as firebase from 'firebase';

export interface DialogData {
  id: string;
  name: string;
  description: string;
  parent: string;
  coord: any[];
  image: string;
}

@Component({
  styles: ['.detail_img {margin: auto;}'],
  selector: 'app-create-description',
  template:  `
                
                  <h1 mat-dialog-title>{{ (data.id) ? 'Редактирование' : 'Добавление'}} описания к точке</h1>
                    <mat-dialog-content fxLayoutAlign="center right" fxLayout="column" fxLayoutGap="10px" style="margin: 0; width: 400px; padding: 10px; margin: 0px;">
                        <mat-form-field style="width: 60%;">
                          <input type="text" matInput [(ngModel)]="data.name" placeholder="Введите название">
                          <mat-error>Введите название.</mat-error>
                        </mat-form-field>
                        <mat-form-field style="width: 90%;">
                          <textarea type="text" matInput [(ngModel)]="data.description" rows="5" placeholder="Описание"> </textarea>
                        </mat-form-field>   

                        <button type="button" mat-raised-button (click)="imgFileInput.click()" [disabled]="showBar">{{ (imageSrc) ? 'Редактирование' : 'Добавление'}} фото</button>
                        <input hidden type="file" #imgFileInput (change)="previewImage($event)">
                        <img class="detail_img" style="max-width: 200px;" [src]="imageSrc" *ngIf="imageSrc">
                        <h4 *ngIf="showBar">Загрузка изображения {{ (upload !== undefined) ? upload.progress : 0}}%</h4>
                        <mat-progress-bar class="example-margin" *ngIf="showBar" [color]="color" [mode]="mode" [value]="(upload !== undefined) ? upload.progress : 0" style="width: 80%;"> </mat-progress-bar>
                        <button  mat-raised-button [mat-dialog-close]="'delete'" color="warn" (tap)="deleteItem()" (click)="deleteItem()">Удалить точку</button>
                    </mat-dialog-content>
                    
                    <mat-dialog-actions fxLayout="row"  fxLayoutAlign="center center" style="padding-bottom: 27px;">
                      <button mat-raised-button color="primary" (tap)="createItem()" (click)="createItem()" [disabled]="showBar">Сохранить</button>
                      <button mat-raised-button [mat-dialog-close]="false" [disabled]="showBar">Отмена</button>
                    </mat-dialog-actions>
                  `
})
export class CreateDescriptionComponent implements OnDestroy, OnInit{

  downloadSubscription: Subscription;
    private name: string = this.data.name;
    private description: string = this.data.description;
    private showSpinner: boolean = false;
    private showImg: boolean = false;
    private showBar: boolean = false;

    private imageSrc;
    fileImage: File;
    upload: Upload;

  constructor(
    @Inject(MAT_DIALOG_DATA)  public data: DialogData, 
    private dialogRef: MatDialogRef<CreateDescriptionComponent>,
    private db: AngularFirestore,
    private auth: AuthService,
    private uploadServise: UploadService,
    ) {
  }


  previewImage(event): void { 
    const files = event.target.files;
      if (files && files[0]) {
          this.showImg = true;

          this.fileImage = files[0];  

          const reader = new FileReader();
          reader.onload = e => this.imageSrc = reader.result;
  
          reader.readAsDataURL(this.fileImage);
      }
  }

  ngOnInit() {
    this.downloadSubscription = this.uploadServise.downloadEnd.subscribe(
      (fileName) => {
        this.dialogRef.close({type: 'save', name: this.data.name ? this.data.name : "---", description: this.data.description ? this.data.description : '', coord: this.data.coord, parent: this.data.parent, image: fileName});
      }
    );

    console.log(1234 , this.data, this.data.image);
    if (this.data.image) {
      let ref = firebase.storage().ref();
      ref.child('uploads/items/' + this.data.image).getDownloadURL().then((res) => {
        this.imageSrc = res;
      });
    }
  }

  createItem() {
    if (this.fileImage) {
      this.showBar = true;
      this.upload = new Upload(this.fileImage);
      this.uploadServise.uploadFile(this.upload, '/items');
    } else {
      this.dialogRef.close({type: 'save', name: this.data.name ? this.data.name : "---", description: this.data.description ? this.data.description : '', coord: this.data.coord, parent: this.data.parent, image: null});
    }
      
  }

  ngOnDestroy () {
  }

  onSubmit() {

  }

  deleteItem() {
    if (this.data.id) {
      this.db.collection('item').doc(this.data.id).delete();
    }
    this.dialogRef.close({type: 'delete', id: this.data.id, coord: this.data.coord});
  }
}

