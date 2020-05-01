import { Component, OnInit } from "@angular/core";
import { LocalizationService } from '../../services/localization.service';

import 'leaflet';
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine";
import "leaflet/dist/leaflet.ajax.min.js"

declare let L;

let DefaultIcon = L.icon({
	iconUrl: "assets/marker-icon.png",
	shadowUrl: "assets/marker-shadow.png"
});

L.Marker.prototype.options.icon = DefaultIcon;

@Component({
	selector: "app-home",
	templateUrl: "./home.component.html",
	styleUrls: ["./home.component.css"]
})

export class HomeComponent implements OnInit {

	constructor() { }

	ngOnInit() {

	}
}
