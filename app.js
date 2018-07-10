var MongoClient = require('mongodb').MongoClient
  , Server = require('mongodb').Server;

var mongoClient = new MongoClient(new Server('localhost', 27017));
mongoClient.open(function(err, mongoClient) {
  var db1 = mongoClient.db("mydb");

  mongoClient.close();
});

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
	var cursor = db.collection('CryptoCurrency').find();
	cursor.each(function(err, doc){
		console.log(doc);
		callback();
	});
}