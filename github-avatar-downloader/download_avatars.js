require('dotenv').config()
const request = require('request');
const fs = require('fs');
const key = process.env.TOKEN;

const input = process.argv.slice(2);
console.log('Welcome to the GitHub Avatar Downloader!');

function getRepoContributors(repoOwner, repoName, cb) {
  const options = {
    url: `https://api.github.com/repos/${repoOwner}/${repoName}/contributors`,
    headers: {
      'User-Agent': 'request',
      Authorization: key
    }
  };

  request(options, function(err, res, body) {
    cb(err, JSON.parse(body));
  });
}

function downloadImageByURL(url, filePath) {
  request
    .get(url)
    .on('error', function(err) {
      throw err;
    })
    .on('end', function() {
      console.log(`\nDownloading ${url}`);
    })
    .pipe(fs.createWriteStream(filePath));
}
// check if argument was passed
if (input.length !== 0) {
  getRepoContributors(input[0], input[1], function(err, result) {
    const avatars = result;
    console.log('Errors:', err);
    for (let el of avatars) {
      const filePath = `avatars/${el.login}.jpg`;
      downloadImageByURL(el.avatar_url, filePath);
    }
  });
} else {
  throw 'Incorrect number of arguments. Provide repo owner and repo name';
}
