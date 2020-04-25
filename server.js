// server.js
// where your node app starts

// init project
const express = require('express');
const app = express();
const assets = require('./assets');
var bodyParser = require('body-parser')
var fs = require("fs");

// Multer is a module to read and handle FormData objects, on the server side
const multer = require('multer');

// create application/json parser
var jsonParser = bodyParser.json()

// Make a "storage" object that explains to multer where to store the images...in /images
let storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, __dirname + '/images')
  },
  // keep the file's original name
  // the default behavior is to make up a random string
  filename: function(req, file, cb) {
    cb(null, file.originalname)
  }
})

// Use that storage object we just made to make a multer object that knows how to
// parse FormData objects and store the files they contain
let uploadMulter = multer({
  storage: storage
});

/* create postcardData.json if does not exist
 * this is more of a test to catch server errors
 */
var postcardDataPath = "postcardData.json";
let postcardData = {
  "photo": "",
  "message": "",
  "font": "",
  "color": ""
}
fs.writeFile(postcardDataPath, JSON.stringify(postcardData), (e) => {
  if (e) {
    throw e;
  } else {
    console.log("postcardData.json can be written!");
  }
})

// First, server any static file requests
app.use(express.static('public'));

// Next, serve any images out of the /images directory
app.use("/images", express.static('images'));

// Next, serve images out of /assets (we don't need this, but we might in the future)
app.use("/assets", assets);

// Next, if no path is given, assume we will look at the postcard creation page
app.get("/", function(request, response) {
  response.sendFile(__dirname + '/public/heartbreaking-creator.html');
});

app.get("/heartbreaking-creator", function(request, response) {
  response.sendFile(__dirname + '/public/heartbreaking-creator.html');
});

/* FROM DIRECTIONS: "xxx-display.html" for R's page, where "xxx" is the name of your app.
For privacy, please make sure "xxx" includes at least one of the random words
Glitch names it when you start the project.
*/
app.get("/heartbreaking-display", jsonParser, function(request, response) {
  response.sendFile(__dirname + '/public/heartbreaking-display.html');
});

// Next, handle post request to upload an image
// by calling the "single" method of the object uploadMulter that we made above
app.post('/upload', uploadMulter.single('newImage'), function(request, response) {
  // file is automatically stored in /images
  // WARNING!  Even though Glitch is storing the file, it won't show up
  // when you look at the /images directory when browsing your project
  // until later (or unless you open the console (Tools->Terminal) and type "refresh").
  // So sorry.
  console.log("Recieved", request.file.originalname, request.file.size, "bytes")
  // the file object "request.file" is truthy if the file exists
  if (request.file) {
    /* update postcardData.json and send it back to the user
     * I would have just stored the data on the server memory, but
     * the assignment says to store the data in the file, so we open the file
     * then write to it.
     */
    fs.readFile(postcardDataPath, 'utf8', function(err, data) {
      if (err) throw err;
      let postcardData = JSON.parse(data);
      postcardData.photo = request.file.originalname;
      // write back to file
      fs.writeFile(postcardDataPath, JSON.stringify(postcardData), function(err) {
        if (err) throw err;
        console.log("JSON written to " + postcardDataPath);
      });
      // send back json response
      response.end(JSON.stringify(postcardData));
    });

  } else throw 'error';
})

app.post("/share", jsonParser, function(request, response) {
  console.log(JSON.stringify(request.body, null, 2));
  fs.readFile(postcardDataPath, 'utf8', function(err, data) {
    if (err) throw err;
    let postcardData = JSON.parse(data);
    /* photo data is ignored since we already have it
     * could be used for photo selection from galery in the future
     */
    postcardData.message = request.body.message;
    postcardData.font = request.body.font;
    postcardData.color = request.body.color;
    // write back to file
    fs.writeFile(postcardDataPath, JSON.stringify(postcardData), function(err) {
      if (err) throw err;
      console.log("JSON written to " + postcardDataPath);
    });
    // send back json response
    response.end(JSON.stringify(postcardData));
  });
});

/* Postcard data for display
 */
app.get("/data", function(request, response) {
  console.log(JSON.stringify(request.body, null, 2));
  fs.readFile(postcardDataPath, 'utf8', function(err, data) {
    if (err) throw err;
    let postcardData = JSON.parse(data);
    // send back json response
    response.end(JSON.stringify(postcardData));
  });
});


// listen for HTTP requests :)
var listener = app.listen(process.env.PORT, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});
