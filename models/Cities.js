/* 
城市数据的模型 在操作数据库的时候不是直接操作结构 而是操作模型 模型又是以结构为基础的  
*/
var mongoose = require('mongoose');
//引入城市表结构
var citySchema = require('../schemas/city.js');
//输出模块         创建模型
module.exports = mongoose.model('Cities',citySchema);