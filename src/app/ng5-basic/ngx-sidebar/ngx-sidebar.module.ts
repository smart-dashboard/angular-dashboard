import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgxSidebarComponent } from './ngx-sidebar.component';

import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    NgxSidebarComponent
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    RouterModule.forRoot([]),
    TranslateModule.forRoot()
  ],
  exports: [
    NgxSidebarComponent
  ]
})
export class NgxSidebarModule { }


export interface NgxMenuItem {
  link?: string;
  icon?: string;
  title: string;
  active?: boolean;
  class?: string;
  permissions?: Array<string>;
  auth?: boolean;
  focused?: boolean;
  children?: Array<NgxMenuItem>;
}
