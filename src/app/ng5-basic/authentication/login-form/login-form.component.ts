import { Component, OnInit } from '@angular/core';
import { IUserForm } from '../shared';
import { GetNetworkError, error, GetUrl } from '@app/common';
import { Router } from '@angular/router';
import { IResponse } from 'response-type';
import { HttpClient } from '@angular/common/http';
import { UserService } from '@app/services/user.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent implements OnInit {
  public isRequesting = false;
  public url = GetUrl('user/signin');
  public response: IResponse<any> = null;
  public error = error;
  public form: IUserForm = {
    email: '',
    password: ''
  };
  public message = '';
  public passwordVisibilty = false;

  constructor(
    private router: Router,
    private http: HttpClient,
    private user: UserService,
  ) { }

  ngOnInit() {
    this.user.Revoke();
    if (environment.github && this.user.IsFirst) {
      this.user.IsFirst = false;
      this.signinHttp({
        email: 'test@test.com',
        password: '123321'
      });
    }
  }

  public async login (e) {
    e.preventDefault();
    this.isRequesting = true;
    this.signinHttp(this.form);
  }

  public togglePassword() {
    this.passwordVisibilty = this.passwordVisibilty ? false : true;
  }

  public onSigninSuccess (response = null) {
    this.user.SetUser(response.data.items[0].user);
    this.user.SetToken(response.data.items[0].token);
    this.router.navigateByUrl('/index');
  }
  private signinHttp (data: IUserForm) {
    console.log(data);
    window.scroll(0, 0);
    this.http.post(this.url, data).subscribe(
      (response) => {
        console.log('#1');
        this.response = response;
        if (this.response.data && this.response.data.items[0]) {
          this.onSigninSuccess(response);
        }
        this.isRequesting = false;
      },
      (response) => {
        console.log('#2', response);
        this.isRequesting = false;
        if (response.name === 'HttpErrorResponse') {
          this.response = GetNetworkError();
          return false;
        }
        this.response = response;
      }
    );
  }
}
