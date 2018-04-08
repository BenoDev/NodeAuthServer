const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');

//Define our model
const userSchema = new Schema ({
	email:
		{
			type:String, 
			unique:true,
			lowercase:true,
			required: true,
			trim : true ,
		},
	password:{
		type:String,
		required:true
	}
});
//On savehook encrypt password

userSchema.pre('save',function (next){
	user = this;
	bcrypt.genSalt(10, (err,salt)=>{
		if(err){
			return next(err)
		}
		bcrypt.hash(user.password,salt,null,(err,hash)=>{
			if(err){
			return next(err)
			}
			user.password = hash;
			next();
		})
	})
})

userSchema.methods.comparePassword = function(candidatePassword,callback){
	const user=this;
	bcrypt.compare(candidatePassword,user.password,(err,isMatch)=>{
		if(err){
			return callback(err)
		}
		callback(null,isMatch);
	})
}

//Create the model class
const ModelClass = mongoose.model('user',userSchema);

//Export the model
module.exports = ModelClass;