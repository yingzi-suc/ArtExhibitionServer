const express = require('express')
const md5 = require('blueimp-md5')
const multer = require('multer')
const fs = require('fs')
const router = express.Router()
const filter = {password: 0, __v: 0} // 指定过滤的属性
const UserModel = require('../model/admin/user')
const ExhibitionCategory =require('../model/admin/exhibitionoverview')
const CategoryModel = require('../model/web/exhibitionCategory')
const ArtHead = require('../model/web/artHeadLines')
const Discuss = require('../model/web/discuss')
const Loginlog = require('../model/web/loginlog')

//用户注册路由
router.post('/api/admin/user/register', async (req, res) => {
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

      // req.session.user = user
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
router.post('/api/admin/user/login',async (req,res) => {
    const {username,password,loginDate} = req.body
    try {
      const user = await UserModel.findOneAndUpdate(username,{loginDate:loginDate})
      const users = await UserModel.findOne({username,password:md5(md5(password))},filter)
      if(users) {
        res.send({code:0,data: {token:"admin-token",user:users}})
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

//admin/info
router.get('/api/admin/info',async (req,res)=>{
    res.send({code:0,data: {roles:["admin"],name:"Super Admin",avatar:"http://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif",introduction:"I am a super administrator"}})
  })

  //退出登录
  router.post('/api/admin/user/logout',async(req,res) =>{
    const {username,logoutDate} = req.body
    console.log(req.body)
    try {
      const user = await UserModel.findOneAndUpdate(username,{logoutDate:logoutDate})
      res.send({code:0,data: {msg:'退出成功'}})
    } catch(e){
      res.send({
        err_code:500,
        msg: e.message
      })
    }
  })

  //获取首页的展会总览
  router.get('/api/admin/home/exhibitionoverview',async(req,res)=>{
    try {
      const exhibitions = await CategoryModel.find()
      // 展会总览数据
      let total = exhibitions.length
      let cityList = []
      let approvalsnum = 12
      let unapprovalsnum = 0
      exhibitions.forEach(item => {
        cityList.push(item.city)
        if(item.isApproval ==true) {
          approvalsnum +=1
        } else {
          unapprovalsnum = total - approvalsnum
        }

      })
      let cityli = Array.from(new Set(cityList)) //去掉数组中重复的值转化为新数组
      let citynum = cityli.length 
      const data = await new ExhibitionCategory({total,approvalsnum,unapprovalsnum,citynum}).save()
      res.send({code:0,data})
      
      
    }catch(e){
      res.send({
        err_code:500,
        msg: e.message
      })
    }
  })

  //获取首页的艺术头条
  router.get('/api/admin/home/artheadlines',async(req,res)=>{
    try {
      const art = await ArtHead.find()
      res.send({code:0,data:art.reverse()})
    }catch(e){
      res.send({
        err_code:500,
        msg: e.message
      })
    }
  })
  // 获取首页的城市展会分类
  router.get('/api/admin/home/cityclassification',async(req,res)=>{
    try {
      const exhibitions = await CategoryModel.find()
      let arr=[]
      exhibitions.forEach(item => {
        arr.push(item.city)
      })
      let newArr = [...new Set(arr)];  // 对原始数组去重
      var list = [];
      newArr.forEach(i => {
          list.push(arr.filter(t => t === i))
      })
      var mlist = [];
      list.forEach((i, index) => {
          mlist.push({
              name: newArr[index],
              num: i.length,
          })
      })
      let total = exhibitions.length
      mlist.forEach(i =>{
        if(i.name == 1) {
          i.name = "成都"
        } else if(i.name == 2) {
          i.name = "上海"
        }else if(i.name == 3) {
          i.name = "北京"
        }else if(i.name == 4) {
          i.name = "深圳"
        }else if(i.name == 5) {
          i.name = "福建"
        }else{
          i.name = "江苏"
        }
        i.percentage = (i.num/total).toFixed(2)*100
      })
      res.send({code:0,data:mlist})
      
    }catch(e){
      res.send({
        err_code:500,
        msg: e.message
      })
    }
  })
  // 获取首页的交流中心
  router.get('/api/admin/home/communicationcenter',async(req,res)=>{
    try {
      const data = await Discuss.find()
      let discuss = []
      data.forEach(item =>{
        discuss.push({
          username:item.username,
          content:item.content,
          time:item.time
        })
      })
      res.send({code:0,data:discuss.reverse()})
    }catch(e){
      res.send({
        err_code:500,
        msg: e.message
      })
    }
  })
// 获取登录日志数据
router.get('/api/admin/loginLog',async(req,res)=>{
  try {
    const data = await Loginlog.find()
    res.send({code:0,data:data.reverse()})
  }catch(e){
    res.send({
      err_code:500,
      msg: e.message
    })
  }
})

  
module.exports = router;