import { untilDestroyed } from '@app/core';
import { Logger } from './../core/logger.service';
import { GithubService } from './../services/github.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

const log = new Logger('Search');

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  isLoading = false;
  searchForm: FormGroup;

  constructor(private githubService: GithubService, private fb: FormBuilder) {}

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
    log.debug('value: ', query);
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
            log.debug('res: ', res);
          }
        },
        (error: any) => {
          log.debug('error', error);
        }
      );
  }
}
