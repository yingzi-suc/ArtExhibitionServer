const mongoose = require('mongoose')

//1. 登录注册 Schema
const userSchema = mongoose.Schema({
    username: {type: String, required: true}, //用户名
    password: {type: String, required: true}, //密码
    token:{type:Object},
    loginDate: { //登陆时间
        type: String,
    },
    logoutDate:{ //退出时间
        type: String,
    }
})

// const UserModel = mongoose.model('User',userSchema)
module.exports = mongoose.model('AdminUser',userSchema)
