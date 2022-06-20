const router = require('koa-router')()
const DB = require('../database/index')

router.prefix('/shops')


// 获取商品列表
router.get('/', async function (ctx, next) {
  // ctx.body = 'this is a data response!'
  const ListNum = ctx.request.query.ListNum;
  const List = await DB.findDocuments('shops', {})
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

router.get('/swiperData', function (ctx, next) {



})

module.exports = router