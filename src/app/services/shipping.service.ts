import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../environments/environment';

const endpoint = environment.host + 'api/shoptask/';
const urlShippingAddress = endpoint + 'shipping-address/';

interface ShippingAddressContext {
  uuid?: string;
  label?: string;
  recipient?: string;
  telephone?: number;
  address?: string;
  postal_code?: string;
  is_default?: boolean;
  notes?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ShippingService {

  constructor(
    private httpClient: HttpClient
  ) { }

  /***
   * Add Shipping Address
   */
  addShippingAddress(context: ShippingAddressContext): Observable<any> {
    return this.httpClient
      .post(urlShippingAddress, {
        label: context.label,
        recipient: context.recipient,
        telephone: context.telephone,
        address: context.address,
        postal_code: context.postal_code,
        is_default: context.is_default,
        notes: context.notes
      }, { withCredentials: true })
      .pipe(
        map(response => {
          return response;
        })
      );
  }

  /***
   * Update Shipping Address
   */
  updateShippingAddress(context: ShippingAddressContext): Observable<any> {
    return this.httpClient
      .patch(urlShippingAddress + context.uuid + '/', {
        label: context.label,
        recipient: context.recipient,
        telephone: context.telephone,
        address: context.address,
        postal_code: context.postal_code,
        is_default: context.is_default,
        notes: context.notes
      }, { withCredentials: true })
      .pipe(
        map(response => {
          return response;
        })
      );
  }

  /***
   * List all ShippingAddress
   */
  getAllShippingAddress(): Observable<any> {
    return this.httpClient
      .get(urlShippingAddress, { withCredentials: true })
      .pipe(
        map(response => {
          const result = response;
          return result;
        })
      );
  }

  /***
   * Single ShippingAddress
   */
  getShippingAddress(uuid: string = null): Observable<any> {
    return this.httpClient
      .get(urlShippingAddress + uuid + '/', { withCredentials: true })
      .pipe(
        map(response => {
          const result = response;
          return result;
        })
      );
  }

  /***
   * Delete ShippingAddress
   */
  deleteShippingAddress(uuid: string = null): Observable<any> {
    return this.httpClient
      .delete(urlShippingAddress + uuid + '/', { withCredentials: true })
      .pipe(
        map(response => {
          const result = response;
          return result;
        })
      );
  }
  
}
