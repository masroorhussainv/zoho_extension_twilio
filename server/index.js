/*
Copyright (c) 2017, ZOHO CORPORATION
License: MIT
*/
var fs = require('fs');
var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var errorHandler = require('errorhandler');
var morgan = require('morgan');
var serveIndex = require('serve-index');
var https = require('https');
var chalk = require('chalk');

process.env.PWD = process.env.PWD || process.cwd();


var expressApp = express();
var port = 5000;

expressApp.set('port', port);
expressApp.use(morgan('dev'));
expressApp.use(bodyParser.json());
expressApp.use(bodyParser.urlencoded({ extended: false }));
expressApp.use(errorHandler());

expressApp.use('/', function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  next();
});

expressApp.get('/plugin-manifest.json', function (req, res) {
  res.sendfile('plugin-manifest.json');
});

// expressApp.use('/', express.static('app')); // To serve app from index.html in the root directory of project
// expressApp.use('/', serveIndex('app')); // To serve app from index.html in the root directory of project

// expressApp.use('/app', express.static('app')); // Commented to serve app from index.html in the root directory of project
// expressApp.use('/app', serveIndex('app')); // Commented to serve app from index.html in the root directory of project
// expressApp.use(express.static('public'));

expressApp.use(express.static('.')); // To serve app from index.html in the root directory of project

expressApp.get('/', function (req, res) {
  // res.redirect('/app'); // Commented to serve app from index.html in the root directory of project
});

var options = {
  key: fs.readFileSync('./key.pem'),
  cert: fs.readFileSync('./cert.pem')
};

// https.createServer(options, expressApp).listen(port, function () {
//   console.log(chalk.green('Zet running at ht' + 'tps://127.0.0.1:' + port));
//   console.log(chalk.bold.cyan("Note: Please enable the host (https://127.0.0.1:"+port+") in a new tab and authorize the connection by clicking Advanced->Proceed to 127.0.0.1 (unsafe)."));
// }).on('error', function (err) {
//   if (err.code === 'EADDRINUSE') {
//     console.log(chalk.bold.red(port + " port is already in use"));
//   }
// });
