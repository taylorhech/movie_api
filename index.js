const express = require('express'),
    morgan = require('morgan'),
    bodyParser = require('body-parser'),
    uuid = require('uuid');

const app = express();
app.use(bodyParser.json()); //middleware application for body-parser

//Logging middleware morgan
app.use(morgan('common'));

let topTenMovies = [
    {
        title: 'Your Name',
        director: 'Makoto Shinkai',
        genre: 'Fantasy/Romance',
        year: 2016
    },
    {
        title: 'Past Lives',
        director: 'Celine Song',
        genre: 'Romance/Drama',
        year: 2023
    },
    {
        title: 'Coco',
        director: 'Adrian Molina, Lee Unkrich',
        genre: 'Fantasy/Adventure',
        year: 2017
    },
    {
        title: 'Ice Age: Dawn of the Dinosaurs',
        director: 'Carlos Saldanha',
        genre: 'Adventure/Comedy',
        year: 2009
    },
    {
        title: 'Bullet Train',
        director: 'David Leitch',
        genre: 'Action/Comedy',
        year: 2022
    },
    {
        title: 'Spider-Man: Across the Spider-Verse',
        director: 'Joaquim Dos Santos, Kemp Powers, Justin K. Thompson',
        genre: 'Action/Comedy',
        year: 2023
    },
    {
        title: 'How to Train Your Dragon',
        director: 'Dean DeBlois, Chris Sanders',
        genre: 'Family/Fantasy',
        year: 2010
    },
    {
        title: 'Howl\'s Moving Castle',
        director: 'Hayao Miyazaki',
        genre: 'Fantasy/Adventure',
        year: 2004
    },
    {
        title: 'Rush Hour',
        director: 'Brett Ratner',
        genre: 'Comedy/Action',
        year: 1998
    },
    {
        title: 'Coherence',
        director: 'James Ward Byrkit',
        genre: 'Sci-fi/Thriller',
        year: 2013
    },
];

let directors = [
    {
        name: 'Makoto Shinkai',
        bio: 'Makoto Niitsu, known as Makoto Shinkai, is a Japanese filmmaker and novelist know for his anime feature films.',
        birthYear: 1973,
        deathYear: 'N/A'
    },
    {
        name: 'Celine Song',
        bio: 'Celine Song is a Korean-Canadian director, playwright, and screenwriter, receiving critical acclaim for her directorial film debut of Past Lives.',
        birthYear: 1988,
        deathYear: 'N/A'
    },
    {
        name: 'Adrian Molina',
        bio: 'Adrian Molina is an American animator, storyboad artist, and screenwriter who works for Pixar.',
        birthYear: 1985,
        deathYear: 'N/A'
    },
    {
        name: 'Lee Unkrich',
        bio: 'Lee Edward Unkrich is an American film director, editor, and writer best known for his work with animation studio, Pixar.',
        birthYear: 1967,
        deathYear: 'N/A'
    },
    {
        name: 'Carlos Saldanha',
        bio: 'Carlos Saldanha is a Brazilian animator, director, producer, and voice actor of animated films who worked with Blue Sky Studios until its closer in 2021.',
        birthYear: 1965,
        deathYear: 'N/A'
    },
    {
        name: 'David Leitch',
        bio: 'David Leitch is an American filmmaker, stunt performer, stunt coordinator, and actor who made his directorial debut on the 2014 action film John Wick.',
        birthYear: 1975,
        deathYear: 'N/A'
    }
];

let users = [
    {
        id: 1,
        name: 'Jane',
        favoriteMovies: []
    },
    {
        id: 2,
        name: 'Samuel',
        favoriteMovies: []
    },
    {
        id: 3,
        name: 'Mary',
        favoriteMovies: []
    },
];

//GET requests
//Welcome route
app.get('/', (req, res) => {
    res.send('Welcome to myFlix Movies!');
});

//CREATE- new user registration
app.post('/users', (req, res) => {
    const newUser = req.body;

    if (newUser.name) {
        newUser.id = uuid.v4();
        users.push(newUser);
        res.status(201).json(newUser)
    } else {
        res.status(400).send('users need names')
    }
})

//UPDATE- allows users to update user info
app.put('/users/:id', (req, res) => {
    const { id } = req.params;
    const updatedUser = req.body;

    let user = users.find( user => user.id == id);

     if (user) {
        user.name = updatedUser.name;
        res.status(200).json(user);
     } else {
        res.status(400).send('no such user')
     }
})

//CREATE- adds a movie to user's list of favorites
app.put('/users/:id/:movieTitle', (req, res) => {
    const { id, movieTitle } = req.params;

    let user = users.find( user => user.id == id);

     if (user) {
        user.favoriteMovies.push(movieTitle);
        res.status(200).send(`${movieTitle} has been added to user ${id}'s array`);
     } else {
        res.status(400).send('no such user')
     }
})

//DELTE- removes a movie from user's list of favorites
app.delete('/users/:id/:movieTitle', (req, res) => {
    const { id, movieTitle } = req.params;

    let user = users.find( user => user.id == id);

     if (user) {
        user.favoriteMovies = user.favoriteMovies.filter( title => title !== movieTitle);
        res.status(200).send(`${movieTitle} has been removed from user ${id}'s array`);
     } else {
        res.status(400).send('no such user')
     }
})

//DELTE- deregisters existing users
app.delete('/users/:id', (req, res) => {
    const { id } = req.params;

    let user = users.find( user => user.id == id);

     if (user) {
        users = users.filter( user => user.id != id);
        res.status(200).send(`user ${id} has been deleted`);
     } else {
        res.status(400).send('no such user')
     }
})

//READ- returns a list of ALL movies
app.get('/movies', (req, res) => {
    res.status(200).json(movies);
})

//READ- returns data about a single movie by title
app.get('/movies/:title', (req, res) => {
    const { title } = req.params;
    const movie = movies.find(movie => movie.Title === title);

    if (movie) {
        res.status(200).json(movie);
    } else {
        res.status(400).send('no such movie')
    }
})

//READ- returns data about a genre by name/title
app.get('/movies/genre/:genreName', (req, res) => {
    const { genreName } = req.params;
    const genre = movies.find(movie => movie.Genre.Name === genreName).Genre;

    if (genre) {
        res.status(200).json(genre);
    } else {
        res.status(400).send('no such genre')
    }
})

//READ- returns data about a director
app.get('/movies/directors/:directorName', (req, res) => {
    const { directorName } = req.params;
    const director = movies.find(movie => movie.Director.Name === directorName).Director;

    if (director) {
        res.status(200).json(director);
    } else {
        res.status(400).send('no such director')
    }
})


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