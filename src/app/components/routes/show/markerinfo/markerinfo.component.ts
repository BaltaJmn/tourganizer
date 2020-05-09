import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Localization } from '../../../../interfaces/Localization';
import { ImageService } from '../../../../services/image.service';
import { Image } from '../../../../interfaces/Image';

@Component({
  selector: 'app-markerinfo',
  templateUrl: './markerinfo.component.html',
  styleUrls: ['./markerinfo.component.css']
})
export class MarkerinfoComponent {

  images = [];

  constructor(
    public dialogRef: MatDialogRef<MarkerinfoComponent>, @Inject(MAT_DIALOG_DATA) public data: Localization,
    private imageService: ImageService) {

    data.images.forEach((image) => {
      this.imageService.getImage(image).subscribe((imageSnapshot) => {

        let imageAux: Image = {
          title: imageSnapshot.data().title,
          image: imageSnapshot.data().image,
          thumbImage: imageSnapshot.data().thumbImage,
          alt: imageSnapshot.data().alt
        }

        this.images.push(imageAux);

      });
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
