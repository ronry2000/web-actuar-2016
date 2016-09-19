var passport=require("passport"),
LocalStrategy=require('passport-local').Strategy,
bcrypt=require("bcryptjs"),
database=require("./database.js");



module.exports=function(){
	passport.use(new LocalStrategy({
		usernameField:"email",
		passwordField:"password"
	},function(username,password,cb){
		database.findOneUsuariosactuartolima({"email":username},function(res){
			//console.log(err,user,solicitud.body);
			if(!res.user){
				cb(null,false,{msg:"Usuario no encontrado"});
			}else{
				if(bcrypt.compareSync(password,res.user.password)){
					cb(null,res.user);
				}else{
					//cb("contraseña incorrecta",null);
					cb(null,false,{msg:"Contraseña incorrecta"});
				}
			}
		});
		/*var user={
			username:username,
			password:password
		};
		cb(null,user);*/
	}));
};






