const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router("data/db.json");
const middlewares = jsonServer.defaults();
const port = process.env.PORT || 3500; // can by changed

server.use(middlewares);
server.use(router);

server.listen(port);
