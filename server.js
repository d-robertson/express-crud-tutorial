const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static('public'));

app.set('view engine', 'ejs');

var db;

MongoClient.connect('mongodb://<put user name here>:<put password here and get rid of arrows>@ds025752.mlab.com:25752/my-star-wars-quotes', (err, database) => {

  if(err) return console.log(err);

  db = database;

  app.listen(3000, function(){
  console.log('listening on 3000');
  });

});

app.get('/', (req, res) =>{
 
  db.collection('quotes').find().toArray((err, result) => {
    if(err) return console.log(err);

    res.render('index.ejs', {quotes: result});
  });
});

app.post('/quotes', (req, res) => {
  
  db.collection('quotes').save(req.body, (err, result) => {
    if(err) return console.log('err');

    console.log('saved to database');

    res.redirect('/');
  });

});

app.put('/quotes', (req, res) => {
  console.log(db.collection);
  db.collection('quotes').findOneAndUpdate({name: 'Derek'}, {
    $set: {
      name: req.body.name,
      quote: req.body.quote
    }
  }, {
      sort: {_id:-1},
      upsert: true
  }, (err, result) => {
    if(err) return res.send(err);
    res.send(result); 
  });
});

