const express = require('express');
const app = express();
const download = require('image-downloader');
const mongoose = require('./db/config');
const  {Image } = require('./models/image');
const sharp = require('sharp');
const fs = require('fs');
const bodyParser = require("body-parser");

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({
    extended: true
}));

app.get('/', function(req, res, next) {  

//    Image.find({}, (err, images) => {
//         if(err) console.error(err);
//         console.log(images)
//     }).sort(( {name: '1'}));
//     Image.find({}, (err, images) => {
//         if(err) console.error(err);
//         console.log(images)
//     }).sort(( {name: '1'}));
    
    res.render('index', {files: false});
});

app.post("/upload", async function (req, res, next) {     
    const options = {
        url: req.body.url,
        dest: __dirname + '/public/images',
        name: getNameAndType(req.body.url)[0],
        type: getNameAndType(req.body.url)[1]
    } 
    let img =  await downloadIMG(options);
 
    array.push(img);   
    res.render('index', {files: array})    
    next();
});
app.post('/sorting',function(req,res) {
    console.log(req.body);
    res.redirect('/')
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

function transformImage(path) {

    sharp(path)
    .resize(150, 150)
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
        let stats = fs.statSync(filename);
        let size = stats["size"]
        let birthtime = stats["birthtime"]
          
        const image = new Image({
            name: options.name,
            path: filename,
            url: options.url,
            size: size,
            birthtime: birthtime,
            type: options.type,
            pathForHtml: options.name + '.' + options.type
        });
        image.save();        
        transformImage(filename); 
        return image;  
        } else console.log('images only');      
    } catch (e) {
        console.error(e)
    }
}

app.listen(8080, () => {
    console.log('App is starting on 3000 port')
})