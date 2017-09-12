process.env.DEBUG = 'actions-on-google:*';

let Assistant = require('actions-on-google').ApiAiApp;
let express = require('express');
let bodyParser = require('body-parser');
let request_lib = require('request'); // for sending the http requests to Numbers API
let assert = require('assert');

let app = express();

app.set('port', (process.env.PORT || 8080));
app.use(bodyParser.json({
    type: 'application/json'
}));

// get by action

const TrackByFlight_ID = "TrackByFlightID";
const TrackByStarting_Date = "TrackByStartingDate";
const Help_Intent = "HelpIntent";
const WelcomeIntent = "input.welcome";
const quit_Intent = "quit_Intent";

app.post('/', function (request, response) {
    const assistant = new Assistant({
        request: request,
        response: response
    });
    console.log('step-2');


    function WelcomeSpeach(assistant) {
        var reply = "Welcome to Flight Track.. give me you flight number will let you know currently where the flight is";
        
        assistant.ask({
            speech: 'hello',
            displayText: 'hi'
        });
        // ask vs. tell -> expects reply vs. doesn't expect reply
        // assistant.ask(reply);
    }

    let actionMap = new Map();
    actionMap.set(TrackByFlight_ID, provideDetailsByID);
    actionMap.set(TrackByStarting_Date, provideDetailsByDate);
    actionMap.set(WelcomeIntent, WelcomeSpeach);
    assistant.handleRequest(actionMap);
});



var server = app.listen(app.get('port'), function () {
    console.log('App listening on port %s', server.address().port);
});