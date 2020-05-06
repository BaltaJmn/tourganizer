import { Component, OnInit } from '@angular/core';

import { UserService } from '../../../services/user.service';
import { NotificationService } from '../../../services/notification.service';

import { User } from '../../../interfaces/User';
import { Notification } from 'src/app/interfaces/Notification';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

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

  public notifications = [];
  public notificationsNumber = this.notifications.length;

  constructor(
    public userService: UserService,
    public notificationService: NotificationService
  ) {
    this.userService.userEmitter.subscribe(response => this.currentUser = response);
    this.userService.notificationUSEmitter.subscribe((notifications) => this.notifications = notifications)
  }

  ngOnInit() {
  }

  markAsRead(id, index) {
    this.notificationService.updateNotificationSeen(id);
    this.notifications.splice(index, 1);
  }
}
