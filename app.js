const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const cors = require('@koa/cors')

const index = require('./routes/index')
const users = require('./routes/users')
const datas = require('./routes/data')
const svg = require('./routes/svg')
const routeUsers = require('./routes/routeUsers')
const uniapp = require('./routes/uniapp')
const shops = require('./routes/uniapp_shops')
const carts = require('./routes/uniapp_cart')
const upload = require('./routes/upload')

// error handler
onerror(app)

// middlewares
app.use(cors())
app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
}))
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))
app.use(require('koa-static')(__dirname + '/public/images'))
// app.use(require('koa-static')(__dirname + '/public'))

app.use(views(__dirname + '/views', {
  extension: 'pug'
}))

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// routes
app.use(index.routes(), index.allowedMethods())
app.use(users.routes(), users.allowedMethods())
app.use(datas.routes(), datas.allowedMethods())
app.use(svg.routes(), svg.allowedMethods())
app.use(uniapp.routes(), uniapp.allowedMethods())
app.use(shops.routes(), shops.allowedMethods())
app.use(routeUsers.routes(), routeUsers.allowedMethods())
app.use(carts.routes(), carts.allowedMethods())
app.use(upload.routes(), upload.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app
