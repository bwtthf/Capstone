import { Component } from '@angular/core';

declare var cordova: any;

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  result = {}
  constructor() {}

  authWithSpotify() {
    const config = {
      clientId: "99e2a0362ad04328892069150d2861ff",
      redirectUrl: "devdacticspotify://callback",
      scopes: ["streaming", "playlist-read-private", "user-read-email", "user-read-private"],
      tokenExchangeUrl: "https://capstone-pro.herokuapp.com/exchange",
      tokenRefreshUrl: "https://capstone-pro.herokuapp.com/refresh",
    };
 
    cordova.plugins.spotifyAuth.authorize(config)
      .then(({ accessToken, encryptedRefreshToken, expiresAt }) => {
        this.result = { access_token: accessToken, expires_in: expiresAt, ref: encryptedRefreshToken };
      });
  }
}
