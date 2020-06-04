import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-confirmed',
  templateUrl: './confirmed.component.html',
  styleUrls: ['./confirmed.component.css']
})
export class ConfirmedComponent implements OnInit {

  confirmed = true;

  constructor(
    public userService: UserService
  ) {
    this.userService.userEmitter.subscribe((response) => {
    });
  }

  ngOnInit() {
  }

}
