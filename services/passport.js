const passport = require('passport');
const User = require('../models/user');
const config = require('../config');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt  = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local');

const localOptions = {usernameField:'email'}

//Create local strategy
const localLogin = new LocalStrategy(localOptions,async (email,password,done)=>{
	//Verify email and password, call done with the user,
	//if it correct, othewise done with false
	try{
		const user = await User.findOne({email})
		if(!user){
			return done(null,false)
		}
		//compare password
		user.comparePassword(password,(err,isMatch)=>{
			if(err){
				return done(err);
			}
			if(!isMatch){
				return done(null,false)
			}
			done(null,user);
		})
	}catch(e){
		return done(e)
	}
	
});;


//Set up options for JWT Strategy
const jwtOptions = {
	jwtFromRequest:ExtractJwt.fromHeader('authorization'),
	secretOrKey:config.secret
};

//Create JWT strategy
const jwtLogin = new JwtStrategy(jwtOptions,async (payload,done)=>{
	//See if user Id in payload exist in our db
	//if it does, call done with that objext
	//otherwise call done with empty object
	try{
		const user = await User.findById(payload.sub);
		if(!user){
			return done(null,false)
		}else(
			done(null,user)
			)

	}catch(e){
		return done(e,false)
	}

})

//Tell passport to use this strategy
passport.use(jwtLogin);
passport.use(localLogin);