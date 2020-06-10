import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatTableDataSource } from '@angular/material';
import { RouteService } from '../../../../services/route.service';
import { Route } from '../../../../interfaces/Route';
import { UserService } from '../../../../services/user.service';

@Component({
  selector: 'app-unconfirmed',
  templateUrl: './unconfirmed.component.html',
  styleUrls: ['./unconfirmed.component.css']
})
export class RoutesUnconfirmedComponent implements OnInit {

  displayedColumns: string[] = ['name', 'see', 'check'];
  data: any;

  constructor(
    public dialogRef: MatDialogRef<RoutesUnconfirmedComponent>,
    public routeService: RouteService,
    public userService: UserService
  ) { }

  ngOnInit() {
    this.refreshContent();
  }

  updateConfirmed(element) {
    this.routeService.updateConfirmed(element).then(() => {
      this.refreshContent();
    });
  };

  deleteConfirmed(element) {
    this.routeService.deleteRoute(element).then(() => {
      this.userService.getUserGET(element.userId).subscribe((result) => {

        let routesAux = result.data().createdRoutes;
        routesAux.splice(routesAux.indexOf(element.id), 1);

        this.userService.updateCreatedRoutes(result.id, routesAux);

        this.userService.searchSavedRoutes(element.id);

        this.refreshContent();
      });
    });
  };

  refreshContent() {
    this.routeService.getRoutesUnconfirmed().subscribe((routesSnapshot) => {

      this.data = [];

      routesSnapshot.forEach((doc: any) => {

        let routeAux: Route = {
          id: doc.payload.doc.id,
          userId: doc.payload.doc.data().userId,
          profile: doc.payload.doc.data().profile,
          name: doc.payload.doc.data().name,
          type: doc.payload.doc.data().type,
          confirmed: doc.payload.doc.data().confirmed,
          center: doc.payload.doc.data().center,
          totalTime: doc.payload.doc.data().totalTime,
          rating: doc.payload.doc.data().rating,
          localizations: doc.payload.doc.data().localizations,
        }

        this.data.push(routeAux);
      });

      this.data = new MatTableDataSource<any>(this.data);
    });
  };

}
