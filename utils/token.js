
const jwt = require('jsonwebtoken')

const jwtSecret = '20220601zht'

const myJwt = jwt.sign(
  { message: "登录成功" },
  jwtSecret,
  {
    expiresIn: "20s"
  }
)