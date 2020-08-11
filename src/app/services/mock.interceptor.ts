import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { MockService } from '@app/services/mocks.service';

@Injectable()
export class MockInterceptor implements HttpInterceptor {
  constructor(
    private mock: MockService
  ) {
  }

  intercept( req: HttpRequest<any>, next: HttpHandler ): Observable<HttpEvent<any>> {
    if ( environment.production === false && this.mock.urlMatch( req.url, req.method ) ) {
      return this.mock.handleRoute( req );
    } else {
      return next.handle( req );
    }
  }
}
