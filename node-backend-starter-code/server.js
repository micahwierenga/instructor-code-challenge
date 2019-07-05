const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const flash = require('connect-flash');
const auth = require('./auth');
const router = require('./routes/routes.js');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

let db = require('./models');
let User = db.models.User;
let FavoriteMovie = db.models.FavoriteMovie;

app.use('/', express.static(path.join(__dirname, 'public')));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

require('./config/passport')(passport);


app.use(function(req, res, next) {
  res.locals.currentUser = req.user;
  currentSessionUser = res.locals.currentUser;
  console.log('currentSessionUser: ', currentSessionUser);
  next();
});

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE" // what matters here is that OPTIONS is present
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization", "Access-Control-Allow-Origin");
  next();
});
app.use(router);

app.get('/favorites', function(req, res){
  let data = fs.readFileSync('./data.json');
  res.setHeader('Content-Type', 'application/json');
  res.send(data);
});

app.get('favorites', function(req, res){
  if(!req.body.name || !req.body.oid){
    res.send("Error");
    return
  }
  
  let data = JSON.parse(fs.readFileSync('./data.json'));
  data.push(req.body);
  fs.writeFile('./data.json', JSON.stringify(data));
  res.setHeader('Content-Type', 'application/json');
  res.send(data);
});

app.listen(3000, function(){
  console.log("Listening on port 3000");
});
