import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class EmailService {

  private cabecera: any;

  constructor(
    private http: HttpClient,
  ) {
    this.cabecera = {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    };
  }

  sendEmail(url, data) {
    return this.http.post(url, data, this.cabecera);
  }
}
