import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-reccomendations',
  templateUrl: './reccomendations.page.html',
  styleUrls: ['./reccomendations.page.scss'],
})
export class ReccomendationsPage implements OnInit {

  userid = null;

  constructor(public activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.userid = this.activatedRoute.snapshot.paramMap.get('userid')
  }

}
