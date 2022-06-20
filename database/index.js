const MongoDB = require('mongodb');
const MongoClient = MongoDB.MongoClient;
const ObjectID = MongoDB.ObjectId;
const CONFIG = {
  dbUrl: 'mongodb://127.0.0.1:27017/',
  dbName: 'koa'
};

class DB {
  static getInstance() {
    if (!DB.instance) {
      DB.instance = new DB();
    }
    return DB.instance;
  }
  constructor() {
    this.dbClient = '';
    this.connect();
  }
  /**
   * 数据库连接
   * @returns new DB
   */
  connect() {
    return new Promise(((resolve, reject) => {
      // 判断是否有数据库连接
      if (!this.dbClient) {
        MongoClient.connect(CONFIG.dbUrl, (err, client) => {
          if (err) {
            reject(err);
          } else {
            this.dbClient = client.db(CONFIG.dbName);
            resolve(this.dbClient);
          }
        })
      } else {
        resolve(this.dbClient);
      }
    }))
  }
  /**
   * 数据库插入多条数据
   * @param {集合名称} collectionName :Str
   * @param {要插入的数据集合} jsonArr :Arr
   * @returns 返回操作结果
   */
  insertDocuments(collectionName, jsonArr) {
    if (!collectionName || !jsonArr || !(jsonArr instanceof Array)) throw '参数错误';
    return new Promise((resolve, reject) => {
      this.connect().then(db => {
        const collect = db.collection(collectionName);
        collect.insertMany(jsonArr, (err, result) => {
          if (!err) {
            resolve(result);
          } else {
            reject(err);
          }
        })
      })
    })
  }
   /**
   * 数据库查找
   * @param {集合名称} collectionName :Arr
   * @param {查找的数据集合} json :obj
   * @returns 返回操作结果
   */
  findDocuments(collectionName, json) {
    if (!collectionName || !json) throw '参数错误';
    return new Promise((resolve, reject) => {
      this.connect().then(db => {
        let result = db.collection(collectionName).find(json);
        result.toArray((err, data) => {
          if (!err) {
            resolve(data);
          } else {
            reject(err);
          }
        })
      })
    })
  }
   /**
   * 数据库查找  XXXX
   * @param {集合名称} collectionName :Arr
   * @param {查找的数据集合} json :obj
   * @returns 返回操作结果
   */
    findOneDocument(collectionName, json) {
      if (!collectionName || !json) throw '参数错误';
      return new Promise((resolve, reject) => {
        this.connect().then(db => {
          let result = db.collection(collectionName).findOne(json);
          result.toArray((err, data) => {
            if (!err) {
              resolve(data);
            } else {
              reject(err);
            }
          })
        })
      })
    }

  /**
   * 数据删除
   * @param {Str集合名称} collectionName 
   * @param {Obj删除的数据} json 
   * @returns 删除结果
   */
  removeDocument(collectionName, json) {
    if (!collectionName || !json) throw '参数错误';
    return new Promise(((resolve, reject) => {
      this.connect().then(db => {
        const collection = db.collection(collectionName);
        collection.deleteOne(json, (err, result) => {
          if (!err) {
            resolve(result);
          } else {
            reject(err);
          }
        })
      })
    }))
  }
  /**
   * 数据更新(一条)
   * @param {Str集合名称} collectionName 
   * @param {Obj查找的条件} filter 
   * @param {Obj更改之后的数据} json 
   * @returns 操作结果
   */
  updateDocument(collectionName, filter, json) {
    if (!collectionName || !filter || !json) throw '参数错误';
    return new Promise((resolve, reject) => {
      this.connect().then(db => {
        const collection = db.collection(collectionName);
        collection.updateOne(filter, { $set: json }, (err, result) => {
          if (!err) {
            resolve(result)
          } else {
            reject(err)
          }
        })
      })
    })
  }
  getObjectId(id) {    /*mongodb里面查询 _id 把字符串转换成对象*/
    return new ObjectID(id);
  }
}

module.exports = DB.getInstance();

// 查找所有 查找一条 更新 删除 插入


