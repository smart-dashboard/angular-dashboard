import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgMediaModule } from '../ng-media';
import { NotificationService } from '@services/notification.service';
import { PermissionsService } from '@services/permissions.service';
import { RequestsService } from '@services/requests.service';
import { ActionsService } from './actions.service';
import { UserService, AuthGuard } from '@services/user.service';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { MockService } from '@services/mocks.service';
import { TokenInterceptor } from '@services/token.interceptor';
// import { RealtimeDocumentModule } from 'realtime-document';
import { ToasterModule } from 'angular2-toaster';
import { NgxUserModule } from './authentication/authentication.module';
import { LayoutComponent } from './layout/layout.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { SideBarComponent } from './side-bar/side-bar.component';
import { NgxSidebarModule } from './ngx-sidebar/ngx-sidebar.module';
import { SidebarControllerService } from './ngx-sidebar/sidebar-controller.service';
import { ProfileMenuComponent } from './profile-menu/profile-menu.component';
import { NotificationListComponent } from '@app/components/notification-list/notification-list.component';
import { NgxTooltipModule } from '@app/components/ngx-tooltip/ngx-tooltip.module';
import { FooterComponent } from './footer/footer.component';
import { TranslateModule } from '@ngx-translate/core';
import { UiIconBoxComponent } from '@app/ng5-basic/ui-icon-box/ui-icon-box.component';
import { UiPanelBoxComponent } from '@app/ng5-basic/ui-panel-box/ui-panel-box.component';
import { UiSmallBoxComponent } from '@app/ng5-basic/ui-small-box/ui-small-box.component';
import { ProgressLineComponent } from '@app/ng5-basic/progress-line/progress-line.component';
import { PageContainerComponent } from '@app/ng5-basic/page-container/page-container.component';
import { ErrorMessageComponent } from '@app/ng5-basic/error-message/error-message.component';
import { GlobalizationService } from '@app/ng5-basic/globalization.service';

@NgModule({
  declarations: [
    LayoutComponent,
    SideBarComponent,
    NavBarComponent,
    ProfileMenuComponent,
    NotificationListComponent,
    FooterComponent,
    UiIconBoxComponent,
    ProgressLineComponent,
    UiPanelBoxComponent,
    UiSmallBoxComponent,
    PageContainerComponent,
    ErrorMessageComponent,
  ],
  exports: [
    LayoutComponent,
    SideBarComponent,
    NavBarComponent,
    ProfileMenuComponent,
    NotificationListComponent,
    FooterComponent,
    UiIconBoxComponent,
    ProgressLineComponent,
    UiPanelBoxComponent,
    UiSmallBoxComponent,
    PageContainerComponent,
    ErrorMessageComponent,
  ],
  imports: [
    HttpClientModule,
    BrowserAnimationsModule,
    BrowserModule,
    FormsModule,
    NgxTooltipModule,
    NgxUserModule,
    TranslateModule.forRoot(),
    NgxSidebarModule,
    NgMediaModule,
    RouterModule.forRoot([]),
    ToasterModule.forRoot(),
  ],
  providers: [
    SidebarControllerService,
    PermissionsService,
    RequestsService,
    MockService,
    ActionsService,
    NotificationService,
    UserService,
    GlobalizationService,
    AuthGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    },
  ],
})
export class Ng5BasicModule {

}
