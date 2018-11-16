const express = require('express');
const app = express();
const download = require('image-downloader');
const mongoose = require('./db/config');
const Image = require('./models/image');
const sharp = require('sharp');
const fs = require('fs');
const bodyParser = require("body-parser");

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({
    extended: true
}));

app.get('/', (req, res) => {
    res.render('index')
})  


app.post("/", function (req, res, next) {
    console.log(req.body.url)
    const options = {
        url: req.body.url,
        dest: __dirname + '/public/images'                
    }
    async function downloadIMG() {
        try {
           const { filename } = await download.image(options);
           console.log(filename);
            const image = new Image({
                 name: getName(options.url),
                path: filename,
                url: options.url
            });
            console.log(image)
            image.save();        
            transformImage(filename); 
        } catch (e) {
            console.error(e)
        }
    }
    downloadIMG();
    next();
});
 
function getName(url) {
    let arr = url.split('/');
    let n = arr[arr.length - 1];
    let name = n.substr(0, n.length - 4);
    return name;
}

function transformImage(path) {
    sharp(path)
    .resize(100, 100)
    .toBuffer()
    .then( data => {
        fs.writeFileSync(path, data);
    })
    .catch( err => {
        console.log(err);
    });											
}

app.listen(3000, () => {
    console.log('App is starting on 3000 port')
})