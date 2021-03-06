var mongoose = require('mongoose');
mongoose.set('useCreateIndex',true);
var { Head } = require('../untils/config.js');

var url = require('url');

//用户注册表结构
var UserSchema = new mongoose.Schema({
	username : { type : String , required : true , index : { unique : true } },
	password : { type : String , required : true },
	email : { type : String , required : true , index : { unique : true } },
	date : { type : Date , default : Date.now() },
	list : {type:Array},
	userHead : { type : String , default : url.resolve(Head.baseUrl , 'logo.png') }

});

var UserModel = mongoose.model('user' , UserSchema);
UserModel.createIndexes();


var save = (data)=>{
	var user = new UserModel(data);
	return user.save()
		   .then(()=>{
		   		return true;
		   })
		   .catch(()=>{
		   		return false;
		   });
};
var findLogin = (data)=>{
	return UserModel.findOne(data);
}

var updatePassword = (email , password)=>{
	return UserModel.update({email} , { $set : { password } })
		   .then(()=>{
		   		return true;
		   })
		   .catch(()=>{
		   		return false;
		   });
}
var usersList = ()=>{
	return UserModel.find();
}


var deleteUser = ( email )=>{
	return UserModel.deleteOne({ email });
}

var updateUserHead = ( username , userHead ) => {
	return UserModel.update({username} , { $set : { userHead } })
		   .then(()=>{
		   		return true;
		   })
		   .catch(()=>{
		   		return false;
		   });
}

module.exports = {
    save,
    findLogin,
	updatePassword,
	usersList,
	deleteUser,
	updateUserHead

};