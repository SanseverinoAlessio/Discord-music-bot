const client = require('./client.js');
const fs = require('fs');
const commandsHandler = require('./handlers/commandsHandler.js')(client);
const eventsHandler = require('./handlers/eventsHandler.js')(client);
global.AbortController = require("node-abort-controller").AbortController;

client.login(process.env.token);
