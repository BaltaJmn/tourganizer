import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { UserService } from '../../../services/user.service';
import { RouteService } from '../../../services/route.service';
import { LocalizationService } from '../../../services/localization.service';

import { Route } from '../../../interfaces/Route';
import { Localization } from '../../../interfaces/Localization';

import Swal from 'sweetalert2';

export interface Aux {
  name: string;
}

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditRouteComponent implements OnInit {

  loaded = true;
  currentRoute: Route;

  localizations = [];
  currentLocalizations = [];

  id;

  route = new FormGroup({
    userId: new FormControl('', [Validators.required]),
    name: new FormControl('', [Validators.required]),
    type: new FormControl(0, [Validators.required]),
    totalTime: new FormControl(0, [Validators.required]),
    rating: new FormControl({ show: 0, total: 0, votes: [] }, [Validators.required]),
    localizations: new FormControl([], [Validators.required])
  });

  constructor(
    private router: Router,
    private userService: UserService,
    private routeService: RouteService,
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

      this.routeService.getRoute(this.id).subscribe((result) => {

        this.currentRoute = {
          userId: result.data().userId,
          name: result.data().name,
          type: result.data().type,
          totalTime: result.data().totalTime,
          rating: result.data().rating,
          localizations: result.data().localizations
        };

        //Añade items al select
        this.localizationService.getLocalizations().subscribe((localizationsSnapshot) => {
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
            };

            this.localizations.push(localizationAux);
          });
          this.localizations = Object.values(this.localizations);
        });

        //Añade los tags de las localizaciones que tiene esa ruta
        this.currentLocalizations = this.currentRoute.localizations;

        this.route.get("userId").setValue(this.currentRoute.userId);
        this.route.get("name").setValue(this.currentRoute.name);
        this.route.get("type").setValue(this.currentRoute.type);
        this.route.get("totalTime").setValue(this.currentRoute.totalTime);
        this.route.get("rating").setValue(this.currentRoute.rating);
        this.route.get("localizations").setValue(this.currentRoute.localizations);

        this.loaded = true;
      });
    });
  }

  onSubmit(route: FormGroup) {
    this.route.get("localizations").setValue(this.currentLocalizations);

    this.routeService.updateRoute(this.id, route.value).then(() => {
      Swal.fire('Great!', 'Your route was updated succesfully!', 'success').then(() => {
        this.router.navigate(['/routes']);
      });
    });
  }
}
