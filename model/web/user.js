const mongoose = require('mongoose')

//1. 登录注册 Schema
const userSchema = mongoose.Schema({
    username: {type: String, required: true}, //用户名
    password: {type: String, required: true}, //密码
    role: {type:String,default:'普通用户'}, //权限设置，普通用户 超级用户
    loginTime:{type:Date,default: Date.now}
})

// const UserModel = mongoose.model('User',userSchema)
module.exports = mongoose.model('User',userSchema)
//向外暴露UserModel
// exports.UserModel = UserModel
