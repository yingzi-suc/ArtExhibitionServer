const mongoose = require('mongoose')
const imgSchema = mongoose.Schema({
    imgurl: {type:Array}
})
module.exports = mongoose.model('Img',imgSchema)