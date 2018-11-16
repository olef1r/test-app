let mongoose = require('mongoose');
 
let Image = mongoose.model('Image', {
    name: {
        type: String,
        required: false,
        trim: true,
        minlength: 1

    },
    path: {
        type: String,
        required: true,
        trim: true,
        minlength: 1
    },
    url: {
        type: String,
        required: true,
        trim: true,
        minlength: 1
    }
});

module.exports = Image;

