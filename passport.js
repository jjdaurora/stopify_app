var passport = require('passport');
var SpotifyStrategy = require('passport-spotify').Strategy;

var db = require('./models');

module.exports = function(app) {

    var client_id = '2a6e2c84b24e4e14ac4369976b06b7d1'; // Your client id
    var client_secret = 'cddf0d9dfa594ab8b8551bcd4ccd3acc';

    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function (userId, done) {
        db.User.findById(userId)
            .then(function(user) {
                done(null, user);
            })
            .catch(function(err) {
                done(err);
            });
    });

    passport.use(new SpotifyStrategy(
        {
          clientID: client_id,
          clientSecret: client_secret,
          callbackURL: "http://localhost:8888/callback",
          scope: ["user-read-email", "user-read-private", "user-top-read", "streaming"]
        },
        function(accessToken, refreshToken, expires_in, profile, done) {
          db.User.findOrCreate({
            where: {
              spotifyId: profile.id
            },
            defaults: {
              userName: profile.displayName,
              userEmail: profile.emails[0].value,
              spotifyId: profile.id,
              accessToken: accessToken,
            //   userImage: profile.photos[0].value,
              refreshToken: refreshToken
            }
          })
            .then(function(users) {
              done(null, users[0]);
            })
            .catch(function(err) {
              done(err);
            });
        }
      ));

    app.use(passport.initialize());
    app.use(passport.session());
    app.use(function(req, res, next) {
        if (
            req.path === '/login' || req.path === '/logout' || req.path === '/callback'
            || req.isAuthenticated()
        ) {
            return next();
        }

        res.redirect('/login');
    });

    app.get('/callback',
        passport.authenticate('spotify', { failureRedirect: '/login' }),

        function (req, res) {
            // Successful authentication, redirect home.
            res.redirect('/');
        });

    app.get('/login',
        passport.authenticate('spotify'),
        function(req, res) {

        }
    )

    app.get('/logout', function (req, res) {
        req.logout();
        res.redirect('/');
    });
}