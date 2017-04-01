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

