const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('index', {
        title: 'My Express App',
        message: 'HELLO'
    });
    // res.send('Hello world');
});

module.exports = router;