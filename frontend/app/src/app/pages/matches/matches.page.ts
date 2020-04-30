import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-matches',
  templateUrl: './matches.page.html',
  styleUrls: ['./matches.page.scss'],
})
export class MatchesPage implements OnInit {
  userid = null;

  constructor(public activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.userid = this.activatedRoute.snapshot.paramMap.get('userid')
  }

}
