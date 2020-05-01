import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-matches',
  templateUrl: './matches.page.html',
  styleUrls: ['./matches.page.scss'],
})
export class MatchesPage implements OnInit {


  constructor(public activatedRoute: ActivatedRoute,
    private http: HttpClient) { }

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
      var matches = Array.from(topFive.keys());
      //can access user's matches in order
      console.log(matches);

      //put topFive into array (same order)
      var top = Array.from(topFive.values());
      top.forEach((item) => {
        var songs = item.split('"');
        for(var i=0; i < songs.length; i++){
          if (!songs[i].match(alnum)){
            songs.splice(i, 1);
          }
        }
        // array of artists & songs, songs[0] => songs[1], etc.
        //remember that this is inside the forEach loop, so songs is logged for each matched user
        console.log(songs);
      });
      
    });
  }

}
