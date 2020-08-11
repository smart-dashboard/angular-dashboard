import { Component, OnInit, OnDestroy } from '@angular/core';
import { IUser } from '@app/definitions';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import en from '../translations/users.module.en';
import { UserRequestsService } from '@app/users/user-requests.service';
import { UserModuleState } from '@app/users/user.module.defs';

@Component({
  selector: 'app-users-archive',
  templateUrl: './users-archive.component.html',
  styleUrls: ['./users-archive.component.scss']
})
export class UsersArchiveComponent implements OnInit, OnDestroy {

  public subtitle = en.user_archive_subtitle;
  public maintitle = en.user_archive_maintitle;
  public users: Array<IUser> = [];
  private ref: Subscription = null;
  public closeResult: string;

  constructor(
    private store: Store<UserModuleState>,
    private requests: UserRequestsService,
    private modalService: NgbModal,
  ) { }

  ngOnInit() {
    this.ref = this.store.select('userModule').subscribe(({users}) => {
      this.users = users;
    });
    this.requests.GetUsers();
  }
  ngOnDestroy() {
    this.ref.unsubscribe();
  }
  public DeleteUser(id: number, dialogTemplate) {
    this.open(dialogTemplate, id);
  }
  open(content, id) {
    this.modalService.open(content).result.then((result) => {
      this.requests.DeleteUser(id);
    });
  }
}
