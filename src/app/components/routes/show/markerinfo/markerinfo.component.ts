import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Localization } from '../../../../interfaces/Localization';
import { ImageService } from '../../../../services/image.service';
import { Image } from '../../../../interfaces/Image';
import { Router } from '@angular/router';

@Component({
  selector: 'app-markerinfo',
  templateUrl: './markerinfo.component.html',
  styleUrls: ['./markerinfo.component.css']
})
export class MarkerinfoComponent {

  images = [];

  constructor(
    public dialogRef: MatDialogRef<MarkerinfoComponent>, @Inject(MAT_DIALOG_DATA) public data: Localization,
    private imageService: ImageService,
    private router: Router) {

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

  goTo() {
    this.router.navigate([`localizations/${this.data.id}`]);
    this.dialogRef.close();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
