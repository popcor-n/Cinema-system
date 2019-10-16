var mongoose = require('mongoose');
//定义 内容结构
module.exports =  new  mongoose.Schema({

    id:String,
    mark:String,
    sellPrice:String,
    nm:String,
    addr:String,
    isHave:{
        type:Number,
        default:0
    },
    hall:{
        type:Array,
        // default:[{'movie':{},'seat':{}},{'movie':{},'seat':{}},{'movie':{},'seat':{}}],
        defult:[[],[],[]]
    },
    //关联字段：
    cities:{
        //类型
        type:String,
        //引用
        ref:'Cities'
    },
})