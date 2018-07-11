
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


function getAllNewsMongo(){
console.log('AA');

}


function GetNewsApi(db, y){
setTimeout(function(){
request('https://cryptopanic.com/api/posts/?auth_token=2f75a7bc9bc217ceebad0c221ef81b21c6c365e0&page='+y, function (error, response, body) {
	ArrayNews = [];
    if (!error && response.statusCode == 200) {
      var info = JSON.parse(body)
      info = info.results;
     // console.log(info);
     
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
  //    getNews(0, db);
  		saveNews(0, y,  db, ArrayNews)
    }
})
}, 30000);
}


function saveNews(x, y, db, array){
	console.log(array)
  db.collection('News').insertOne(array[x], function (error, response) {
    if(error) {
        console.log('Error occurred while inserting');
       saveNews(x, db, array)
    } else {
       console.log('inserted record', response.ops[0]);
        GetNewsApi(db, y+1);
      // return 
    }
});
}









