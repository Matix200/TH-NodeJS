
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

// Connection URL
const url = process.env.MONGODB_URI;

// Database Name
const dbName = 'heroku_n9471zh2';

// Use connect method to connect to the Server
MongoClient.connect(url, function(err, client) {
  assert.equal(null, err);
  console.log("Connected correctly to server");

  const db = client.db(dbName);

  findDocuments(db, function() {
    client.close();
  });
});

function findDocuments(db, callback) {
  const collection = db.collection( 'CryptoCurrency' );
  collection.find().toArray(function(err, docs) {
      assert.equal(err, null);
      console.log("Found the following records");
      console.log(docs)
      callback(docs);
  });
}