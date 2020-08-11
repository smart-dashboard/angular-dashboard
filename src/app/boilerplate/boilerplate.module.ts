import { NgModule, } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { NgxTooltipModule } from '../components/ngx-tooltip/ngx-tooltip.module';
import { NgbModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { UserCommonService } from '@app/users/user-common.service';
import { UserMockService } from '@app/users/user-mocks.service';
import { UserRequestsService } from '@app/users/user-requests.service';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { UserMockInterceptor } from '@app/users/user-mock.interceptor';
import { environment } from 'environments/environment';
import { userModuleReducersGenerator } from '@app/users/user-module.reducers';

@NgModule({
  imports: [
    HttpClientModule,
    CommonModule,
    RouterModule.forChild([]),
    TranslateModule.forRoot(),
    NgxTooltipModule,
    ReactiveFormsModule,
    FormsModule,
    NgbModule,
    NgbModalModule,
    userModuleReducersGenerator(),
  ],
  providers: [
    UserCommonService,
    UserMockService,
    UserRequestsService,
    !environment.targetAPI ? { provide: HTTP_INTERCEPTORS, useClass: UserMockInterceptor, multi: true } : [],
  ],
  declarations: [

  ]
})
export class BoilerplateModule { }

export const DefaultBoilerPlateModuleNavigation = [
  {
    link: '/index',
    icon: 'icon-home',
    title: 'Home',
    class: 'home'
  },
  {
    icon: 'icon-cogs',
    title: 'Components',
    children: [
      {
        link: '/angular-calendar',
        title: 'Angular Calendar',
        icon: 'icon-calendar'
      },
    ]
  },
  {
    link: '/login',
    icon: 'icon-power_settings_new',
    title: 'Logout',
    class: 'logout'
  },
];
