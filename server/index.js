const config = require("./config/default");
const app = require("./server");
const socket = require("./libs/socket");

const server = app.listen(config.port);

socket(server);
