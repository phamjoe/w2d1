var request = require('request');
var token = require('./secrets');
var fs = require('fs');
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

getRepoContributors('jquery', 'jquery', function(err, result) {
  let avatars = result;
  console.log('Errors:', err);
  for (let el of avatars) {
    var filePath = `avatars/${el['login']}.jpg`;
    fs.createWriteStream(filePath);
    downloadImageByURL(el['avatar_url'], filePath);
  }
});
