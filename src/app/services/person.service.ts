import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../environments/environment';

const credentialsKey = 'credential';
const tokenKey = 'token';
const endpoint = environment.host + 'api/person/';
const urlCheckTelephone = endpoint + 'users/check-telephone/';
const urlLogin = endpoint + 'token/';
const urlUser = endpoint + 'users/';

// CONTEXT
interface RegisterContext {
  first_name?: string;
  username?: string;
  telephone?: number;
  email?: string;
  password?: string;
  password_confirm?: string;
}

interface LoginContext {
  username?: string;
  password?: string;
}

interface CheckTelephoneContext {
  telephone?: string;
}

interface ProfileContext {
  first_name?: string;
  biography?: string;
}

@Injectable({
  providedIn: 'root'
})
export class PersonService {

  private storageCredentials: any | null;
  private storageToken: string | null;
  private loginData: any | null;

  constructor(
    private httpClient: HttpClient) {

    const savedCredentials = localStorage.getItem(credentialsKey);
    if (savedCredentials) {
      this.storageCredentials = JSON.parse(savedCredentials);
    }

    const savedToken = localStorage.getItem(tokenKey);
    if (savedToken != null && savedToken !== 'undefined') {
      this.storageToken = JSON.parse(savedToken);
    }
  }

  /**
   * Checks is the user is authenticated.
   * @return True if the user is authenticated.
   */
  isAuthenticated(): boolean {
    return !!this.credentials;
  }

  /**
   * Gets the user credentials.
   * @return The user credentials or null if the user is not authenticated.
   */
  get credentials(): any | null {
    return this.storageCredentials;
  }

  /**
   * Get single token
   * @return Single token string
   */
  get token(): any | null {
    return this.storageToken;
  }

  /**
   * Sets the user credentials.
   * Otherwise, the credentials are only persisted for the current session.
   * @param credentials The user credentials.
   */
  private setCredentials(credentials?: any) {
    this.storageCredentials = credentials || null;

    if (credentials) {
      const storage = localStorage;
      storage.setItem(credentialsKey, JSON.stringify(credentials));
    } else {
      localStorage.removeItem(credentialsKey);
    }
  }

  private setToken(token: any) {
    this.storageToken = token || null;

    if (token) {
      const storage = localStorage;
      storage.setItem(tokenKey, JSON.stringify(token));
    } else {
      localStorage.removeItem(tokenKey);
    }
  }

  getLocalToken(): any {
    const tokenObj = JSON.parse(localStorage.getItem(tokenKey));
    return tokenObj;
  }

  /***
   * Save localStorage data 
   */
  setLocalData(key: string = '', data: any = ''): void {
    if (key && data) localStorage.setItem(key, JSON.stringify(data));
  }

  /***
   * Delete localStorage data
   */
  deleteLocalData(key: string = ''): void {
    if (key) localStorage.removeItem(key);
  }

  /*** 
   * Get localStorage data 
   */
  getLocalData(key: string = ''): any {
    return JSON.parse(localStorage.getItem(key));
  }

  /***
   * Register action
   */
  register(context: RegisterContext): Observable<any> {
    return this.httpClient
      .post(urlUser, {
        first_name: context.first_name,
        username: context.username,
        email: context.email,
        telephone: context.telephone,
        password: context.password,
        password_confirm: context.password_confirm
      }, { withCredentials: true })
      .pipe(
        map(response => {
          return response;
        })
      );
  }

  /*** 
   * Login action
   */
  login(context: LoginContext): Observable<any> {
    return this.httpClient
      .post(urlLogin, {
        username: context.username,
        password: context.password
      }, { withCredentials: true })
      .pipe(
        map(response => {
          this.loginData = response;

          this.setCredentials(this.loginData);
          this.setToken(this.loginData);

          return this.loginData;
        })
      );
  }

  /*** 
   * Check telephone
   */
  checkTelephone(context: CheckTelephoneContext): Observable<any> {
    return this.httpClient
      .post(urlCheckTelephone, {
        telephone: context.telephone
      }, { withCredentials: true })
      .pipe(
        map(response => {
          return response;
        })
      );
  }

  /**
   * Logs out the user and clear credentials.
   * @return True if the user was logged out successfull
   */
  logout(): Observable<any> {
    let personData = this.getLocalToken();

    // Customize credentials invalidation here
    this.setCredentials();
    this.setToken(false);

    // Logout from server
    let urlLogout = urlUser + personData.id + '/logout/';
    return this.httpClient
      .post(urlLogout, { withCredentials: true })
      .pipe(
        map(response => {
          return {};
        })
      );
  }

  /**
   * Person detail
   * @param id User id
   */
  profile(id: string): Observable<any> {
    return this.httpClient
      .get(urlUser + id + '/', { withCredentials: true })
      .pipe(
        map(response => {
          const result = response;
          return result;
        })
      );
  }

  /***
   * Update profile
   */
  updateProfile(id: number, context: ProfileContext): Observable<any> {
    return this.httpClient
      .patch(urlUser + id + '/', {
        first_name: context.first_name,
        biography: context.biography
      }, { withCredentials: true })
      .pipe(
        map(response => {
          return response;
        })
      );
  }

  /**
   * Security detail
   * @param id User id
   */
  security(id: string): Observable<any> {
    return this.httpClient
      .get(urlUser + id + '/security/', { withCredentials: true })
      .pipe(
        map(response => {
          const result = response;
          return result;
        })
      );
  }

  /***
   * Update security
   */
  updateSecurity(id: number, context: any): Observable<any> {
    return this.httpClient
      .patch(urlUser + id + '/security/', {
        ...context
      }, { withCredentials: true })
      .pipe(
        map(response => {
          return response;
        })
      );
  }

}
