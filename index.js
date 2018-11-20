
var express = require('express');

var MongoClient = require('mongodb').MongoClient

var bParser = require('body-parser');

var app = express();

app.use(function (req, res, next)
{
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

//body-parser package is used to handle the data from the POST
app.use(bParser.urlencoded({ extended: true}));

app.use(express.static('public'));

//create users
app.get('/createUser', function (req, res)
{
  var login = '<a href="/">Login</a>';

  var html = login + '<h3>Create User</h3>' +
               '<form action="/createUser" method="post">' +
	             'Enter Username' +
    				   '<br>' +
    				   '<input type="text" name="usernameCreate" />' +
    				   '<br>' +
    				   'Enter Password' +
    				   '<br>' +
    				   '<input type="password" name="passwordCreate" />' +
    				   '<br>' +
    				   'Enter Email' +
    				   '<br>' +
    				   '<input type="email" name="emailAddress">' +
    				   '<br>' +
    				   'Enter First Name' +
    				   '<br>' +
    				   '<input type="text" name="firstName">' +
    				   '<br>' +
    				   'Enter Last Name' +
    				   '<br>' +
    				   '<input type="text" name="lastName">' +
    				   '<br>' + '<br>' +
    				   '<button type="submit">Submit</button>' +
				      '</form>';

    res.send(html);

});

//create users post
app.post('/createUser', function(req, res)
{
  var enterUsername = req.body.usernameCreate;
  var enterPassword = req.body.passwordCreate;
  var enterEmail = req.body.emailAddress;
  var enterFirstname = req.body.firstName;
  var enterLastname = req.body.lastName;

  MongoClient.connect('mongodb://localhost:27017/testing', function (err, db)
  {
	  if (err) throw err
	  var dbCollection = db.collection('users');
		dbCollection.insert({"usernameValue":enterUsername, "passwordValue":enterPassword, "emailValue":enterEmail, "firstnameValue":enterFirstname, "lastnameValue":enterLastname},
    function(err, result)
    {
		  dbCollection.find().toArray(function (err, documents)
      {
			  console.log(documents);
			  //res.send(documents);
			  db.close();
			}); //end find
		}); //end insert
	}); //end .connect
});

//login index.html
app.get('/', function (req, res)
{
  res.sendFile(__dirname + '/index.html');
});

/*
//Login
app.get('/', function (req, res)
{
  var createUser = '<a href="/createUser">Create User</a>';
  var html = createUser + '<h3>Login</h3>' +
             '<form action="/" method="post">' +
        	   'Enter Username' +
        	   '<br>' +
        	   '<input type="text" name="userName" />' +
        	   '<br>' +
        	   'Enter Password' +
        	   '<br>' +
        	   '<input type="password" name="passWord" />' +
        	   '<br>' + '<br>' +
        	   '<button type="submit">Submit</button>' +
             '</form>';
  res.send(html);
});
*/

//login post
app.post('/', function(req, res)
{
  var userName = req.body.userName;
  var passWord = req.body.passWord;
  var tryAgain = '<a href="/">Try Again</a>';
  var default1 = '<a href="/default1">Default/Tasks</a>';
  var html = "";

  MongoClient.connect('mongodb://localhost:27017/testing', function (err, db)
  {
	  if (err) throw err
	  var dbCollection = db.collection('users');
    dbCollection.findOne({"usernameValue":userName}, function(err, result)
    {
      var userNameDb = result.usernameValue;
      var passWordDb = result.passwordValue;

      if(err)
      {
        return console.log(err);
      }

      else if(userName == userNameDb && passWord == passWordDb)
      {
        //console.log(userName2);
        html = 'authentication match ' + default1;
      }

      else
      {
        html = 'no authentication match ' + tryAgain;
      }
      //console.log(result);
      res.send(html);
      db.close();

		}); //end insert findOne
	}); //end .connect
});

//Enter Tasks
app.get('/tasks', function (req, res)
{
  var default1 = '<a href="/default1">Default/Tasks</a>';
  var html = default1 + '<h3>Enter Tasks</h3>' +
            '<form action="/tasks" method="post">' +
			      '<input type="text" name="tasks" />' +
			      '<br>' + '<br>' +
			      '<button type="submit">Submit</button>' +
            '</form>';
  res.send(html);
});

//enter task post
app.post('/tasks', function(req, res)
{
  var enterTasks = req.body.tasks;
  MongoClient.connect('mongodb://localhost:27017/testing', function (err, db)
  {
	  if (err) throw err
	  var dbCollection = db.collection('tasks');
		dbCollection.insert({"taskValue":enterTasks}, function(err, result)
    {
		  dbCollection.find().toArray(function (err, documents)
      {
			  console.log(documents);
			  //res.send(documents);
			  db.close();
			}); //end find
		}); //end insert
	}); //end .connect
});

//display tasks
app.get('/default1', function(req, res){
MongoClient.connect('mongodb://localhost:27017/testing', function (err, db)
{
  if (err) throw err
  var dbCollection = db.collection('tasks');
	dbCollection.find().toArray(function (err, documents)
  {
    var output ='';

    for (i=0; i<documents.length; i++)
    {
	     output += '<ul>' + '<li>' + documents[i].taskValue + '</li>' + '</ul>'
    }
	  //console.log(output);
    var createUser = '<a href="/createUser">Create User</a>';
    var h3 = '<h3>Tasks</h3>';
		var html = '<a href="/tasks">Enter Tasks</a>' + '<br>' + createUser + h3 + output;
    //console.log(documents);
    //res.send(tasks);
		res.send(html);
    db.close();

	}); //end find

 }); //end .connect

}); //end app.get

app.listen(3001, function () {
    console.log('Listening on port 3001');
});
