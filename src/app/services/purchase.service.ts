import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../environments/environment';

const endpoint = environment.host + 'api/shoptask/';
const urlPurchase = endpoint + 'purchases/';

// CONTEXT
interface PurchaseContext {
  label?: string;
  schedule?: string;
  description?: string;
  shipping_to?: number;
}

interface PurchaseUpdateContext {
  uuid?: string;
  label?: string;
  schedule?: string;
  description?: string;
  status?: string;
  shipping_to?: number;
}

interface ListPurchaseContext {
  status?: any;
  next_url?: string;
}

@Injectable({
  providedIn: 'root'
})
export class PurchaseService {

  constructor(
    private httpClient: HttpClient) {
  }

  /***
   * Create purchase
   */
  createPurchase(context: PurchaseContext): Observable<any> {
    return this.httpClient
      .post(urlPurchase, {
        ...context
      }, { withCredentials: true })
      .pipe(
        map(response => {
          return response;
        })
      );
  }

  /***
   * Update purchase
   */
  updatePurchase(context: PurchaseUpdateContext): Observable<any> {
    return this.httpClient
      .patch(urlPurchase + context.uuid + '/', {
        ...context
      }, { withCredentials: true })
      .pipe(
        map(response => {
          return response;
        })
      );
  }

  /***
   * Delete purchase
   */
  deletePurchase(uuid: string): Observable<any> {
    return this.httpClient
      .delete(urlPurchase + uuid + '/', { withCredentials: true })
      .pipe(
        map(response => {
          return response;
        })
      );
  }

  /***
   * Purchase list
   */
  getPurchases(context: ListPurchaseContext): Observable<any> {
    let url = urlPurchase;
    if (context.next_url) url = context.next_url;
  
    return this.httpClient
      .get(url, { withCredentials: true, params: { status: context.status } })
      .pipe(
        map(response => {
          const result = response;
          return result;
        })
      );
  }

  /***
   * Single Purchase
   */
  getPurchase(uuid: string = null): Observable<any> {
    return this.httpClient
      .get(urlPurchase + uuid + '/', { withCredentials: true })
      .pipe(
        map(response => {
          const result = response;
          return result;
        })
      );
  }

}
