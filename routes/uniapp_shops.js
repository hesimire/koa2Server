const router = require('koa-router')()
const DB = require('../database/index')

router.prefix('/shops')


// 获取商品列表
router.get('/', async function (ctx, next) {
  // ctx.body = 'this is a data response!'
  const ListNum = ctx.request.query.ListNum;
  const ListType = ctx.request.query.listType;
  console.log(ListType);

  const rgb = new RegExp("" + ListType + "")
  const List = await DB.findDocuments('shops', {
    cClass: rgb
  })

  let startNum = (ListNum - 1) * 6;
  let limitNum = startNum + 5;
  let isOver = List.length > startNum
  const dataArr = []
  // console.log(startNum, limitNum, isOver);
  for (; startNum <= limitNum && startNum <= List.length - 1; startNum++) {
    dataArr.push(List[startNum])
  }
  ctx.body = {
    err_code: 0,
    message: 'OK',
    dataArr: dataArr,
    isOver: !isOver
  }
})

// 查询商品
router.get('/findByKeys', async function (ctx, next) {
  // ctx.body = 'this is a data response!'
  const ListNum = ctx.request.query.ListNum;
  const ListType = ctx.request.query.listType;

  const rgb = new RegExp("" + ListType + "")
  const List = await DB.findDocuments('shops', {
    cClass: rgb
  })

  console.log(List.length);
  // let startNum = (ListNum - 1) * 6;
  // let limitNum = startNum + 5;
  // let isOver = List.length > startNum
  // const dataArr = []
  // // console.log(startNum, limitNum, isOver);
  // for (; startNum <= limitNum && startNum <= List.length - 1; startNum++) {
  //   dataArr.push(List[startNum])
  // }
  ctx.body = {
    err_code: 0,
    message: '查询成功',
    // dataArr: dataArr,
    // isOver: !isOver
  }
})

router.get('/swiperData', async function (ctx, next) {
  const List = await DB.findDocuments('swipper', {})
  ctx.body = {
    err_code: 0,
    message: '查询成功',
    dataArr: List,
  }
})

// 后台商品列表
router.get('/ViteShopsList', async function (ctx, next) {
  const dataArr = await DB.findDocuments('shops', {})
  // let startNum = (hotListNum - 1) * 6;
  // let limitNum = startNum + 5;
  // let isOver = hotList.length > startNum
  // const dataArr = []
  // // console.log(startNum, limitNum, isOver);
  // for (; startNum <= limitNum && startNum <= hotList.length - 1; startNum++) {
  //   dataArr.push(hotList[startNum])
  // }
  ctx.body = {
    err_code: 0,
    message: 'OK',
    dataList: dataArr,
    // isOver: !isOver
  }
})


// 修改商品
router.patch('/updateShop', async (ctx, next) => {
  let shopData = ctx.request.body;
  let { key, name, imgUrl, newPrice, oldPrice, isHot, info } = shopData;
  const filter = {
    _id: DB.getObjectId(key)
  }

  const data = {
    name,
    imgUrl,
    newPrice,
    oldPrice,
    class:shopData.class,
    isHot,
    info,
    imgUrl
  }

  switch (data.class) {
    case 'computer':
      data.cClass = '电脑'
      break;
    case 'sweep':
      data.cClass = '扫地机器人'
      break;
    case 'phone':
      data.cClass = '手机'
      break;
    case 'pot':
      data.cClass = '电饭锅'
      break;
    case 'TV':
      data.cClass = '电视'
      break;
    case 'watch':
      data.cClass = '智能手表'
      break;
    default:
      break;
  }

  // console.log(data);
  const updateDataResult = await DB.updateDocument('shops', filter, data);
  console.log(updateDataResult);


  // const foundResult = await DB.findDocuments('shops', filter)
  // console.log(foundResult);

  if (updateDataResult.acknowledged == true && updateDataResult.modifiedCount == 1) {
    ctx.body = {
      err_code: 0,
      message: '修改成功',
    }
  } else if(updateDataResult.acknowledged == true && updateDataResult.matchedCount == 1) {
    ctx.body = {
      err_code: 0,
      message: '修改成功',
    }
  } else {
    ctx.body = {
      err_code: 1,
      message: '修改失败',
    }
  }
})


// 删除商品
router.post('/deleteShops', async (ctx, next) => {
  const Data = ctx.request.body;
  const deleteDataResult = await DB.removeDocument('shops', {
    _id: DB.getObjectId(Data._id)
  })
 
  console.log(deleteDataResult);
  if (deleteDataResult.acknowledged == true && deleteDataResult.deletedCount == 1) {
    ctx.body = {
      err_code: 0,
      message: '删除成功',
    }
  } else {
    ctx.body = {
      err_code: 1,
      message: '删除失败',
    }
  }

})
module.exports = router