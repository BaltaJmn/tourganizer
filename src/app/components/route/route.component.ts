import { Component, OnInit } from '@angular/core';
import { RouteService } from '../../services/route.service';
import { ActivatedRoute } from '@angular/router';
import { Route } from '../../interfaces/Route';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-route',
  templateUrl: './route.component.html',
  styleUrls: ['./route.component.css']
})
export class RouteComponent implements OnInit {

  type = "add";
  loaded = true;
  currentRoute: Route;

  route = new FormGroup({
    userId: new FormControl('', [Validators.required]),
    name: new FormControl('', [Validators.required]),
    type: new FormControl(0, [Validators.required]),
    totalTime: new FormControl(0, [Validators.required]),
    ratingTotal: new FormControl(0, [Validators.required]),
    votes: new FormControl(0, [Validators.required]),
    localizations: new FormControl([], [Validators.required])
  });

  constructor(
    private userService: UserService,
    private routeService: RouteService,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {

      if (params.id != 'add') {

        this.type = "update";

        this.loaded = false;

        this.routeService.getRoute(params.id).subscribe((result) => {

          this.currentRoute = {
            id: result.id,
            userId: result.data().userId,
            name: result.data().name,
            type: result.data().type,
            totalTime: result.data().totalTime,
            ratingTotal: result.data().ratingTotal,
            votes: result.data().votes,
            localizations: result.data().localizations
          };

          this.route.get("userId").setValue(this.currentRoute.userId);
          this.route.get("name").setValue(this.currentRoute.name);
          this.route.get("type").setValue(this.currentRoute.type);
          this.route.get("totalTime").setValue(this.currentRoute.totalTime);
          this.route.get("ratingTotal").setValue(this.currentRoute.ratingTotal);
          this.route.get("votes").setValue(this.currentRoute.votes);
          this.route.get("localizations").setValue(this.currentRoute.localizations);

          this.loaded = true;
        });
      };
    });
  }

  onSubmit(route: FormGroup) {
    if (this.type == "add") {

      this.route.get("userId").setValue(this.userService.getCurrentUserId());

      this.routeService.createRoute(route.value).then(() => {
        Swal.fire('Great!', 'Your route was created succesfully!', 'success').then(() => {
          route.reset();
        });
      });
    } else {
      this.routeService.updateRoute(route.value).then(() => {
        Swal.fire('Great!', 'Your route was updated succesfully!', 'success').then(() => {
          route.reset();
        });
      });
    }
  }
}
