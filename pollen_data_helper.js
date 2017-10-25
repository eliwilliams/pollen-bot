'use strict';
var requestPromise = require('request-promise');
var ENDPOINT = 'https://www.pollen.com/api/forecast/current/pollen/';


function PollenDataHelper() {}


PollenDataHelper.prototype.getCityStatus = function(zip) {
  var options = {
    method: 'GET',
    uri: ENDPOINT + zip,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Referer': 'https://www.pollen.com/forecast/current/pollen/' + zip,
      'Host': 'www.pollen.com',
      'Connection': 'keep-alive',
      'Accept-Application': 'en-US,en;q=0.8',
      'Accept-Encoding': 'null',
      'Accept': 'application/json, text/plain, */*'
    },
    json: true
  };
  return requestPromise(options);
};


PollenDataHelper.prototype.formatCityStatus = function(pollenObject) {
  var data = pollenObject.Location.periods[1];
  var index = data.Index;

  var city = pollenObject.Location.City.toProperCase();
  var templateString = "Today in " + city + ", the pollen count is " + index + " out of 12. ";
  var allergenString = buildAllergenString(data);

  return templateString + allergenString;
};


var buildAllergenString = function(data) {
  var numTriggers = data.Triggers.length;

  var triggers;

  switch (data.Triggers.length) {
    case 0:
      triggers = "There are no predominant allergens.";
      break;
    case 1:
      triggers = "The primary allergen is ";
      break;
    default:
      triggers = "The primary allergens are ";
  }

  for (var i = 0; i < numTriggers; i++) {
    triggers += data.Triggers[i].Name.toLowerCase();
    if (i == numTriggers - 2) {
      if (numTriggers == 2) {
        triggers += " and ";
      } else {
        triggers += ", and ";
      }
    } else if (i == numTriggers - 1) {
      triggers += ".";
    } else {
      triggers += ", ";
    }
  }

  return triggers;
};


String.prototype.toProperCase = function() {
  return this.replace(/\w\S*/g, function(txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
};


module.exports = PollenDataHelper;