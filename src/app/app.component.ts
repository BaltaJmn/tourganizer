import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';

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
    private userService: UserService
  ) {
    translate.setDefaultLang('es');

    this.route.queryParamMap.subscribe(queryParams => {
      let conf = queryParams.get("conf");

      if (conf != null) {
        this.userService.confirmUser(conf);
      }
    });
  }
}
