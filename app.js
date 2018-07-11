
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



var page = 1;
// Use connect method to connect to the Server
MongoClient.connect(url, function(err, client) {
  assert.equal(null, err);
  console.log("Connected correctly to server");

  const db = client.db(dbName);

GetNewsApi(db, page);
});


var ArrayNews = [];


function GetNewsApi(db, y){
setTimeout(function(){
request('https://cryptopanic.com/api/posts/?auth_token=2f75a7bc9bc217ceebad0c221ef81b21c6c365e0&page='+y, function (error, response, body) {
	ArrayNews = [];
    if (!error && response.statusCode == 200) {
      var info = JSON.parse(body)
      info = info.results;
      console.log(info);
     
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
  			"ID" : id,
  			"created_at" : created_at,
  			"slug" : slug,
  			"title" : title,
  			"source" : source,
  			"currencies" : currencies,
  			"published_at" : published_at,
  			"url" : url

  		})
      }
      console.log(ArrayNews[0].ID);
      getNews(0, db);
    }
})
}, 40000);
}


function getNews(x, db){
console.log(x, ArrayNews[0]);
 var check = findNews(db, ArrayNews[x].ID);  
 if(check == true){
 	saveNews(x, db);
 }else{
	getNews(x+1, db);
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

function saveNews(x, db){
if(ArrayNews.length == x) GetNewsApi(db, page+1);

var doc = { "ID_CP" : ArrayNews[x].ID_CP,
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
       saveNews(x, db)
    } else {
       console.log('inserted record', response.ops[0]);
       getNews(x+1, db);
      // return 
    }
});
}









