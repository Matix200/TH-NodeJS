
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
  		ArrayNews.push({
  			"ID" : info[i].id,
  			"created_at" : info[i].created_at,
  			"slug" : info[i].slug,
  			"title" : info[i].title,
  			"source" : info[i].source,
  			"currencies" : info[i].currencies,
  			"published_at" : info[i].published_at,
  			"url" : info[i].url

  		})
      }
      console.log(ArrayNews);
  //    getNews(0, db);
    }
})
}, 40000);
}


function getNews(x, db){
 var check = findNews(db, x);  
 if(check == true){
 	saveNews(x, db);
 }else{
	getNews(x+1, db);
 }
}



function findNews(db, x) {
	var id = ArrayNews[x].ID;
  const collection = db.collection( 'News' );
  collection.find({ 'ID_CP' :  id}).toArray(function(err, docs) {
      assert.equal(err, null);
      console.log("Found the following records");
      console.log(docs)
      if(docs == null){return true}
  });
}

function saveNews(x, db){
if(ArrayNews.length == x) GetNewsApi(db, page+1);

var doc = { "ID_CP" : ArrayNews[x].ID,
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









