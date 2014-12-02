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

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use('/img', express.static(__static + '/img'));
app.use('/css', express.static(__static + '/css'));
app.use('/js', express.static(__static + '/js'));

var workouts = require("/js/workouts.js");

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

app.get('/profile', function(req, res){
	//res.sendFile(__views + '/profile.html');
    var identifier = ;
    db.collection('profiles', function(er, collection) {
        collection.find({"account":identifier}).toArray(function(err, profiles) {
            var profile = profiles[0];
            if (!profile) {
                res.redirect('/login');
            }
            var workout = workouts.getWorkout(profile);
            res.render(__views + '/profile.jade',
                {'workouts': 'test'// fill in with data form getWorkout
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
