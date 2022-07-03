const router = require('koa-router')()
const multer = require('@koa/multer'); // 引入
const DB = require('../database/index')
// const path = require('path')
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/images/"); // 储存路径
  },
  filename: function (req, file, cb) {

    var fileFormat = file.originalname.split("."); // 获取文件后缀
    cb(null, Date.now() + "." + fileFormat[fileFormat.length - 1]); // 生成文件
  }
});

const baseUrl = 'http://192.168.1.4:3001/'

const upload = multer({ storage: storage }); // note you can pass `multer` options here
router.prefix('/upload')

router.get('/', function (ctx, next) {
  ctx.body = 'this is a data response!'
})

router.post('/addShops', upload.single('file'), async function (ctx, next) {
  console.log('ctx.request.file', ctx.request.file);
  console.log('ctx.file', ctx.file);
  console.log('ctx.request.body', ctx.request.body);

  let shopInfo = {
    name: ctx.request.body.name,
    newPrice: ctx.request.body.newPrice,
    oldPrice: ctx.request.body.newPrice,
    class: ctx.request.body.class,
    info: ctx.request.body.info,
    isHot: 0,
    imgUrl: baseUrl + ctx.file.filename,
    cClass: ''
  }

  switch (shopInfo.class) {
    case 'computer':
      shopInfo.cClass = '电脑'
      break;
    case 'sweep':
      shopInfo.cClass = '扫地机器人'
      break;
    case 'phone':
      shopInfo.cClass = '手机'
      break;
    case 'pot':
      shopInfo.cClass = '电饭锅'
      break;
    case 'TV':
      shopInfo.cClass = '电视'
      break;
    case 'watch':
      shopInfo.cClass = '智能手表'
      break;
    default:
      break;
  }

  console.log(shopInfo);

  const insertResult = await DB.insertDocuments('shops',[shopInfo])
  console.log(insertResult);
  const res = ctx.request.body;
  if(insertResult.acknowledged == true && insertResult.insertedCount == 1) {
    ctx.body = {
      err_code: 0,
      message: '商品添加成功',
    }
  } else {
    ctx.body = {
      err_code: 1,
      message: '商品添加失败',
    }
  }
  console.log(res);
  
})
router.post('/img', upload.single('file'), function (ctx, next) {
  // console.log('ctx.request.file', ctx.request.file);
  // console.log('ctx.file', ctx.file);
  // console.log('ctx.request.body', ctx.request.body);
  // console.log(path.join(ctx.file.destination, ctx.file.filename));
  const filename = ctx.file.filename
  const res = ctx.request.body;
  console.log(res);
  ctx.body = {
    err_code: 0,
    message: '上传成功',
    filename
  }

})

module.exports = router;