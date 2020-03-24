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
		this.localizationService.getCurrentPosition().then(pos => {
			this.initMap(pos.lat, pos.lng);
			this.initMarkers();
		});
	}

	private initMap(lat, lon): void {
		this.map = L.map('map', {
			center: [lat, lon],
			zoom: 10
		});

		var currentPositionIcon = L.icon({
			iconUrl: 'assets/current_position_icon.png',

			iconSize: [35, 50],
			iconAnchor: [10, 70],
			popupAnchor: [7, -70]
		});

		let currentPositionMarker = L.marker([lat, lon], { icon: currentPositionIcon });
		currentPositionMarker.bindPopup("Posición Actúal");
		currentPositionMarker.addTo(this.map)

		const tiles1 = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
			maxZoom: 15,
			attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
		});

		const tiles2 = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
			maxZoom: 15,
			attribution: `Lat: ${lat} Lon: ${lon}`
		});

		tiles1.addTo(this.map);
		tiles2.addTo(this.map);
	}

	private initMarkers() {
		this.localizationService.getLocalizations().subscribe((localizationsSnapshot) => {
			this.localizations = [];
			localizationsSnapshot.forEach((doc: any) => {
				let marker = L.marker([doc.payload.doc.data().latitude, doc.payload.doc.data().longitude], { title: doc.payload.doc.data().name });
				marker.bindPopup(doc.payload.doc.data().name);
				marker.on("click", this.addToRoute)
				marker.addTo(this.map)
			})
		});
	}

	private addToRoute(event) {
		console.log(event.target.options.title);
	}
}
