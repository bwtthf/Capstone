import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth'
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.page.html',
  styleUrls: ['./navigation.page.scss'],
})
export class NavigationPage implements OnInit {

  userid = null;

  constructor(public afAuth: AngularFireAuth,
    public router: Router, 
    public activatedRoute:ActivatedRoute) { }


  ngOnInit() {
    this.userid = this.activatedRoute.snapshot.paramMap.get('userid')
  }

  SignOut() {
    this.afAuth.signOut();
    this.router.navigate(['/home'])
  }
}
