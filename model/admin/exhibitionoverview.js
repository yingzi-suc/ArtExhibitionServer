const mongoose = require('mongoose')

//1. 登录注册 Schema
const userSchema = mongoose.Schema({
    total: {type: Number, required: true}, 
    approvalsnum: {type: Number, required: true},
    unapprovalsnum:{type: Number, required: true},
    citynum:{type: Number, required: true},
})

// const UserModel = mongoose.model('User',userSchema)
module.exports = mongoose.model('ExhibitionCategory',userSchema)
