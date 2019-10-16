const go = document.getElementById('go');
const fOut = document.getElementById('fOut');
const fAll = document.getElementById('firAll');
const leAll = document.getElementById('left-all');
const cTable = document.getElementById('cinemaTable');
const fdj = document.getElementById('fdjpic');
let usersList;
const ipid = document.getElementById('ip_find_phone');

function setWH(url , arg){
    return url.replace(/w\.h/,arg);
  };
  
let cinemaList = [];
let disNo = (...element) => {
    for(let i of element){
        i.style.display = 'none';
    }
}
let disBl = (...element) => {
    for(let i of element){
        i.style.display = 'block';
    }
}
const ifPass = function() {
    if (ip1.value == 'admin' && ip2.value == 'Admin') {
       
        fOut.classList.add('fOutWell');
        fOut.classList.remove('fOutFail');    
        setTimeout(() => {
            fAll.classList.add('fAdone');  
            document.getElementById('secAll').style.display = 'block';
            window.location.hash = '';
            window.location.hash='#choCity';
        }, 1000);    
        window.location.hash = '#choCity';
    }else{
        fOut.classList.add('fOutFail');     
        
        setTimeout(() => {
            fOut.classList.remove('fOutFail');           
            document.getElementsByClassName('form-contorl').style = 'none';
            document.getElementById('ip2').value = '';
        }, 300);
        
    }
    console.log('go');
}
go.addEventListener('click',ifPass);
// 登录结束

// 请求城市列表

document.getElementById('headCinema').addEventListener('click',function(){
    if(cinemaList == false){
        layui.use('layer', function(){
            var layer = layui.layer;
            layer.open({
                title:'提示',
                anim:6,
                time:2000,
                shade: [0.8, '#393D49'],  
                content: '请先选择城市'
                ,btn: ['确定', '取消']
                
                ,btn1: function(index, layero){
                  //按钮【按钮二】的回调
                  window.location.hash = '#choCity';
                }
                ,btn2: function(index, layero){
                  //按钮【按钮三】的回调
                }
                ,cancel: function(){ 
                  //右上角关闭回调
                  
                  //return false 开启该代码可禁止点击该按钮关闭
                },end:function(){
                    window.location.hash = '#choCity'
                }
               
              })
          });  
    }else{
        window.location.hash = '#cinema';
    }
})


