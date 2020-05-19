import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { BaseService } from './../core/base.service';
import { Injectable } from '@angular/core';

const routes = {
  search: 'search/users',
  users: 'users'
};

export interface Users {
  avatar_url: string;
  html_url: string;
  login: string;
}

@Injectable({
  providedIn: 'root'
})
export class GithubService extends BaseService<any> {
  constructor(httpClient: HttpClient) {
    super(httpClient);
  }

  searchUsers(query: string, pageQty: number = 100): Observable<any> {
    return this.sendGet(`${routes.search}?q=${query}&per_page=${pageQty}`);
  }

  getUserProfileInfo(user: string): Observable<any> {
    return this.sendGet(`${routes.users}/${user}`);
  }

  getUserRepos(
    user: string,
    sort: string = 'created:asc',
    per_page: number = 6
  ): Observable<any> {
    return this.sendGet(
      `${routes.users}/${user}/repos?per_page=${per_page}&sort=${sort}`
    );
  }
}
