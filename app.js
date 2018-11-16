const express = require('express');
const app = express();
const download = require('image-downloader');
const mongoose = require('./db/config');
const Image = require('./models/image');
const sharp = require('sharp');
const fs = require('fs');

app.use(express.static(__dirname + '/public'));
app.get('/', (req, res) => {
    res.render('index')
})  

const options = {
    url: 'https://bipbap.ru/wp-content/uploads/2017/04/807093396.jpg',
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
        image.save();        
        transformImage(filename); 
    } catch (e) {
        console.error(e)
    }
}
   
downloadIMG();

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