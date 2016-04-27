"use strict";

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
var fs = require('fs');

var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
        res.sendStatus(200);
    }
    else {
        next();
    }
};
app.use(allowCrossDomain);

app.get('/:action', (req, res) => {
    routeGet(req.params.action,req.body)
        .then( data => res.send(data));
});

app.post('/:action', jsonParser, (req, res) => {
    routePost(req.params.action,req.body)
        .then( data => res.send(data));
});

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(3000, () => {
    console.log('Listening on port 3000!');
});

function routeGet(action,data,callback) {

    return new Promise((resolve, reject) => {
        let filename = '';
        switch (action) {
            case "participants":
                filename = 'server/participants.json';
                break;
            case "workshops":
                filename = 'server/workshops.json';
                break;
        }
        fs.readFile(filename, "utf-8", (err, data) => {
            if (err)
                reject(err);

            resolve(data);
        });
    });

}

function routePost(action,data,callback) {
    if (data === undefined)
        return {};

    return new Promise((resolve, reject) => {
        let filename = '';
        switch (action) {
            case "participants":
                filename = 'server/participants.json';
                break;
            case "workshops":
                filename = 'server/workshops.json';
                break;
        }
        fs.writeFile(filename,JSON.stringify(data), (err) => {
            if (err)
                reject(err);

            resolve({"status": "success"});
        });
    })
}
