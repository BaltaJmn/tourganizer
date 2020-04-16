import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { LocalizationService } from '../../../services/localization.service';

import { Localization } from '../../../interfaces/Localization';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditLocalizationComponent implements OnInit {

  loaded = true;
  currentLocalization: Localization;

  id;

  localization = new FormGroup({
    userId: new FormControl('', [Validators.required]),
    name: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    likes: new FormControl(0, [Validators.required]),
    latitude: new FormControl(0, [Validators.required]),
    longitude: new FormControl(0, [Validators.required]),
    url: new FormControl('', [Validators.required]),
    images: new FormControl([], [Validators.required]),
  });

  constructor(
    private router: Router,
    private localizationService: LocalizationService,
    private activatedRoute: ActivatedRoute
  ) {
    router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.id = event.url.split('/')[2]
      };
    });
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe(() => {

      this.loaded = false;

      this.localizationService.getLocalization(this.id).subscribe((result) => {

        this.currentLocalization = {
          userId: result.data().userId,
          name: result.data().name,
          description: result.data().description,
          likes: result.data().likes,
          latitude: result.data().latitude,
          longitude: result.data().longitude,
          url:  result.data().url,
          images: result.data().images,
        };

        this.localization.get("userId").setValue(this.currentLocalization.userId);
        this.localization.get("name").setValue(this.currentLocalization.name);
        this.localization.get("description").setValue(this.currentLocalization.description);
        this.localization.get("latitude").setValue(this.currentLocalization.latitude);
        this.localization.get("longitude").setValue(this.currentLocalization.longitude);
        this.localization.get("likes").setValue(this.currentLocalization.likes);
        this.localization.get("url").setValue(this.currentLocalization.url);
        this.localization.get("images").setValue(this.currentLocalization.images);
  
        this.loaded = true;
      });
    });
  };

  onSubmit(localization: FormGroup) {
    this.localizationService.updateLocalization(this.id, localization.value).then(() => {
      Swal.fire('Great!', 'Your route was updated succesfully!', 'success').then(() => {
        this.router.navigate(['/routes']);
      });
    });
  };

}
