const router = require('koa-router')()
// const users = require('../public/json/user.json')

const { enroll, isToLogin } = require('../utils/user')

router.prefix('/users')

router.get('/', function (ctx, next) {
  ctx.body = 'this is a users response!'
})

router.get('/bar', function (ctx, next) {
  ctx.body = 'this is a users/bar response'
})

router.post('/login', async function (ctx, next) {
  // 获取用户post传值数据
  let userData = ctx.request.body;
  console.log(userData);
  // 获取用户json数据
  let data = await enroll();
  // 将数据进行比较
  let isLogin = isToLogin(userData, data)
  console.log(isLogin);
  ctx.body = ctx.request.body;
})

module.exports = router
