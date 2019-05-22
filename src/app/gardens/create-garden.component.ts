import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-create-garden',
  template:  `<h1 mat-dialog-title>Создать сад</h1>
                  <mat-dialog-content fxLayout="column"  fxLayoutAlign="center center"  fxLayoutGap="10px" style="min-width: 400px; padding: 5px; margin: 0 px;">
                    <mat-form-field>
                    <input
                      type="text"
                      matInput
                      placeholder="Название сада">
                    </mat-form-field>

                    <button type="button" mat-raised-button (click)="imgFileInput.click()">Выбрать схему/фото сада</button>
                    <input hidden type="file" #imgFileInput (change)="previewImage($event)">

                    <img [src]="imageSrc" style="max-width: 200px">
                  </mat-dialog-content>
                  <mat-dialog-actions fxLayout="row"  fxLayoutAlign="center center" style="padding-bottom: 27px;">
                    <button mat-raised-button [mat-dialog-close]="true" color="primary">Создать</button>
                    <button mat-raised-button [mat-dialog-close]="false" color="warn">Отмена</button>
                  </mat-dialog-actions>`
})
export class CreateGardenComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public passedData: any) {}

  imageSrc: string;

  previewImage(event): void { 
    const files = event.target.files;
      if (files && files[0]) {
          const file = files[0];
  
          const reader = new FileReader();
          reader.onload = e => this.imageSrc = reader.result;
  
          reader.readAsDataURL(file);
      }
  }
}

