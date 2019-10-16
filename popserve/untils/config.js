var mongoose = require('mongoose');
var nodemailer = require('nodemailer');

//连接数据库
var Mongoose = {
	url : 'mongodb://localhost:27019/new',
	connect(){
		mongoose.connect(this.url , { useNewUrlParser: true }, (err)=>{
			if(err){
				console.log('数据库连接失败');
				return;
			}
			console.log('数据库连接成功');
		});
	}
};

//发送邮件
var Email = {
	config : {
		host: "smtp.qq.com",
	    port: 587,
	    auth: {
				user: 'yutingbai990901@qq.com', 
				pass: 'nqgvzpyybhihbeeg'
	    }
	},
	get transporter(){
		return nodemailer.createTransport(this.config);
	},
	get verify(){
		return Math.random().toString().substring(2,6);
	},
	get time(){
		return Date.now();
	}
};
var Head = {
	baseUrl : 'http://localhost:3000/images/'
}
module.exports = {
    Mongoose,
	Email,
	Head
};