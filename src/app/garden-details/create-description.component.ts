import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import * as _ from 'lodash';
import { MatDialogRef } from '@angular/material';
import { Subscription } from 'rxjs';
import { AngularFirestore } from 'angularfire2/firestore';

export interface DialogData {
  name: string;
  description: string;
}

@Component({
  selector: 'app-create-description',
  template:  `
                
                  <h1 mat-dialog-title>Добавьте описание к точке</h1>
                    <mat-dialog-content fxLayoutAlign="center center" fxLayout="column" fxLayoutGap="10px" style="min-width: 400px; padding: 5px; margin: 0 px;">
                        <mat-form-field *ngIf="!showSpinner">
                          <input type="text" matInput [(ngModel)]="data.name" placeholder="Введите название">
                          <mat-error>Введите название.</mat-error>
                        </mat-form-field>
                        <mat-form-field *ngIf="!showSpinner" style="width: 300px;">
                          <textarea type="text" matInput [(ngModel)]="data.description" rows="5" placeholder="Описание"> </textarea>
                        </mat-form-field>   
                        <mat-spinner *ngIf="showSpinner"> </mat-spinner>                
                    </mat-dialog-content>
                    
                    <mat-dialog-actions fxLayout="row"  fxLayoutAlign="center center" style="padding-bottom: 27px;">
                      <button mat-raised-button color="primary" (click)="createItem()" [disabled]="showBar">Сохранить</button>
                      <button mat-raised-button [mat-dialog-close]="false" color="warn" [disabled]="showBar">Отмена</button>
                    </mat-dialog-actions>
                  `
})
export class CreateDescriptionComponent implements OnDestroy, OnInit{

    private name: string;
    private description: string;
    private showSpinner: boolean = false;
  
  constructor(
    @Inject(MAT_DIALOG_DATA)  public data: DialogData, 
    private dialogRef: MatDialogRef<CreateDescriptionComponent>,
    private db: AngularFirestore
    ) {
  }

  ngOnInit() {
    console.log(this.data);
  }

  previewImage(event): void { 
  }

  createItem() {
      this.showSpinner = true;

      this.db.collection('item').add(this.data).then(
        (result) => {
          console.log(888999888);
          this.dialogRef.close(result.id);
        }
      );
  }

  ngOnDestroy () {
  }

  onSubmit() {

  }
}

