var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var pg = require('pg');

// globals
var port = process.env.PORT || 8000;
var config = {
  database: 'joins',
  host: 'localhost',
  port: 5432, // always use this port for localhost postgresql
  max: 12
};

var pool = new pg.Pool(config);

// static folder
app.use(express.static('public'));
app.use(bodyParser.urlencoded({
  extended: true
}));

// spin up server
app.listen(port, function() {
  console.log('server up on', port);
});

// base url
app.get('/', function(req, res) {
  console.log('base url hit');
  res.sendFile('index.html');
});

app.get('/customers', function(req, res) {
  console.log('/customer url hit');
  pool.connect(function(err, connection, done) {
    if (err) {
      console.log(err);
      done();
      res.send(400);
    } else {
      console.log('connected to todo db');
      var customerNames = [];
      var results = connection.query("SELECT * FROM customers");
      results.on('row', function(row) {
        customerNames.push(row);
      }); //end
      results.on('end', function() {
        done();
        res.send(customerNames);
      })
    }
  });
});

app.get('/orders/:id', function(req, res) {
  var id = req.params.id;
  pool.connect(function(err, connection, done) {
    if (err) {
      console.log(err);
      done();
      res.send(400);
    } else {
      console.log('connected to todo db');
      var customerOrders = [];
      var orderResults = connection.query(
        "SELECT orders.id, line_items.unit_price, quantity, description, street, city, state, zip FROM customers " +
        "JOIN addresses ON customers.id = addresses.customer_id " +
        "JOIN orders ON addresses.id = orders.address_id " +
        "JOIN line_items ON orders.id = line_items.order_id " +
        "JOIN products ON line_items.product_id = products.id " +
        "WHERE customers.id =" + id
      );
      orderResults.on('row', function(row) {
        customerOrders.push(row);
      }); //end
      orderResults.on('end', function() {
        done();
        res.send(customerOrders);
      })
    }
  });
});
