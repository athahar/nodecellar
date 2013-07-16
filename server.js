var express = require('express'),
	wines = require('./routes/wines'),
	fs = require('fs'),
	sys = require('sys');

var app = express();

app.configure(function(){	
	app.use(express.logger('dev'));
	app.use(express.bodyParser());
	app.use(express.static(__dirname + '/public')); 	
});


app.get('/wines', wines.findAll);
app.get('/wines/:id', wines.findById);
app.post('/wines', wines.addWine);
app.put('/wines/:id', wines.updateWine);
app.delete('/wines/:id',wines.deleteWine);


app.listen(3000);

console.log('Server running at http://127.0.0.1:3000/');