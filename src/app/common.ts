import { IResponse } from 'response-type';
import { Observable } from 'rxjs';
import { HttpEvent, HttpHeaders, HttpRequest, HttpResponse } from '@angular/common/http';
import { matchPattern } from 'url-matcher';

export function GetNetworkError (): IResponse<any> {
  return {
    error: {
      code: 0,
      message: 'It seems you are not connected to internet. Please check your connection and try again'
    }
  };
}
import { IotSvgService } from '@app/services/iot-svg/iot-svg.service';
import { DataSource } from '@app/definitions';
import { environment } from 'environments/environment';

export function error (response: IResponse<any>, fieldName: string) {
  if ( ! response || ! response.error || !response.error.errors) {
    return '';
  }
  const $error = response.error.errors.find(x => x.location === fieldName);
  return $error ? $error.message : '';
}

export const IotImages = [
  {
    id: '1',
    src: IotSvgService.bathroom,
    name: 'Bathroom',
  },
  {
    id: '2',
    src: IotSvgService.kitchen,
    name: 'Kitchen'
  },
  {
    id: '3',
    src: IotSvgService.masterBedroom,
    name: 'Master bedroom'
  },
  {
    id: '4',
    src: IotSvgService.pathtub,
    name: 'Pathtub'
  }
];

export function IsSuccessEntity (response: IResponse<any>) {
  return response && response.data && response.data.items && response.data.items[0];
}

export function IsDataSource (data: DataSource) {

  if (! data.value) {
    return false;
  }
  if (!data.dataSourceId) {
    return false;
  }
  return true;
}

export function handleRoute (req: HttpRequest<any>, routes, prefixAPI: string): Observable<HttpEvent<any>> {
  const { url, match } = urlMatch( req.url, req.method, routes, prefixAPI);
  const action = routes[ url ];
  const result = this[ action ].call( this, req, match );

  const mockResponse = new HttpResponse( {
    body: result,
    headers: new HttpHeaders(),
    status: (result.data) ? 200 : result.error.code,
    statusText: 'OK',
    url: req.url
  } );
  return Observable.of( mockResponse );
}

export function urlMatch( url: string, method: string = null, routes, prefixAPI) {
  url = url.replace(prefixAPI, '');
  for ( const route of Object.keys( routes ) ) {
    const urlMethod = route.split( ' ' );
    let result = '';
    if ( urlMethod.length === 2 ) {
      if ( method === null ) {
        result = matchPattern( urlMethod[ 1 ], url );
      } else {
        if ( urlMethod[ 0 ].toUpperCase() === method.toUpperCase() ) {
          result = matchPattern( urlMethod[ 1 ], url );
        }
      }
    } else {
      result = matchPattern( route, url );
    }
    if ( result ) {
      return {
        url: route,
        match: result
      };
    }
  }
  return null;
}

export const API = {
  'get': (affix) => 'GET ' + environment.apiPrefix + '/' + affix,
  'post': (affix) => 'POST ' + environment.apiPrefix + '/' + affix,
  'delete': (affix) => 'delete ' + environment.apiPrefix + '/' + affix
};

export function GetUrl (affix: string) {
  return environment.api + environment.apiPrefix + '/' + affix;
}
