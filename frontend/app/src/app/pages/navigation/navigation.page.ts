import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth'
import { Router } from '@angular/router';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.page.html',
  styleUrls: ['./navigation.page.scss'],
})
export class NavigationPage implements OnInit {

  constructor(public afAuth: AngularFireAuth,
    public router: Router
    ) { }

  ngOnInit() {
  }

  SignOut() {
    this.afAuth.signOut();
    this.router.navigate(['/home'])
  }
}
