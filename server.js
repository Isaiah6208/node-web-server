const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

// Dynamic port variable for web deployment.
const port = process.env.PORT || 3080;

var app = express(); // Set to the result of calling express.

hbs.registerPartials(__dirname + '/views/partials');

// Tells express what view engine we would like to use.
app.set('view engine', 'hbs');



// Gets HTTP object info
app.use((req, res, next) => {
    var now = new Date().toString();
    var log = `${now}: ${req.method} ${req.url}`;
    
    console.log(log);
    // Creates a file with a log of each HTTP Request.
    fs.appendFile('server.log', log + '\n', (err) =>{
        if (err)
        {
            console.log('Unable to append to server.log')
        }
    })
    next();
});

// Defines a middleware that puts the entire website on hold.
// Has to be ordered first, order matters.
app.use((req, res, next) =>{
    res.render('maintenance');
});

// Set up the web server locally. This looks for files within this specific absolute path directory.
app.use(express.static(__dirname + '/public'));

hbs.registerHelper('getCurrentYear', () =>{
    return new Date().getFullYear();
});


hbs.registerHelper('screamIt', (text) =>{
    return text.toUpperCase();
});

//Set up HTTP Route handlers
app.get('/', (req, res) => {
    
res.render('home', { // User will see this when they visit the website.
    pageTitle: 'Home Page', // Dynamic usage > Static Usage, hence why we set these in place so that it's easily mutable
    welcomeMessage: 'Welcome!',
}) 
});


app.get('/about', (req, res) => {
res.render('about', {
    pageTitle: 'About Page',
    currentYear: 2018
});
});



app.listen(port, function() {
    console.log('Our app is running on Port: ' + port);
});