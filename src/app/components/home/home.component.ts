import { Component, OnInit } from "@angular/core";

import { LocalizationService } from '../../services/localization.service';
import { ActivityService } from '../../services/activity.service';
import { UserService } from '../../services/user.service';

import { Localization } from '../../interfaces/Localization';
import { Activity } from '../../interfaces/Activity';
import { User } from '../../interfaces/User';

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
			rol: 3
		},
		followers: [],
		follows: [],
		createdRoutes: [],
		savedRoutes: [],
	};

	public activities = [];

	constructor(
		private activityService: ActivityService,
		private userService: UserService,
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
		this.currentUser.follows.forEach((user) => {

			this.activityService.getActivity(user).subscribe((activitySnapshot) => {

				this.activities = [];

				activitySnapshot.forEach((doc: any) => {

					let activityAux: Activity = {
						id: doc.id,
						userId: doc.data().userId,
						date: doc.data().date,
						type: doc.data().type,
						content: doc.data().content,
						new: doc.data().new,
						profile: doc.data().profile
					}

					this.activities.push(activityAux);

					this.activityService.updateNewActivity(activityAux);
				});
			});
		});
	}
}
