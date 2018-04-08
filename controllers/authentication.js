const jwt = require('jwt-simple');
const User = require('../models/user');
const config = require('../config')

function tokenForUser(user){
	const timestamp = new Date().getTime();
	return jwt.encode({sub:user.id,iat:timestamp},config.secret);
}

exports.signin = async(req,res,next)=>{

	res.send({token:tokenForUser(req.user)});
}

exports.signup = async(req,res,next)=>{
	//See if a user with a given email exists
	const {email,password} = req.body;

	if(!email || !password){
		return res.status(422).send({error:'You must provide email and password'})
	}
	//if a user with email exist. return an error
	try{
		const result = await User.findOne({email});
		if(result){
			return res.status(422).send({error:'Email is in use'})
		}
		const user = new User({email,password});
		await user.save();
		res.send({token:tokenForUser(user)});
	}
	catch(e){
		return next(e)
	}
} 