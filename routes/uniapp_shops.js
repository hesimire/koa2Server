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

router.get('/swiperData',async function (ctx, next) {
  const List = await DB.findDocuments('swipper', { })
  ctx.body = {
    err_code: 0,
    message: '查询成功',
    dataArr: List,
  }
})

module.exports = router