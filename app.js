const express = require('express');
const app = express();
const download = require('image-downloader');
const mongoose = require('./db/config');
const Image = require('./models/image');
const sharp = require('sharp');
const fs = require('fs');
const bodyParser = require("body-parser");

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({
    extended: true
}));

app.get('/', function(req, res, next) {  
    res.render('index', {files: false});
});

let arr = [];

app.post("/upload", async function (req, res, next) {     
    const options = {
        url: req.body.url,
        dest: __dirname + '/public/images',
        name: getNameAndType(req.body.url)[0],
        type: getNameAndType(req.body.url)[1]       
    } 
    await downloadIMG(options);
    arr.push(`images/${options.name}.${options.type}`);   
    res.render('index', {files: arr})    
    next();
});

function checkType(type, callback) {
    const filetypes = /jpeg|jpg|png|gif/;
    if(filetypes.test(type)) {
        return true; 
    } else return false;
}
 
function getNameAndType(url) {
    let arr = url.split('/');
    let n = arr[arr.length - 1];
    let name = n.split('.')
    return [name[0], name[1]];
}
// function save(file) {
//     let arr = [];
//     arr.push(file.name)
//     console.log(arr);
// }

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

async function downloadIMG(options) {
    try {
        if (checkType(options.type)) {               
          const { filename } = await download.image(options);             
            
          const image = new Image({
              name: options.name,
              path: filename,
              url: options.url
          });
          console.log(image)
          image.save();        
          transformImage(filename); 
        } else console.log('images only');      
    } catch (e) {
        console.error(e)
    }
}

app.listen(3000, () => {
    console.log('App is starting on 3000 port')
})