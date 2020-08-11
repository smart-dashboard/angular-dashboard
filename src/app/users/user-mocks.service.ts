import { Injectable } from '@angular/core';
import { HttpRequest } from '@angular/common/http';
import { IResponse } from 'response-type';
import { IUser, IRole } from '@app/definitions';
import { random } from '@lodash';
import { TranslateService } from '@ngx-translate/core';
import { handleRoute, urlMatch, API } from '@app/common';

let $Users: Array<IUser> = [
  {
    id: 1,
    firstname: 'Ali',
    lastname: 'Torabi',
    email: 'connexion.founder@outlook.com',
    phone: '+48783538796',
    username: 'ali.torabi',
    preferences: {},
    role: null,
    avatar: ''
  },
];

@Injectable()
export class UserMockService {

  public handleRoute = handleRoute.bind(this);
  public urlMatch = urlMatch.bind(this);
  public routes = {
    [API.post('user/signin')]: 'signIn',
    [API.post('user/signup')]: 'signUp',
    [API.delete('role/:id')]: 'deleteRole',
    [API.get('roles')]: 'getRoles',
    [API.get('users')]: 'getUsers',
    [API.post('role')]: 'postRole',
    [API.post('user')]: 'postUser',
    [API.get('user/:id')]: 'getUser',
    [API.delete('user/:id')]: 'deleteUser',
  };

  constructor (
    private translate: TranslateService,
  ) {}

  public deleteRole (req: HttpRequest<any>): IResponse<any> {
    return {
      data: {
        items: [
          {
          }
        ]
      }
    };
  }

  public postRole (req: HttpRequest<any>): IResponse<IRole> {
    const form: IRole = req.body;
    if (!form.id) {
      form.id = random(1, 99999);
    }
    return {
      data: {
        items: [
          form
        ]
      }
    };
  }
  public postUser (req: HttpRequest<any>): IResponse<IUser> {
    const form: IUser = req.body;
    if (!form.id) {
      form.id = random(1, 99999);
      $Users.push(form);
    } else {
      $Users.push(form);
    }

    return {
      data: {
        items: [
          form
        ]
      }
    };
  }
  public getRoles (): IResponse<IRole> {
    return {
      data: {
        items: [
          {
            id: 1,
            title: 'Developer',
            permissions: []
          },
          {
            id: 2,
            title: 'Master',
            permissions: []
          },
          {
            id: 3,
            title: 'Guest',
            permissions: []
          }
        ]
      }
    };
  }
  public getUsers (): IResponse<IUser> {
    return {
      data: {
        items: $Users
      }
    };
  }
  public getUser (req: HttpRequest<any>, params): IResponse<IUser> {
    const id = +params.paramValues[0];
    return {
      data: {
        items: [$Users.find( user => user.id === id)]
      }
    };
  }

  public deleteUser (req: HttpRequest<any>, params): IResponse<any> {
    const id = +params.paramValues[0];

    $Users = $Users.filter(user => user.id !== id);
    return {
      data: {
        items: [
          {
            id,
          }
        ]
      }
    };
  }
}

