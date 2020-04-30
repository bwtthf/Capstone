import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-message-navigation',
  templateUrl: './message-navigation.page.html',
  styleUrls: ['./message-navigation.page.scss'],
})
export class MessageNavigationPage implements OnInit {

  userid = null;

  constructor(public activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.userid = this.activatedRoute.snapshot.paramMap.get('userid')
  }

}
