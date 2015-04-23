var mongo = require('mongodb');
var request = require('request');

var db = new mongo.Db('carsharing', new mongo.Server('localhost', 27017), {safe:false});

var optionsCar2Go = {
  url: 'https://www.car2go.com/api/v2.1/vehicles',
  qs: {'loc':'Vienna', 'oauth_consumer_key':'car2gowebsite', 'format':'json'},
  json: 'body'
};

var optionsEnjoy = {
  url: 'https://enjoy.eni.com/get_vetture',
  method: 'POST',
  strictSSL: false,
  json: 'body'
};

var minutes = 2, 
  the_interval = minutes * 60 * 1000;

db.open(function(){

  //insert Car2Go data
  db.collection('car2go', function(err, collection){
    setInterval(function() {
      request(optionsCar2Go, function(err, res, body) {
        if(err){console.log(err)}
        else{
          var data = {
            'date' : new Date(),
            'values' : body['placemarks']
          };

          collection.insert(data, {safe:true}, function(){});

        }
      });
    }, the_interval);   
  });

  //insert Enjoy data
  db.collection('enjoy', function(err, collection){
    setInterval(function() {
      request(optionsEnjoy, function(err, res, body) {
        if(err){console.log(err)}
        else{
          var data = {
            'date' : new Date(),
            'values' : body
          };
 
          collection.insert(data, {safe:true}, function(){});

        }
      });
    }, the_interval);  
  });

});
