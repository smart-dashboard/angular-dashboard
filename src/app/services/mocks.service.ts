import { Injectable } from '@angular/core';
import { HttpEvent, HttpHeaders, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IResponse, IResponseErrorItem } from 'response-type';
import { matchPattern } from 'url-matcher';
import { environment } from '../../environments/environment';
import { PermissionsService } from '@services/permissions.service';
import { IUserForm, IUser, IContact, IResetForm } from '@app/definitions';
import { IotSvgService } from '@services/iot-svg/iot-svg.service';
import { random, times } from '@lodash';
import { TranslateService } from '@ngx-translate/core';
import { API } from '@app/common';
import { of } from 'rxjs';

@Injectable()
export class MockService {
  public routes = {
    [API.post('user/signin')]: 'signIn',
    [API.post('user/signup')]: 'signUp',
    [API.post('forget-password')]: 'forgetPassword',
    [API.get('contact-details')]: 'GetContactDetails',
    [API.post('user/settings')]: 'updateUserProfile',
    [API.post('contact-details')]: 'UpdateContactDetails',
    [API.post('user/reset-password')]: 'ResetPassword',
  };

  constructor (
    private permissions: PermissionsService,
    private iotsvg: IotSvgService,
    private translate: TranslateService,
  ) {}

  urlMatch( url: string, method: string = null ) {
    url = url.replace(environment.api, '');
    for ( const route of Object.keys( this.routes ) ) {
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
        return route;
      }
    }
    return '';
  }

  handleRoute( req: HttpRequest<any> ): Observable<HttpEvent<any>> {
    const url = this.urlMatch( req.url, req.method );
    const action = this.routes[ url ];
    const result = this[ action ].call( this, req );

    if (result && result.error) {
      result.error.message = this.translate.get(result.error.message)['value'];
    }
    if (result && result.error && result.error.errors) {
      result.error.errors = result.error.errors.map((x: IResponseErrorItem) => {
        x.message = this.translate.get(x.message)['value'];
        return x;
      });
    }
    const mockResponse = new HttpResponse( {
      body: result,
      headers: new HttpHeaders(),
      status: (result.data) ? 200 : result.error.code,
      statusText: 'OK',
      url: req.url
    } );
    return of( mockResponse );
  }

  public ResetPassword(req: HttpRequest<IResetForm>): IResponse<any> {
    const message = 'Please reset your password to 123321, and both fields must be identical.' +
    ' You see this message because your are running an experimental version of app';
    if (req.body.password1 !== '123321' || req.body.password2 !== req.body.password1) {
      return {
        error: {
          code: 17,
          message,
          errors: [
            {
              location: 'password1',
              message: 'Please type 123321'
            },
            {
              location: 'password2',
              message: 'Please repeat 123321'
            }
          ]
        }
      };
    }
    return {
      data: {
        items: times(24 , () => random (10, 30)),
      }
    };
  }

  public mockUser () {
    return {
      email: 'alitorabi@seekasia.com',
      username: 'alitorabi',
      avatar: 'user.png',
      firstname: 'John',
      lastname: 'Doe ',
      role: {
        permissions: [
          this.permissions.findByKey('DEVICES::VIEW'),
          this.permissions.findByKey('WIDGETS::VIEW'),
          this.permissions.findByKey('LOCATIONS::VIEW'),
          this.permissions.findByKey('ACTIVITIES::VIEW'),
          this.permissions.findByKey('ROLES::VIEW'),
          this.permissions.findByKey('USERS::VIEW')
        ]
      },
    };
  }
  signIn( req: HttpRequest<any> ): IResponse<any> {
    if ( req.body.email === 'test@test.com' && req.body.password === '123321' ) {
      return {
        'data': {
          'items': [
            {
              token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXlsb2FkIjp7ImlkIjoyfSwiaWF0IjoxNTEwOTE4NTY5L' +
              'CJleHAiOjE1MTA5MjIxNjl9.qOPJVGiIFBye1dUY0BfX6bqcc0rig8PhZTLMYNg1FLU',
              user: this.mockUser()
            }
          ]
        }
      };
    } else {

      const errors: Array<IResponseErrorItem> = [];
      if (!req.body.email) {
        errors.push({
          location: 'email',
          message: 'Please provide "test@test.com" as email'
        });
      }
      if (!req.body.password) {
        errors.push({
          location: 'password',
          message: 'Please provide "123321" as password'
        });
      }
      return {
        apiVersion: 'beta',
        error: {
          code: 401,
          message: 'There is an issue on sign-in. Please set the email and password as provided.',
          errors: errors
        }
      };
    }
  }
  public signUp (req: HttpRequest<any>): IResponse<any> {
    const form = req.body;
    function hasUnvalidFields(user: IUserForm): Array<any> {
      const errors = [];
      if ( ! user.email ) {
        errors.push({
          location: 'email',
          message: 'Please provide the email'
        });
      }
      if ( ! user.password ) {
        errors.push({
          location: 'password',
          message: 'Please provide a strong password'
        });
      }
      return errors;
    }
    if (hasUnvalidFields(form).length) {
      return {
        error: {
          code: 1,
          message: 'Signup cannot be completed due to some errors. Please fix marked fields and try again',
          errors: hasUnvalidFields(form)
        }
      };
    }
    return {
      data: {
        items: [
          {
            user: this.mockUser(),
            token: 'fake-token3892379828932982789237982'
          }
        ]
      }
    };
  }

  public UpdateContactDetails(req: HttpRequest<any>): IResponse<any> {

    return {
      data: {
        items: [
          {

          }
        ]
      }
    };
  }
  /**
   * For email, phone, sms and etc that user determines when he wants
   * to be notified when an action has occured.
   */
  public GetContactDetails (req: HttpRequest<any>): IResponse<IContact> {
    return {
      data: {
        items: [
          {
            type: 'call',
            value: '+14149990000'
          },
          {
            type: 'sms',
            value: '+492839179387'
          }
        ]
      }
    };
  }
  public updateUserProfile(req: HttpRequest<any>): IResponse<IUser> {
    const user: IUser = req.body;
    return {
      data: {
        items: [
          user
        ]
      }
    };
  }

  public forgetPassword(req: HttpRequest<any>): IResponse<any> {
    const username: string = req.body.username;
    if ( ! username) {
      return {
        error: {
          code: 29,
          message: 'We cannot process your reset password request',
          errors: [
            {
              location: 'username',
              message: 'Please provide us a username first.'
            }
          ]
        },
      };
    }
    return {
      data: {
        items: []
      }
    };
  }
}
