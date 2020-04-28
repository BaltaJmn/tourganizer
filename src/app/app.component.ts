import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'tourganizer';

  constructor(
    private translate: TranslateService,
    private route: ActivatedRoute,
    private cookieService: CookieService,
    private userService: UserService
  ) {
    translate.setDefaultLang('es');

    this.route.queryParamMap.subscribe(queryParams => {
      let conf = queryParams.get("conf");

      if (conf != null) {
        this.userService.confirmUser(conf);
      };
    });

    if (cookieService.check('login')) {
      let username = cookieService.get('login');

      this.userService.getUserByName(username).subscribe((user) => {
        this.userService.login(user.docs[0].data());
        translate.setDefaultLang(user.docs[0].data().config.lang);
      })
    }
  }
}
