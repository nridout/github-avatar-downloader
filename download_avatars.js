var request = require('request');
var token = require("./secrets");
var fs = require('fs');
var avatarArray = [];

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

// calls the getRepoContributors function, passing in a repo owner & name
// logs errors
// logs the avatar urls for each contributor
getRepoContributors("jquery", "jquery", function (err, result) {
  console.log("Errors:", err);
  var contributor = result[0];
  result.forEach(function (contributor) {
    var userAvatar = {};
    userAvatar[contributor.login] = contributor.avatar_url
    avatarArray.push(userAvatar);
  });
  return avatarArray;
});


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

console.log(downloadImageByURL("https://avatars2.githubusercontent.com/u/2741?v=3&s=466", "avatars/kvirani.jpg"));