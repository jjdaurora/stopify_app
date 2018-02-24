var express = require('express');
var session = require('express-session');
var passport = require('passport');
var app = express();
var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main"})); 
app.set("view engine", "handlebars");

// configure middleware
app.use(require('cookie-parser')());
app.use(session({
    secret: 'keyboard cat', resave: false,
    saveUninitialized: false
}));

// configure passport
require('./passport')(app);

var SpotifyClient = require('./spotifyClient');



app.get('/music', 
    // passport.authorize('spotify'), 
    function(req, res, next) {
        var client = new SpotifyClient({
            accessToken: req.user.accessToken
        });

        client.getTopTracks()
            .then(function(result) {
                
                res.render('toptracks', { track: result});
            })
            .catch(next);
    });



app.get('/nextTrack',
    // passport.authorize('spotify'), 
    function (req, res, next) {
        var client = new SpotifyClient({
            accessToken: req.user.accessToken
        });

        client.getNextTrack()
            .then(function(result) {

                res.render('nexttrack', { nextTrack: result });
            })
          .catch(next);

    });

// DO NOT sync in production
var db = require('./models');
db.sequelize.sync({force: true}).then(function() {
    app.listen(8888, function () {
        console.log('Server listening on 8888');
    });
});
