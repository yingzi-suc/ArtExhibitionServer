module.exports = app => {
    //1. 连接数据库
    const md5 = require('blueimp-md5') //md5加密函数
//1.1 引入mongoose
    const mongoose = require('mongoose')
//1.2 连接指定数据库
    mongoose.connect('mongodb://localhost:27017/art-web',{useNewUrlParser: true})
//1.3 获取连接对象
    const conn = mongoose.connection
//1.4 绑定连接完成的监听（用来提示连接成功）
    conn.on('connected',function () {//连接成功回调
        console.log('数据库连接成功')
    })
}



//2. 首页 艺术展推荐 Schema
// const RecommendSchema = mongoose.Schema({
//     imgUrl: {required: true},
//     location: {type: String,required:true},
//     name:  {type: String,required:true},
//     time:  {type: String,required:true},
//     type:  {type: String,required:true},
// })
// const Recommend = mongoose.model('Recommend',RecommendSchema)
// exports.Recommend = Recommend













