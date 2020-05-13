import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../environments/environment';

const endpoint = environment.host + 'api/shoptask/';
const urlGoods = endpoint + 'goods/';

interface ListGoodsContext {
  necessary_uuid?: string;
  next_url?: string;
}

interface GoodsContext {
  label?: string;
  description?: string;
  quantity?: number;
  metric?: string;
}

interface GoodsUpdateContext {
  uuid?: string;
  label?: string;
  description?: string;
  quantity?: number;
  metric?: string;
}


@Injectable({
  providedIn: 'root'
})
export class GoodsService {

  constructor(
    private httpClient: HttpClient) {
  }

  /***
   * Create Goods
   */
  createGoods(context: GoodsContext): Observable<any> {
    return this.httpClient
      .post(urlGoods, {
        ...context
      }, { withCredentials: true })
      .pipe(
        map(response => {
          return response;
        })
      );
  }

  /***
   * Update Goods
   */
  updateGoods(context: GoodsUpdateContext): Observable<any> {
    return this.httpClient
      .patch(urlGoods + context.uuid + '/', {
        ...context
      }, { withCredentials: true })
      .pipe(
        map(response => {
          return response;
        })
      );
  }

  /***
   * Delete Goods
   */
  deleteGoods(uuid: string): Observable<any> {
    return this.httpClient
      .delete(urlGoods + uuid + '/', { withCredentials: true })
      .pipe(
        map(response => {
          return response;
        })
      );
  }

  /***
   * Goods list
   */
  getGoods(context: ListGoodsContext): Observable<any> {
    let url = urlGoods;
    if (context.next_url) url = context.next_url;
  
    return this.httpClient
      .get(url, { withCredentials: true, params: { necessary_uuid: context.necessary_uuid } })
      .pipe(
        map(response => {
          const result = response;
          return result;
        })
      );
  }

  /***
   * Single Goods
   */
  getSingleGoods(uuid: string = null): Observable<any> {
    return this.httpClient
      .get(urlGoods + uuid + '/', { withCredentials: true })
      .pipe(
        map(response => {
          const result = response;
          return result;
        })
      );
  }

}
