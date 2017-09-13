process.env.DEBUG = 'actions-on-google:*';

const Assistant = require('actions-on-google').ApiAiApp;
var FlightStatsAPI = require('flightstats')
var express = require('express');
var bodyParser = require('body-parser');
var request_lib = require('request'); // for sending the http requests to Numbers API
var assert = require('assert');
var rp = require('request-promise');

var app = express();

app.set('port', (process.env.PORT || 8080));
app.use(bodyParser.json({
    type: 'application/json'
}));

// get by action

// var api = new FlightStatsAPI({
//     appId: '6aac18a6',
//     apiKey: '40a7e359cb020a07ead5159c2d5d8162',
//     // optional, defaults to `node flightstats/{package.version}` 
//     userAgent: 'Flight_Bot',
// })

const TrackByFlight_ID = "TrackByFlightID";
const TrackByStarting_Date = "TrackByStartingDate";
const Help_Intent = "HelpIntent";
const WelcomeIntent = "input.welcome";
const quit_Intent = "quit_Intent";

// Options are optional; 
// defaults to retrieve all currently active airlines 
// api.getAirlines(options, callback)
// // Options (iata, icao, fs are mutually exclusive): 
// var options = {
//     all: {
//         Boolean
//     },
//     date: {
//         Date
//     },
//     iata: {
//         String
//     },
//     icao: {
//         String
//     },
//     fs: {
//         String
//     },
// }

app.post('/', function (req, res) {
    const assistant = new Assistant({
        request: req,
        response: res
    });
    var intent = assistant.getIntent();
    console.log("hi this is intent" + intent);

    function WelcomeSpeach(assistant) {
        console.log("this is assistant" + assistant);
        var reply = "Welcome to FlightStat.. give me you flight number will let you know currently where the flight is";
        assistant.ask(reply);
    }

    function provideDetailsByID(request, response) {
        var flightNumber_url = assistant.getArgument('flightNumber');
        console.log("the response is " + response);
        if (flightNumber_url) {
            var p = Promise.resolve();
            var getDetails = {
                method: 'GET',
                // 933427129 flight number
                // uri: `https://api.flightstats.com/flex/flightstatus/rest/v2/json/flight/track/933427129?appId=6aac18a6&appKey=40a7e359cb020a07ead5159c2d5d8162&includeFlightPlan=false&maxPositions=2`,
                uri: `https://api.flightstats.com/flex/flightstatus/rest/v2/json/flight/track/${flightNumber_url}?appId=6aac18a6&appKey=40a7e359cb020a07ead5159c2d5d8162&includeFlightPlan=false&maxPositions=2`,
                json: true,
                resolveWithFullResponse: true,
            };
            console.log("get details log " + getDetails);
            p = rp(getDetails)
                .then(function (res) {
                    let flightId = res.body.request.flightId.requested;
                    let maxPositions = res.body.request.maxPositions.requested;
                    let fLNumber = res.body.flightTrack.flightNumber;
                    let carrierCode = res.body.flightTrack.carrierFsCode;
                    let departureDate = res.body.flightTrack.departureDate.dateLocal;
                    let airName = res.body.appendix.airlines[0].name;
                    let airPortName = res.body.appendix.airports[0].name;
                    let airPortCity = res.body.appendix.airports[0].city;
                    let airPortCountryName = res.body.appendix.airports[0].countryName;
                    let airPortregionName = res.body.appendix.airports[0].regionName;
                    let airPortlat = res.body.appendix.airports[0].latitude;
                    let airPortlong = res.body.appendix.airports[0].longitude;

                    console.log("logging flight id " + flightId);

                    FlightTrackdata = `Your flight Id is ${flightId}  the maximum positions is ${maxPositions}  and flight number is ${fLNumber} the carrier code is  ${carrierCode} and the departure date is today and the airport name is ${airPortName} and the airport city name is ${airPortCity} and the country name is ${airPortCountryName} the lattitude are ${airPortlat} logitude is ${airPortlong}. Do you want to continue. `;
                    assistant.ask(FlightTrackdata);
                    //  response.say(JSON.stringify(res));
                    response.send();
                });
            return p;
        } else {
            assistant.ask("please tell me your Flight Number");
        }
    }
    // ---------------------------------------search by date------------------
    // function provideDetailsByDate(request, response) {
    //     var flightNumber_url = assistant.getArgument('flightNumber');
    //     console.log("the response is " + response);
    //     if (flightNumber_url) {
    //         var p = Promise.resolve();
    //         var getDetails = {
    //             method: 'GET',
    //             // 933427129 flight number
    //             // https://api.flightstats.com/flex/flightstatus/rest/v2/json/flight/tracks/AA/100/arr/2017/09/14?appId=6aac18a6&appKey=40a7e359cb020a07ead5159c2d5d8162&utc=false&includeFlightPlan=false&maxPositions=2
    //             uri: `https://api.flightstats.com/flex/flightstatus/rest/v2/json/flight/track/${flightNumber_url}?appId=6aac18a6&appKey=40a7e359cb020a07ead5159c2d5d8162&includeFlightPlan=false&maxPositions=2`,
    //             json: true,
    //             resolveWithFullResponse: true,
    //         };
    //         console.log("get details log " + getDetails);
    //         p = rp(getDetails)
    //             .then(function (res) {
    //                 let flightId = res.body.request.flightId.requested;
    //                 let maxPositions = res.body.request.maxPositions.requested;
    //                 let fLNumber = res.body.flightTrack.flightNumber;
    //                 let carrierCode = res.body.flightTrack.carrierFsCode;
    //                 let departureDate = res.body.flightTrack.departureDate.dateLocal;
    //                 let airName = res.body.appendix.airlines[0].name;
    //                 let airPortName = res.body.appendix.airports[0].name;
    //                 let airPortCity = res.body.appendix.airports[0].city;
    //                 let airPortCountryName = res.body.appendix.airports[0].countryName;
    //                 let airPortregionName = res.body.appendix.airports[0].regionName;
    //                 let airPortlat = res.body.appendix.airports[0].latitude;
    //                 let airPortlong = res.body.appendix.airports[0].longitude;

    //                 console.log("logging flight id " + flightId);

    //                 FlightTrackByDatedata = `Your flight Id is ${flightId}  the maximum positions is ${maxPositions}  and flight number is ${fLNumber} the carrier code is  ${carrierCode} and the departure date is today and the airport name is ${airPortName} and the airport city name is ${airPortCity} and the country name is ${airPortCountryName} the lattitude are ${airPortlat} logitude is ${airPortlong} `;
    //                 assistant.ask(FlightTrackByDatedata);
    //                 //  response.say(JSON.stringify(res));
    //                 response.send();
    //             });
    //         return p;
    //     } else {
    //         assistant.ask("please tell me your Flight Number");
    //     }
    // }




    let actionMap = new Map();
    let actionSee = actionMap.get(TrackByFlight_ID);
    console.log("this is action" + actionSee);

    actionMap.set(TrackByFlight_ID, provideDetailsByID);
    // actionMap.set(TrackByStarting_Date, provideDetailsByDate);
    actionMap.set(WelcomeIntent, WelcomeSpeach);
    assistant.handleRequest(actionMap);

});




app.get('/', function (req, res) {
    res.send("Server is up and running.")
});

var server = app.listen(app.get('port'), function () {
    console.log('App listening on port %s', server.address().port);
});