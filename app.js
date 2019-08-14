const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const { mongodb : { DB_USER, DB_HOST, DB_NAME, DB_PASS }} = require('./config/keys');

const app = express();
// serving static files
app.use(express.static('public'));

// connecting to mongoDB
mongoose.connect(`mongodb+srv://${DB_USER}:${DB_PASS}@${DB_HOST}/${DB_NAME}?retryWrites=true&w=majority`, { useNewUrlParser : true })
    .then(()=> {
        console.log('connected to mongoDB')
    })
    .catch(err => console.log )

// EJS - Templating
app.use(expressLayouts);
app.set('view engine', 'ejs');

// BodyParser - since express.json() doesnot support form-data encoded body
app.use(express.urlencoded({extended : false}));

// Routes
app.use('/', require('./routes/'));
app.use('/users', require('./routes/users'));


const port  = process.env.PORT || 5000;
app.listen(port, () => console.log(`app is ready on- http://localhost:${port}`));