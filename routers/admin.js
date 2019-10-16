const express = require('express');
const router = express.Router();
const Cities = require('../models/Cities');
const Cinema = require('../models/Cinema');
const http = require('http');
function deepCopy(obj) {
    var result = Array.isArray(obj) ? [] : {};
    for (var key in obj) {
      if (obj.hasOwnProperty(key)) {
        if (typeof obj[key] === 'object') {
          result[key] = deepCopy(obj[key]);   //递归复制
        } else {
          result[key] = obj[key];
        }
      }
    }
    return result;
}

function delById(arr,val){
    for(let i = 0; i < arr.length; i++){
        if(arr[i].id == val){
            arr.splice(i,1);
            console.log(i);
            break;
        }
    }
}
//做城市按首字母排序
function formatCityList(cities){
    var cityList = [];
    var hotList = [];
    //热门城市
    for(var i=0;i<cities.length;i++){
        if(cities[i].isHot === 1){
            hotList.push( cities[i] );
        }
    }
    //添加索引
    for(var i=0;i<cities.length;i++){
        var firstLetter = cities[i].py.substring(0,1).toUpperCase();
        if(toCom(firstLetter)){  //新添加index
            cityList.push({ index : firstLetter , list : [ { nm : cities[i].nm , id : cities[i].id } ] });
        }
        else{   //累加到已有index中
            for(var j=0;j<cityList.length;j++){
                if( cityList[j].index === firstLetter ){
                    cityList[j].list.push( { nm : cities[i].nm , id : cities[i].id } );
                }
            }
        }
    }
    //排序
    cityList.sort((n1,n2)=>{
        if( n1.index > n2.index ){
            return 1;
        }
        else if(n1.index < n2.index){
            return -1;
        }
        else{
            return 0;
        }
    });
    //判断索引是否已经存在
    function toCom(firstLetter){
        for(var i=0;i<cityList.length;i++){
            if( cityList[i].index ===  firstLetter){
                return false;
            }
        }
        return true;
    }
    // console.log(cityList)
    // console.log(hotList)
    return {
        cityList,
        hotList
    };

}
router.use(function(req,res,next){
    Responsedata = {
        code:0,//无错
        message:''
    }
    next();
})
router.post('/cityList',function(req,res){
    Cities.find().then((cities)=>{
        Responsedata.message = [formatCityList(cities),cities];
        res.json(Responsedata);
    })
   
})
router.post('/cinemaFindByCity',function(req,res){
   console.log(req.body.req);
   Cinema.find({cities:req.body.req}).then(function(cinema){
        if(cinema == false){
            Responsedata.code = 1;
            Responsedata.message = '该城市暂无影院信息';
            
        }else{
            Responsedata.message = cinema;
        }
        res.json(Responsedata);
    })
})
router.post('/movOnInfoList',function(req,res){
    let movieList = null;
    console.log(req.body.req);
    http.get(`http://39.97.33.178/api/movieOnInfoList?cityId=${req.body.req}`,function(re){
        var data = '';
        re.on('data',function(chunk){
            data += chunk;
        });
        re.on('end',function(){
            movieList = JSON.parse(data);
            Responsedata.message = movieList.data.movieList;
            res.json(Responsedata);    
            console.log(Responsedata);
        })
    })
})
router.post('/addMov',function(req, res) {
    let array;
    console.log(req.body);
    let is = 0;
    Cinema.findOne({'id':req.body.cinema.toString()}).then(function(fs){
        // console.log(fs.hall);
        array = deepCopy(fs.hall);
        console.log(req.body);
        // array[req.body.hall-1].movie.id = req.body.movie;
        for(let i  = 0; i< array[req.body.hall-1].length; i++){
            if(array[req.body.hall-1][i].id == req.body.movie){
                is = 1;
            }
        }
        if(is == 1){
            Responsedata.message = '已添加过该影片';
            Responsedata.code = 1;
        }else{
            array[req.body.hall-1].push({id:req.body.movie,bTime:req.body.bTime,eTime:req.body.eTime,seat:[]})
            console.log(array);
            fs.hall = array;
            fs.isHave = 1;
            fs.save();
            Responsedata.message = fs.hall;
        }
        
        res.json(Responsedata);
        // Cinema.update({'id':'req.body.cinema'},{$set:{'hall':array}});
    })    
})
router.post('/delMov',function(req,res) {
    let array;    
    // console.log(req.body);
    Cinema.findOne({'id':req.body.cinema.toString()}).then(function(fs){
        array = deepCopy(fs.hall);
        // console.log(array);
        // console.log(req.body.movie.toString());
        delById(array[req.body.hall-1],req.body.movie.toString());
        // console.log(array);
        fs.hall = array;
        fs.isHave = 0;
        fs.save();
        Responsedata.message = '删除成功';
        res.json(Responsedata);

    })
})
router.post('/buyMov',function(req,res) {
    let array;    
    // console.log(req.body);
    let is = 0;
    Cinema.findOne({'id':req.body.cinema.toString()}).then(function(fs){
        array = deepCopy(fs.hall);
        // delById(array[req.body.hall-1],req.body.movie.toString());
        console.log(array[req.body.hall-1]);
        if(array[req.body.hall-1] == []){
            Responsedata.message = '未找到对应场次影片';
            console.log('k1');
            Responsedata.code = 1;
        }else{
            for(let i  = 0; i< array[req.body.hall-1].length; i++){
                if(array[req.body.hall-1][i].id == req.body.movie){
                    array[req.body.hall-1][i].seat.push([req.body.hang,req.body.lie,req.body.userId]);
                    is = 1;
                }
            }
            if(is == 0){
                Responsedata.message = '未找到对应场次影片';
                Responsedata.code = 1;
            }else{
                fs.hall = array; 
                fs.save();
                Responsedata.message = '购票成功';
            }
            // console.log(array);
        }
        res.json(Responsedata);
    })
})
router.post('/findSeat',function(req,res){
    // console.log(req.body);
    let is = 0;
    let seatList,result = [];
    Cinema.findOne({'id':req.body.cinema.toString()}).then(function(fs){
        
        console.log(fs.hall[req.body.hall-1]);
        if(fs.hall[req.body.hall-1] == []){
            Responsedata.message = '未找到对应场次影片';
            Responsedata.code = 1;
        }else{
            for(let i  = 0; i< fs.hall[req.body.hall-1].length; i++){
                if(fs.hall[req.body.hall-1][i].id == req.body.movie){
                    seatList = fs.hall[req.body.hall-1][i].seat;
                    is = 1;
                }
            }
            if(is == 0){
                Responsedata.message = '未找到对应场次影片';
                Responsedata.code = 1;
            }else{
                for(let i = 0; i < seatList.length; i++) {
                    result.push([Number(seatList[i][0]),Number(seatList[i][1])]);
                }
                Responsedata.message = result;
            }
            // console.log(array);
        }
        res.json(Responsedata);
    })
})
router.post('/findMov',function(req,res){
    let array;
    Cinema.findOne({id:req.body.id}).then(function(fs){
        array = deepCopy(fs.hall);
        console.log(array);
        Responsedata.message = array;
        res.json(Responsedata);
        
    })
})

module.exports = router;
