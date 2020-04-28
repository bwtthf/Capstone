import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MessageNavigationPage } from './message-navigation.page';

describe('MessageNavigationPage', () => {
  let component: MessageNavigationPage;
  let fixture: ComponentFixture<MessageNavigationPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MessageNavigationPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MessageNavigationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
