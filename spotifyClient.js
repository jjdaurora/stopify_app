var request = require('request');
var db = require('./models');
var badSongsArr = require('./services/logic');


var spotifyRequest = request.defaults({
    baseUrl: 'https://api.spotify.com/v1',
    json: true
});

var SpotifyClient = function(options) {
    this.options = options;
    this.request = spotifyRequest.defaults({
        auth: {
            bearer: options.accessToken
        }
    });
}

SpotifyClient.prototype = {
    getTopTracks: function() {
        var self = this;
        return new Promise((resolve, reject) => {
            // need to limit get request to 1 track
            self.request.get('me/top/tracks?limit=1', {}, (err, response, body) => {
                if (err) {
                    return reject(err);
                }                
               self.saveDatatoDb(body.items);

               resolve(body.items);
               console.log(body.items);
            });
        });
    },

    getArtistGenre: function(artistId) {
        var self = this;
        return new Promise((resolve, reject) => {
            self.request.get('artists/' + artistId, {}, (err, response, body) => {
                if (err) {
                    return reject(err);
                }
                
                resolve(body.genres);
            });
        });
    },

    getNextTrack: function() {
        var self = this;
        return new Promise((resolve, reject) => {
            var trackId = badSongsArr[Math.floor(badSongsArr.length * Math.random())]; 
            self.request.get('tracks/' + trackId, {}, (err, response, body) => {
                if (err) {
                    return reject(err);
                }
                // self.saveNextTracktoDb(body.items);
                resolve(body);      
                console.log(body);   
            });
        });
    },

    saveDatatoDb: function(tracks) {
        var artistsStr = "";
        var self = this;
        var track = tracks[0];

        for (var i = track.artists.length - 1; i >=0; i--) {
            artistsStr += ', ' + track.artists[i].name;
        }
        console.log('artistsStr' , artistsStr);

    self.getArtistGenre(track.artists[0].id)
        .then(function(genreResponse) {
            console.log('genreResponse: ', genreResponse);
            db.Music.findOrCreate({
                where: {
                    spotifyTrackId: track.id
                },
                defaults: {
                    trackGenre: JSON.stringify(genreResponse),
                    trackArtwork: track.album.images[0].url,
                    spotifyTrackID: track.id,
                    trackName: track.name,
                    trackArtist: artistsStr,
                    trackPopularity: track.popularity
                }
            })

        })
    },

    // saveNextTracktoDb: function(body) {
    //     var artistsStr = "";
    //     var self = this;
    //     var track = body.name;

    //     for (var i = track.artists.length - 1; i >=0; i--) {
    //         artistsStr += ', ' + track.artists[i].name;
    //     }

    //     console.log('artistsStr' , artistsStr);
    //     self.getNextTrack(track.artists[0].id)
    //     .then(function(genreResponse) {
    //         db.Music.findOrCreate({
    //             where: {
    //                 spotifyTrackId: track.id
    //             },
    //             defaults: {
    //                 trackGenre: JSON.stringify(genreResponse),
    //                 trackArtwork: track.album.images[0].url,
    //                 spotifyTrackID: track.id,
    //                 trackName: track.name,
    //                 trackArtist: artistsStr,
    //                 trackPopularity: track.popularity
    //             }
    //         })
    // });
    // }
}

module.exports = SpotifyClient;

