const express = require('express');
const md5 = require('blueimp-md5')
const multer = require('multer')
const fs = require('fs')
const router = express.Router();
const UserModel = require('../model/web/user')
const CategoryModel = require('../model/web/exhibitionCategory')
const ArtHead = require('../model/web/artHeadLines')
const Discuss = require('../model/web/discuss')
const filter = {password: 0, __v: 0} // 指定过滤的属性

//用户注册路由
router.post('/api/register', async (req, res) => {
  // 1. 获取请求参数
  const {username, password,role} = req.body
  try {
    const datas = await UserModel.findOne({username})
    if(datas) {
      //如果有用户，则提示错误信息
      res.send({code: 1,msg: '此用户已存在'})
    } else {
      //如果没有用户，则提示正确信息
      const user = await new UserModel({username,password: md5(md5(password)),role}).save()
      // 生成一个cookie(userid: user._id), 并交给浏览器保存
      // res.cookie('userid',user._id)

      // req.session.user = user
      const data = {username,_id: user._id,role} //响应数据中不携带password
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
  // req.session.user = null
})

//用户角色升级
router.get('/api/promotion',async (req,res)=>{
  const model = await UserModel.findOneAndUpdate({username:req.query.username},{role:'超级用户'})
  UserModel.find({username:req.query.username},function (err,ret) {
    res.send({code:0,data:ret})
  })
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

//展会图片上传
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

//材料证明图片上传
router.post(
    "/api/hold/evidenceImg",
    multer({
      //设置文件存储路径
      dest: "public/evidenceImg",
    }).array("file", 1),
    function (req, res, next) {
      let files = req.files;
      let file = files[0];
      let fileInfo = {};
      let path = "public/evidenceImg/" + Date.now().toString() + "_" + file.originalname;
      fs.renameSync("./public/evidenceImg/" + file.filename, path);
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

//根据城市获取艺术展列表
router.get('/api/findArt/cityArts',async (req,res) =>{
  const city = req.query.city
  console.log(req.query.city)
    const exhibitions = await CategoryModel.find({city})
    res.send({code:0,data:exhibitions})
})

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

//详情页根据 id 添加展会评论信息
router.post('/api/detail/pinglun',async (req,res) => {
  try {
    const model = await CategoryModel.findByIdAndUpdate(req.body._id,{myPinglun:req.body.myPinglun})
    CategoryModel.find({_id:req.body._id},function (err,ret) {
      res.send({code:0,data:ret})
    })
  }catch (e) {
    res.send({
      err_code:500,
      msg: e.message
    })
  }
})

//详情页根据id 点赞
router.post('/api/detail/dianzan',async (req,res) => {
  const body = req.body
  try {
    const model = await CategoryModel.findByIdAndUpdate(req.body._id,{dianzan:body.dianzan,isDianzan:body.isDianzan})
    CategoryModel.find({_id:req.body._id},function (err,ret) {
        res.send({code:0,data:ret})
    })
  }catch (e) {
    res.send({
      err_code:500,
      msg: e.message
    })
  }
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

//获取交流中心信息
router.get('/api/communication',async (req,res)=>{
  const model = await Discuss.find()
  res.send({code:0,data:model})
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

//交流中心图片上传
router.post(
    "/api/communication/imgload",
    multer({
      //设置文件存储路径
      dest: "public/comImages",
    }).array("file", 1),
    function (req, res, next) {
      let files = req.files;
      let file = files[0];
      let fileInfo = {};
      let path = "public/comImages/" + Date.now().toString() + "_" + file.originalname;
      fs.renameSync("./public/comImages/" + file.filename, path);
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

//交流中心我要发表
router.post('/api/publicDialog',async (req,res)=>{
  const body = req.body

  // id序号每次新增就 +1
  const model = await Discuss.find()
  const dd = model[model.length-1]
  body['id'] = dd.id+1

  new Discuss(body).save((err,ret)=> {
    if(err){
      res.send({
            err_code:500,
            msg: err.message
          })
    } else {
      res.send({code:0,data:ret,msg:'添加成功'})
    }
  })
})

//根据id 添加交流中心我要评论
router.post('/api/publicDialog/pinglun',async (req,res) => {
  const body = req.body
  try {
    const model = await Discuss.findByIdAndUpdate(body._id,{pinglun:body.pinglun})
    Discuss.find({_id:body._id},function (err,ret) {
      res.send({code:0,data:ret})
    })
  }catch (e) {
    res.send({
      err_code:500,
      msg: e.message
    })
  }
})

//交流中心按照内容搜索
router.post('/api/publicDialog/search',async (req,res)=> {
  const body = req.body.content
  try {
   const model = await Discuss.find({content:{ $regex: body}})
    res.send({code:0,data:model})
  }catch (e) {
    res.send({
      err_code:500,
      msg: e.message
    })
  }
})

//交流中心根据id 点赞
router.post('/api/publicDialog/dianzan',async (req,res) => {
  const body = req.body
  try {
    const model = await Discuss.findByIdAndUpdate(body._id,{dianzanNumber:body.dianzanNumber,isDianzan:body.isDianzan})
    Discuss.find({_id:body._id},function (err,ret) {
      res.send({code:0,data:ret})
    })
  }catch (e) {
    res.send({
      err_code:500,
      msg: e.message
    })
  }
})

module.exports = router;
