import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireModule } from 'angularfire2';
import { AngularFireStorageModule } from "@angular/fire/storage";
import { AngularFireDatabaseModule } from "@angular/fire/database";
import { AngularFireAuthModule } from 'angularfire2/auth';

import { environment } from '../environments/environment';

// Components
import { HeaderComponent } from './components/structure/header/header.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent, ResetPasswordForm } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { SidebarComponent } from './components/structure/sidebar/sidebar.component';
import { NotificationsComponent } from './components/structure/header/notifications/notifications.component';
import { ConfirmedComponent } from './guards/confirmed/confirmed.component';

// Users Components
import { IndexUserComponent } from './components/users/index/index.component';
import { ShowUserComponent } from './components/users/show/show.component';
import { EditUserComponent } from './components/users/edit/edit.component';
import { AddUserComponent } from './components/users/add/add.component';

// Routes Components
import { IndexRouteComponent } from './components/routes/index/index.component';
import { ShowRouteComponent } from './components/routes/show/show.component';
import { AddRouteComponent } from './components/routes/add/add.component';
import { EditRouteComponent } from './components/routes/edit/edit.component';
import { MarkerinfoComponent } from './components/routes/show/markerinfo/markerinfo.component';
import { RoutesUnconfirmedComponent } from './components/routes/index/unconfirmed/unconfirmed.component';

//Localizations Components
import { IndexLocalizationComponent } from './components/localizations/index/index.component';
import { ShowLocalizationComponent } from './components/localizations/show/show.component';
import { EditLocalizationComponent } from './components/localizations/edit/edit.component';
import { AddLocalizationComponent } from './components/localizations/add/add.component';
import { LocalizationsUnconfirmedComponent } from './components/localizations/index/unconfirmed/unconfirmed.component';

// Login & Register
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Maps
import { LeafletModule } from '@asymmetrik/ngx-leaflet';

// Rating
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

// MultiSelect with search
import { NgSelectModule } from '@ng-select/ng-select';

//Imageviewer
import { ImageViewerModule } from '@hallysonh/ngx-imageviewer';
import { NgImageSliderModule } from 'ng-image-slider';

// Angular Material
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatCheckboxModule } from '@angular/material';
import { MatButtonModule } from '@angular/material';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTabsModule } from '@angular/material/tabs';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatBadgeModule } from '@angular/material'
import { FilterPipe } from './pipes/filter.pipe';

// import ngx-translate and the http loader
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient, HttpClientModule } from '@angular/common/http';

// Cookie Service
import { CookieService } from 'ngx-cookie-service';

// Jquery
import * as $ from 'jquery';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomeComponent,

    IndexRouteComponent,
    ShowRouteComponent,
    AddRouteComponent,
    EditRouteComponent,
    MarkerinfoComponent,

    IndexLocalizationComponent,
    ShowLocalizationComponent,
    EditLocalizationComponent,
    AddLocalizationComponent,

    IndexUserComponent,
    ShowUserComponent,
    EditUserComponent,
    AddUserComponent,

    LoginComponent,
    RegisterComponent,
    SidebarComponent,
    FilterPipe,
    ResetPasswordForm,
    NotificationsComponent,
    RoutesUnconfirmedComponent,
    LocalizationsUnconfirmedComponent,
    ConfirmedComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireStorageModule,
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    LeafletModule.forRoot(),
    NgbModule,
    NgSelectModule,

    //Images
    NgImageSliderModule,
    ImageViewerModule,

    //Material
    MatCheckboxModule,
    MatButtonModule,
    MatInputModule,
    MatAutocompleteModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatRadioModule,
    MatSelectModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatMenuModule,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatGridListModule,
    MatCardModule,
    MatStepperModule,
    MatTabsModule,
    MatExpansionModule,
    MatButtonToggleModule,
    MatChipsModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatDialogModule,
    MatTooltipModule,
    MatSnackBarModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatBadgeModule,

    // ngx-translate and the loader module
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  providers: [CookieService,
    { provide: MAT_DIALOG_DATA, useValue: {} },
    { provide: MatDialogRef, useValue: {} }],
  bootstrap: [AppComponent],
  entryComponents: [
    LocalizationsUnconfirmedComponent,
    RoutesUnconfirmedComponent,
    MarkerinfoComponent,
    NotificationsComponent,
    ResetPasswordForm
  ],
})
export class AppModule { }

// required for AOT compilation
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}