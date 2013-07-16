var mongo = require('mongodb');

var Server = mongo.Server,
	Db = mongo.Db,
	BSON = mongo.BSONPure;


var server = new Server('localhost', 27017, {auto_reconnect : true}),
	db = new Db('artdb', server);

db.open(function (err,db) {
	if (!err) {
		console.log("Connected to art db");
		db.collection('arts',{strict:true},function (err, collection) {
			if (err) {
				console.log(" The arts collection is empty, creating sample data");
				populateDB();
			}
		});
	}
});

exports.startApp = function(req,res){
	res.send({name:'Start App'});
};

exports.findById = function(req,res){

	var id = req.params.id;
	console.log("retrieving art : " + id);
	db.collection('arts', function (err, collection) {
		collection.findOne({'_id': new BSON.ObjectID(id)}, function (err, item) {
			if (err) {
				console.log('Error retrieving art : ' + err);
				res.send({'error':'An error occured'});
			} else{
				res.send(item);
			}
		});
	});
};

exports.findAll = function(req,res){

	db.collection('arts', function (err, collection) {
		collection.find().toArray(function (err, items) {
			res.send(items);
		});
	});
};

exports.addArt = function(req,res){
	var art = req.body;
	console.log('Adding art : ' + JSON.stringify(art));

	db.collection('arts', function(err,collection){
		collection.insert(art, {safe:true}, function (err, result) {
			if (err) {
				res.send({'error':'An error occured' + err});
			} else{
				console.log('Success: ' + JSON.stringify(result[0]));
				res.send(result[0]);
			}
		});
	});
};

exports.updateArt = function(req,res){

	var id = req.params.id;
    var art = req.body;
    delete art._id;
    console.log('Updating art: ' + id);
    console.log(JSON.stringify(art));

	db.collection('arts', function(err,collection){
		collection.update({'_id': new BSON.ObjectID(id)}, art, {safe:true}, function (err, result) {
			if (err) {
				console.log('Error updating art : ' + err);
				res.send({'error':'An error occured'});
			} else{
				console.log('' + result + 'documents(s) updated');
				res.send(art);
			}
		});
	});
};

exports.deleteArt = function(req,res){
	var id = req.params.id;
	console.log('deleting art : ' + id);
	db.collection('arts', function (err, collection) {
		collection.remove({'_id': new BSON.ObjectID(id)}, {safe:true}, function(err, result){
			if (err) {
				res.send({'error': 'An error occured' + err});
			} else{
				console.log('' + result + ' document(s) deleted');
				res.send(req.body);
			}
		});
	});
};

/*--------------------------------------------------------------------------------------------------------------------*/
// Populate database with sample data -- Only used once: the first time the application is started.
// You'd typically not find this code in a real-life app, since the database would already exist.
var populateDB = function() {

    var arts = [
    {
        name: "CHATEAU DE SAINT COSME",
        year: "2009",
        grapes: "Grenache / Syrah",
        country: "France",
        region: "Southern Rhone",
        description: "The aromas of fruit and spice...",
        picture: "saint_cosme.jpg"
    },
    {
        name: "LAN RIOJA CRIANZA",
        year: "2006",
        grapes: "Tempranillo",
        country: "Spain",
        region: "Rioja",
        description: "A resurgence of interest in boutique vineyards...",
        picture: "lan_rioja.jpg"
    }];

    db.collection('arts', function(err, collection) {
        collection.insert(arts, {safe:true}, function(err, result) {});
    });

};
