import { Component, OnInit } from "@angular/core";

import { LocalizationService } from '../../services/localization.service';
import { ActivityService } from '../../services/activity.service';
import { UserService } from '../../services/user.service';
import { Activity } from '../../interfaces/Activity';
import { User } from '../../interfaces/User';


@Component({
	selector: "app-home",
	templateUrl: "./home.component.html",
	styleUrls: ["./home.component.css"]
})

export class HomeComponent implements OnInit {

	public first = true;

	public currentUser: User;
	public activities = [];

	constructor(
		private activityService: ActivityService,
		private userService: UserService
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
						id: doc.payload.doc.id,
						userId: doc.payload.doc.data().userId,
						date: doc.payload.doc.data().date,
						type: doc.payload.doc.data().type,
						content: doc.payload.doc.data().content
					}

					this.activities.push(activityAux);
				});
			});
		});
	}
}
