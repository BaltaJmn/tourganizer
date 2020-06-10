import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatTableDataSource } from '@angular/material';
import { LocalizationService } from '../../../../services/localization.service';
import { Localization } from '../../../../interfaces/Localization';

@Component({
  selector: 'app-unconfirmed',
  templateUrl: './unconfirmed.component.html',
  styleUrls: ['./unconfirmed.component.css']
})
export class LocalizationsUnconfirmedComponent implements OnInit {

  displayedColumns: string[] = ['name', 'see', 'check'];

  constructor(
    public dialogRef: MatDialogRef<LocalizationsUnconfirmedComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
    public localizationService: LocalizationService
  ) { }

  ngOnInit() { }

  updateConfirmed(element) {
    this.localizationService.updateConfirmed(element).then(() => {
      this.refreshContent();
    });
  };

  deleteConfirmed(element) {
    this.localizationService.deleteLocalization(element).then(() => {
      this.refreshContent();
    });
  };

  refreshContent() {
    this.localizationService.getLocalizationsUnconfirmed().subscribe((localizationsSnapshot) => {

      this.data = [];

      localizationsSnapshot.forEach((localization: any) => {

        let localizationAux: Localization = {
          id: localization.payload.doc.id,
          profile: localization.payload.doc.data().profile,
          userId: localization.payload.doc.data().userId,
          name: localization.payload.doc.data().name,
          description: localization.payload.doc.data().description,
          confirmed: localization.payload.doc.data().confirmed,
          images: localization.payload.doc.data().images,
          latitude: localization.payload.doc.data().latitude,
          longitude: localization.payload.doc.data().longitude,
          likes: localization.payload.doc.data().likes,
          url: localization.payload.doc.data().url
        }

        this.data.push(localizationAux);
      });

      this.data = new MatTableDataSource<any>(this.data);
    });
  };

}
