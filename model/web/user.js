const mongoose = require('mongoose')

//1. 登录注册 Schema
const userSchema = mongoose.Schema({
    username: {type: String, required: true}, //用户名
    password: {type: String, required: true}, //密码

})

// const UserModel = mongoose.model('User',userSchema)
module.exports = mongoose.model('User',userSchema)
//向外暴露UserModel
// exports.UserModel = UserModel
