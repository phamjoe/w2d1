require('dotenv').config();
const request = require('request');
const fs = require('fs');
const token = process.env.TOKEN;
const path = './avatars';
const input = process.argv.slice(2);
console.log('Welcome to the GitHub Avatar Downloader!');
const getRepoContributors = (repoOwner, repoName, cb) => {
  const options = {
    url: `https://api.github.com/repos/${repoOwner}/${repoName}/contributors`,
    headers: {
      'User-Agent': 'request',
      Authorization: token
    }
  };

  request(options, (err, res, body) => {
    cb(err, JSON.parse(body));
  });
};

const downloadImageByURL = (url, filePath) => {
  request
    .get(url)
    .on('error', function(err) {
      throw err;
    })
    .on('end', function() {
      console.log(`\nDownloading ${url}`);
    })
    .pipe(fs.createWriteStream(filePath));
};

//  the provided owner/repo does not exist
const ifExists = message => {
  if (message === 'Not Found') throw 'Repo/owner does not exist';
};

// the .env file is missing
// the .env file is missing information
// the .env file contains incorrect credentials
const checkToken = token => {
 if (!token) {
    throw new Error('No env variable with the name TOKEN was specified');
  }
  if (!/[a-f0-9]{40}/gi.test(token)) {
    throw new Error('Invalid github token provided');
  }
};

checkToken(token);

// check if argument was passed
if (input.length !== 0) {
  //  the folder to store images to does not exist
  if (!fs.existsSync(path)) {
    console.log(`${path} directory not found. Creating now... `);
    fs.mkdirSync(path);
  }

  getRepoContributors(input[0], input[1], (err, result) => {
    ifExists(result.message);
    const avatars = result;
    console.log('Errors:', err);
    for (let key of avatars) {
      const filePath = `${path}/${key.login}.jpg`;
      downloadImageByURL(key.avatar_url, filePath);
    }
  });
} else {
  throw 'Incorrect number of arguments';
}
