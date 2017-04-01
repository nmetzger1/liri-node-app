var keyfile = require("./keys.js");
var Twitter = require("twitter");
var spotify = require("spotify");

var chosenFunction = process.argv[2];

if(process.argv[3] != null){
    var searchTerm = process.argv[3];
}

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

    if(searchTerm == null){
        var searchTerm = "The Sign Ace of Base";
    }

    var options = {
        type: "track",
        query: searchTerm
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
    console.log("movies")
}

function doWhat() {
    console.log("do what?!?");
}

