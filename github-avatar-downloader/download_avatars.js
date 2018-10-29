var request = require('request');
var token = require('./secrets');
var fs = require('fs');
var input = process.argv.slice(2);
console.log('Welcome to the GitHub Avatar Downloader!');

function getRepoContributors(repoOwner, repoName, cb) {
  var options = {
    url: 'https://api.github.com/repos/' + repoOwner + '/' + repoName + '/contributors',
    headers: {
      'User-Agent': 'request',
      Authorization: token.GITHUB_TOKEN
    }
  };

  request(options, function(err, res, body) {
    cb(err, JSON.parse(body));
  });
}

function downloadImageByURL(url, filePath) {
  var bar = '|';

  request
    .get(url)
    .on('error', function(err) {
      throw err;
    })
    .on('response', function(response) {})
    .on('data', function() {
      process.stdout.write(bar);
    })
    .on('end', function() {
      console.log('\nDownload Complete.');
    })
    .pipe(fs.createWriteStream(filePath));
}
if(input.length !== 0){
getRepoContributors(input[0], input[1], function(err, result) {
  let avatars = result;
  console.log('Errors:', err);
  for (let el of avatars) {
    var filePath = `avatars/${el['login']}.jpg`;
    fs.createWriteStream(filePath);
    downloadImageByURL(el['avatar_url'], filePath);
  }
});
}

else{
  throw 'Incorrect number of arguments. Provide repo owner and repo name';
}
