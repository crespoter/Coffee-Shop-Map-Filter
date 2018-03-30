var express = require('express');
var app = express();
var pg = require('pg');

var username = "postgres";
var password = "blantest";
var host = "localhost"
var database = "sis" 
var conString = "postgres://" + username + ":" + password + "@" + host + "/" + database;



app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/public'));
    
app.get('/', (req, res) => {
    res.render('index.ejs');
});


app.get('/filter', (req, res) => {
    res.render('filter.ejs');
});

app.get('/api/getallshops', (req, res) => {
    var coffee_query = "SELECT * FROM cambridge_coffee_shops";
    var client = new pg.Client(conString);
    client.connect();
    var query = client.query(coffee_query);
    query.on("row", function (row, result) {
        result.addRow(row);
    });

    query.on("end", function (result) {
        res.json(result.rows);
        client.end();
    });
   
});
app.get('/api/filter', (req, res) => {
    var name = req.query.shop_name;
    var pin_start = req.query.pin_start;
    var pin_end = req.query.pin_end;
    var address = req.query.address;
    var client = new pg.Client(conString);
    client.connect();
    var query = "SELECT * FROM cambridge_coffee_shops";
    var firstFilter = true;
    if (name != '' || pin_start != '' || address != '' || pin_end != '') {
        query += " WHERE";
        if (name != '') {
            query += " name='" + name+"'";
            firstFilter = false;
        }
        if (pin_start != '')
        {
            if (!firstFilter)
                query += " AND";
            query += " zip<'" + pin_start+"'";
            firstFilter = false;
        }
        if (pin_start != '') {
            if (!firstFilter)
                query += " AND";
            query += " zip>'" + pin_end+"'";
            firstFilter = false;
        }
        if (address != '') {
            if (!firstFilter)
                query += " AND";
            query += " address='" + address+"'";
            firstFilter = false;
        }
    }
    console.log(query);
    var sql_query = client.query(query);
    sql_query.on("row", function (row, result) {
        result.addRow(row);
    });

    sql_query.on("end", function (result) {
        console.log(result.rows);
        res.json(result.rows);
        client.end();
    });
});






app.listen(process.env.PORT | 80, '0.0.0.0', () => {
    console.log("listening to port " + (process.env.PORT | 80));
});