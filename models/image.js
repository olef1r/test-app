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
        required: false,
        trim: true,
        minlength: 1
    },
    size: {
        type: Number,
        required: false,
        trim: true,
        minlength: 1
    },
    birthtime: {
        type: Date,
        required: false,
        trim: true,
        minlength: 1
    },
    type: {
        type: String,
        required: false,
        trim: true,
        minlength: 1
    },
    pathForHtml: {
        type: String,
        required: false,
        trim: true,
        minlength: 1
    },
});

module.exports = {Image};

