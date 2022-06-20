const router = require('koa-router')()

router.prefix('/data')

router.get('/', function (ctx, next) {
  ctx.body = 'this is a data response!'
})

router.get('/swiperData', function (ctx, next) {

  ctx.body = 'this is a data/bar response'
  
})

module.exports = router;