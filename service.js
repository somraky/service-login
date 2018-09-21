var express = require('express');
var bodyParser = require('body-parser');
var sha1 = require('js-sha1');

var app = express();

var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017';

app.use(bodyParser.urlencoded({extended: false}));

module.exports = (function(app){
	app.get('/', function(req, res){
		console.log("GET Method");
		res.end("GET Method");
	});

    app.post('/login', function(req, res){
        console.log("username: "+req.body.username);
        console.log("password: "+req.body.password);

        MongoClient.connect(url, function(err, database){
            const myDB = database.db('SoftenDB');
            myDB.collection('users').findOne({ username:req.body.username},
            function(err, user){
                if(user == null){
                    res.end("User Invalid");
                }else if(user.username === req.body.username && 
                    user.password === sha1(req.body.password)){
                        var authorization;
                        if (user.Authorization === "12dea96fec20593566ab75692c9949596833adc9"){
                            authorization = "user";
                        }else if (user.Authorization === "d033e22ae348aeb5660fc2140aec35850c4da997"){
                            authorization = "admin";
                        }else{
                            authorization ="no authorization"
                        }
                        res.json({"Login success":true,
						"Name":user.name,
						"Age":user.age,
                        "Gender":user.gender,
						"Authorization":authorization});
                }else{
                    console.log("Credentials wrong");
                    res.end("Password incorrect");
                }
            });
        });
    });
});