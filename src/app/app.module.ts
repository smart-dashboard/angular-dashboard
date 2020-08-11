import { Component, Inject, OnInit } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { appReducersGenerator } from './app.reducers';
import { createRoutes  } from './app.routes';
import { NgMediaModule } from './ng-media/ng-media-module';
import { NotificationService } from '@services/notification.service';
import { SettingsComponent } from '@components/settings/settings.component';
import { PageHeaderComponent } from '@components/page-header/page-header.component';
import { TextInputComponent } from '@components/forms/text-input/text-input.component';
import { RadioInputComponent } from '@components/forms/radio-input/radio-input.component';
import { SelectInputComponent } from '@components/forms/select-input/select-input.component';
import { PermissionsService } from '@services/permissions.service';
import { RequestsService } from '@services/requests.service';
import { CheckboxInputComponent } from '@components/forms/checkbox-input/checkbox-input.component';
import { UserService, AuthGuard } from '@services/user.service';
import { OutputPinViewComponent } from '@components/output-pin-view/output-pin-view.component';
import { UserWidgetComponent } from '@components/user-widget/user-widget.component';
import { GalleryComponent } from '@components/gallery/gallery.component';
import { LoadingComponent } from '@components/loading/loading.component';
import { NavigationComponent } from '@components/navigation/navigation.component';
import { SidebarWidgetComponent } from '@components/sidebar-widget/sidebar-widget.component';
import { IotSvgService } from '@services/iot-svg/iot-svg.service';
import { environment } from '../environments/environment';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { MockInterceptor } from '@services/mock.interceptor';
import { MockService } from '@services/mocks.service';
import { TokenInterceptor } from '@services/token.interceptor';
import { QuickChartComponent } from '@app/components/quick-chart/quick-chart.component';
import { ToasterModule } from 'angular2-toaster';
import { NgxTooltipModule } from '@app/components/ngx-tooltip/ngx-tooltip.module';
import { PrivacyPolicyComponent } from '@app/components/privacy-policy/privacy-policy.component';
import { ProfileComponent } from '@app/components/profile/profile.component';
import { ContactDetailsComponent } from '@app/components/contact-details/contact-details.component';
import { TranslateModule } from '@ngx-translate/core';
import { TranslateService } from '@ngx-translate/core';
import { Ng5BasicModule } from './ng5-basic/ng5-basic.module';
import pl from './translations/pl';
import fa from './translations/fa';
import { DOCUMENT } from '@angular/common';
import { UsersModule } from '@app/users/users.module';
import { CalendarModule } from 'angular-calendar';
import { AngularCalendarComponent } from '@app/boilerplate/angular-calendar/angular-calendar.component';
import { IotModule } from '@app/iot/iot.module';
import { GlobalizationService } from '@app/ng5-basic/globalization.service';
import { NgxSidebarModule } from '@app/ng5-basic/ngx-sidebar/ngx-sidebar.module';
import { NgBillingModule } from '@ng-dashboard/billing';
import { NgDashboardModule } from '@ng-dashboard/core';
declare var require: any;
const Highcharts = require('highcharts/highstock');
window['Highcharts'] = Highcharts;
import { navigation } from '@app/app.navigation';

@Component({
  selector: 'app-root',
  template: '<router-outlet></router-outlet>'
})
export class AppComponent implements OnInit {
  constructor (
    private translate: TranslateService,
    private globalization: GlobalizationService,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.RestoreLanguage();
  }

  ngOnInit() {
    this.globalization.layoutDirectionEmitter.subscribe(direction => {
      this.document.body.setAttribute('dir', direction);
    });
  }

  private RestoreLanguage () {
    let lang = 'en';
    const _lang = localStorage.getItem('preferedLanguage');
     if (_lang === 'en' || _lang === 'pl' || _lang === 'fa') {
      lang = _lang;
    }
    this.translate.setTranslation('pl', pl);
    this.translate.setTranslation('fa', fa);
    this.translate.use(lang);
    this.translate.setDefaultLang(lang);
    this.globalization.setLayoutDirection(true);
    this.document.body.setAttribute('dir', this.globalization.getLayoutDirection());
  }
}

@NgModule({
  declarations: [
    AppComponent,
    SettingsComponent,
    PageHeaderComponent,
    TextInputComponent,
    RadioInputComponent,
    SelectInputComponent,
    SidebarWidgetComponent,
    CheckboxInputComponent,
    QuickChartComponent,
    UserWidgetComponent,
    GalleryComponent,
    LoadingComponent,
    PrivacyPolicyComponent,
    ProfileComponent,
    ContactDetailsComponent,
    AngularCalendarComponent,
    OutputPinViewComponent,
    NavigationComponent,
  ],
  imports: [
    HttpClientModule,
    NgxTooltipModule,
    BrowserAnimationsModule,
    Ng5BasicModule,
    BrowserModule,
    FormsModule,
    IotModule,
    UsersModule,
    NgxSidebarModule,
    NgDashboardModule.forRoot({
      navigation: navigation
    }),
    NgBillingModule.forRoot({}),
    TranslateModule.forRoot(),
    CalendarModule.forRoot(),
    NgMediaModule,
    ToasterModule.forRoot(),
    createRoutes (),
    appReducersGenerator()
  ],
  providers: [
    PermissionsService,
    RequestsService,
    MockService,
    NotificationService,
    UserService,
    AuthGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    },
    !environment.production ? { provide: HTTP_INTERCEPTORS, useClass: MockInterceptor, multi: true } : [],
    IotSvgService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {

}
