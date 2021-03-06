import { Router } from '@angular/router';
import { untilDestroyed } from '@app/core';
import { Logger } from './../core/logger.service';
import { GithubService, Users } from './../services/github.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';

const log = new Logger('Search');

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  isLoading = false;
  searchForm: FormGroup;
  modalRef: NgbModalRef;
  totalCount: number;
  users: Users[];
  p: any;
  itemsQtyForPage = 12;
  pages = [100, 50, 30, 20, 10];
  errorAvailable = false;
  error: any;
  selectedUser: any;
  modalLoading = false;
  profileInfo: any;
  repoInfo: any;

  constructor(
    private githubService: GithubService,
    private fb: FormBuilder,
    private modalService: NgbModal,
    private router: Router
  ) {}

  ngOnInit() {
    this.createSearchForm();
  }

  ngOnDestroy() {}

  createSearchForm() {
    this.searchForm = this.fb.group({
      query: ['', Validators.required]
    });
  }

  search() {
    const { query } = this.searchForm.value;
    this.getUsers(query);
  }

  getUsers(query: string, page?: number) {
    this.isLoading = true;
    const users$ = this.githubService.searchUsers(query, page);
    users$
      .pipe(
        finalize(() => {
          this.isLoading = false;
        }),
        untilDestroyed(this)
      )
      .subscribe(
        (res: any) => {
          if (res) {
            if (this.error) {
              this.errorAvailable = false;
            }
            this.totalCount = res.total_count;
            this.users = res.items.map((user: Users) => {
              return {
                avatar_url: user.avatar_url,
                html_url: user.html_url,
                login: user.login
              };
            });
          }
        },
        (error: any) => {
          if (error) {
            this.error = error;
            if (this.users && this.users.length > 0) {
              this.users.length = 0;
            }
            this.errorAvailable = true;
          }
        }
      );
  }

  getMoreProfileInfo(username: string) {
    this.modalLoading = true;
    const userProfile$ = this.githubService.getUserProfileInfo(username);
    userProfile$
      .pipe(
        finalize(() => {
          this.modalLoading = false;
        }),
        untilDestroyed(this)
      )
      .subscribe(
        (res: any) => {
          if (res) {
            this.profileInfo = res;
          }
        },
        (error: any) => {
          log.debug('error: ', error);
        }
      );
  }

  getRepoInfo(username: string) {
    this.modalLoading = true;
    const repoInfo$ = this.githubService.getUserRepos(username);
    repoInfo$
      .pipe(
        finalize(() => {
          this.modalLoading = false;
        }),
        untilDestroyed(this)
      )
      .subscribe(
        (res: any) => {
          if (res) {
            this.repoInfo = res;
          }
        },
        (error: any) => {
          log.debug('error: ', error);
        }
      );
  }

  onViewModal(view: any, user: any) {
    this.selectedUser = user;
    this.getMoreProfileInfo(user.login);
    this.getRepoInfo(user.login);
    this.modalRef = this.modalService.open(view, {
      windowClass: 'medium confirm',
      backdrop: true
    });
  }

  dismissModal() {
    this.modalRef.dismiss();
    this.selectedUser = null;
  }

  dismissAllModals() {
    this.modalService.dismissAll();
    this.selectedUser = null;
  }

  refreshAfterFilter() {
    this.router.navigateByUrl('/about').then(() => {
      this.router.navigate(['/', 'home']);
    });
  }

  selectPageQuantity(event: any) {
    const pageQtyValue = event.target.value;
    if (pageQtyValue !== null || pageQtyValue !== undefined) {
      this.itemsQtyForPage = pageQtyValue;
    }
  }

  processPageChange(page: number) {
    const { query } = this.searchForm.value;
    this.getUsers(query, page);
  }
}
