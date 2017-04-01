//global variables
var chosenFunction;
var searchTerm = "";

//require files
var keyfile = require("./keys.js");
var Twitter = require("twitter");
var spotify = require("spotify");
var request = require("request");
var fs = require("fs");

//get user inputs
chosenFunction = process.argv[2];

if(process.argv[3] != null){
    searchTerm = process.argv[3];
}

//run function
switch (chosenFunction){
    case "my-tweets":
        displayTweets();
        break;
    case "spotify-this-song":
        spotifyThis(searchTerm);
        break;
    case "movie-this":
        movieThis(searchTerm);
        break;
    case "do-what-it-says":
        doWhat();
        break;
    default:
        console.log("Please choose one of the following options: 'my-tweets', 'spotify-this-song', 'movie-this', 'do-what-it-says")
}


function displayTweets() {
    console.log("Tweet Tweet");

    var keys = keyfile.twitterKeys;

    var client = new Twitter({
        consumer_key: keys.consumer_key,
        consumer_secret: keys.consumer_secret,
        access_token_key: keys.access_token_key,
        access_token_secret: keys.access_token_secret
    });

    var parameters = {
        screen_name: 'The_Factosaurus',
        count: "20"
    };

    client.get('statuses/user_timeline', parameters, function (error, tweets) {
        if(error){
            throw error;
        }

        for(var i = 0; i < tweets.length; i++){
            console.log(i+1 + ": " + tweets[i].text + " (" + tweets[i].created_at + ")");
        }
    })
}

function spotifyThis() {

    var song;

    if(searchTerm === ""){
        song = "Ace of Base I Saw the Sign"
    }
    else {
        song = searchTerm;
    }

    var options = {
        type: "track",
        query: song
    };

    spotify.search(options, function (err, data) {
        if(err){
            throw err;
        }
        //console.log(data.tracks.items[0]);

        console.log("Artist:", data.tracks.items[0].artists[0].name);
        console.log("Song Name:", data.tracks.items[0].name);
        console.log("Preview URL:", data.tracks.items[0].preview_url);
        console.log("Album:", data.tracks.items[0].album.name);
    })
}

function movieThis() {

    var movie;

    if(searchTerm === ""){
        movie = "Mr. Nobody";
    }
    else {
        movie = searchTerm;
    }

    url = 'http://www.omdbapi.com/?t=' + movie + '&tomatoes=true&plot=full';
    request(url, function (err, response, body) {
        if(err){
            throw err;
        }

        var data = JSON.parse(body);

        console.log("Title:", data.Title);
        console.log("Released:", data.Year);
        console.log("IMDB Rating:", data.imdbRating);
        console.log("Countries:", data.Country.toString(", "));
        console.log("Language:", data.Language);
        console.log("Plot:", data.Plot);
        console.log("Cast:", data.Actors.toString(", "));
        if(data.Ratings[1] === undefined){
            console.log("No Rotten Tomatoes Score");
        }
        else {
            console.log("Tomator Rating:", data.Ratings[1].Value);
        }
        console.log("Rotten Tomatoes URL:", data.tomatoURL);
    });
}

function doWhat() {
    fs.readFile('random.txt', 'utf8', function (err, data) {

        if(err){
            throw err;
        }

        searchTerm = data;

        spotifyThis();

    })
}