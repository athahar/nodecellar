var mongo = require('mongodb');

var Server = mongo.Server,
	Db = mongo.Db,
	BSON = mongo.BSONPure;


var server = new Server('localhost', 27017, {auto_reconnect : true}),
	db = new Db('winedb', server);

db.open(function (err,db) {
	if (!err) {
		console.log("Connected to wine db");
		db.collection('wines',{strict:true},function (err, collection) {
			if (err) {
				console.log(" The wines collection is empty, creating sample data");
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
	console.log("retrieving wine : " + id);
	db.collection('wines', function (err, collection) {
		collection.findOne({'_id': new BSON.ObjectID(id)}, function (err, item) {
			if (err) {
				console.log('Error retrieving wine : ' + err);
				res.send({'error':'An error occured'});
			} else{
				res.send(item);
			}
		});
	});
};

exports.findAll = function(req,res){

	db.collection('wines', function (err, collection) {
		collection.find().toArray(function (err, items) {
			res.send(items);
		});
	});
};

exports.addWine = function(req,res){
	var wine = req.body;
	console.log('Adding wine : ' + JSON.stringify(wine));

	db.collection('wines', function(err,collection){
		collection.insert(wine, {safe:true}, function (err, result) {
			if (err) {
				res.send({'error':'An error occured' + err});
			} else{
				console.log('Success: ' + JSON.stringify(result[0]));
				res.send(result[0]);
			}
		});
	});
};

exports.updateWine = function(req,res){

	var id = req.params.id;
    var wine = req.body;
    delete wine._id;
    console.log('Updating wine: ' + id);
    console.log(JSON.stringify(wine));

	db.collection('wines', function(err,collection){
		collection.update({'_id': new BSON.ObjectID(id)}, wine, {safe:true}, function (err, result) {
			if (err) {
				console.log('Error updating wine : ' + err);
				res.send({'error':'An error occured'});
			} else{
				console.log('' + result + 'documents(s) updated');
				res.send(wine);
			}
		});
	});
};

exports.deleteWine = function(req,res){
	var id = req.params.id;
	console.log('deleting wine : ' + id);
	db.collection('wines', function (err, collection) {
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

    var wines = [
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

    db.collection('wines', function(err, collection) {
        collection.insert(wines, {safe:true}, function(err, result) {});
    });

};
