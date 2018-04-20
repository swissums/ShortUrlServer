const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const router = express.Router();
const shortUrl = require('./ShortUrl.js')
const model = require('./model.js')
const table = require('./config.js').table

//Normal express config 
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// app.use(require('method-override')());
app.use(express.static(__dirname + '/public'));

// Create a new table if there isn't one already defined in config.js
table.length > 0 ? model.initTable(table, '20000') : model.initTable('urlList', '20000')

// Init Routes
app.use(router.use('/api', require('./routes.js')));

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.json({'errors': {
      message: err.message
    }});
  });
  

app.listen(8080, () => console.log('Example app listening on port 8080'))