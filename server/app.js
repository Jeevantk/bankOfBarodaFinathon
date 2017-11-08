var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var multer = require('multer');
var util = require('./routes/util');
var settings = require("./routes/settings");
var _ = require('underscore');
var mongoose = require('mongoose');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
// app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(multer({
	dest: './public/uploads/',
	onFileUploadComplete: function (file) {
		console.log("File uploaded to " + file.path);
	}
}));

global.cwd = __dirname;

app.use('/api/person', require('./routes/person'));

app.post('/', function(req, res) {
	if(!(req.files.uploaded instanceof Array)) {
		req.files.uploaded = [req.files.uploaded];
	}
	var arr = _.map(req.files.uploaded, function(ele) {
		return settings.prefix_path + ele.path.substr(6);
	});
	res.send(arr);
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});


module.exports = app;
