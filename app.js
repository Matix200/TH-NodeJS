
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
var request = require('request');
var Redis = require('ioredis');
// Connect Redis
var redis = new Redis(process.env.REDIS_URL);
// Connection URL
const url = process.env.MONGODB_URI;

// Database Name
const dbName = 'heroku_n9471zh2';

var ArrayNews = [];

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

GetNewsApi();

function GetNewsApi(){
setTimeout(function(){
request('https://cryptopanic.com/api/posts/?auth_token=2f75a7bc9bc217ceebad0c221ef81b21c6c365e0', function (error, response, body) {
	ArrayNews = [];
    if (!error && response.statusCode == 200) {
      var info = JSON.parse(body)
      console.log(info.results);
     
      for(var i in info){
      	var id = info[i].id;
      	var created_at = info[i].created_at;
      	var slug = info[i].slug;
      	var title = info[i].title;
      	var source = info[i].source;
      	var currencies = info[i].currencies;
      	var published_at = info[i].published_at;
      	var url = info[i].url;

  		ArrayNews.push({
  			"ID_CP" : id,
  			"created_at" : created_at,
  			"slug" : slug,
  			"title" : title,
  			"source" : source,
  			"currencies" : currencies,
  			"published_at" : published_at,
  			"url" : url

  		})
      }
      getNews(x);
    }
})
}, 40000);
}


function getNews(x){
 var check = findNews(db, id);  
 if(check == true){
 	saveNews(x);
 }else{
	getNews(x+1);
 }
}



function findNews(db, id) {
  const collection = db.collection( 'News' );
  collection.find({ 'ID_CP' : id }).toArray(function(err, docs) {
      assert.equal(err, null);
      console.log("Found the following records");
      console.log(docs)
      if(docs != null){
      return true}
  });
}

function saveNews(x){
if(ArrayNews.length == x) GetNewsApi();

var doc = { "ID_CP" : ArrayNews[x].id,
  			"created_at" : ArrayNews[x].created_at,
  			"slug" : ArrayNews[x].slug,
  			"title" : ArrayNews[x].title,
  			"source" : ArrayNews[x].source,
  			"currencies" : ArrayNews[x].currencies,
  			"published_at" : ArrayNews[x].published_at,
  			"url" : ArrayNews[x].url }

  db.collection('News').insertOne(doc, function (error, response) {
    if(error) {
        console.log('Error occurred while inserting');
       saveNews(x)
    } else {
       console.log('inserted record', response.ops[0]);
       getNews(x+1);
      // return 
    }
});
}









