const express = require('express');
const md5 = require('blueimp-md5')
const multer = require('multer')
const fs = require('fs')

const router = express.Router();

const UserModel = require('../model/web/user')
const CategoryModel = require('../model/web/exhibitionCategory')
const ArtHead = require('../model/web/artHeadLines')
const Discuss = require('../model/web/discuss')
const Img = require('../model/web/imgLoad')


const filter = {password: 0, __v: 0} // 指定过滤的属性

//用户注册路由
router.post('/api/register', async (req, res) => {
  // 1. 获取请求参数
  const {username, password} = req.body
  try {
    const datas = await UserModel.findOne({username})
    if(datas) {
      //如果有用户，则提示错误信息
      res.send({code: 1,msg: '此用户已存在'})
    } else {
      //如果没有用户，则提示正确信息
      const user = await new UserModel({username,password: md5(md5(password))}).save()
      // 生成一个cookie(userid: user._id), 并交给浏览器保存
      // res.cookie('userid',user._id)

      req.session.user = user
      const data = {username,_id: user._id} //响应数据中不携带password
      res.send({code:0, data})
    }
  }catch (e) {
    res.send({
      err_code:500,
      msg: e.message
    })
  }
})

//用户登录路由
router.post('/api/login',async (req,res,next) => {
  const {username,password} = req.body
  try {
    const user = await UserModel.findOne({username,password:md5(md5(password))},filter)
    if(user) {
      //  登陆成功，返回登录信息
      // 生成一个cookie(userid: user._id), 并交给浏览器保存
      // res.cookie('userid',user._id)

      // 通过 Session 记录登陆状态
      req.session.user = user
      res.send({code:0,data: user})
    } else {
      //  登录失败，返回错误信息
      res.send({code: 1,msg:'用户名或密码不正确！'})
    }
  }catch (e) {
    res.send({
      err_code:500,
      msg: e.message
    })
  }
})

//用户退出
router.get('/api/logout',(req,res) =>{
  req.session.user = null
})

//办展会
router.post('/api/hold/exhibition',async (req,res) => {
  const body = req.body
  try {
    const exhibition = await new CategoryModel(body).save()
    res.send({code:0,data: exhibition,msg:'提交成功'})
  }catch (e) {
    res.send({
      err_code:500,
      msg: e.message
    })
  }
})

//图片上传
router.post(
    "/api/hold/imgload",
    multer({
      //设置文件存储路径
      dest: "public/images",
    }).array("file", 1),
    function (req, res, next) {
      let files = req.files;
      let file = files[0];
      let fileInfo = {};
      let path = "public/images/" + Date.now().toString() + "_" + file.originalname;
      fs.renameSync("./public/images/" + file.filename, path);
      //获取文件基本信息
      fileInfo.type = file.mimetype;
      fileInfo.name = file.originalname;
      fileInfo.size = file.size;
      fileInfo.path = path;
      res.send({
        code: 200,
        msg: "OK",
        data: fileInfo,
      });
    }
)

// 艺术展列表
// router.get('/api/home/highlight',async (req,res) => {
//    switch (req.query.currentCity) {
//      case '成都':
//        cuCity = 1;
//        break;
//      case '上海':
//        cuCity = 2;
//        break;
//      case '北京':
//        cuCity = 3;
//        break;
//      case '深圳':
//        cuCity = 4;
//        break;
//      case '福建':
//        cuCity = 5;
//        break;
//      case '江苏':
//        cuCity = 6;
//        break;
//      case '山东':
//        cuCity = 7;
//        break;
//      case '浙江':
//        cuCity = 8;
//        break;
//      case '安徽':
//        cuCity = 9;
//        break;
//      case '全部':
//        cuCity = 0;
//        break;
//    }
//    console.log(cuCity)
//    if( cuCity === 0) {
//      const exhibition = await CategoryModel.find()
//      res.send({code:0,data:exhibition})
//    } else {
//      const exhibition = await CategoryModel.find({city:cuCity})
//      res.send({code:0,data:exhibition})
//    }
// })

//获取艺术展列表
router.get('/api/home/highlight',async (req,res) => {
    const exhibition = await CategoryModel.find()
    res.send({code:0,data:exhibition})
})

//详情页
router.get('/api/detail',async (req,res) => {
  const model = await CategoryModel.findOne({_id: req.query.iid})
  res.send({code:0,data:model})
})

//获取艺术头条
router.get('/api/arthead',async (req,res)=>{
  const model = await ArtHead.find()
  res.send({code:0,data:model})
})
//添加艺术头条
router.post('/api/arthead',async (req,res)=>{
  const body = req.body
  try {
    const model = await new ArtHead(body).save()
    res.send({code:0,data:model,msg:'添加成功'})
  }catch (e) {
    res.send({
      err_code:500,
      msg: e.message
    })
  }
})

//新增交流中心
router.post('/api/communication',async (req,res)=>{
  const body = req.body
  try {
    const model = await new Discuss(body).save()
    res.send({code:0,data:model,msg:'添加成功'})
  }catch (e) {
    res.send({
      err_code:500,
      msg: e.message
    })
  }
})

//获取交流中心信息
router.get('/api/communication',async (req,res)=>{
  const model = await Discuss.find()
  res.send({code:0,data:model})
})

//交流中心我要发表
router.post('/api/publicDialog',async (req,res)=>{
  const body = req.body
  const id = Discuss.findOne()
  try {
    const model = await new Discuss(body).save()
    res.send({code:0,data:model,msg:'添加成功'})
  }catch (e) {
    res.send({
      err_code:500,
      msg: e.message
    })
  }
})

//交流中心我要评论


module.exports = router;
