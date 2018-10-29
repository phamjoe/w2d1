// require `request` and the Node `fs` (filesystem) module
var request = require('request');
var fs = require('fs');
var bar = '.'

request.get('https://sytantris.github.io/http-examples/future.jpg')
       .on('error', function (err) {
         throw err;
       })
       .on('response', function (response) {
         console.log('Response Status Code: ', response.statusCode);
         console.log('Response Message: ', response.statusMessage);
         console.log('Response Content Type: ', response.headers['content-type']);
         console.log('Downloading image...')

       })
       .on('data', function(){
        process.stdout.write(bar);
       })
       .on('end', function(){
          console.log('\nDownload Complete.')
        })
       .pipe(fs.createWriteStream('./future.jpg'));
