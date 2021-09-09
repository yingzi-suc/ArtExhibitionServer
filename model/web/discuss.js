const mongoose = require('mongoose')

const discussSchema = mongoose.Schema({
    id: {
        type: Number,
        required:true
    },
    username: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    time: {
        type: Date,
        default:Date.now
    },
    imgUrl: {
        type: Array,
    },
    dianzanNumber: {
        type: Number,
        required: true
    },
    isDianzanNum: {
        type: Number,
        default: 0
    },
    isDianzan: {
        type: Boolean,
        default: false
    },
    pinglun: [{
        time: {
            type: Date,
            default:Date.now
        },
        content: {
            type: String,
            required: true
        },
        username: {
            type: String,
            required: true
        }
    }],
})

module.exports = mongoose.model('Discuss',discussSchema)