const Joi = require('joi');
const express = require('express');
const app = express();

app.use(express.json());

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
    if (!course) res.status(404).send('The course with the given ID was not found');
    res.send(course);
});

app.post('/api/courses', (req, res) => {

    const result = validateCourse(req.body);

    if (result.error) {
        res.status(400).send(result.error.details[0].message);
        return;
    }

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
    if (!course) res.status(404).send('The course with the given ID was not found');

    //Validate
    //If invalid, return 404 - Bad request
        
    //Object destructuring
    const { error } = validateCourse(req.body); //result.error

    if (error) {
        res.status(400).send(error.details[0].message);
        return;
    }

    //Update course
    //Return updated course
    course.name = req.body.name;
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