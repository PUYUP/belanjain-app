import { Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { Router } from '@angular/router';

import { PersonService } from '../../../../services/person.service';
import { EventsService } from '../../../../services/events.service';

@Component({
  selector: 'app-account',
  templateUrl: 'account.page.html',
  styleUrls: ['account.page.scss']
})
export class AccountPage implements OnInit {

  personData: any | null;

  constructor(
    private router: Router,
    private personService: PersonService,
    private events: EventsService,
  ) {}

  ngOnInit() {
    this.personData = this.personService.getLocalToken();
  }

  logout(): void {
    this.personService.logout()
      .pipe(
        finalize(() => {
          this.events.publish('personLogoutEvent', true);
          this.router.navigate(['/tabs/purchase'], {replaceUrl: true});
        })
      )
      .subscribe(
        (response: any) => {
          
        },
        (failure: any) => {

        }
      );
  }

}
