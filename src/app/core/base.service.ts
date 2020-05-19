import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BaseService<M> {
  public headers = {};
  constructor(public httpClient: HttpClient) {}

  sendGet(url: any): Observable<M> {
    this.headers = {
      headers: new HttpHeaders({
        Authorization:
          'Basic OGNkYjZhYmJiN2IyYTQwY2I4NzI6NzY4NzQ5YjFjNjBlZDc4MDM3Y2JlNzYyNWJlMjZkMDNmMTQ5ZmFiOQ=='
      })
    };
    return this.httpClient.get(url, this.headers).pipe(
      map((body: any) => body),
      catchError(this.handleError)
    );
  }

  baseUrl(url: string) {
    return environment.serverUrl + url;
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      // console.error('An error occurred:', error.error.message);
    } else {
      if (
        error.status === 401 ||
        error.status === 504 ||
        error.status === 400
      ) {
        // console.error('An error occurred:', error.error);
        return throwError(
          JSON.stringify({
            name: error.error,
            status: error.status,
            message: error.message
          })
        );
      }
    }
    return throwError(
      JSON.stringify({
        name: error.name,
        status: error.status,
        message: error.message
      })
    );
  }
}
