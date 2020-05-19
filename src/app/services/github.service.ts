import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { BaseService } from './../core/base.service';
import { Injectable } from '@angular/core';

const routes = {
  search: 'search/users',
  users: 'users'
};

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
}
