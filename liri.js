var keyfile = require("./keys.js");
var Twitter = require("twitter");

var chosenFunction = process.argv[2];

switch (chosenFunction){
    case "my-tweets":
        displayTweets();
        break;
    case "spotify-this-song":
        spotifyThis();
        break;
    case "movie-this":
        movieThis();
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
    console.log("la la la");
}

function movieThis() {
    console.log("movies")
}

function doWhat() {
    console.log("do what?!?");
}

