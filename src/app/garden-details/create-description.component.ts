import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import * as _ from 'lodash';
import { MatDialogRef } from '@angular/material';
import { Subscription } from 'rxjs';
import { AngularFirestore } from 'angularfire2/firestore';

export interface DialogData {
  id: string;
  name: string;
  description: string;
  parent: string;
  coord: any[];
}

@Component({
  selector: 'app-create-description',
  template:  `
                
                  <h1 mat-dialog-title>{{ (data.id) ? 'Редактирование' : 'Добавление'}} описания к точке</h1>
                    <mat-dialog-content fxLayoutAlign="center right" fxLayout="column" fxLayoutGap="10px" style="margin: 0; width: 400px; padding: 10px; margin: 0px;">
                        <mat-form-field *ngIf="!showSpinner" style="width: 60%;">
                          <input type="text" matInput [(ngModel)]="data.name" placeholder="Введите название">
                          <mat-error>Введите название.</mat-error>
                        </mat-form-field>
                        <mat-form-field *ngIf="!showSpinner" style="width: 90%;">
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

    private name: string = this.data.name;
    private description: string = this.data.description;
    private showSpinner: boolean = false;
  
  constructor(
    @Inject(MAT_DIALOG_DATA)  public data: DialogData, 
    private dialogRef: MatDialogRef<CreateDescriptionComponent>,
    private db: AngularFirestore
    ) {
  }

  ngOnInit() {
    console.log(222222, this.data);
  }

  previewImage(event): void { 
  }

  createItem() {
      this.showSpinner = true;
      console.log(222333, this.data.id);
      this.dialogRef.close({name: this.data.name, description: this.data.description, coord: this.data.coord, parent: this.data.parent});
  }

  ngOnDestroy () {
  }

  onSubmit() {

  }
}

