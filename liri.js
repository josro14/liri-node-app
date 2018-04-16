require('dotenv').config();
var keys = require('./keys');
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var request = require('request');
var fs = require('fs');

var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);


//console.log(process.env);
var input = process.argv[2];
var name = process.argv[3];

function run(command, title) {

    if (command === "my-tweets") {
        client.get('statuses/user_timeline', { user_id: "jawsh1414", count: 20 }, function (error, tweets, response) {
            tweets.forEach(function (tweets) {
                console.log(tweets.created_at, tweets.text);
            })
        });
    }

    else if (command === "spotify-this-song") {
        if (title) {
            spotify.search({ type: "track", query: title }, function (err, data) {
                if (err) {
                    return console.log("error happened: " + err);
                }
                else {
                    data.tracks.items.forEach(function (song) {
                        console.log("Song name:", song.name);
                        console.log("Artist(s):", song.artists[0].name);
                        console.log("Album name:", song.album.name);
                        console.log("Song link:", song.external_urls.spotify);
                    })
                    //console.log(data.tracks.items[0]);
                }
            })
        } else {
            console.log("Here's a song for you: 'The Sign' by: Ace of Base")
        }
    }

    else if (command === "movie-this") {
        request('http://www.omdbapi.com/?i=tt3896198&apikey=trilogy&t=' + title.replace(" ", "%20"), function (error, response, body) {
            console.log('error:', error); // Print the error if one occurred
            body = JSON.parse(body);
            console.log('Movie year:', body.Year);
            console.log('Movie title:', body.Title);
            console.log('IMDB rating:', body.Ratings[0].Value);
            console.log('Rotten Tomatoes rating:', body.Ratings[1].Value);
            console.log('Country filmed:', body.Country);
            console.log('Movie language:', body.Language);
            console.log('Movie Plot:', body.Plot);
            console.log('Actors:', body.Actors);
        });
    }

    else if (command === "do-what-it-says") {
        var fsThing = fs.readFileSync("random.txt", "utf-8");
        //console.log(fsThing.split(", "));
        var array = fsThing.split(", ");
        run(array[0], array[1]);
    }

}

run(input, name);