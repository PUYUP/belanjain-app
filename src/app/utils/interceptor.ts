import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { PersonService } from '../services/person.service';

@Injectable()
export class HttpInterceptorExtend implements HttpInterceptor {
    token: any | null;

    constructor(
        private cookieService: CookieService,
        private personService: PersonService) {}

    intercept(request: HttpRequest<any>, next: HttpHandler):Observable<HttpEvent<any>> {
        this.token = this.personService.getLocalToken();

        let auth = {};
        if (this.token) auth = {'Authorization': `Bearer ${this.token.access}`};

        request = request.clone({
            setHeaders: { 
                ...auth,
                'X-CSRFTOKEN': this.cookieService.get('csrftoken'),
            }
        });
        
        return next.handle(request);
    }
}