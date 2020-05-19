import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatTableDataSource } from '@angular/material';
import { LocalizationService } from '../../../../services/localization.service';

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

  updateConfirmed(i, element) {
    this.localizationService.updateConfirmed(element);
    this.data.splice(i, 1);
    this.data = new MatTableDataSource<any>(this.data);
  }

}
