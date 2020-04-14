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

	private map;
	private control;
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

	private initMap() {
		this.map = L.map('map', {
			center: ["40.4636688", "-3.7492199"],
			zoom: 6
		});

		const tiles1 = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
			maxZoom: 15,
			attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
		});

		tiles1.addTo(this.map);
	}

	private initCurrentMap(lat, lon): void {
		this.map = L.map('map', {
			center: [lat, lon],
			zoom: 6
		});

		var currentPositionIcon = L.icon({
			iconUrl: "assets/marker-icon-current.png",
			shadowUrl: "assets/marker-shadow.png"
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

		// var geojsonLayer = L.geoJson.ajax("assets/leaflet-geojson.json",{dataType:"json"});
		// geojsonLayer.addTo(this.map);

		// L.Routing.control({
		// 	router: L.Routing.osrmv1({
		// 		serviceUrl: `http://router.project-osrm.org/route/v1/`
		// 	}),
		// 	showAlternatives: true,
		// 	lineOptions: { styles: [{ color: '#242c81', weight: 7 }] },
		// 	fitSelectedRoutes: false,
		// 	altLineOptions: { styles: [{ color: '#ed6852', weight: 7 }] },
		// 	show: false,
		// 	routeWhileDragging: true,
		// 	waypoints: [
		// 		L.latLng(57.74, 11.94),
		// 		L.latLng(57.6792, 11.949)
		// 	]
		// }).addTo(this.map);
	}

	private initMarkers() {
		this.localizationService.getLocalizations().subscribe((localizationsSnapshot) => {
			localizationsSnapshot.forEach((doc) => {

				let marker = L.marker(
					[doc.data().latitude, doc.data().longitude],
					{ title: doc.data().name }
				);

				marker.bindPopup(doc.data().name);
				marker.on('mouseover', function (e) {
					this.openPopup();
				});
				marker.on('mouseout', function (e) {
					this.closePopup();
				});
				marker.on("click", this.addToRoute)
				marker.addTo(this.map)
			})
		});
	}

	public addToRoute(event) {
		console.log(event.target);
		let positionSrc = event.target._icon.src.split("/").length - 1;

		if (event.target._icon.src.split("/")[positionSrc] == "marker-icon.png") {
			event.target._icon.src = "assets/marker-icon-selected.png"
		} else {
			event.target._icon.src = "assets/marker-icon.png"
		}
	}
}
