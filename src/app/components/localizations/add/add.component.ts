import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { LocalizationService } from '../../../services/localization.service';

import { Localization } from '../../../interfaces/Localization';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class AddLocalizationComponent implements OnInit {

  localization = new FormGroup({
    userId: new FormControl('', [Validators.required]),
    name: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    likes: new FormControl({}, [Validators.required]),
    latitude: new FormControl(0, [Validators.required]),
    longitude: new FormControl(0, [Validators.required]),
    url: new FormControl('', [Validators.required]),
    images: new FormControl([], [Validators.required]),
  });

  constructor(
    private router: Router,
    private localizationService: LocalizationService
  ) { }

  ngOnInit() {
  }

  onSubmit(localization: FormGroup) {
    this.localizationService.createLocalization(localization.value).then(() => {
      Swal.fire('Great!', 'Your localization was created succesfully!', 'success').then(() => {
        this.router.navigate(['/localizations']);
      });
    });
  };

}
