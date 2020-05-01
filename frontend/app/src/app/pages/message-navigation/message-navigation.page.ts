import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-message-navigation',
  templateUrl: './message-navigation.page.html',
  styleUrls: ['./message-navigation.page.scss'],
})
export class MessageNavigationPage implements OnInit {

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.http.get('http://localhost:8888/messages').subscribe(data => {
      var alnum = /^[0-9a-zA-Z]+$/;
      // array of matched users
      console.log(data);
    });
  }

}
