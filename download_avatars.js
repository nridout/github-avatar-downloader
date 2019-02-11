var request = require('request');
var token = require("./secrets");

function getRepoContributors(repoOwner, repoName, cb) {
  var options = {
    url: "https://api.github.com/repos/" + repoOwner + "/" + repoName + "/contributors",
    headers: {
      'User-Agent': 'request',
      'Authorization': token.GITHUB_TOKEN
    }
  };

  request(options, function (err, res, body) {
    cb(err);
    var data = JSON.parse(body);
    var contributor = data[0];
    data.forEach(function(contributor){
      console.log(contributor.avatar_url);
    });
  });
}

getRepoContributors("jquery", "jquery", function (err, result) {
  console.log("Errors:", err);
  console.log("Result:", result);
});