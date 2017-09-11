const Assistant = require('actions-on-google').ApiAiApp;
let express = require('express');
let bodyParser = require('body-parser');
let request_lib = require('request'); // for sending the http requests to Numbers API
let assert = require('assert');

let app = express();

app.set('port', (process.env.PORT || 8080));
app.use(bodyParser.json({
    type: 'application/json'
}));

const realZombies = "realZombies";

app.post('/', function (request, response) {
    const assistant = new Assistant({
        request: request,
        response: response
    });

    // function provideFact(assistant) {
    //     var number;
    //     var url = NUMBERS_API_BASE_URL;
    //     var type;

    //     for (var fact_type in FACT_TYPES) {
    //         console.log('fact_type=' + fact_type);
    //         if (assistant.getArgument(fact_type) != null) {
    //             type = fact_type;
    //             break;
    //         }
    //     }

    //     if (type == null) type = DEFAULT_TYPE;
    //     assert(typeof (type) != "undefined", 'fact type is undefined');

    //     console.log("type=" + type);

    //     if (type == MATH_ARGUMENT || type == DEFAULT_TYPE) {
    //         number = assistant.getArgument(NUMBER_ARGUMENT);
    //     } else {
    //         console.log("Arg=" + assistant.getArgument(type));
    //         number = extractNumber(assistant.getArgument(type), type);
    //     }

    //     assert(number, 'number is null');
    //     console.log("number = " + number);

    //     url += "/" + number + "/" + FACT_TYPES[type];
    //     sendRequest(url, callback);
    // }

      function provideDetails(assistant) {
    var reply = "Welcome to Number Facts! What number is on your mind?";
    // ask vs. tell -> expects reply vs. doesn't expect reply
    assistant.ask(reply);
  }

    let actionMap = new Map();
    actionMap.set(realZombies, provideDetails);
    assistant.handleRequest(actionMap);
});



var server = app.listen(app.get('port'), function () {
    console.log('App listening on port %s', server.address().port);
});