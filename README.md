## Installation

  `npm install @jdaudier/number-formatter`

## Usage
### Installation

Install the dependencies and devDependencies and start the server.

```sh
$ cd test-app
$ npm install -d
$ nodemon app.js
```
### Dependencies
expressjs - The server for handling and routing HTTP requests
mongoose - For modeling and mapping MongoDB data to javascript
sharp - For convert large images in common formats to smaller
image-downloader -  For downloading image to disk from a given URL

### Application Structure
app.js - The entry point to our application. This file defines express server. It also requires the routes and models we'll be using in the application
config.js -This file defines connects server to MongoDB using mongoose.
public/ - This folder contains downloaded images.
views/ - This folder contains EJS file.
models/ - This folder contains the model definitions for our Mongoose model