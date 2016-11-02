var express = require('express');
var compression = require('compression');
var bodyParser = require('body-parser');
var errorhandler = require('errorhandler');
var app = express();

app.use(compression());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/dist/'));
app.use(errorhandler());

process.on('uncaughtException', function (err) {
  if (err) console.log(err, err.stack);
});

// redirect all others to the index (HTML5 history)
app.get('*', function (req, res) {
  res.render('index');
});

// Start server
app.listen(4200, function () {
  console.log("Documentation Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});
