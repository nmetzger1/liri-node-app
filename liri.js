//global variables
var chosenFunction;
var searchTerm = "";
var dataArray = [];

//require files
var keyfile = require("./keys.js");
var Twitter = require("twitter");
var spotify = require("spotify");
var request = require("request");
var fs = require("fs");
var colors = require("colors/safe");

//get user inputs
chosenFunction = process.argv[2];

//combine search arguments into single string
for(var i = 3; i < process.argv.length; i++){
    searchTerm = searchTerm + " " + process.argv[i];
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

        dataArray.push("Last 20 tweets from: The_Factosaurus");

        for(var i = 0; i < tweets.length; i++){
            var newTweet = i+1 + ": " + tweets[i].text + " (" + tweets[i].created_at + ")";
            dataArray.push(newTweet);
        }

        addToLog(dataArray, "green");

    })
}

function spotifyThis() {

    var song = searchTerm;

    if(searchTerm === ""){
        song = "Ace of Base I Saw the Sign"
    }

    var options = {
        type: "track",
        query: song
    };

    spotify.search(options, function (err, data) {
        if(err){
            throw err;
        }

        //store data in array
        dataArray.push("Artist: " + data.tracks.items[0].artists[0].name);
        dataArray.push("Song Name: " + data.tracks.items[0].name);
        dataArray.push("Preview URL: " + data.tracks.items[0].preview_url);
        dataArray.push("Album: " + data.tracks.items[0].album.name);

        //log data
        addToLog(dataArray, "red");
    })
}

function movieThis() {

    var movie = searchTerm;

    if(searchTerm === ""){
        movie = "Mr. Nobody";
    }

    url = 'http://www.omdbapi.com/?t=' + movie + '&tomatoes=true&plot=full';
    request(url, function (err, response, body) {
        if(err){
            console.log("Movie not found");
        }


        var data = JSON.parse(body);

        if(data.Response === "False"){
            console.log("Your search for " + movie + " returned 0 results");
            return;
        }

        dataArray.push("Title: " + data.Title);
        dataArray.push("Released: " + data.Year);
        dataArray.push("IMDB Rating: " + data.imdbRating);
        dataArray.push("Countries: " + data.Country.toString(", "));
        dataArray.push("Language: " + data.Language);
        dataArray.push("Plot: " + data.Plot);
        dataArray.push("Cast: " + data.Actors.toString(", "));
        if(data.Ratings[1] === undefined){
            dataArray.push("No Rotten Tomatoes Score");
        }
        else {
            dataArray.push("Tomator Rating: " + data.Ratings[1].Value);
        }
        dataArray.push("Rotten Tomatoes URL: " + data.tomatoURL);

        addToLog(dataArray, "blue");
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

function addToLog(logData, color){

    //display in console
    switch (color){
        case "red":
            console.log(colors.red(logData.join('\r\n')));
            return;
        case "blue":
            console.log(colors.blue(logData.join('\r\n')));
            return;
        default:
            console.log(colors.green(logData.join('\r\n')));
    }



    //log to text file
    fs.appendFileSync("log.txt", logData.join('\r\n'));
    fs.appendFileSync("log.txt", '\r\n***************************************************\r\n');
}