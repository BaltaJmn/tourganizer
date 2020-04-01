import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { User } from '../../interfaces/User';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  public logged: boolean = false;
  public currentUser: User;

  constructor(
    public userService: UserService
  ) {
    this.userService.loggedEmitter.subscribe(response => this.logged = response);
    this.userService.userEmitter.subscribe(response => this.currentUser = response);
  }

  ngOnInit() {
  }

  logOut(){
    this.userService.logOut();
  }

}
