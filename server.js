var express = require("express");
var path = require("path");
var app = express();

var __static = path.resolve('../static');
var __views = path.resolve('../views');

app.use('/img', express.static(__static + '/img'));
app.use('/css', express.static(__static + '/css'));

app.get('/', function(req, res){
    res.sendFile(__views + '/index.html'); 
});

app.get('/home', function(req, res){
	res.send('hello world'); 
});

app.listen(3000);