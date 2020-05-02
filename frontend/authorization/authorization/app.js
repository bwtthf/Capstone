var express = require('express'); // Express web server framework
var request = require('request'); // "Request" library
var querystring = require('querystring');
var cookieParser = require('cookie-parser');
var async = require('async');
const {spawn} = require('child_process')

var client_id = '99e2a0362ad04328892069150d2861ff'; 
var client_secret = '4fecda836b3d409a941ba264d51c3e32'; 
var redirect_uri = 'http://ec2-13-59-42-62.us-east-2.compute.amazonaws.com:8888/callback';
//mysql connection
var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit: 10,
  host: 'ec2-13-59-42-62.us-east-2.compute.amazonaws.com',
  user: 'root',
  password: 'Capstone2!',
  database: 'spotify'
});
console.log('DB connected');


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
var userID = 0;

var app = express();

app.use(express.static(__dirname + '/public'))
   .use(cookieParser());

app.get('/login', function(req, res) {

  var state = generateRandomString(16);
  res.cookie(stateKey, state);

  // your application requests authorization
  var scope = 'user-read-private user-read-email user-read-playback-state user-top-read';
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
            refresh_token = body.refresh_token;


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
        res.redirect('http://ec2-13-59-42-62.us-east-2.compute.amazonaws.com:8100/navigation/');
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
            
            //check if user is already there, if so replace tokens, else make a new user
            connection.query('SELECT userID FROM user WHERE userID = ?', [userID], function(error,rows){
              if(error) throw error;
              //if user does not exist
              var updated = 0
              var matches = {}
              matches[userID] = []
              console.log(matches)
              if(!rows.length){
                var sql = "INSERT INTO user (userID, accessToken, refreshToken, updated, matches) VALUES ('"+userID+"', '"+access_token+"', '"+refresh_token+"', '"+updated+"', '"+JSON.stringify(matches)+"')";
                connection.query(sql, function(error, results, fields){
                if(error) throw error;
                //else we log success
                //connection.destroy()
                console.log('New User Success');
                });
              }
              //if user does exist
              else{
                var updateAccess = "UPDATE user SET accessToken = ?, updated = ? WHERE userID = ?"
                connection.query(updateAccess, [access_token, updated, userID], function(error){
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
        //var currentPath = process.cwd()
        var path = require('path')
        const logOutput = (name) => (data) => console.log(`[${name}] ${data.toString()}`)
        //console.log(path)
        setTimeout(() => {
          const tracks = spawn('python3', [path.join(__dirname, '../../../src/top_tracks.py')]);
          tracks.stdout.on('data', logOutput('stdout'));
          tracks.stderr.on('data', logOutput('stderr'));
        }, 200);
        setTimeout(() => {
          const matches = spawn('python3', [path.join(__dirname, '../../../src/get_matches.py')]);
          matches.stdout.on('data', logOutput('stdout'));
          matches.stderr.on('data', logOutput('stderr'));
        }, 3000);
        //const process = spawn('python', ['test.py'])
        

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

app.get('/matches', function(req, res){
  res.setHeader('Access-Control-Allow-Origin', '*');
  pool.getConnection(function(error, connection){
    if(error) throw error; //not connected
    var matches = []
    var topFive = {}
    var alnum = /^[0-9a-zA-Z]+$/;

    var sql = 'SELECT matches from user WHERE userID = ?'
    connection.query(sql, [userID], function(error, result){
      matches = (result[0].matches).split('"');
      for(var i=0; i < matches.length; i++){
        if (!matches[i].match(alnum)){
          matches.splice(i, 1);
        }
      }
      matches.splice(0, 1);
      sql = 'SELECT topFive from user WHERE userID = ?'
      async.forEachOf(matches, function(user, i, callback){
        connection.query(sql, [user], function(error,result){
          if(error) callback(error)
          topFive[matches[i]] = result[0].topFive;
          callback(null)
        });
      },
      function(err){
        if(err){
          throw err;
        }else{
          res.json(topFive)
        }
    });
      
    });
    
  });
});

app.get('/recommendation', function(req, res){
  res.setHeader('Access-Control-Allow-Origin', '*');
  pool.getConnection(function(error, connection){
    if(error) throw error; //not connected
    var matches = []
    var recs = {}
    var alnum = /^[0-9a-zA-Z]+$/;

    var sql = 'SELECT matches from user WHERE userID = ?'
    connection.query(sql, [userID], function(error, result){
      matches = (result[0].matches).split('"');
      for(var i=0; i < matches.length; i++){
        if (!matches[i].match(alnum)){
          matches.splice(i, 1);
        }
      }
      matches.splice(0, 1);
      sql = 'SELECT recommendations from user WHERE userID = ?'
      async.forEachOf(matches, function(user, i, callback){
        connection.query(sql, [user], function(error,result){
          if(error) callback(error)
          recs[matches[i]] = result[0].recommendations;
          callback(null)
        });
      },
      function(err){
        if(err){
          throw err;
        }else{
          res.json(recs)
        }
    });
      
    });
    
  });
});

app.get('/messages', function(req, res){
  res.setHeader('Access-Control-Allow-Origin', '*');
  var alnum = /^[0-9a-zA-Z]+$/;
  pool.getConnection(function(error, connection){
    if(error) throw error; //not connected
    var sql = 'SELECT matches from user WHERE userID = ?'
    connection.query(sql, [userID], function(error, result){
      matches = (result[0].matches).split('"');
      for(var i=0; i < matches.length; i++){
        if (!matches[i].match(alnum)){
          matches.splice(i, 1);
        }
      }
      matches.splice(0, 1);
      res.json(matches);
    });
  });
});

app.get('/recommendations', function(req, res){
  res.setHeader('Access-Control-Allow-Origin', '*');
  var alnum = /^[0-9a-zA-Z]+$/;
  pool.getConnection(function(error, connection){
    if(error) throw error; //not connected
    var sql = 'SELECT recommendations from user WHERE userID = ?'
    connection.query(sql, [userID], function(error, result){
      recommendations = (result[0].recommendations).split('"');
      for(var i=0; i < matches.length; i++){
        if (!recommendations[i].match(alnum)){
          recommendations.splice(i, 1);
        }
      }
      recommendations.splice(0, 1);
      res.json(recommendations);
    });
  });
});

console.log('Listening on 8888');
app.listen(8888);
