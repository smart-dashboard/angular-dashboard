import { NgModule, } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersArchiveComponent } from './users-archive/users-archive.component';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { NgxTooltipModule } from '../components/ngx-tooltip/ngx-tooltip.module';
import { UsersSingleComponent } from './users-single/users-single.component';
import { NgbModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { UserCommonService } from '@app/users/user-common.service';
import { UserMockService } from '@app/users/user-mocks.service';
import { UserRequestsService } from '@app/users/user-requests.service';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { UserMockInterceptor } from '@app/users/user-mock.interceptor';
import { environment } from 'environments/environment';
import { RoleArchiveComponent } from '@app/users/role-archive/role-archive.component';
import { RoleSingleComponent } from '@app/users/role-single/role-single.component';
import { userModuleReducersGenerator } from '@app/users/user-module.reducers';
import { Ng5BasicModule } from '@app/ng5-basic/ng5-basic.module';

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
    Ng5BasicModule,
  ],
  providers: [
    UserCommonService,
    UserMockService,
    UserRequestsService,
    !environment.targetAPI ? { provide: HTTP_INTERCEPTORS, useClass: UserMockInterceptor, multi: true } : [],
  ],
  declarations: [UsersArchiveComponent, UsersSingleComponent, RoleArchiveComponent, RoleSingleComponent]
})
export class UsersModule { }
