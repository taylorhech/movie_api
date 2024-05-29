const express = require('express'),
    morgan = require('morgan');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('common')); //Logging middleware morgan


let auth = require('./auth')(app); //Ensures Express is available in auth.js
const passport = require('passport');
require('./passport');

const mongoose = require('mongoose');
const Models = require('./models.js');
const Movies = Models.Movie;
const Users = Models.User;
mongoose.connect('mongodb://localhost:27017/cfDB');

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

//CREATE- check if user already exists & new user registration if they don't JSON
app.post('/users', (req, res) => {
    Users.findOne({ Username: req.body.Username})
    .then((user) => {
        if(user) {
            return res.status(400).send(req.body.Username + 'already exists');
        } else {
            Users
            .create({
                Username: req.body.Username,
                Password: req.body.Password,
                Email: req.body.Email,
                Birthday: req.body.Birthday
            })
            .then((user) =>{res.status(201).json(user)})
            .catch((error) => {
                console.error(error);
                res.status(500).send('Error: ' + error);
            })
        }
    })
    .catch((error) => {
        console.error(err);
        res.status(500).send('Error: ' + error);
    });
});

//UPDATE- allows users to update user info JSON
app.put('/users/:Username', passport.authenticate('jwt', { session: false }), (req, res) => {
    {
        //CONDITION TO CHECK ADDED HERE
        if(req.user.Username !== req.user.Username){
            return res.status(400).send('Permission denied');
        }
    }
    //CONDITION ENDS
    Users.findOneAndUpdate({ Username: req.params.Username }, { $set:
        {
            Username: req.body.Username,
            Password: req.body.Password,
            Email: req.body.Email,
            Birthday: req.body.Birthday
        }
    },
    { new: true }) //makes sure the updated document is returned
    .then((updatedUser) => {
        res.json(updatedUser);
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
    });

});

//CREATE- adds a movie to user's list of favorites JSON
app.post('/users/:Username/movies/:MovieID', passport.authenticate('jwt', { session: false }), (req, res) => {
    Users.findOneAndUpdate({ Username: req.params.Username}, {
        $push: { FavoriteMovies: req.params.MovieID }
    }, 
    { new: true}) //makes sure the updated document is returned
    .then((updatedUser) => {
        res.json(updatedUser);
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
    });
});

//DELTE- removes a movie from user's list of favorites
app.delete('/users/:Username/movies/:MovieID', passport.authenticate('jwt', { session: false }), (req, res) => {
    Users.findOneAndUpdate({ Username: req.params.Username}, {
        $pull: { FavoriteMovies: req.params.MovieID}
    },
    {new: true})
    .then((updatedUser) => {
        res.json(updatedUser);
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
    });
});

//DELTE- deregisters existing users
app.delete('/users/:Username', passport.authenticate('jwt', { session: false }), (req, res) => {
    Users.findOneAndDelete({ Username: req.params.Username })
    .then((user) => {
        if (!user) {
            res.status(400).send(req.params.Username + ' was not found');
        } else {
            res.status(200).send(req.params.Username + ' was deleted.');
        }
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
    });
});

//READ- returns a list of ALL movies JSON
app.get('/movies', passport.authenticate('jwt', { session: false }), (req, res) => {
    Movies.find()
    .then((movies) => {
        res.status(200).json(movies);
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
    });
});

//READ- returns data about a single movie by title JSON
app.get('/movies/:Title', passport.authenticate('jwt', { session: false }), (req, res) => {
    Movies.findOne({ Title: req.params.Title }) 
    .then((movie) => {
        res.json(movie);
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
    });
});

//READ- returns data about a genre by name/title JSON
app.get('/movies/genre/:genreName', passport.authenticate('jwt', { session: false }), (req, res) => {
    Movies.findOne({ "Genre.Name": req.params.genreName })
    .then((movie) => {
        res.json(movie);
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
    });
})

//READ- returns data about a director JSON
app.get('/movies/director/:directorName', passport.authenticate('jwt', { session: false }), (req, res) => {
    Movies.findOne({ "Director.Name": req.params.directorName })
    .then((directors) => {
        res.json(directors);
    })
    .catch((err) => {
        console.error(err);
        res.status(400).send("Error: " + err);
    });
});

//READ- returns a list of ALL users JSON
app.get('/users', passport.authenticate('jwt', { session: false }), (req, res) => {
    Users.find()
    .then((users) => {
        res.status(201).json(users);
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
    });
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