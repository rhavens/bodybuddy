var google = require('../lib/googleapis.js');
var OAuth2Client = google.auth.OAuth2;
var plus = google.plus('v1');

var CLIENT_ID = '653963664016-botgpkk2rgdeo7aijhadanemtlhmn5lo.apps.googleusercontent.com';
var CLIENT_SECRET = 'taQn3zolCrfG_-B6EsKWpM3A';
var REDIRECT_URL = 'http://localhost:3000/oauth2callback';

var oauth2Client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET, REDIRECT_URL);

googleapis
  .discover('calendar', 'v3')
  .discover('oauth2', 'v2')
  .execute(function(err, client){
    if(!err)
      callback(client);
  });


/*
var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
*/

function getAccessToken(oauth2Client, callback) {
  // generate consent page url
  var gmail_url = oauth2Client.generateAuthUrl({
    access_type: 'offline', 
    scope: 'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/calendar'
  });

  console.log('Visit the url: ', url);
  rl.question('Enter the code here:', function(code) {
    // request access token
    oauth2Client.getToken(code, function(err, tokens) {
      // TODO: tokens should be set by OAuth2 client.
      oauth2Client.setCredentials(tokens);
      callback();
    });
  });
}

// retrieve an access token
getAccessToken(oauth2Client, function() {
  // retrieve user profile
  plus.people.get({ userId: 'me', auth: oauth2Client }, function(err, profile) {
    if (err) {
      console.log('An error occured', err);
      return;
    }
    console.log(profile.displayName, ':', profile.tagline);
  });
});

exports.url = gmail_url;
exports.client = oauth2Client;
