import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { IotMockService } from './iot-mocks.service';

@Injectable()
export class IotMockInterceptor implements HttpInterceptor {
  constructor(
    private mock: IotMockService
  ) {
  }

  intercept( req: HttpRequest<any>, next: HttpHandler ): Observable<HttpEvent<any>> {
    if ( environment.targetAPI === false && this.mock.urlMatch( req.url, req.method, this.mock.routes, environment.api ) ) {
      return this.mock.handleRoute( req, this.mock.routes, environment.api);
    } else {
      return next.handle( req );
    }
  }
}
