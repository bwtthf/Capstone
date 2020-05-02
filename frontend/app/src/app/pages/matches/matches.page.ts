import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-matches',
  templateUrl: './matches.page.html',
  styleUrls: ['./matches.page.scss'],
})
export class MatchesPage implements OnInit {

  userid = null;
  matches = [];
  topfive = [];
  firstmatch = [];
  secondmatch = [];
  thirdmatch = [];

  constructor(public activatedRoute: ActivatedRoute,
    private http: HttpClient) { }

  ngOnInit() {

    this.userid = this.activatedRoute.snapshot.paramMap.get('userid')

    this.http.get('http://ec2-13-59-42-62.us-east-2.compute.amazonaws.com:8888/matches').subscribe(data => {
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

      //put topFive into array (same order)
      var top = Array.from(topFive.values());
      top.forEach((item) => {
        var songs = item.split('"');
        for(var i=0; i < songs.length; i++){
          if (!songs[i].match(alnum)){
            songs.splice(i, 1);
          }
        }
        this.topfive = this.topfive.concat(songs);
        console.log(this.topfive);
        // array of artists & songs, songs[0] => songs[1], etc.
        //remember that this is inside the forEach loop, so songs is logged for each matched user
        //console.log(songs);

      });
      //this.topfive = Array.from(this.topfive[0],this.topfive[1]);
      this.firstmatch = [
        'Artist: ' + this.topfive[0] +
        '  |  Song: ' + this.topfive[1],
        'Artist: ' + this.topfive[2] +
        '  |  Song: ' + this.topfive[3],
        'Artist: ' + this.topfive[4] +
        '  |  Song: ' + this.topfive[5],
      ];
      this.secondmatch = [
        'Artist: ' + this.topfive[10] +
        '  |  Song: ' + this.topfive[11],
        'Artist: ' + this.topfive[12] +
        '  |  Song: ' + this.topfive[13],
        'Artist: ' + this.topfive[14] +
        '  |  Song: ' + this.topfive[15],
      ];
      this.thirdmatch = [
        'Artist: ' + this.topfive[20] +
        '  |  Song: ' + this.topfive[21],
        'Artist: ' + this.topfive[22] +
        '  |  Song: ' + this.topfive[23],
        'Artist: ' + this.topfive[24] +
        '  |  Song: ' + this.topfive[25]
      ];
      //this.topfive = top;
    });
  }

}
