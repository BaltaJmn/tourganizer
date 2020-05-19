import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatTableDataSource } from '@angular/material';
import { RouteService } from '../../../../services/route.service';

@Component({
  selector: 'app-unconfirmed',
  templateUrl: './unconfirmed.component.html',
  styleUrls: ['./unconfirmed.component.css']
})
export class RoutesUnconfirmedComponent implements OnInit {

  displayedColumns: string[] = ['name', 'see', 'check'];

  constructor(
    public dialogRef: MatDialogRef<RoutesUnconfirmedComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
    public routeService: RouteService
  ) { }

  ngOnInit() { }

  updateConfirmed(i, element) {
    this.routeService.updateConfirmed(element);
    this.data.splice(i, 1);
    this.data = new MatTableDataSource<any>(this.data);
  }

}
