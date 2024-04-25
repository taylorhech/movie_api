const express = require('express');
const morgan = require('morgan');
const app = express();

//Logging middleware morgan
app.use(morgan('common'));

let topTenMovies = [
    {
        title: 'Your Name',
        director: 'Makoto Shinkai'
    },
    {
        title: 'Past Lives',
        director: 'Celine Song'
    },
    {
        title: 'Coco',
        director: 'Adrian Molina, Lee Unkrich'
    },
    {
        title: 'Ice Age: Dawn of the Dinosaurs',
        director: 'Carlos Saldanha'
    },
    {
        title: 'Bullet Train',
        director: 'David Leitch'
    },
    {
        title: 'Spider-Man: Across the Spider-Verse',
        director: 'Joaquim Dos Santos, Kemp Powers, Justin K. Thompson'
    },
    {
        title: 'How to Train Your Dragon',
        director: 'Dean DeBlois, Chris Sanders'
    },
    {
        title: 'Howl\'s Moving Castle',
        director: 'Hayao Miyazaki'
    },
    {
        title: 'Rush Hour',
        director: 'Brett Ratner'
    },
    {
        title: 'Coherence',
        director: 'James Ward Byrkit'
    },
];

//GET requests
//Welcome route
app.get('/', (req, res) => {
    res.send('Welcome to myFlix Movies!');
});

//Movie route
app.get('/movies', (req, res) => {
    res.json(topTenMovies);
});

//Serves static documentation.html file from the 'public' folder
app.use('/documentation', express.static('public'));

//Error-handling middleware function
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

//Listens for requests
app.listen(8080, () => {
    console.log('This app is listening on port 8080.');
})