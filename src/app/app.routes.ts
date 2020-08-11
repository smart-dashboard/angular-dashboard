import { RouterModule, Routes } from '@angular/router';
import { SettingsComponent } from '@components/settings/settings.component';
import { GalleryComponent } from '@components/gallery/gallery.component';
import { Route } from '@angular/router';
import { LayoutComponent } from './ng5-basic/layout/layout.component';
import { AuthGuard } from '@services/user.service';
import { PrivacyPolicyComponent } from '@app/components/privacy-policy/privacy-policy.component';
import { ProfileComponent } from '@app/components/profile/profile.component';
import { ContactDetailsComponent } from '@app/components/contact-details/contact-details.component';
import { userAuthLayoutRoutes } from '@app/users/user-routes';
import { AngularCalendarComponent } from '@app/boilerplate/angular-calendar/angular-calendar.component';
import { IotAuthLayoutRoutes } from '@app/iot/iot-routes';
// import { LayoutComponent } from '@ng-dashboard/core';

export function AuthLayoutChild(component: any, route: string, options: any = {}): Route {
  return {
    path: route,
    component: component,
    ... options,
    canActivate: [AuthGuard],
  };
}

export const appRoutes: Routes = [
  {   path: '', redirectTo: '/index', pathMatch: 'full' },
  {
    path: 'privacy-policy',
    component: PrivacyPolicyComponent,
  },
  {
    path: '',
    canActivate: [AuthGuard],
    component: LayoutComponent,
    children: [
      ...IotAuthLayoutRoutes,
      AuthLayoutChild (SettingsComponent, 'token'),
      AuthLayoutChild (ProfileComponent, 'profile'),
      AuthLayoutChild (ContactDetailsComponent, 'monitoring/manage-contacts'),
      AuthLayoutChild (GalleryComponent, 'gallery'),
      AuthLayoutChild (AngularCalendarComponent, 'angular-calendar'),
      ...userAuthLayoutRoutes,
    ]
  },
  {   path: '**', redirectTo: '/index' }
];

export function createRoutes () {
  return RouterModule.forRoot(appRoutes, { useHash: true});
}
