import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-message-navigation',
  templateUrl: './message-navigation.page.html',
  styleUrls: ['./message-navigation.page.scss'],
})
export class MessageNavigationPage implements OnInit {

  matches = [];
  topfive = [];

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.http.get('http://localhost:8888/matches').subscribe(data => {
      var alnum = /^[0-9a-zA-Z]+$/;
      let topFive = new Map<string, string>();
      var i = 0;
      for (var user in data){
        topFive.set(Object.keys(data)[i], data[user]);
        i++;
      }
      //returns Map object (key,value)
      //console.log(topFive);
      
      // put matches into array
      this.matches = Array.from(topFive.keys());
      //can access user's matches in order
      console.log(this.matches);
      
    });
  }

}
