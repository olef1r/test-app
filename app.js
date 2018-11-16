const express = require('express');
const app = express();
const download = require('image-downloader')

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
        const { filename, image } = await download.image(options)
        console.log(filename) 
    } catch (e) {
        console.error(e)
    }
}
   
downloadIMG();

app.listen(8080, () => {
    console.log('App is starting on 8080 port')
})