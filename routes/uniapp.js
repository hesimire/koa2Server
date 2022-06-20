const router = require('koa-router')()
const DB = require('../database/index')

router.prefix('/uniapp')

router.get('/', function (ctx, next) {
  ctx.body = 'this is a users response!'
})

// 获取推荐商品列表
router.get('/hotList', async (ctx, next) => {
  const hotListNum = ctx.request.query.hotListNum
  const hotList = await DB.findDocuments('shops', {
    isHot: 1
  })
  let startNum = (hotListNum - 1) * 6;
  let limitNum = startNum + 5;
  let isOver = hotList.length > startNum
  const dataArr = []
  // console.log(startNum, limitNum, isOver);
  for (; startNum <= limitNum && startNum <= hotList.length - 1; startNum++) {
    dataArr.push(hotList[startNum])
  }
  ctx.body = {
    err_code: 0,
    message: 'OK',
    dataArr: dataArr,
    isOver: !isOver
  }
})


// 登录/注册
router.post('/login', async function (ctx, next) {
  // 获取用户post传值数据
  let userData = ctx.request.body;
  console.log(userData);
  let { account, password } = ctx.request.body;
  const findData = await DB.findDocuments('users', {
    account,
    password
  })
  if (findData.length > 0) {
    ctx.body = {
      err_code: 0,
      message: '登录成功',
      nickName: findData[0].nickName,
      _id: DB.getObjectId(findData[0]._id)
    }
  } else {
    const DataList = ctx.request.body;
    const InsertData = {
      account,
      password,
      nickName: '我的用户名'
    }
    const addData = await DB.insertDocuments('users', [InsertData])
    // console.log(addData);

    const findData2 = await DB.findDocuments('users', {
      _id: addData.insertedIds[0]
    })
    // console.log(findData2);
    ctx.body = {
      err_code: 0,
      message: '注册成功',
      nickName: findData2[0].nickName,
      _id: DB.getObjectId(findData2[0]._id)
    }
  }
  console.log(findData);
})

// 修改用户信息
router.post('/update', async function (ctx, next) {
  // 获取用户post传值数据
  let userData = ctx.request.body;
  let { account, password, userId, nickName } = userData;

  console.log(userData);
  const filter = {
    _id: DB.getObjectId(userId)
  }

  const data = {
    account,
    password,
    nickName
  }
  const updateDataResult = await DB.updateDocument('users', filter, data);
  console.log(updateDataResult);

  const foundResult = await DB.findDocuments('users', {
    _id: DB.getObjectId(userId)
  })
  console.log(foundResult);

  ctx.body = {
    err_code: 0,
    message: '修改成功',
    nickName: foundResult[0].nickName,
    _id: DB.getObjectId(foundResult[0]._id)
  }
})




module.exports = router
