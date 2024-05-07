const express = require('express'),
    morgan = require('morgan'),
    bodyParser = require('body-parser'),
    uuid = require('uuid');

const app = express();
app.use(bodyParser.json()); //middleware application for body-parser

//Logging middleware morgan
app.use(morgan('common'));

let movies = [
    {
        Title: 'Your Name',
        Director: {
            Name: 'Makoto Shinkai',
            Bio: 'Makoto Niitsu, known as Makoto Shinkai, is a Japanese filmmaker and novelist know for his anime feature films.',
            Birth: 1973
        },
        Genre: {
            Name: 'Fantasy',
            Description: 'Fantasy films include fantastic themes, usually magic, supernatural events, mythology, folklore, or exoctic fantasy worlds.'
        },
        Year: 2016
    },
    {
        Title: 'Past Lives',
        Director: {
            Name: 'Celine Song',
            Bio: 'Celine Song is a Korean-Canadian director, playwright, and screenwriter, receiving critical acclaim for her directorial film debut of Past Lives.',
            Birth: 1988
        },
        Genre: {
            Name: 'Drama',
            Description: 'In film and television, drama is a category narrative fiction (or semi-fiction) intended to be more serious than humurous in tone.'
        },
        Year: 2023
    },
    {
        Title: 'Coco',
        Director: [ 
            {
            Name: 'Adrian Molina',
            Bio: 'Adrian Molina is an American animator, storyboad artist, and screenwriter who works for Pixar.',
            Birth: 1985
        }, {
            Name: 'Lee Unkrich',
            Bio: 'Lee Edward Unkrich is an American film director, editor, and writer best known for his work with animation studio, Pixar.',
            Birth: 1967
        }],  
        Genre: {
            Name: 'Fantasy',
            Description: 'Fantasy films include fantastic themes, usually magic, supernatural events, mythology, folklore, or exoctic fantasy worlds.'
        },
        Year: 2017
    },
    {
        Title: 'Ice Age: Dawn of the Dinosaurs',
        Director: {
            Name: 'Carlos Saldanha',
            Bio: 'Carlos Saldanha is a Brazilian animator, director, producer, and voice actor of animated films who worked with Blue Sky Studios until its closer in 2021.',
            Birth: 1965
        },
        Genre: {
            Name: 'Comedy',
            Description: 'In film, the comedy category emphasizes humor, is designed to amuse audiences, and make them laugh.'
        },
        Year: 2009
    },
    {
        Title: 'Bullet Train',
        Director: {
            Name: 'David Leitch',
            Bio: 'David Leitch is an American filmmaker, stunt performer, stunt coordinator, and actor who made his directorial debut on the 2014 action film John Wick.',
            Birth: 1975
        },
        Genre: {
            Name: 'Comedy',
            Description: 'In film, the comedy category emphasizes humor, is designed to amuse audiences, and make them laugh.'
        },
        Year: 2022
    },
    {
        Title: 'Spider-Man: Across the Spider-Verse',
        Director: 'Joaquim Dos Santos, Kemp Powers, Justin K. Thompson',
        Genre: 'Action',
        Year: 2023
    },
    {
        Title: 'How to Train Your Dragon',
        Director: 'Dean DeBlois, Chris Sanders',
        Genre: {
            Name: 'Fantasy',
            Description: 'Fantasy films include fantastic themes, usually magic, supernatural events, mythology, folklore, or exoctic fantasy worlds.'
        },
        Year: 2010
    },
    {
        Title: 'Howl\'s Moving Castle',
        Director: 'Hayao Miyazaki',
        Genre: {
            Name: 'Fantasy',
            Description: 'Fantasy films include fantastic themes, usually magic, supernatural events, mythology, folklore, or exoctic fantasy worlds.'
        },
        Year: 2004
    },
    {
        Title: 'Rush Hour',
        Director: 'Brett Ratner',
        Genre: {
            Name: 'Comedy',
            Description: 'In film, the comedy category emphasizes humor, is designed to amuse audiences, and make them laugh.'
        },
        Year: 1998
    },
    {
        Title: 'Coherence',
        Director: 'James Ward Byrkit',
        Genre: {
            Name: 'Sci-fi',
            Description: 'The science fiction genre uses speculative, fictional science-based depictions of phenomena that are not fully accepted by mainstream science, such as extraterrestrial lifeforms, spacecraft, robots, cyborgs, mutants, interstellar travel, time travel, or other technologies.'
        },
        Year: 2013
    },
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
app.post('/users/:id/:movieTitle', (req, res) => {
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
    const genre = movies.find( movie => movie.Genre.Name === genreName).Genre;

    if (genre) {
        res.status(200).json(genre);
    } else {
        res.status(400).send('no such genre')
    }
})

//READ- returns data about a director
app.get('/movies/director/:directorName', (req, res) => {
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