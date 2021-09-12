const mongoose = require('mongoose')

const categorySchema = mongoose.Schema({
    title: { //标题
        type: String,
        required: true
    },
    exhibitionType: {  //展会类别
        type: Number,
        enum: [1,2,3,4,5],
        default: 2
        //  1:摄影展  2.美术展  3.艺术展  4.插画展  5.雕塑展
    },
    extension: { //展览展期
        type: Array,
        required: true
    },
    businessHours: { //营业时间
        type: Array,
        required: true
    },
    location: { //地点
        type: String,
        required: true
    },
    name: { //联系人
        type: String,
        required: true
    },
    number: { //联系电话
        type: Number,
        required: true
    },
    imgBanner: {
        type: String
    },
    img:{ //图片
        type:Array
    },
    content: { //展会介绍
        type: String,
        required: true
    },
    dianzan: {
        type: Number
    },
    city: {
        type: Number,
        enum: [1,2,3,4,5,6],
        default: 2
        //  1:成都  2.上海  3.北京  4.深圳  5.福建  6.江苏  0.全部
    },
    myPinglun: [{ //每个展会的评论信息
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

module.exports = mongoose.model('Category',categorySchema)