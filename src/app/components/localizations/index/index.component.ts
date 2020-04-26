import { Component, OnInit } from '@angular/core';

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

  constructor(
    public userService: UserService,
    public localizationService: LocalizationService
  ) {
    this.currentUser = this.userService.getCurrentUser();
  }

  ngOnInit() {
    this.localizationService.getLocalizations().subscribe((localizationsSnapshot) => {

      this.localizations = [];

      localizationsSnapshot.forEach((doc: any) => {

        let localizationAux: Localization = {
          id: doc.payload.doc.id,
          userId: doc.payload.doc.data().userId,
          name: doc.payload.doc.data().name,
          description: doc.payload.doc.data().description,
          images: doc.payload.doc.data().images,
          latitude: doc.payload.doc.data().latitude,
          longitude: doc.payload.doc.data().longitude,
          likes: doc.payload.doc.data().likes,
          url: doc.payload.doc.data().url
        }

        this.localizations.push(localizationAux);
      })
    });
  };
}
