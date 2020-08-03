const http = require('http');
const cheerio = require('cheerio');
const express = require('express');
const bodyPaser = require('body-parser');
const mongoose = require('mongoose');
const Cities = require('./models/Cities');
const Cinema = require('./models/Cinema');
let cityList,udcityList,cinemaList;

//爬到城市列表
// http.get('http://39.97.33.178/api/cityList',function(res){
//     var data = '';
//     res.on('data',function(chunk){
//         data += chunk;
//     });
//     res.on('end',function(){
//         data = JSON.parse(data);
//         console.log(data.data.cities);
//         udcityList = data.data.cities;
//         cityList = formatCityList(data.data.cities);
//            // 将爬到的城市信息放在数据库里
//          for(let i in udcityList){
//         let city = new Cities({
//             id:udcityList[i].id,
//             nm:udcityList[i].nm,
//             isHot:udcityList[i].isHot,
//             py:udcityList[i].py,
//         })
//         city.save();
//     }

//     })
// });

// for(let i = 500; i < 1000; i++) {
//     console.log(i+1);
//     http.get(`http://39.97.33.178/api/cinemaList?cityId=${i+1}`,function(res){
//         var data = '';
//         res.on('data',function(chunk){
//             data += chunk;
//         });
//         res.on('end',function(){
//             data = JSON.parse(data);
//             cinemaList = data.data.cinemas;
//             if(cinemaList != undefined){
//             // 将爬到的城市信息放在数据库里
//                 for(let j in cinemaList){
//                     let cinema = new Cinema({
//                         id:cinemaList[j].id,
//                         mark:cinemaList[j].mark,
//                         sellPrice:cinemaList[j].sellPrice,
//                         nm:cinemaList[j].nm,
//                         addr:cinemaList[j].addr,
//                         isHave:0,
//                         hall:[[],[],[]],
//                         cities:i+1
//                     })
//                     cinema.save();
//                 }   
//             }
//         })
//     });
// }
//搭建本地服务
var server = express();
server.get('/',function(req,res,next){
    res.send('dasds');
})
mongoose.connect('mongodb://localhost:27019/new',{useNewUrlParser: true},function(err){
    if(err){
        console.log('数据库连接失败');
    }else{
        console.log('数据库连接成功');
        server.listen(8081);
 
    }
})
//配置接口访问
server.use(bodyPaser.urlencoded({extended:true}));
server.use(bodyPaser.json());
server.use(function(req, res, next) { 
    res.header("Access-Control-Allow-Origin", "*"); 
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
server.use('/admin',require('./routers/admin'));







