// getRepoContributors makes a request for JSON, getting back an array of contributors.
// getRepoContributors passes this data to cb, an anonymous callback function that it is given.
// cb loops through each item in the array:
// It constructs a file path using the login value(e.g., "avatars/dhh.jpg")
// It then passes the avatar_url value and the file path to downloadImageByURL
// downloadImageByURL fetches the desired avatar_url and saves this information to the given filePath


var request = require('request');
var token = require("./secrets");
var fs = require('fs');

var owner = process.argv[2];
var repo = process.argv[3];
console.log(owner, repo);

//function that retrieves the repo conributors for a given repo
function getRepoContributors(repoOwner, repoName, cb) {
  // creates the request options
  var options = {
    url: "https://api.github.com/repos/" + repoOwner + "/" + repoName + "/contributors",
    headers: {
      'User-Agent': 'request',
      // uses the token from the secrets file
      'Authorization': 'token ' + token.GITHUB_TOKEN
    }
  };
  // reqests the api data and returns in JSON
  request(options, function (err, res, body) {
    var data = JSON.parse(body);
    cb(err, data);
  });
}

//downloads the avatar images using the url
function downloadImageByURL(url, filePath) {
  request.get(url)
    .on('error', function (err) {
      console.log("Download error");
    })
    .on('response', function (response) {
      console.log('Downloading image...');
    })
    .pipe(fs.createWriteStream(filePath))
    .on('close', function () {
      console.log('Download complete.');
    });
}

// calls the getRepoContributors function, passing in a repo owner & name
// logs errors
// logs the avatar urls for each contributor
getRepoContributors(owner, repo, function (err, result) {
  console.log("Errors:", err);
  var contributor = result[0];
  result.forEach(function (contributor) {
    var filePath = './avatars/' + contributor.login + '.jpg';
    var url = contributor.avatar_url
    downloadImageByURL(url, filePath);
  });
});

