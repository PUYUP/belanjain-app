import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../environments/environment';

const endpoint = environment.host + 'api/shoptask/';
const urlNecessary = endpoint + 'necessaries/';

// CONTEXT
interface NecessaryContext {
  label?: string;
  description?: string;
  purchase?: number;
}

interface NecessaryUpdateContext {
  uuid?: string;
  label?: string;
  description?: string;
}

interface ListNecessaryContext {
  purchase_uuid?: string;
  next_url?: string;
}


@Injectable({
  providedIn: 'root'
})
export class NecessaryService {

  constructor(
    private httpClient: HttpClient) {
  }

  /***
   * Create Necessary
   */
  createNecessary(context: NecessaryContext): Observable<any> {
    return this.httpClient
      .post(urlNecessary, {
        ...context
      }, { withCredentials: true })
      .pipe(
        map(response => {
          return response;
        })
      );
  }

  /***
   * Update Necessary
   */
  updateNecessary(context: NecessaryUpdateContext): Observable<any> {
    return this.httpClient
      .patch(urlNecessary + context.uuid + '/', {
        ...context
      }, { withCredentials: true })
      .pipe(
        map(response => {
          return response;
        })
      );
  }

  /***
   * Delete Necessary
   */
  deleteNecessary(uuid: string): Observable<any> {
    return this.httpClient
      .delete(urlNecessary + uuid + '/', { withCredentials: true })
      .pipe(
        map(response => {
          return response;
        })
      );
  }

  /***
   * Necessary list
   */
  getNecessaries(context: ListNecessaryContext): Observable<any> {
    let url = urlNecessary;
    if (context.next_url) url = context.next_url;
  
    return this.httpClient
      .get(url, { withCredentials: true, params: { purchase_uuid: context.purchase_uuid } })
      .pipe(
        map(response => {
          const result = response;
          return result;
        })
      );
  }

  /***
   * Single Necessary
   */
  getNecessary(uuid: string = null): Observable<any> {
    return this.httpClient
      .get(urlNecessary + uuid + '/', { withCredentials: true })
      .pipe(
        map(response => {
          const result = response;
          return result;
        })
      );
  }

}
