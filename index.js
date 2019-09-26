const Joi = require('joi');
const logger = require('./logger');
const express = require('express');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true })); //key=value&key=value
app.use(express.static('public'));

app.use(logger);

app.use(function(req, res, next) {
    console.log('Authenticating...');
    next();
});

const courses = [
    { id: 1, name: 'course1' },
    { id: 2, name: 'course2' },
    { id: 3, name: 'course3' },
    { id: 4, name: 'course4' },
];

app.get('/', (req, res) => {
    res.send('Hello world');
});

app.get('/api/courses', (req, res) => {
    res.send(courses);
});

app.get('/api/courses/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) return res.status(404).send('The course with the given ID was not found');
    res.send(course);
});

app.post('/api/courses', (req, res) => {

    const result = validateCourse(req.body);

    if (result.error) return res.status(400).send(result.error.details[0].message);

    const course = {
        id: courses.length + 1,
        name: req.body.name
    };

    courses.push(course);
    res.send(course);
});

app.put('/api/courses/:id', (req, res) => {
    //Lookup the course
    //If not exesting, return 404
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) return res.status(404).send('The course with the given ID was not found');

    //Validate
    //Object destructuring
    const { error } = validateCourse(req.body); //result.error
    if (error) return res.status(400).send(error.details[0].message);

    //Update course
    //Return updated course
    course.name = req.body.name;
    res.send(course);

});

app.delete('/api/courses/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) return res.status(404).send('The course with the given ID was not found');

    //Remove course
    const index = courses.indexOf(course);
    courses.splice(index, 1);

    res.send(course);
});

//Validation
function validateCourse(course) {
    const schema = {
        name: Joi.string().min(3).required()
    };
    return result = Joi.validate(course, schema);
};

// PORT
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Listening on port ${port}...`);
});