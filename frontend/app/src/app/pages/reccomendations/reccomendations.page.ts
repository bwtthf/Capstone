import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-reccomendations',
  templateUrl: './reccomendations.page.html',
  styleUrls: ['./reccomendations.page.scss'],
})
export class ReccomendationsPage implements OnInit {

  rec = [];
  artist = [];
  songs = [];

  constructor(public activatedRoute: ActivatedRoute,
    private http: HttpClient) { }

  ngOnInit() {

    
    this.http.get('http://localhost:8888/recommendation').subscribe(data => {
      var alnum = /^[0-9a-zA-Z]+$/;
      let recommendations = new Map<string, string>();
      var i = 0;
      for (var user in data){
        recommendations.set(Object.keys(data)[i], data[user]);
        i++;
      }
      
      // put matches into array
      var matches = Array.from(recommendations.keys());
      //can access user's matches in order
      console.log(matches);

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
        this.rec = songs;
        console.log(this.rec);
        this.artist = ['Arist: ' + songs[0],'Song: ' + songs[1],'Arist: ' + songs[2],'Song: ' + songs[3],'Arist: ' + songs[4],'Song: ' + songs[5],'Arist: ' + songs[6],'Song: ' + songs[7],'Arist: ' + songs[8],'Song: ' + songs[9]];
        
      });
      
    });
  }

}
