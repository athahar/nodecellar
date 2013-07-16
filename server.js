var express = require('express'),
	arts = require('./routes/arts'),
	fs = require('fs'),
	sys = require('sys');

var app = express();

app.configure(function(){	
	app.use(express.logger('dev'));
	app.use(express.bodyParser());
	app.use(express.static(__dirname + '/public')); 	
});


app.get('/arts', arts.findAll);
app.get('/arts/:id', arts.findById);
app.post('/arts', arts.addArt);
app.put('/arts/:id', arts.updateArt);
app.delete('/arts/:id',arts.deleteArt);


app.listen(3000);

console.log('Server running at http://127.0.0.1:3000/');