process.env.DEBUG = 'actions-on-google:*';

const Assistant = require('actions-on-google').ApiAiApp;
var express = require('express');
var bodyParser = require('body-parser');
var request_lib = require('request'); // for sending the http requests to Numbers API
var assert = require('assert');

var app = express();

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

app.post('/google', function (request, response) {
    const assistant = new Assistant({
        request: request,
        response: response
    });
    console.log('step-2');

    var intent = assistant.getIntent();
    console.log(intent);


    //     function WelcomeSpeach(assistant) {
    //         var reply = "Welcome to Flight Track.. give me you flight number will let you know currently where the flight is";

    //         assistant.ask({
    //             speech: 'hello',
    //             displayText: 'hi'
    //         });
    //         // ask vs. tell -> expects reply vs. doesn't expect reply
    //         // assistant.ask(reply);
    //     }

    //     let actionMap = new Map();
    //     actionMap.set(TrackByFlight_ID, provideDetailsByID);
    //     actionMap.set(TrackByStarting_Date, provideDetailsByDate);
    //     actionMap.set(WelcomeIntent, WelcomeSpeach);
    //     assistant.handleRequest(actionMap);


    //     function responseHandler(assistant) {
    //         console.log("okok")
    //         // intent contains the name of the intent you defined in the Actions area of API.AI
    //         let intent = assistant.getIntent();
    //         switch (intent) {
    //             case WelcomeIntent:
    //                 assistant.ask('Welcome! Say a number.');
    //                 break;

    //             // case quit_Intent:
    //             //     let number = assistant.getArgument(NUMBER_ARGUMENT);
    //             //     assistant.tell('You said ' + number);
    //             //     break;
    //         }
    //     }
    //     assistant.handleRequest(responseHandler);

});

app.get('/', function (req, res) {
    res.send("Server is up and running.")
});

var server = app.listen(app.get('port'), function () {
    console.log('App listening on port %s', server.address().port);
});