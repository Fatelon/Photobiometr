try {
  const config = require('../config');
  Object.assign(process.env, config);
} catch (e) {
  console.log('No config file');
}

import http from 'http';
import debug from 'debug';
import app from './app';

const routes = require('./routes');

export interface NsEnvI {
  PORT: string;
}

const port = process.env.PORT || 3000;

const server = http.createServer(app);

app.set('port', port);
app.use(routes);
global['exifs'] = {};
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

function normalizePort(val) {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }

  if (port >= 0) {
    return port;
  }

  return false;
}

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof port === 'string'
    ? `Pipe ${port}`
    : `Port ${port}`;

  switch (error.code) {
    case 'EACCES':
      console.error(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
}

function onListening() {
  const address = server.address() || 'server address error';
  const bind = typeof address === 'string'
    ? `pipe ${address}`
    : `port ${address.port}`;
  console.log(`Listening on ${bind}`);
  debug(`Listening on ${bind}`);
}
