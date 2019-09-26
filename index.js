const config = require('config');
const Joi = require('joi');
const helmet = require('helmet');
const debug = require('debug')('app:startup');
const morgan = require('morgan');
const logger = require('./middleware/logger');
const courses = require('./routes/courses');
const home = require('./routes/home');
const express = require('express');
const app = express();

app.set('view engine', 'pug');
app.set('views', './views'); //default

app.use(express.json());
app.use(express.urlencoded({ extended: true })); //key=value&key=value
app.use(express.static('public'));
app.use(helmet());
app.use('/api/courses', courses);
app.use('/', home);

//Configuration
console.log(`Application name: ${config.get('name')}`);
console.log(`Mail Server: ${config.get('mail.host')}`);
console.log(`Mail Password: ${config.get('mail.password')}`);

if (app.get('env') === 'development') {
    // console.log('Morgan is enabled');
    // process.env.NODE_ENV
    debug('Morgan is enabled');
    app.use(morgan('tiny'));
};

app.use(logger);

app.use(function (req, res, next) {
    console.log('Authenticating...');
    next();
});

// PORT
const port = process.env.PORT || 3008;
app.listen(port, () => {
    console.log(`Listening on port ${port}...`);
});