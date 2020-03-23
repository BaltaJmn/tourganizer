import { Component, OnInit } from "@angular/core";
import * as L from 'leaflet';
import { Observable } from 'rxjs';
import { AngularFirestore } from 'angularfire2/firestore';
import { LocalizationService } from '../../services/localization.service';

@Component({
	selector: "app-home",
	templateUrl: "./home.component.html",
	styleUrls: ["./home.component.css"]
})
export class HomeComponent implements OnInit {

	private map;
	private localizations = [];

	constructor(
		private localizationService: LocalizationService
	) {

	}

	ngOnInit(): void {
		this.initMap();
	}

	ngAfterViewInit(): void {
		this.localizationService.getLocalizations().subscribe((localizationsSnapshot) => {
			this.localizations = [];
			localizationsSnapshot.forEach((doc: any) => {
				let marker = L.marker([doc.payload.doc.data().latitude, doc.payload.doc.data().longitude], { title: doc.payload.doc.data().name });
				marker.bindPopup(doc.payload.doc.data().name);
				marker.addTo(this.map)
			})
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
