'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const games = require('./routes/games.js');
const enableWs = require('express-ws');

const app = express();
enableWs(app);
app.use(bodyParser.json());

app.use('/', express.static('public'));
app.use('/api/games', games);


let subscribers = {};
let cellsController = require('./controllers/cellsController.js');
cellsController.onEvent((event) => {
    const id = event.id;
    if (subscribers.hasOwnProperty(id)) {
        subscribers[id].forEach((subscriber) => {
           subscriber.send(JSON.stringify(event.cells));
        });
    }
});

app.ws('/events', (ws, req) => {
    const id = req.query.id;
    if (!subscribers.hasOwnProperty(id)) {
        subscribers[id] = [];
    }
    subscribers[id].push(ws);
    ws.id = id;
    console.log(`Subscribed: ${id}`);

    ws.on('close', () => {
        //subscribers[ws.id].remove(ws);
    });
});

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Listening on http://localhost:${port}`));
