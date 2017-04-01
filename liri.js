//global variables
var chosenFunction;

//require files
var keyfile = require("./keys.js");
var Twitter = require("twitter");
var spotify = require("spotify");
var request = require("request");
var fs = require("fs");
var inquierer = require("inquirer");

//Prompt user to pick a function
inquierer.prompt([
    {
        type: "list",
        message: "Please select a program",
        choices: ['my-tweets', 'spotify-this-song', 'movie-this', 'do-what-it-says'],
        name: "chosenFunction"
    }
]).then(function (input) {

    //prompt user for additional input
    switch (input.chosenFunction){
        case "my-tweets":
            displayTweets();
            break;
        case "spotify-this-song":
            spotifyPrompt();
            break;
        case "movie-this":
            moviePrompt();
            break;
        case "do-what-it-says":
            doWhat();
            break;
    }
});

//prompt functions
function spotifyPrompt() {
    //Prompt to get song title
    inquierer.prompt([
        {
            type: "input",
            message: "Please enter a song title.",
            default: "Playing with the Boys",
            name: "song"
        }
    ]).then(function (input) {
        //run find song on spotify
        spotifyThis(input.song);
    })
}

function moviePrompt() {
    //prompt user for movie title
    inquierer.prompt([
        {
            type: "input",
            message: "Please enter a movie title.",
            default: "Rubber",
            name: "movie"
        }
    ]).then(function (input) {
        //search OMDB for movie
        movieThis(input.movie);
    })
}

//npm functions
function displayTweets() {

    //prompt user for screen name
    inquierer.prompt([
        {
            type: "input",
            message: "Enter a Twitter screen name to see his/her last 20 tweets!",
            name: "screenName",
            default: "The_Factosaurus"
        }
    ]).then(function (input) {

        //connection properties
        var keys = keyfile.twitterKeys;
        //setup client
        var client = new Twitter({
            consumer_key: keys.consumer_key,
            consumer_secret: keys.consumer_secret,
            access_token_key: keys.access_token_key,
            access_token_secret: keys.access_token_secret
        });
        //set search parameters
        var parameters = {
            screen_name: input.screenName,
            count: "20"
        };
        //make call to Twitter
        client.get('statuses/user_timeline', parameters, function (error, tweets) {
            if(error){
                throw error;
            }
            //Loop through response and output tweets
            for(var i = 0; i < tweets.length; i++){
                console.log(i+1 + ": " + tweets[i].text + " (" + tweets[i].created_at + ")");
            }
        })
    })
}

function spotifyThis(song) {

    //declare search options
    var options = {
        type: "track",
        query: song
    };
    //make call to spotify
    spotify.search(options, function (err, data) {
        if(err){
            throw err;
        }
        //output song information
        console.log("Artist:", data.tracks.items[0].artists[0].name);
        console.log("Song Name:", data.tracks.items[0].name);
        console.log("Preview URL:", data.tracks.items[0].preview_url);
        console.log("Album:", data.tracks.items[0].album.name);
    })
}

function movieThis(movie) {

    //declare URL for omdb api & insert movie title
    url = 'http://www.omdbapi.com/?t=' + movie + '&tomatoes=true&plot=full';
    //make call to omdb
    request(url, function (err, response, body) {
        if(err){
            throw err;
        }
        //parse response body into objects
        var data = JSON.parse(body);

        //output movie information
        console.log("Title:", data.Title);
        console.log("Released:", data.Year);
        console.log("IMDB Rating:", data.imdbRating);
        console.log("Countries:", data.Country.toString(", "));
        console.log("Language:", data.Language);
        console.log("Plot:", data.Plot);
        console.log("Cast:", data.Actors.toString(", "));
        //if rotten tomatoes score is not returned
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
    //get string from random.txt
    fs.readFile('random.txt', 'utf8', function (err, data) {

        if(err){
            throw err;
        }

        var song = data;

        var randomNumber = Math.floor(Math.random() * 2);

        if(randomNumber > 0){
            console.log("Searching for a song");
            //run spotify function and return results
            spotifyThis(song);
        }
        else {
            console.log("Searching for a movie");
            movieThis(song);
        }

    })
}