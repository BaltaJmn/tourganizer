import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

import { UserService } from './services/user.service';
import { User } from './interfaces/User';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  currentUser: User;
  
  public logged: boolean = false;

  constructor(
    private translate: TranslateService,
    private route: ActivatedRoute,
    private cookieService: CookieService,
    public userService: UserService
  ) {
    this.userService.loggedEmitter.subscribe(response => this.logged = response);

    translate.setDefaultLang('es');

    // Params de URL
    this.route.queryParamMap.subscribe(queryParams => {

      if(queryParams.get("conf")){
        this.userService.confirmUser(queryParams.get("conf"));
      } else if (queryParams.get("reset")){
        this.userService.resetPassword(queryParams.get("reset"));
      }


    });

    // Comprobación de cookie
    if (cookieService.check('login')) {
      let username = cookieService.get('login');

      this.userService.getUserByName(username).subscribe((user) => {

        this.userService.login(user.docs[0].data());

        this.logged = true;

        translate.setDefaultLang(user.docs[0].data().config.lang);
      })
    }
  }
}
