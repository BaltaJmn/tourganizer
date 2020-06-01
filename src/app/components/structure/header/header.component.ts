import { Component, OnInit } from '@angular/core';

import { UserService } from '../../../services/user.service';
import { NotificationService } from '../../../services/notification.service';

import { User } from '../../../interfaces/User';
import { Notification } from 'src/app/interfaces/Notification';
import { MatDialog } from '@angular/material/dialog';
import { NotificationsComponent } from './notifications/notifications.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  admin: boolean = false;

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

  public notifications = [];
  public notificationsNumber = this.notifications.length;

  constructor(
    public userService: UserService,
    public notificationService: NotificationService,
    public dialog: MatDialog
  ) {

    this.userService.userEmitter.subscribe((response) => {
      this.currentUser = response;
    });

    this.userService.notificationUSEmitter.subscribe((notifications) => {
      this.notifications = notifications;
    });
  }

  ngOnInit() {
  }

  openModal() {
    const dialogRef = this.dialog.open(NotificationsComponent, {
      width: '600px',
      height: '400px',
      data: this.notifications
    });
  }
}
