var express = require('express'); // Express web server framework
var request = require('request'); // "Request" library
var querystring = require('querystring');
var cookieParser = require('cookie-parser');

var client_id = '99e2a0362ad04328892069150d2861ff'; 
var client_secret = '4fecda836b3d409a941ba264d51c3e32'; 
var redirect_uri = 'http://localhost:8888/callback'; 

//mysql connection
var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit: 10,
  host: 'ec2-18-216-195-64.us-east-2.compute.amazonaws.com',
  user: 'root',
  password: 'Capstone2!',
  database: 'spotify'
});


/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
var generateRandomString = function(length) {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

var stateKey = 'spotify_auth_state';

var app = express();

app.use(express.static(__dirname + '/public'))
   .use(cookieParser());

app.get('/login', function(req, res) {

  var state = generateRandomString(16);
  res.cookie(stateKey, state);

  // your application requests authorization
  var scope = 'user-read-private user-read-email user-read-playback-state';
  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: client_id,
      scope: scope,
      redirect_uri: redirect_uri,
      state: state
    }));
});

app.get('/callback', function(req, res) {

  // your application requests refresh and access tokens
  // after checking the state parameter

  var code = req.query.code || null;
  var state = req.query.state || null;
  var storedState = req.cookies ? req.cookies[stateKey] : null;

  if (state === null || state !== storedState) {
    res.redirect('/#' +
      querystring.stringify({
        error: 'state_mismatch'
      }));
  } else {
    res.clearCookie(stateKey);
    var authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        code: code,
        redirect_uri: redirect_uri,
        grant_type: 'authorization_code'
      },
      headers: {
        'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
      },
      json: true
    };

    request.post(authOptions, function(error, response, body) {
      if (!error && response.statusCode === 200) {

        var access_token = body.access_token,
            refresh_token = body.refresh_token,
            userID = 0;

        var options = {
          url: 'https://api.spotify.com/v1/me',
          headers: { 'Authorization': 'Bearer ' + access_token },
          json: true
        };

        // use the access token to access the Spotify Web API
        request.get(options, function(error, response, body) {
          console.log(body);
          userID = body.id;
        });
        
        // we can also pass the token to the browser to make requests from there
        res.redirect('http://localhost:8100/navigation/'); //+
        //  querystring.stringify({
        //    access_token: access_token,
        //    refresh_token: refresh_token
        //  }));
        
        
        //wait 200ms for api results
        setTimeout(() => {
          //connection to mysql
          pool.getConnection(function(error, connection){
            if(error) throw error; //not connected
            console.log('New Connection');
            //console.log(userID);
            //check if user is already there, if so replace tokens, else make a new user
            connection.query('SELECT userID FROM user WHERE userID = ?', [userID], function(error,rows){
            //connection.query('SELECT userID FROM user', function(error, rows){
              if(error) throw error;
              console.log(rows)
              //if user does not exist
              if(!rows.length){
                var sql = "INSERT INTO user (userID, accessToken, refreshToken) VALUES ('"+userID+"', '"+access_token+"', '"+refresh_token+"')";
                connection.query(sql, function(error, results, fields){
                if(error) throw error;
                //else we log success
                //connection.destroy()
                console.log('New User Success');
                });
              }
              //if user does exist
              else{
                var updateAccess = "UPDATE user SET accessToken = ? WHERE userID = ?"
                connection.query(updateAccess, [access_token, userID], function(error){
                  if(error) throw error;
                  console.log('Updated user ' + userID + '\'s access token');
                });
                var updateRefresh = "UPDATE user SET refreshToken = ? WHERE userID = ?"
                connection.query(updateRefresh, [refresh_token, userID], function(error){
                  if(error) throw error;
                  console.log('Updated user ' + userID + '\'s refresh token');
                });
                //connection.destroy()
              }
            });
            connection.release()
            console.log('Released connection')
          })
        }, 200);
      } else {
        res.redirect('/#' +
          querystring.stringify({
            error: 'invalid_token'
          }));
      }
    });
  }
});

app.get('/refresh_token', function(req, res) {

  // requesting access token from refresh token
  var refresh_token = req.query.refresh_token;
  var authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: { 'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64')) },
    form: {
      grant_type: 'refresh_token',
      refresh_token: refresh_token
    },
    json: true
  };

  request.post(authOptions, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      var access_token = body.access_token;
      res.send({
        'access_token': access_token
      });
    }
  });
});

console.log('Listening on 8888');
app.listen(8888);
