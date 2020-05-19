import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { NotificationService } from '../../../../services/notification.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {

  notifications = [];

  constructor(
    public dialogRef: MatDialogRef<NotificationsComponent>, @Inject(MAT_DIALOG_DATA) public notification: Array<Notification>,
    private notificationService: NotificationService
  ) {
    this.notifications = notification
  }

  ngOnInit() {
  }

  markAsRead(index, id) {
    this.notificationService.updateNotificationSeen(id);
    this.notifications.splice(index, 1);
  }

}
