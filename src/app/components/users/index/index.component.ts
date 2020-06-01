import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';


import { UserService } from '../../../services/user.service';

import { User } from '../../../interfaces/User';

import Swal from 'sweetalert2'
import { MatTableDataSource } from '@angular/material';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexUserComponent implements OnInit {

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

  nameFilter = new FormControl();
  filteredValues = { username: ''};

  public users = [];
  dataSource;
  public displayedColumns: string[] = ['name', 'follow', 'see', 'delete'];

  constructor(
    public userService: UserService,
  ) { }

  ngOnInit() {

    this.currentUser = this.userService.getCurrentUser();

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
      });

      this.dataSource = new MatTableDataSource(this.users);
      this.dataSource.filterPredicate = this.customFilterPredicate();

      this.nameFilter.valueChanges.subscribe((nameFilterValue) => {
        this.filteredValues['username'] = nameFilterValue;
        this.dataSource.filter = JSON.stringify(this.filteredValues);
      });

    });
  };

  confirmDelete(user) {
    Swal.fire({
      title: 'Do you want to delete this user?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel',
      focusCancel: true
    }).then((result) => {
      if (result.value) {
        this.userService.deleteUser(user.id).then(() => {
          Swal.fire(
            'Deleted!',
            'This user was deleted succesfully!',
            'success'
          );
        });
      }
    })
  };

  customFilterPredicate() {
    const myFilterPredicate = function (data: User, filter: string): boolean {
      let searchString = JSON.parse(filter);

      let nameFound = data.username.toString().trim().toLowerCase().indexOf(searchString.username.toLowerCase()) !== -1

      if (searchString.topFilter) {
        return nameFound
      } else {
        return nameFound
      }
    }
    return myFilterPredicate;
  };
}
