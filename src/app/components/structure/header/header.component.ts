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
    this.userService.notificationUSEmitter.subscribe(() => this.refreshNotification())
  }

  ngOnInit() {
    this.refreshNotification();
  }

  refreshNotification() {
    if (this.userService.getLogged()) {
      this.notificationService.getNotificationsById(this.currentUser.id).subscribe((notificationSnapshot) => {
        this.notifications = [];

        notificationSnapshot.forEach((doc: any) => {
          let notificationAux: Notification = {
            id: doc.payload.doc.id,
            content: doc.payload.doc.data().content,
            sender: doc.payload.doc.data().sender,
            receiver: doc.payload.doc.data().receiver
          };

          this.notifications.push(notificationAux);
        });
      });
    }
  };

  markAsRead(id, index) {
    this.notificationService.updateNotificationSeen(id);
    this.notifications.splice(index, 1);
  }
}
