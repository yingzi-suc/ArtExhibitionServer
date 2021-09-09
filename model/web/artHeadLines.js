const mongoose = require('mongoose')

const artHeadLines = mongoose.Schema({
    headlinesTitle: {
        type: String,
        required:true
    },
    headlinesText: {
        type: String,
        required:true
    }
})

module.exports = mongoose.model('Arthead',artHeadLines)