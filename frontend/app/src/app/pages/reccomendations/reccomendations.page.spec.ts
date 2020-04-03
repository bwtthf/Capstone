import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ReccomendationsPage } from './reccomendations.page';

describe('ReccomendationsPage', () => {
  let component: ReccomendationsPage;
  let fixture: ComponentFixture<ReccomendationsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReccomendationsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ReccomendationsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
