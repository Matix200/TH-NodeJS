
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
var request = require('request');
var Redis = require('ioredis');
var Parse = require('parse/node');
var express = require('express');
var app = express();

Parse.initialize(process.env.APP_ID, process.env.JS_KEY ,process.env.MASTER_KEY);
Parse.serverURL = process.env.SERVER_URL;


// Connect Redis
//var redis = new Redis(process.env.REDIS_URL);


app.listen(process.env.PORT, function () {
  console.log('Example app listening on port 8000!');

var page = 1;
var x = 0;

getLastNews();
//getAllCoinsValueFromParse();

var ArrayNews = [];
var AllCoinsFromParse = [];

function getLastNews(){
var News = Parse.Object.extend("News");
var Query_News = new Parse.Query(News);
Query_News.exists("ID");
Query_News.descending("createdAt");
Query_News.limit(300);
Query_News.find().then(function(objCoin){
    for(var i in objCoin){
var ID = objCoin[i].get("ID");
AllCoinsFromParse.push(ID);
}
return reqTimer = setTimeout(GetNewsApi, 30000);
console.log(AllCoinsFromParse);
 });
}

function GetNewsApi() {
	console.log(AllCoinsFromParse);
request('https://cryptopanic.com/api/posts/?auth_token=2f75a7bc9bc217ceebad0c221ef81b21c6c365e0&page='+page+'&metadata=true', function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var info = JSON.parse(body)
      info = info.results;
     // console.log(info);
     
      for(var i in info){
      	var metadata = info[i].metadata;
      	if(metadata.hasOwnProperty('image')) {var image = "null" }else{var image = metadata.image;}
      	if(metadata.hasOwnProperty('description')) {var description = "null" }else{var description = metadata.description;}
  		ArrayNews.push({
  			"ID" : info[i].id,
  			"created_at" : info[i].created_at,
  			"slug" : info[i].slug,
  			"title" : info[i].title,
  			"source" : info[i].source,
  			"currencies" : info[i].currencies,
  			"published_at" : info[i].published_at,
  			"images" : image,
  			"description" : description,
  			"url" : info[i].url

  		})
      }
     x = 0;
     return SaveTime = setTimeout(saveNews, 3000);
    }
})
}





var omitted = 0;




function saveNews(){ 
if(omitted == 10){
page = 1;
omitted = 0;	
console.log("Get next NEWS ommited")
return reqTimer = setTimeout(GetNewsApi, 30000);
}else{
if(AllCoinsFromParse.indexOf(ArrayNews[x].ID) > -1){
console.log(ArrayNews[x].ID+" ID already exist");
omitted++;
x++;
return SaveTime = setTimeout(saveNews, 1000);
}else{	

    var e = new Date(ArrayNews[x].published_at);
    var c = new Date(ArrayNews[x].created_at);
var coins = ArrayNews[x].currencies;
var AllCoins = [];
for(var c in coins){
AllCoins.push(coins[c].code);
}

var News = Parse.Object.extend("News");
News  = new News();
News.set("ID", ArrayNews[x].ID);
News.set("created_at", ArrayNews[x].created_at);
News.set("slug", ArrayNews[x].slug);
News.set("title", ArrayNews[x].title);
News.set("source", ArrayNews[x].source);
News.set("currencies", ArrayNews[x].currencies);
News.set("Coins", AllCoins);
News.set("published_at", ArrayNews[x].published_at);
News.set("images", ArrayNews[x].images);
News.set("description", ArrayNews[x].description);
News.set("url", ArrayNews[x].url);
News.set("CountLikes", 0);
News.save().then(function(results) {
	console.log("GIT: "+ results+" x:"+x+" max:"+ArrayNews.length+" y:"+page);

	if((ArrayNews.length - 1) == x){
		console.log("Get next NEWS");
		page++;
		return reqTimer = setTimeout(GetNewsApi, 30000);
	}else{
	AllCoinsFromParse.push(ArrayNews[x].ID);
	x++;
    return SaveTime = setTimeout(saveNews, 1000);
	}
  })
  .catch(function(error) {
  	console.log("GIT: "+ error.message);
    return SaveTime = setTimeout(saveNews, 1000);
  });

}}
}


