const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const PORT = 3000;
const passport = require('passport');
const session = require('express-session');
const expressLayouts = require('express-ejs-layouts');
let ejs = require('ejs');

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});
app.use(bodyParser.json());
app.use(express.urlencoded({extended: false}));

app.set('view engine', 'ejs');

app.use(session({
    secret: 'cbs2020',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(expressLayouts);

//Routes
app.use('/', require('./routes/home'));
app.use('/users', require('./routes/users'));

const db = require('./Models/config').MongoURL;

mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connection to DB established.'))
    .catch(err => console.log(err));