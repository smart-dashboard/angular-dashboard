import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpHeaders
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserService } from '@app/services/user.service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ActionsService } from '@app/ng5-basic/actions.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(
    private user: UserService,
    private router: Router,
    private translate: TranslateService,
    private actions: ActionsService,
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // this.actions.scrollTop();
    const headers = Object.assign({
      'x-token': this.user.GetToken(),
      'x-lang': this.translate.currentLang
    } , HeadersToObject(request.headers));
    request = request.clone({ setHeaders: headers });
    return next.handle(request);
  }
}

function HeadersToObject(headers: HttpHeaders): any {
  const heads = {};
  headers.keys().forEach((key) => {
    heads[key] = headers.get(key);
  });
  return heads;
}
