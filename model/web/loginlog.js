const mongoose = require('mongoose')

//1. 登录注册 Schema
const userSchema = mongoose.Schema({
    username: {type: String, required: true}, //用户名
    role: {type:String,default:'普通用户'}, //权限设置，普通用户 超级用户
    detail:{type:String},
    loginDate: { //登陆时间
        type: String,
    },
    logoutDate:{ //退出时间
        type: String,
    }
})

// const UserModel = mongoose.model('User',userSchema)
module.exports = mongoose.model('Userlog',userSchema)
//向外暴露UserModel
// exports.UserModel = UserModel
