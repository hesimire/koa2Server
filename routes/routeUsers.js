const router = require('koa-router')()
// const users = require('../public/json/user.json')

const { enroll, isToLogin } = require('../utils/user')
const DB = require('../database/index')
const { log } = require('debug/src/browser')

router.prefix('/routeUsers')

router.get('/', function (ctx, next) {
  ctx.body = 'this is a users response!'
})

router.get('/bar', function (ctx, next) {
  ctx.body = 'this is a users/bar response'
})

router.post('/login', async function (ctx, next) {
  // 获取用户post传值数据
  let userData = ctx.request.body;
  let { account, password } = ctx.request.body;
  const findData = await DB.findDocuments('adminUsers', {
    account,
    password
  })
  if (findData.length > 0) {
    ctx.body = {
      err_code: 0,
      message: 'OK',
      nickName: findData[0].nickName,
      userId: DB.getObjectId(findData[0]._id)
    }
  } else {
    ctx.body = {
      err_code: 1,
      message: '登录失败 用户名或者密码错误',
    }
  }
  console.log(findData);

})

// 获取管理用户列表
router.get('/getList', async (ctx, next) => {
  const findData = await DB.findDocuments('adminUsers', {})
  // console.log(findData);
  ctx.body = {
    err_code: 0,
    message: 'OK',
    dataList: findData
  }
})

// 新增管理用户
router.post('/addRouteUser', async (ctx, next) => {
  const DataList = ctx.request.body;
  const addData = await DB.insertDocuments('adminUsers', [DataList])
  // console.log(findData);
  console.log(addData);
  ctx.body = {
    err_code: 0,
    message: '添加成功',
  }
})

// 删除管理用户
router.post('/deleteRouteUser', async (ctx, next) => {
  const DataList = ctx.request.body;
  const deleteDataResult = await DB.removeDocument('adminUsers', {
    _id:DB.getObjectId(DataList._id)
  } )
  // console.log(findData);
  console.log(deleteDataResult);
  if(deleteDataResult.acknowledged == true && deleteDataResult.deletedCount == 1){
    ctx.body = {
      err_code: 0,
      message: '删除成功',
    }
  }  else {
    ctx.body = {
      err_code: 0,
      message: '删除失败',
    }
  }
 
})

// 修改管理用户
router.post('/updateRouteUser', async (ctx, next) => {
  const DataList = ctx.request.body;
  console.log(DataList);
  const filterD = {
    _id:DB.getObjectId(DataList.key)
  }
  const data = {
    account: DataList.account,
    password: DataList.password,
    status: DataList.status
  }
  const updateDataResult = await DB.updateDocument('adminUsers',filterD, data );
  console.log(updateDataResult);
  ctx.body = {
    err_code: 0,
    message: '修改成功',
  }
})

module.exports = router