
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , svg = require('./routes/svg')
  , http = require('http')
  , path = require('path')
  , store = express.session.MemoryStore;


var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);
app.post('/svg/png', svg.png);
app.post('/svg/page', svg.page);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
