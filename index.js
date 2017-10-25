'use strict';
module.change_code = 1;
var _ = require('lodash');
var Alexa = require('alexa-app');
var skill = new Alexa.app('pollen-bot');
var PollenDataHelper = require('./pollen_data_helper.js');

var prompt = 'Please tell me a zip code to get a pollen forecast.';
var reprompt = 'I didn\'t hear a zip code; please tell me a zip code to get a pollen forecast.';


/*
 * Called when user launches skill without intent
 */
skill.launch(function(request, response) {
  response.say(prompt).shouldEndSession(false);
});


skill.intent('pollenInfoIntent', {
    'slots': {
      'Zip': 'AMAZON.NUMBER'
    },
    'utterances': [
      '{|forecast|pollen} {|level|information|info} {|for|in} {-|Zip}'
    ]
  },
  function(request, response) {
    var zip = request.slot('Zip');
    if (!_.isEmpty(zip)) {
      var pollenHelper = new PollenDataHelper();
      return pollenHelper.getCityStatus(zip).then(function(cityStatus) {
        var resp = pollenHelper.formatCityStatus(cityStatus);
        return response.say(resp).send();
      }).catch(function(err) {
        console.log("Error: " + err.statusCode);
        var error = 'I don\'t have data for the zip code ' + zip;
        response.say(error).shouldEndSession(true).send();
        return false;
      });
    } else {
      response.say(reprompt).reprompt(reprompt).shouldEndSession(false);
      return true;
    }
  }
);


var cancelIntentFunction = function(request, response) {
  response.say("Goodbye.").shouldEndSession(true);
};

skill.intent("AMAZON.CancelIntent", {}, cancelIntentFunction);
skill.intent("AMAZON.StopIntent", {}, cancelIntentFunction);


skill.intent("AMAZON.HelpIntent", {},
  function(request, response) {
    var help = prompt + " You can also say stop or cancel to exit.";
    response.say(help).shouldEndSession(false);
  });


module.exports = skill;