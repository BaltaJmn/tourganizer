import { Component, OnInit } from '@angular/core';

import { UserService } from '../../../services/user.service';

import { User } from '../../../interfaces/User';
import { Filter } from '../../../interfaces/Filter';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexUserComponent implements OnInit {

  public filter: Filter = {
    name: ''
  };
  
  public users = [];

  constructor(
    public userService: UserService,
  ) { }

  ngOnInit() {
    this.userService.getUsers().subscribe((usersSnapshot) => {

      this.users = [];

      usersSnapshot.forEach((doc: any) => {

        let userAux: User = {
          id: doc.payload.doc.id,
          profile: doc.payload.doc.data().profile,
          username: doc.payload.doc.data().username,
          password: doc.payload.doc.data().password,
          email: doc.payload.doc.data().email,
          config: doc.payload.doc.data().config,
          followers: doc.payload.doc.data().followers,
          follows: doc.payload.doc.data().follows,
          createdRoutes: doc.payload.doc.data().createdRoutes,
          savedRoutes: doc.payload.doc.data().savedRoutes,
        }

        this.users.push(userAux);
      })
    });
  };
}
