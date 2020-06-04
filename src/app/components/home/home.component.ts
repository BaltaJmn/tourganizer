import { Component, OnInit } from "@angular/core";

import { LocalizationService } from '../../services/localization.service';
import { ActivityService } from '../../services/activity.service';
import { UserService } from '../../services/user.service';

import { Localization } from '../../interfaces/Localization';
import { Activity } from '../../interfaces/Activity';
import { User } from '../../interfaces/User';
import { RouteService } from '../../services/route.service';
import { Route } from '../../interfaces/Route';

@Component({
	selector: "app-home",
	templateUrl: "./home.component.html",
	styleUrls: ["./home.component.css"]
})

export class HomeComponent implements OnInit {

	public first = true;

	public currentUser: User = {
		id: "",
		profile: "",
		username: "",
		password: "",
		email: "",
		config: {
			lang: "",
			confirmed: false,
			rol: 2
		},
		followers: [],
		follows: [],
		createdRoutes: [],
		savedRoutes: [],
	};

	public routes: Route[] = [];
	public localizations: Localization[] = [];

	constructor(
		private activityService: ActivityService,
		private userService: UserService,
		private routeService: RouteService,
		private localizationService: LocalizationService
	) {
		this.userService.userEmitter.subscribe((response) => {
			this.currentUser = response;
			this.initActivities();
			this.first = false;
		});
	}

	ngOnInit() {
		if (this.first) {
			this.currentUser = this.userService.getCurrentUser();
			this.initActivities();
		}
	}

	initActivities() {
		this.routeService.getRoutesHome().subscribe((result) => {
			result.forEach((route: any) => {
				let routeAux: Route = {
					id: route.payload.doc.id,
					userId: route.payload.doc.data().userId,
					profile: route.payload.doc.data().profile,
					name: route.payload.doc.data().name,
					type: route.payload.doc.data().type,
					confirmed: route.payload.doc.data().confirmed,
					center: route.payload.doc.data().center,
					totalTime: route.payload.doc.data().totalTime,
					rating: route.payload.doc.data().rating,
					localizations: route.payload.doc.data().localizations,
				};

				this.routes.push(routeAux);
			})
		});

		this.localizationService.getLocalizationsHome().subscribe((result) => {
			result.forEach((localization: any) => {

				let localizationAux: Localization = {
					id: localization.payload.doc.id,
					profile: localization.payload.doc.data().profile,
					userId: localization.payload.doc.data().userId,
					name: localization.payload.doc.data().name,
					description: localization.payload.doc.data().description,
					confirmed: localization.payload.doc.data().confirmed,
					images: localization.payload.doc.data().images,
					latitude: localization.payload.doc.data().latitude,
					longitude: localization.payload.doc.data().longitude,
					likes: localization.payload.doc.data().likes,
					url: localization.payload.doc.data().url
				}

				this.localizations.push(localizationAux);
			})
		});
	}
}
