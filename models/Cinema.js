/* 
影厅数据的模型 在操作数据库的时候不是直接操作结构 而是操作模型 模型又是以用户结构为基础的  
*/
var mongoose = require('mongoose');
//引入影厅表结构
var cinemaSchema = require('../schemas/cinema.js');
//输出模块         创建模型
module.exports = mongoose.model('Cinema',cinemaSchema);