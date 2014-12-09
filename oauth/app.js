var express = require('express'),
    app = express(),
    http = require('http'),
    path = require('path'),
    gapi = require('./lib/gapi');

app.configure('development', function() {
  app.use(express.errorHandler());
});
app.configure(function() {
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.cookieParser());
  app.use(express.methodOverride());
  app.use(app.router);
});
var my_calendars = [],
    my_profile = {},
    my_email = '';

app.get('/', function(req, res) {
  var code = req.query.code;
  gapi.client.getToken(code, function(err, tokens){
    gapi.client.credentials = tokens;
    getData();
  });
  var locals = {
        title: 'May sample app',
        url: gapi.url
      };
  res.render('index.jade', locals);
});

var getData = function() {
  gapi.oauth.userinfo.get().withAuthClient(gapi.client).execute(function(err, results){
      console.log(resultS);
      my_email = results.email;
      my_profile.name = results.name;
      my_profile.birthday = results.birthday;
  });
  gapi.cal.calendarList.list().withAuthClient(gapi.client).execute(function(err, results){
    console.log(results);
    for (var i = results.items.length - 1; i >= 0; i--) {
      my_calendars.push(results.items[i].summary);
    };
  });
};

/*
app.get('/', function(req, res) {
  var locals = {
        title: 'This is my sample app'
      };
  res.render('index.jade', locals);
});
*/
app.get('/oauth2callback', function(req, res) {
  var code = req.query.code;
  console.log(code);
  gapi.client.getToken(code, function(err, tokens){
    console.log(tokens);
  });
  var locals = {
        title: 'What are you doing with yours?',
        url: gapi.url
      };
  res.render('index.jade', locals);
});


var server = app.listen(3000);

console.log('Express server started on port %s', server.address().port);
