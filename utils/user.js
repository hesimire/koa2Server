const { log } = require('console');
const fs = require('fs');
const path = require('path')

// 基地址
const fileName1 = path.join(__dirname, '../public/json/user.json');
const fileName2 = path.join(__dirname, '../public/json/indexuser.json');


// let params = {
//   account: 'admin',
//   password: '123456'
// }

// 读取users文件数据 并且用promise封装
function enroll(option) {
  // 判断需要读取的文件 返回响应文件
  console.log(option);
  console.log(typeof option);
  if(option == 1) {
    return new Promise((res, rej) => {
      fs.readFile(fileName1, 'utf8', (err, data) => {
        if (err) {
          rej(err)
        }
        res(JSON.parse(data))
      })
    })
  } else if (option == 2) {
    return new Promise((res, rej) => {
      fs.readFile(fileName2, 'utf8', (err, data) => {
        if (err) {
          rej(err)
        }
        res(JSON.parse(data))
      })
    })
  }
  return Promise.resolve(1)
}

// 比较用户登录时是否能成功登录
function isToLogin(userData, usersDataList) {
  console.log(userData, usersDataList);
  // 查找相应数据
  let userDataIn = usersDataList.userArr.filter((item, index) => {
    if (item.account == userData.account && item.password == userData.password) {
      return item;
    }
  });
  console.log(userDataIn);
  return userDataIn;
}

module.exports = {
  enroll,
  isToLogin
}