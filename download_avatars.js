// This file takes a github owner and repository as command-line arguments
// and downloads all of the repo contributor avatar photos to the folder "avatar"

// include required modules
var request = require('request');
var secret = require("./secrets");
var fs = require('fs');

// take owner and repo arguments from the command line
var owner = process.argv[2];
var repo = process.argv[3];

// check that both owner and repo were inputted to the command line
if (owner && repo !== undefined) {
  // if both values valid, run getRepoContributors
  getRepoContributors(owner, repo, function (err, result) {
    if (!err) {
      // takes the downloaded JSON and loops through each item in the array:
      var contributor = result[0];
      result.forEach(function (contributor) {
        // constructs a file path using the login value(e.g., "avatars/dhh.jpg")
        var filePath = './avatars/' + contributor.login + '.jpg';
        // sets url to the contributor avatar url
        var url = contributor.avatar_url
        // passes the avatar_url value and the file path to downloadImageByURL
        downloadImageByURL(url, filePath);
      });
    } else {
      console.log("Errors:", err);
    }
  });
} else {
  // if not, return error
  console.log('Error: command line argument owner or repo missing.');
  console.log('Please specify owner and repo after download_avatars.js');
}

// getRepoContributors makes a request for JSON,
// getting back an array of contributors
function getRepoContributors(repoOwner, repoName, cb) {
  // creates the request options
  var options = {
    url: "https://api.github.com/repos/" + repoOwner + "/" + repoName + "/contributors",
    headers: {
      'User-Agent': 'request',
      // uses the token from the secrets file
      'Authorization': 'token ' + secret.GITHUB_TOKEN
    }
  };
  // passes request option, checking for errors & status code
  request(options, function (err, res, body) {
    // if no errors & status code is 'ok'
    if (!err && res.statusCode === 200) {
      // parse the returned array of contributors to JSON
      var data = JSON.parse(body);
      // pass error report & JSON to callback
      cb(err, data);
    } else {
      console.log('Data not found');
    }
  });
}

// downloadImageByURL fetches the desired avatar_url
function downloadImageByURL(url, filePath) {
  request.get(url)
    .on('error', function (err) {
      console.log("Download error");
    })
    .on('response', function (response) {
      console.log('Downloading image...');
    })
    // saves this information to the given filePath
    .pipe(fs.createWriteStream(filePath))
    .on('close', function () {
      console.log('Download complete.');
    });
}