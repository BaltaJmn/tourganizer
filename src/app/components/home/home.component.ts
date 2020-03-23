import { Component, OnInit } from "@angular/core";
import * as L from 'leaflet';
import { Observable } from 'rxjs';
import { AngularFirestore } from 'angularfire2/firestore';

@Component({
	selector: "app-home",
	templateUrl: "./home.component.html",
	styleUrls: ["./home.component.css"]
})
export class HomeComponent implements OnInit {

	private map;
	private localizations: Observable<any[]>;

	constructor(
		private db: AngularFirestore
	) {

	}

	ngOnInit(): void {
		this.initMap();
	}

	ngAfterViewInit(): void {
		this.localizations = this.db.collection('/localization').valueChanges();

		this.localizations.forEach(localization => {
			L.marker([localization[0].latitude, localization[0].altitude], {title: localization[0].name}).addTo(this.map).bindPopup(localization[0].name);;
		});
	}

	private initMap(): void {
		this.map = L.map('map', {
			center: [40.4636688, -3.7492199],
			zoom: 6
		});

		const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
			maxZoom: 15,
			attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
		});

		tiles.addTo(this.map);
	}
}
