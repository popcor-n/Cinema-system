var mongoose = require('mongoose');
//定义 内容结构
module.exports =  new  mongoose.Schema({
   
    //分类名
    id:String,
    //内容
    nm:{
        type:String,
        default:''
    },
    isHot:{
        type:Number,
        default:''
    },
    py:{
        type:String,
        default:''
    }
})