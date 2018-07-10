var http = require('http');
var MongoClient = require('mongodb').MongoClient;
var server = require('websocket').server;

startMongoDBConnection();

function startMongoDBConnection(){
MongoClient.connect(process.env.MONGODB_URI, {useNewUrlParser: true }, function(err, db){
	if (err) {
		console.log(err);
	} else {
		listProducts(db, function(){
			db.close();
		});
	}
});
}


var listCryptoCurrency = function(db, callback) {
	var cursor = db.collection('CryptoCurrency').find(
		);
	cursor.each(function(err, doc){
		console.log(doc);
		callback();
	});
}