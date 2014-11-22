var express = require("express");
var path = require("path");
var jade = require("jade");
var app = express();

var __static = path.resolve('static');
var __views = path.resolve('views');

app.use('/img', express.static(__static + '/img'));
app.use('/css', express.static(__static + '/css'));
app.use('/js', express.static(__static + '/js'));

app.get('/', function(req, res){
    res.sendFile(__views + '/index.html'); 
});

app.get('/signup', function(req, res){
	res.sendFile(__views + '/signup.html');
});

app.get('/profile', function(req, res){
	//res.sendFile(__views + '/profile.html');

        //var profile = ; // get the profile from the database
        //var workout = getWorkout(profile);
        res.render(__views + '/profile.jade',
                {'workouts': 'test'// fill in with data form getWorkout
                });
});

app.get('/home', function(req, res){
	res.sendFile(__views + '/home.html');
});

app.get('/login', function(req, res){
	res.sendFile(__views + '/login.html');
});

app.listen(3000);
