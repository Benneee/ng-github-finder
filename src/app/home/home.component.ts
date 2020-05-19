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
  totalLengthOfItems: number;
  itemsQtyForPage = 12;
  pages = [100, 50, 30, 20, 10];
  errorAvailable = false;

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
    this.searchForm.reset();
    this.getUsers(query);
  }

  getUsers(query: string) {
    this.isLoading = true;
    const users$ = this.githubService.searchUsers(query);
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
            if (this.users && this.users.length > 0) {
              this.users.length = 0;
            }
            this.errorAvailable = true;
          }
        }
      );
  }

  showMoreInfo() {
    log.debug('info');
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
}
