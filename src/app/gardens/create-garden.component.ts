import { Component, Inject, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { UploadService } from '../shared/upload.service';
import { Upload } from '../models/upload.model';
import * as _ from 'lodash';
import { MatDialogRef } from '@angular/material';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';


@Component({
  selector: 'app-create-garden',
  template:  `<h1 mat-dialog-title>Создать сад</h1>
                  <mat-dialog-content fxLayout="column"  fxLayoutAlign="center center"  fxLayoutGap="10px" style="min-width: 400px; padding: 5px; margin: 0 px;">
                    <mat-form-field>
                    <input
                      type="text"
                      matInput
                      placeholder="Название сада"
                      [(ngModel)] ="text">
                    </mat-form-field>

                    <button type="button" mat-raised-button (click)="imgFileInput.click()" [disabled]="showBar">Выбрать схему/фото сада</button>
                    <input hidden type="file" #imgFileInput (change)="previewImage($event)">
                    <img [src]="imageSrc" style="max-width: 200px" *ngIf="showImg">
                    <h4 *ngIf="showBar">Загрузка изображения {{ (upload !== undefined) ? upload.progress : 0}}%</h4>
                    <mat-progress-bar class="example-margin" *ngIf="showBar" [color]="color" [mode]="mode" [value]="(upload !== undefined) ? upload.progress : 0" style="width: 80%;"> </mat-progress-bar>
                  </mat-dialog-content>
                  <mat-dialog-actions fxLayout="row"  fxLayoutAlign="center center" style="padding-bottom: 27px;">
                    <button mat-raised-button color="primary" (click)="createGarden()" [disabled]="showBar">Создать</button>
                    <button mat-raised-button [mat-dialog-close]="false" color="warn" [disabled]="showBar">Отмена</button>
                  </mat-dialog-actions>`
})
export class CreateGardenComponent implements OnDestroy{

  constructor(
    @Inject(MAT_DIALOG_DATA) public passedData: any, 
    private uploadServise: UploadService, 
    private dialogRef: MatDialogRef<CreateGardenComponent>,
    private auth: AuthService
    ) {
    this.downloadSubscription = this.uploadServise.downloadEnd.subscribe(
      (url) => {
        this.dialogRef.close(true);
      }
    );
    console.log(222222);
    console.log(this.auth);
  }

  private showBar: boolean = false;
  private showImg: boolean = false;
  downloadSubscription: Subscription;
  imageSrc: string;
  fileImage: File;
  upload: Upload;
  progressValue: number;
  text: string = '111';

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

  createGarden() {
    if (this.fileImage) {
      this.showBar = true;
      this.upload = new Upload(this.fileImage, this.text);
      this.uploadServise.uploadFile(this.upload, this.auth.getEmail());
    }
  }

  ngOnDestroy () {
    this.downloadSubscription.unsubscribe();
  }
}

