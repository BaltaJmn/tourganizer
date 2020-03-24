import { Component, OnInit } from "@angular/core";

import 'leaflet';
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";

declare let L;

import { LocalizationService } from '../../services/localization.service';

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

	private map;
	private route = [];

	constructor(
		private localizationService: LocalizationService
	) { }

	ngOnInit(): void {
		this.localizationService.getCurrentPosition().then(
			(pos) => {
				this.initCurrentMap(pos.lat, pos.lng);
				this.initMarkers();
			},
			(err) => {
				this.initMap();
				this.initMarkers();
			});
	}

	onMapReady(map: L.Map) {
		L.Routing.control({
			waypoints: [L.latLng(57.74, 11.94), L.latLng(57.6792, 11.949)],
			routeWhileDragging: true
		}).addTo(map);
	}

	private initMap() {
		this.map = L.map('map', {
			center: ["40.4636688", "-3.7492199"],
			zoom: 10
		});

		const tiles1 = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
			maxZoom: 15,
			attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
		});

		tiles1.addTo(this.map);
	}

	private initCurrentMap(lat?, lon?): void {
		this.map = L.map('map', {
			center: [lat, lon],
			zoom: 7
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
			localizationsSnapshot.forEach((doc: any) => {

				let marker = L.marker(
					[doc.payload.doc.data().latitude, doc.payload.doc.data().longitude],
					{ title: doc.payload.doc.data().name }
				);

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
