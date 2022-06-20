const router = require('koa-router')()
const { Db } = require('mongodb')
const DB = require('../database/index')

router.prefix('/carts')

router.get('/', function (ctx, next) {
  ctx.body = 'this is a data response!'
})

// 购物车状态
// 1 未发货
// 2 已发货
// 3 已收货
router.post('/addCart', async function (ctx, next) {
  ctx.body = 'this is a data/bar response';
  const dataCart = ctx.request.body;
  const InsertData = {
    userId: dataCart.userId,
    carts: dataCart.data,
    status: 1
  }

  const result = await DB.insertDocuments('carts', [InsertData])

  if (result.acknowledged == true && result.insertedCount == 1) {
    ctx.body = {
      err_code: 0,
      message: '订单提交成功',
    }
  } else {
    ctx.body = {
      err_code: 1,
      message: '提交订单发生错误',
    }
  }



})


// 获取所有订单列表
router.post('/getCartMoreList', async (ctx, next) => {
  const data = ctx.request.body;
  const foundResult = await DB.findDocuments('carts', {
    userId: data.userID,
  })
  ctx.body = {
    err_code: 0,
    message: '订单发起成功',
    dataArr: foundResult
  }
})

// 获取相应订单列表
router.post('/getCartMoreListByStatus', async (ctx, next) => {
  const data = ctx.request.body;
  console.log(data.status);
  const foundResult = await DB.findDocuments('carts', {
    userId: data.userID,
  })

  console.log(foundResult);
  const DataList = []

  foundResult.forEach((item) => {
    if(item.status == data.status) {
      DataList.push(item)
    }
  })

  console.log(DataList);

  ctx.body = {
    err_code: 0,
    message: '订单发起成功',
    dataArr: DataList
  }
})


// 订单收货
router.post('/changeCarts', async (ctx, next) => {
  const data = ctx.request.body;
  console.log(data);
  const foundResult = await DB.findDocuments('carts', {
    userId: data.carts.userId,
    _id: DB.getObjectId(data.carts._id)
  })


  if (foundResult.length >= 1) {
    const updateDataResult = await DB.updateDocument('carts', {
      userId: data.carts.userId,
      _id: DB.getObjectId(data.carts._id)
    }, {
      status: 3
    });
    console.log(updateDataResult);
    if (updateDataResult.acknowledged == true && updateDataResult.modifiedCount == 1) {
      ctx.body = {
        err_code: 0,
        message: '订单收货成功',
      }
    } else {
      ctx.body = {
        err_code: 0,
        message: '订单收货失败',
      }
    }
  }

  // console.log(foundResult);

})


// 订单数量
router.post('/getCartMoreListNum', async function (ctx, next) {
  const data = ctx.request.body;
  console.log(data);
  const foundResult = await DB.findDocuments('carts', {
    userId: data.userId,
  })

  // doneSendCarts: [],
  // 	hasSendCarts: [],
  // 	hasOwnCarts: [],
  const DataList = [0, 0, 0]
  foundResult.forEach((item, index) => {
    if (item.status)
      switch (item.status) {
        case 1:
          DataList[0] += 1;
          break;
        case 2:
          DataList[1] += 1;
          break;
        case 3:
          DataList[2] += 1;
          break;
        default:
          break;
      }
  })

  console.log(DataList);
  console.log(foundResult);
  ctx.body = {
    err_code: 0,
    message: '订单发起成功',
    // dataArr: foundResult
    ListNum:DataList
  }
})

module.exports = router