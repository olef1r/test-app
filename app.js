const express = require('express');
const app = express();
const download = require('image-downloader');
const mongoose = require('./db/config');
const  { Image } = require('./models/image');
const sharp = require('sharp');
const fs = require('fs');
const bodyParser = require("body-parser");

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({
    extended: true
}));

Image.deleteMany({}).exec();

app.get('/', function(req, res, next) {  
    res.render('index', {files: false});
});

let array = [];
app.post("/upload",  function (req, res, next) {     
    const options = {
        url: req.body.url,
        dest: __dirname + '/public/images',
        name: getNameAndType(req.body.url)[0],
        type: getNameAndType(req.body.url)[1]
    }
    // checking if exist in DB
    Image.findOne({name: options.name}, async (err, img) => {
        if (img) {
            res.render('index', {msg: 'Image exist!', files: false})
        } else {
            let img =  await downloadIMG(options); 
            array.push(img);   
            res.render('index', {files: array, msg: ' '})    
            next();
        }        
    })
});

app.post('/sorting',function(req,res) {
    let n = req.body;

    if (n.sort == 1) {
        Image.find({}, 'name size birthtime pathForHtml', (err, images) => {
            if(err) console.error(err);
                res.render('index', { files: images })    
        }).sort(({ name: '1' }));
    } else 
    if (n.sort == 2) {
        Image.find({}, 'name size birthtime pathForHtml', (err, images) => {
            if(err) console.error(err);
                res.render('index', { files: images })    
        }).sort(( {name: '-1'}));
    } else 
    if (n.sort == 3) {
        Image.find({}, 'name size birthtime pathForHtml', (err, images) => {
            if(err) console.error(err);
                res.render('index', { files: images })    
        }).sort(( {size: '1'}));
    } else 
    if (n.sort == 4) {
        Image.find({}, 'name size birthtime pathForHtml', (err, images) => {
            if(err) console.error(err);           
                res.render('index', { files: images })    
        }).sort(( {size: '-1'}));
    } else 
    if (n.sort == 5) {
        Image.find({}, 'name size birthtime pathForHtml', (err, images) => {
            if(err) console.error(err);          
                res.render('index', { files: images })    
        }).sort(( {birthtime: '1'}));
    } else 
    if (n.sort == 6) {
        Image.find({}, 'name size birthtime pathForHtml', (err, images) => {
            if(err) console.error(err);           
                res.render('index', {files: images})    
        }).sort(( {birthtime: '-1'}));
    } 
    else {
        res.render('index', {msg: 'Select sorting', files: array})    
    } 
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
    .resize(200, 200)
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