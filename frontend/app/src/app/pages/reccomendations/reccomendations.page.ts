import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-reccomendations',
  templateUrl: './reccomendations.page.html',
  styleUrls: ['./reccomendations.page.scss'],
})
export class ReccomendationsPage implements OnInit {
  matches = [];
  rec = [];
  artist = [];
  songs = [];
  topfive = [];
  firstmatch = [];
  secondmatch = [];
  thirdmatch = [];

  constructor(public activatedRoute: ActivatedRoute,
    private http: HttpClient) { }

  ngOnInit() {

    
    this.http.get('http://ec2-13-59-42-62.us-east-2.compute.amazonaws.com:8888/recommendation').subscribe(data => {
      var alnum = /^[0-9a-zA-Z]+$/;
      let recommendations = new Map<string, string>();
      var i = 0;
      for (var user in data){
        recommendations.set(Object.keys(data)[i], data[user]);
        i++;
      }
      
      // put matches into array
      this.matches = Array.from(recommendations.keys());
      //can access user's matches in order
      console.log(this.matches);

      //put topFive into array (same order)
      var rec = Array.from(recommendations.values());
      rec.forEach((item) => {
        var songs = item.split('"');
        for(var i=0; i < songs.length; i++){
          if (!songs[i].match(alnum)){
            songs.splice(i, 1);
          }
        }
        // array of artists & songs, songs[0] => songs[1], etc.
        //remember that this is inside the forEach loop, so songs is logged for each matched user
        this.topfive = this.topfive.concat(songs);
        console.log(this.topfive);
        //this.artist = ['Arist: ' + songs[0],'Song: ' + songs[1],'Arist: ' + songs[2],'Song: ' + songs[3],'Arist: ' + songs[4],'Song: ' + songs[5],'Arist: ' + songs[6],'Song: ' + songs[7],'Arist: ' + songs[8],'Song: ' + songs[9]];
        
      });
      this.firstmatch = [
        'Artist: ' + this.topfive[0] +
        '  |  Song: ' + this.topfive[1],
        'Artist: ' + this.topfive[2] +
        '  |  Song: ' + this.topfive[3],
        'Artist: ' + this.topfive[4] +
        '  |  Song: ' + this.topfive[5],
        'Artist: ' + this.topfive[6] +
        '  |  Song: ' + this.topfive[7],
        'Artist: ' + this.topfive[8] +
        '  |  Song: ' + this.topfive[9],
      ];
      this.secondmatch = [
        'Artist: ' + this.topfive[10] +
        '  |  Song: ' + this.topfive[11],
        'Artist: ' + this.topfive[12] +
        '  |  Song: ' + this.topfive[13],
        'Artist: ' + this.topfive[14] +
        '  |  Song: ' + this.topfive[15],
        'Artist: ' + this.topfive[16] +
        '  |  Song: ' + this.topfive[17],
        'Artist: ' + this.topfive[18] +
        '  |  Song: ' + this.topfive[19],
      ];
      this.thirdmatch = [
        'Artist: ' + this.topfive[20] +
        '  |  Song: ' + this.topfive[21],
        'Artist: ' + this.topfive[22] +
        '  |  Song: ' + this.topfive[23],
        'Artist: ' + this.topfive[24] +
        '  |  Song: ' + this.topfive[25],
        'Artist: ' + this.topfive[26] +
        '  |  Song: ' + this.topfive[27],
        'Artist: ' + this.topfive[28] +
        '  |  Song: ' + this.topfive[29],
      ];
    });
  }

}
