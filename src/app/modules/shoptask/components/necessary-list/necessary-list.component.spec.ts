import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { NecessaryListComponent } from './necessary-list.component';

describe('NecessaryListComponent', () => {
  let component: NecessaryListComponent;
  let fixture: ComponentFixture<NecessaryListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NecessaryListComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(NecessaryListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