window.addEventListener('hashchange',function(){
    const hash = document.location.hash;
    if(hash == '#choCity'){
        disNo(document.getElementById('addMovData'));
        disNo(document.getElementById('user'));
        document.getElementById('cinemaData').style.display = 'none';
        document.getElementById('cinema').style.display = 'none';        
        document.getElementById('choCity').style.display = 'block';
        const xhr = new XMLHttpRequest();
        xhr.onload = function() {
            let leftAllTime = setInterval(function(){
                leAll.style.marginLeft = parseInt(leAll.style.marginLeft) - 5 + 'px';
                if(parseInt(leAll.style.marginLeft) <= 0){
                                  
                    leAll.style.marginLeft = '0px';
                    window.clearInterval(leftAllTime);
                }
            },10)
            while(document.getElementById('hotCtList').hasChildNodes()){
                　　    document.getElementById('hotCtList').removeChild(document.getElementById('hotCtList').firstChild);
            }
            while(document.getElementById('cityList').hasChildNodes()){
                　　    document.getElementById('cityList').removeChild(document.getElementById('cityList').firstChild);
            }
            let output = JSON.parse(xhr.responseText);
            console.log(output);
            for(let i = 0; i < output.message[0].hotList.length; i++) {
                document.getElementById('hotCtList').innerHTML += `<a class="city" id="${output.message[0].hotList[i]._id}"href=javascript:;>${output.message[0].hotList[i].nm}</a>`;
            }
            for(let i = 0; i < output.message[0].cityList.length; i++) {
                document.getElementById('cityList').innerHTML += `<div class="cityClass" id="ct${i}"></div><br>`
                for(let j = 0; j < output.message[0].cityList[i].list.length; j++) {
                    document.getElementById(`ct${i}`).innerHTML += `<a class="city" id="${output.message[0].cityList[i].list[j].id}"href=javascript:;>${output.message[0].cityList[i].list[j].nm}</a>`;
                }
            }
            for(let i = 0; i < 6; i++){
                document.getElementById(`ct${i}`).classList.add('current');
            }
            for(let i = 0; i < output.message[1].length; i++) {
                document.getElementById(`${output.message[1][i].id}`).addEventListener('click',function(){
                    document.getElementById('cityCur').innerHTML = output.message[1][i].nm;                
                    
                    let xhr = new XMLHttpRequest();
                    xhr.onload = function(){
                        let output = JSON.parse(xhr.responseText);
                        console.log(output);
                        cinemaList =  output.message;                        
                        window.location.hash = '#cinema';
                        
                    }
                    xhr.open('POST','http://localhost:8081/admin/cinemaFindByCity',true);
                    xhr.setRequestHeader("Content-type","application/json");
                    xhr.send(JSON.stringify({req:output.message[1][i].id})); 
        
                })
            }
            for(let i = 0; i < 7; i++) {
                
                document.getElementById(`${output.message[0].hotList[i]._id}`).addEventListener('click',function(){
                    document.getElementById('cityCur').innerHTML = output.message[0].hotList[i].nm;
                    
                    let xhr = new XMLHttpRequest();
                    xhr.onload = function(){
                        let output = JSON.parse(xhr.responseText);
                        console.log(output);
                        cinemaList =  output.message;
                        window.location.hash = '#cinema';
                        document.getElementsByClassName('layui-nav-item')[0].classList.remove('layui-this');
                        document.getElementsByClassName('layui-nav-item')[1].classList.add('layui-this');

                    }
                    xhr.open('POST','http://localhost:8081/admin/cinemaFindByCity',true);
                    xhr.setRequestHeader("Content-type","application/json");
                    xhr.send(JSON.stringify({req:output.message[0].hotList[i].id})); 
        
                })
            }
        }
        xhr.open('POST','http://localhost:8081/admin/cityList',true);
        xhr.setRequestHeader("Content-type","application/json");
        xhr.send(); 
        document.getElementById('city1').addEventListener('click',function(){
            for(let i = 0; i < 22; i++){
                document.getElementById(`ct${i}`).classList.remove('current');
            }
            for(let i = 0; i < 7; i++) {
                document.getElementById(`ct${i}`).classList.add('current')        
            }
        })
        document.getElementById('city2').addEventListener('click',function(){
            console.log('click');
            for(let i = 0; i < 22; i++){
                document.getElementById(`ct${i}`).classList.remove('current');
            }
            for(let i = 8; i < 11; i++) {
                document.getElementById(`ct${i}`).classList.add('current')        
            }
        })
        document.getElementById('city3').addEventListener('click',function(){
            console.log('click');
            for(let i = 0; i < 22; i++){
                document.getElementById(`ct${i}`).classList.remove('current');
            }
            for(let i = 12; i < 18; i++) {
                document.getElementById(`ct${i}`).classList.add('current')        
            }
        })
        document.getElementById('city4').addEventListener('click',function(){
            console.log('click');
            for(let i = 0; i < 22; i++){
                document.getElementById(`ct${i}`).classList.remove('current');
            }
            for(let i = 19; i < 21; i++) {
                document.getElementById(`ct${i}`).classList.add('current')        
            }
        })
    }else if(hash == '#cinema') {
        // disBl(document.getElementById('addMovData'));
        document.getElementById('addMovData').style.display = 'none';
        document.getElementById('ip_find_phone').style.display = 'none';
        cTable.style.display = 'table';
        disNo(document.getElementById('user'));
        disNo(fdj);
        let userNameTime = setInterval(function(){
            cTable.style.marginTop = parseInt(cTable.style.marginTop) - 1 + 'px';
            if(parseInt(cTable.style.marginTop) <= 0){
                cTable.style.marginTop = '0px';
                window.clearInterval(userNameTime);
            }
        },20);
        document.getElementById('cinemaData').style.display = 'none';        
        document.getElementById('cinema').style.display = 'block';
        cTable.style.marginRight = '0px';
        let leftAllTime = setInterval(function(){
            leAll.style.marginLeft = parseInt(leAll.style.marginLeft) + 8 + 'px';
            if(parseInt(leAll.style.marginLeft) >= 300){
                              
                leAll.style.marginLeft = '300px';
                window.clearInterval(leftAllTime);
            }
        },10)
        document.getElementById('choCity').style.display = 'none';
        while(document.getElementById('cinemaTable').hasChildNodes()){
            document.getElementById('cinemaTable').removeChild(document.getElementById('cinemaTable').firstChild);
        }
        document.getElementById('cinemaTable').innerHTML = '<tr><th>id</th><th>名称</th><th>地址</th><th>价格</th><th>电影操作</th></tr>';

        for(let i in cinemaList){
            let tr = document.createElement('tr');
            tr.setAttribute('id','cinema_'+i.toString());
            document.getElementById('cinemaTable').appendChild(tr);
            document.getElementById('cinema_'+i.toString()).innerHTML = '<td>'+ cinemaList[i].id.toString()+ '</td><td>'+cinemaList[i].nm.toString()+ '</td><td>'+cinemaList[i].addr.toString()+'</td><td>'+cinemaList[i].sellPrice.toString()+'起</td><td><a href='+"#movie-add"+cinemaList[i].id.toString()+'>添加<a> -- <a href='+"#movie-delete"+cinemaList[i].id.toString() +'>删除<a></td>';
        }
    }else if(hash == '#ipFind1') {
        disNo(document.getElementById('user'));
        disBl(this.document.getElementById('finduser'));
        let userNameTime = setInterval(function(){
            cTable.style.marginTop = parseInt(cTable.style.marginTop) + 1 + 'px';
            if(parseInt(cTable.style.marginTop) >= 50){
                cTable.style.marginTop = '50px';
                window.clearInterval(userNameTime);
                document.getElementById('ip_find_phone').style.display = 'block';
                disBl(fdj);
                
                
            }
        },20);
        fdjpic.onclick = function() {
            console.log('test');
            let judge = 0;// 判断是否在所有名单中有这一输入的名字，默认没有
                for(let i  = 0; i < cinemaList.length; i++) {
                    if(cinemaList[i].id == ipid.value){
                        judge = 1;
                        // console.log(allUserDt[i]);
                        document.getElementById('cinema-id').value = cinemaList[i].id;
                        document.getElementById('cinema-name').value = cinemaList[i].nm;
                        document.getElementById('cinema-add').value = cinemaList[i].addr;
                        document.getElementById('cinema-price').value = cinemaList[i].sellPrice;   
                        let cindtLeTime = setInterval( function() {
                            cTable.style.marginRight = parseInt( cTable.style.marginRight ) + 5+ 'px';
                            if( parseInt( cTable.style.marginRight ) >= 1320 ) {
                                cTable.style.marginRight == '1320px';
                                window.clearInterval(cindtLeTime);
                                document.getElementById('cinemaData').style.display = 'block';
                                
                            }
                        },5)
                        
                    }
                }
                if(judge == 0) {
                    console.log('未找到对应信息哦')
                }
            
        };
    }else if(hash == '#user'){
        this.document.getElementById('choCity').style.display = 'none';
        disBl(document.getElementById('user'));
        disNo(this.document.getElementById('cinema'),this.document.getElementById('addMovData'),this.document.getElementById('finduser'));
        while(document.getElementById('usertable').hasChildNodes()){
            document.getElementById('usertable').removeChild(document.getElementById('usertable').firstChild);
        }
        document.getElementById('usertable').innerHTML = '<tr><th>id</th><th>用户名</th><th>邮箱</th><th>注册时间</th><th>操作</th></tr>';
        let xhr = new XMLHttpRequest();
        xhr.onload = () => {
            let output = JSON.parse(xhr.responseText);
            usersList = output.data.usersList;
            console.log(usersList);
            allUserDt = output.data;
            // userdt.style.display = 'block';
            // fdUser.style.display = 'none';  
            console.log(output);
            let leftAllTime = setInterval(function(){
                leAll.style.marginLeft = parseInt(leAll.style.marginLeft) - 8 + 'px';
                if(parseInt(leAll.style.marginLeft) <= 0){

                    leAll.style.marginLeft = '0px';
                    window.clearInterval(leftAllTime);
                }
            },10)
            for(let i in output.data.usersList){
                let tr = document.createElement('tr');
                tr.setAttribute('id','user_'+i.toString());
                document.getElementById('usertable').appendChild(tr);
                document.getElementById('user_'+i.toString()).innerHTML = '<td>'+ output.data.usersList[i]._id.toString()+ '</td><td>'+output.data.usersList[i].username.toString()+ '</td><td>'+output.data.usersList[i].email.toString()+'</td><td>'+output.data.usersList[i].date.toString()+'</td><td><a href='+"#user-delete"+i.toString() +'>删除</a></td>';
            }
            

        }
        
        xhr.open('GET','http://localhost:3000/api2/admin/usersList',true);
        xhr.setRequestHeader("Content-type","application/json");  
        xhr.send();
    }
    
    for(let i in cinemaList){
        if(hash ==`#movie-add${cinemaList[i].id}`){
            disBl(document.getElementById('addMovData'));
            disNo(document.getElementById('choCity'),cTable,document.getElementById('user'));
            disBl(document.getElementById('addMovData'));
            let xhr = new XMLHttpRequest();
            xhr.onload = function() {
                let output = JSON.parse(xhr.responseText);
                console.log(output);
                if(output.code == 0) {

                    
                        for(let i of output.message) {
                        document.getElementById('choMovIn').innerHTML += `<option value=${i.id}>${i.nm}</option>`
                    }
                    document.getElementById('addchoCinema').value = cinemaList[i].nm;
                }

            }
            xhr.open('POST','http://localhost:8081/admin/movOnInfoList',true);
            xhr.setRequestHeader("Content-type","application/json");
            xhr.send(JSON.stringify({req:cinemaList[i].id})); 
            document.getElementById('go4').onclick = function() {
                let obj;
                const xhr = new XMLHttpRequest();
                xhr.onload = function() {
                    let output = JSON.parse(xhr.responseText);
                    console.log(output);
                    layui.use('layer', function(){
                        var layer = layui.layer;
                        layer.open({
                            anim:6,
                            time:2000,
                            title:'提示',
                            shade: [0.8, '#393D49'],  
                            content: '添加成功'
                            ,btn: ['好的', '知道啦']
                            
                            ,btn1: function(index, layero){
                                
                              //return false 开启该代码可禁止点击该按钮关闭
                            }
                            ,btn2: function(index, layero){
                              //按钮【按钮三】的回调
                            }
                            ,cancel: function(){ 
                              //右上角关闭回调
                              
                              //return false 开启该代码可禁止点击该按钮关闭
                            },
                            end:function(){
                                window.location.hash = '#cinema';
                            }
                        })
                    });  
                }
                xhr.open('POST','http://localhost:8081/admin/addMov',true);
                xhr.setRequestHeader("Content-type","application/json");
                obj = {cinema:cinemaList[i].id,hall:document.getElementById('addchoCinHall').value,movie:document.getElementById('choMovIn').value,bTime:document.getElementById('bTime').value,eTime:document.getElementById('eTime').value};
                xhr.send(JSON.stringify(obj));
    
            }

        }
        if(hash ==`#movie-delete${cinemaList[i].id}`){
            let xhr = new XMLHttpRequest();
            xhr.onload = function(){
                let output = JSON.parse(xhr.responseText);       
                console.log(output);     
            }
            xhr.open('POST','http://localhost:8081/admin/findMov',true);
            xhr.setRequestHeader("Content-type","application/json");
            // obj = {cinema:cinemaList[i].id,hall:document.getElementById('addchoCinHall').value,movie:document.getElementById('choMovIn').value,bTime:document.getElementById('bTime').value,eTime:document.getElementById('eTime').value};
            xhr.send(JSON.stringify({id:cinemaList[i].id}));
        }
    }
    for(let i in usersList){
        if(hash == `#user-delete${i}`){
            layui.use('layer', function(){
                var layer = layui.layer;
                layer.open({
                    anim:6,
                    time:5000,
                    title:'提示',
                    shade: [0.8, '#393D49'],  
                    content: '确认要删除该用户信息嘛？'
                    ,btn: ['是的', '取消']
                    
                    ,btn1: function(index, layero){
                        let xhr = new XMLHttpRequest();
                        xhr.onload = function(){
                            let output = JSON.parse(xhr.responseText);
                            console.log(output);
                        }
                        xhr.open('POST','http://localhost:3000/api2/admin/deleteUser?email='+usersList[i].email,true);
                        xhr.setRequestHeader("Content-Type","application/json");
                        xhr.send();
            
                      //return false 开启该代码可禁止点击该按钮关闭
                    }
                    ,btn2: function(index, layero){
                      //按钮【按钮三】的回调
                    }
                    ,cancel: function(){ 
                      //右上角关闭回调
                      
                      //return false 开启该代码可禁止点击该按钮关闭
                    },
                    end:function(){
                        window.location.hash = '#user';
                    }
                })
            });  




           
        }
    }
    
})
