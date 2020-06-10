import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { LocalizationsUnconfirmedComponent } from './unconfirmed/unconfirmed.component';

import { LocalizationService } from '../../../services/localization.service';
import { UserService } from '../../../services/user.service';

import { Localization } from 'src/app/interfaces/Localization';
import { Filter } from '../../../interfaces/Filter';
import { User } from '../../../interfaces/User';

import Swal from 'sweetalert2'

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexLocalizationComponent implements OnInit {

  public currentUser: User;

  public filter: Filter = {
    name: ''
  };

  public localizations = [];
  public localizationsUnconfirmed = [];

  constructor(
    public userService: UserService,
    public localizationService: LocalizationService,
    public dialog: MatDialog
  ) {
    this.currentUser = this.userService.getCurrentUser();
  }

  ngOnInit() {
    this.localizationService.getLocalizations().subscribe((localizationsSnapshot) => {

      this.localizations = [];

      localizationsSnapshot.forEach((doc: any) => {

        let localizationAux: Localization = {
          id: doc.payload.doc.id,
          profile: doc.payload.doc.data().profile,
          userId: doc.payload.doc.data().userId,
          name: doc.payload.doc.data().name,
          description: doc.payload.doc.data().description,
          confirmed: doc.payload.doc.data().confirmed,
          images: doc.payload.doc.data().images,
          latitude: doc.payload.doc.data().latitude,
          longitude: doc.payload.doc.data().longitude,
          likes: doc.payload.doc.data().likes,
          url: doc.payload.doc.data().url
        }

        this.localizations.push(localizationAux);
      })
    });

    this.localizationService.getLocalizationsUnconfirmed().subscribe((localizationsSnapshot) => {

      this.localizationsUnconfirmed = [];

      localizationsSnapshot.forEach((doc: any) => {

        let localizationAux: Localization = {
          id: doc.payload.doc.id,
          profile: doc.payload.doc.data().profile,
          userId: doc.payload.doc.data().userId,
          name: doc.payload.doc.data().name,
          description: doc.payload.doc.data().description,
          confirmed: doc.payload.doc.data().confirmed,
          images: doc.payload.doc.data().images,
          latitude: doc.payload.doc.data().latitude,
          longitude: doc.payload.doc.data().longitude,
          likes: doc.payload.doc.data().likes,
          url: doc.payload.doc.data().url
        }

        this.localizationsUnconfirmed.push(localizationAux);
      })
    });
  };

  openModal() {
    const dialogRef = this.dialog.open(LocalizationsUnconfirmedComponent, {
      width: '600px',
      height: '400px',
      data: this.localizationsUnconfirmed
    });
  };

  deleteLocalization(localization) {

    Swal.fire({
      title: 'Do you want to delete this localization?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel',
      focusCancel: true
    }).then((result) => {
      if (result.value) {
        this.localizationService.deleteLocalization(localization).then(() => {
          Swal.fire(
            'Deleted!',
            'This route was deleted succesfully!',
            'success'
          );
        });
      }
    });
  }
}