/*
// variables
var countCalendarAPI = 1;
var countEvents = 0;
var ommitedCalendar = 0;
var AllParseCalendar_VALUE = [];
var ALL_COINS_PARSE_JSON = [];


function getAllCoinsValueFromParse(){
var AllCoinsFromParseCalendar = [];    
var CryptoCurrency = Parse.Object.extend("CryptoCurrency");
var Query_CryptoCurrency = new Parse.Query(CryptoCurrency);
Query_CryptoCurrency.exists("IDCoin");
Query_CryptoCurrency.limit(2000);
Query_CryptoCurrency.find().then(function(objCoin){
    console.log(objCoin);
    for(var i in objCoin){

var idname = objCoin[i].get("IDCoin");
var idcmc = objCoin[i].get("IDCMC");
var symbol = objCoin[i].get("Symbol");

ALL_COINS_PARSE_JSON.push({
        "idName": idname,
        "idcmc": idcmc,
        "symbol": symbol
      })

AllCoinsFromParseCalendar.push(idname);
}
AllParseCalendar_VALUE = AllCoinsFromParseCalendar;
console.log(AllParseCalendar_VALUE);

return Calendar = setTimeout(getCalendar, 30000);

 });

}







var AllINFOCalendar = [];
function getCalendar(){  
AllINFOCalendar = [];

request('https://api.coinmarketcal.com/v1/events?access_token=ZWI3ZmM1MjNhNzM3YTJjZWMxZWMzY2NiNmZkMjFmOTRiNmYyZWM0YjE4NGFkMDdlYmVjNmQyZmMzY2Q4MWE3MQ&page='+countCalendarAPI+'&max=50&sortBy=created_desc', function (error, response, body) {
    if (!error && response.statusCode == 200) {
var Events = JSON.parse(body);
for(var i in Events){
var EVENT_COINS = [];
var id = Events[i].id;
var title = Events[i].title;
var coins = Events[i].coins;
var date_event = Events[i].date_event;
var created_date = Events[i].created_date;
var description = Events[i].description;
var source = Events[i].source;
var is_hot = Events[i].is_hot;

for(var c in coins){
var coinsID = coins[c].id;

if(AllParseCalendar_VALUE.indexOf(coinsID) > -1){
var All_JSON = iscoinExistsCalendar(coinsID);
var IMG = All_JSON[0].idcmc;
var Symbol = All_JSON[0].symbol;


EVENT_COINS.push({
        "idName": coinsID,
        "IMG": IMG,
        "Symbol": Symbol
      })
}else{}


}
     AllINFOCalendar.push({
        "id": id,
        "title": title,
        "coins"      : EVENT_COINS,
        "date_event"     : date_event,
        "created_date" : created_date,
        "description" : description,
        "source" : source,
        "is_hot" : is_hot
      })


}

countEvents = 0;
return EventsCalendar = setTimeout(GetEvents, 1000);

                                  
    }
})
}



function GetEvents(){
if(ommitedCalendar == 10){
countCalendarAPI = 1;
ommitedCalendar = 0;
console.log("Get next Calendar ommited")
return Calendar = setTimeout(getCalendar, 30000);
}else{

    if((AllINFOCalendar.length - 1) == countEvents){
    	countCalendarAPI++;
    	countEvents = 0;
    	console.log("Get next Calendar page: "+ countCalendarAPI)
    	return Calendar = setTimeout(getCalendar, 30000);
    }else{
 
    var id = AllINFOCalendar[countEvents].id;
    var coins = AllINFOCalendar[countEvents].coins;

    if(coins.length > 0){
    console.log(id);      
var Calendar = Parse.Object.extend("Calendar");
var Query_Calendar = new Parse.Query(Calendar);
    Query_Calendar.equalTo("IdCoinmarketcal", id.toString());
Query_Calendar.first().then(function(obj){
if(obj == null) { 
return saveCalendar(AllINFOCalendar[countEvents].id, AllINFOCalendar[countEvents].title,  AllINFOCalendar[countEvents].coins,  AllINFOCalendar[countEvents].date_event, AllINFOCalendar[countEvents].created_date, AllINFOCalendar[countEvents].description, AllINFOCalendar[countEvents].source, AllINFOCalendar[countEvents].is_hot);


}else{
countEvents++;
ommitedCalendar++;
console.log("Pominieto: "+AllINFOCalendar[countEvents].id+" Strona: "+countCalendarAPI+" pozycja: "+countEvents+" z "+AllINFOCalendar.length);
return EventsCalendar = setTimeout(GetEvents, 1000);
}

});
}else{

    console.log("Pominieto coina");
    	countEvents++;
        return EventsCalendar = setTimeout(GetEvents, 1000);
}
}
}}


function saveCalendar(id, Title, AllCOINS,  eDate, cDate, Content, Source,  isHot){
	var COINS = [];
    var e = new Date(eDate);
    var c = new Date(cDate);
    e.setDate(e.getDate() + 1);
    c.setDate(c.getDate() + 1);

    for(var w in AllCOINS){
    	COINS.push(AllCOINS[w].Symbol);
    }

var Calendar = Parse.Object.extend("Calendar");
Calendar  = new Calendar();
Calendar.set("IdCoinmarketcal", id.toString());
Calendar.set("Title", Title);
Calendar.set("AllCOINS", AllCOINS);
Calendar.set("Coins", COINS);
Calendar.set("eDate", e);
Calendar.set("cDate", c);
Calendar.set("Content", Content);
Calendar.set("Source", Source);
Calendar.set("isHot", isHot);
Calendar.set("CountLikes", 0);
Calendar.save().then(function(results) {
console.log("Dodano: "+id.toString()+" Strona: "+countCalendarAPI+" pozycja: "+countEvents);
countEvents++;
return Events = setTimeout(GetEvents, 1000);
  })
  .catch(function(error) {
  	console.log("error: "+ error.message);
  });

}


function iscoinExistsCalendar(code) {
var json = JSON.parse(JSON.stringify(ALL_COINS_PARSE_JSON));
  return json.filter(
    function(json) {
      return json.idName == code 
    }
  );
}
*/


});






