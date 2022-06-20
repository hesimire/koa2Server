const router = require('koa-router')()
const svgCaptcha = require('svg-captcha')

router.prefix('/svg')

router.get('/', function (ctx, next) {
  ctx.body = 'this is a users response!'
})

router.get('/captcha', function (ctx, next) {
  // 获取图片验证码
  let codeConfig = {
    size: 4,// 验证码长度
    ignoreChars: '0o1i', // 验证码字符中排除 0o1i
    noise: 2, // 干扰线条的数量
    height: 30,
    width:100,
    inverse: false,
    fontSize: 40,
  }
  let captcha = svgCaptcha.create(codeConfig);
  ctx.body = {
    err_code: 0,
    message: 'OK',
    text:captcha.text,
    img: captcha.data
  }
})

module.exports = router