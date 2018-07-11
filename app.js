
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
var request = require('request');
var Redis = require('ioredis');
var Parse = require('parse/node');

Parse.initialize(process.env.APP_ID, process.env.JS_KEY ,process.env.MASTER_KEY);
Parse.serverURL = process.env.SERVER_URL;


// Connect Redis
var redis = new Redis(process.env.REDIS_URL);


var page = 1;

getLastNews();


var ArrayNews = [];
var AllCoinsFromParse = [];

function getLastNews(){
var News = Parse.Object.extend("News");
var Query_News = new Parse.Query(News);
Query_News.exists("ID");
Query_News.limit(300);
Query_News.descending("createdAt");
Query_News.find().then(function(objCoin){
    for(var i in objCoin){
var ID = objCoin[i].get("ID");
AllCoinsFromParse.push(ID);
}
GetNewsApi(page);
console.log(AllCoinsFromParse);
 });
}


function GetNewsApi(y){
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
     saveNews(0, y,  ArrayNews);
    }
})
}, 30000);
}

var omitted = 0;
function saveNews(x, y, ArrayNews){
if(omitted == 5){
omitted = 0;
GetNewsApi(1);
}else{
if(AllCoinsFromParse.indexOf(ArrayNews[x].ID) > -1){
console.log(ArrayNews[x].ID+" ID already exist");
omitted++;
saveNews(x+1, y, ArrayNews);
}else{	
setTimeout(function(){  
    var e = new Date(ArrayNews[x].published_at);
    var c = new Date(ArrayNews[x].created_at);
  //  e.setDate(e.getDate() + 1);
  //  c.setDate(c.getDate() + 1);	
var News = Parse.Object.extend("News");
News  = new News();
News.set("ID", ArrayNews[x].ID);
News.set("created_at", ArrayNews[x].created_at);
News.set("slug", ArrayNews[x].slug);
News.set("title", ArrayNews[x].title);
News.set("source", ArrayNews[x].source);
News.set("currencies", ArrayNews[x].currencies);
News.set("published_at", ArrayNews[x].published_at);
News.set("url", ArrayNews[x].url);
News.set("CountLikes", 0);
News.save().then(function(results) {
	console.log("GIT: "+ results+" x:"+x+" max:"+ArrayNews.length+" y:"+y);

	if((ArrayNews.length - 1) == x){
		console.log("Get next NEWS");
		GetNewsApi(y+1);
	}else{
	AllCoinsFromParse.push(ArrayNews[x].ID);
    saveNews(x+1, y, ArrayNews);
	}
  })
  .catch(function(error) {
  	console.log("GIT: "+ error.message);
    saveNews(x, y, ArrayNews);
  });
},200);
}}}





function getAllCoinsValueFromCMC(){
var AllCoinsFromParse = [];    
var CryptoCurrency = Parse.Object.extend("CryptoCurrency");
var Query_CryptoCurrency = new Parse.Query(CryptoCurrency);
Query_CryptoCurrency.exists("IMGfile");
Query_CryptoCurrency.limit(2000);
Query_CryptoCurrency.find().then(function(objCoin){
    for(var i in objCoin){
var idname = objCoin[i].get("IMGfile");
AllCoinsFromParse.push(idname);
}
console.log(AllCoinsFromParse);
 });
}






