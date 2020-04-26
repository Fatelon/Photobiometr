const compression = require('compression');
const express = require('express');
const app = express();

const _app_folder = __dirname + '/dist/pbm';

const port = process.env.PORT || 80;

console.log('server start on port', port);

app.use(compression());
app.use(express.static(_app_folder));
app.use(function(req, res) {
  res.sendFile(_app_folder + '/index.html');
});

app.listen(port);
