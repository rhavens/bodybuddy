var express = require("express");
var path = require("path");
var jade = require("jade");
var cookieparser = require("cookieparser");
var bodyparser = require('body-parser');
var validator = require('validator');
var app = express();

var __static = path.resolve('static');
var __views = path.resolve('views');

var mongoUri = process.env.MONGOLAB_URI ||
    process.env.MONGOHQ_URL ||
    'mongodb://localhost/bodybuddy';
var mongo = require('mongodb');
var db = mongo.Db.connect(mongoUri, function (error, databaseConnection) {
    db = databaseConnection;
});

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended: true}));

app.use('/img', express.static(__static + '/img'));
app.use('/css', express.static(__static + '/css'));
app.use('/js', express.static(__static + '/js'));

var workouts = require("./js/workouts.js");

app.get('/', function(req, res){
    res.sendFile(__views + '/index.html'); 
});

app.get('/signup', function(req, res){
	res.sendFile(__views + '/signup.html');
});

app.get('/editprofile', function(req, res){
    res.sendFile(__views + '/editprofile.html');
    //res.render(__views + '/editprofile.html');
});

function motivationalMessage() {
    var num = Math.floor(Math.random() * 3);    
    switch (num) {
        case 0:
            return "Do not fear the unknown.";
        case 1:
            return "I will show you the path.";
        case 2:
            return "Your skills are inferior!";
    }
}

app.get('/profile', function(req, res){
	//res.sendFile(__views + '/profile.html');
    var identifier = "testprofile";
    db.collection('profiles', function(er, collection) {
        collection.find({"account":identifier}).toArray(function(err, profiles) {
            var profile = profiles[0];
            if (!profile) {
                res.redirect('/login');
            }
            var workout = workouts.getWorkout(profile);
            var feedback = motivationalMessage();
            res.render(__views + '/profile.jade',
                {'workout': workout,
                 'date': new Date(),
                 'feedback': feedback,
                 // 'graphs':
                });
        });
    });
});

app.get('/home', function(req, res){
	res.sendFile(__views + '/home.html');
});

app.get('/login', function(req, res){
	res.sendFile(__views + '/login.html');
});

app.get('/about', function(req, res){
    res.sendFile(__views + '/about.html');
});

app.listen(3000);
