var mysql=require('mysql'),
sendEmail=require("./sendemail.js"),
mongoose=require('mongoose'),
bcrypt=require("bcryptjs"),
schema=mongoose.Schema,
objectId=schema.ObjectId;


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
var options={
	db:{native_parser:true},
	server:{poolSize:5},
	user:'root',
	pass:'root'
};
//var usuariosactuartolimaUrl="mongodb://test11test.mooo.com/usuariosactuartolima";
var usuariosactuartolimaUrl="mongodb://localhost/usuariosactuartolima";

//mongoose.connect(usuariosactuartolimaUrl,options);
mongoose.connect(usuariosactuartolimaUrl);
mongoose.connection.on('connected',function(err){
	console.log("mongoose.connection.on'connected': "+usuariosactuartolimaUrl);
});
mongoose.connection.on('error',function(err){
	console.log("mongoose.connection.on'error' "+usuariosactuartolimaUrl+": ",err);
});
mongoose.connection.on('disconnected',function(){
	console.log("mongoose.connection.on'disconnected': "+usuariosactuartolimaUrl);
	//self.connectToDatabase();
});

var User = mongoose.model('User',new schema({
	id:objectId,
	name:{type:String,required:true},//, required:'{PATH} is required.'
	email:{type:String,required:true,unique:true},
	password:{type:String,required:true},//,select:false no mostrar en query
	accesibilidad:{type:String,required:true}
}));

function insertUsuariosactuartolima(body,callback){
	var u=new User({
		name:body.nombre,
		email:body.email,
		password:bcrypt.hashSync(body.password,bcrypt.genSaltSync(10)),
		accesibilidad:body.accesibilidad
	});
	//console.log("\n",u,"\n",body);
	u.save(function(err){
		if(err){
			console.log(err);
			if(err.code===11000){callback({"error":err,"resultado":"email ya existe"});}
			callback({"error":err,"resultado":"error."});
		}else callback({"error":err,"resultado":"registro exitoso."+JSON.stringify(body)});
	});
}
function findOneUsuariosactuartolima(body,callback){
	User.findOne({email:body.email},function(err,user){
		callback({"error":err,"user":user});
	})
}
function findUsuariosactuartolima(body,callback){
	User.find({},function(err,users){
		callback({"error":err,"users":users});
	})
}
function removeUsuariosactuartolima(body,callback){
	User.findOne({email:body.email},function(err,user){
		if(err){
			callback({"error":err,"resultado":"error"});
		}else{
			user.remove();
			user.save(function(err2){
				if(err){
					console.log(err);
					callback({"error":err2,"resultado":"error"});
				}else callback({"error":err2,"resultado":"borrado exitoso de "+JSON.stringify(user)});
			});
		}
	})
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/*
//var connectionbd=mysql.createConnection(optionsdb);
var optionsdb={host:"test11test.mooo.com",port:"3306",database:"test",user:"root",password:"root",waitForConnections:false,connectionLimit:1000};
var poolClusterOptions={canRetry:false,removeNodeErrorCount:1000};
var poolClusterdb=mysql.createPoolCluster(poolClusterOptions);
poolClusterdb.add("test",optionsdb);
//var pooldb=poolClusterdb.of("test");

poolClusterdb.on("connection",function(connectiondb){
	console.log("***************************************pool.on connection "+connectiondb.config.database);
	//poolClusterdb.add("test",optionsdb);
});
poolClusterdb.on("error",function(err){
	console.log("error poolClusterdb event:"+err);
	setTimeout(function(){poolClusterdb= mysql.createPoolCluster(poolClusterOptions);poolClusterdb.add("test",optionsdb);},5000);
});
poolClusterdb.on("remove",function(nodeId){
	console.log('nodo removido poolClusterdb : '+nodeId);
	if(nodeId=="test") poolClusterdb.add("test",optionsdb);
});

function query(sql, parametros, callback){	
	if((Object.keys(poolClusterdb._nodes).length>0 && poolClusterdb._nodes["test"].errorCount==0) || sql=="error"){
		poolClusterdb.getConnection("test",function(err, connectiondb){
			if(err){
				console.log("error poolClusterdb getconnection:"+err);
				callback({"error":err,"resultado":"error en base de datos"});
				//query("error",{}, function(err2,resultado){console.log("error en base de datos");});//opcional
			}else{
				connectiondb.on("error",function (err2){
					console.log("error connectionbd event:"+err2);
					connectiondb.destroy();
					//query("error",{}, function(err2,resultado){console.log("error en base de datos");});//opcional
				});
				connectiondb.query(sql,parametros,function(err2,resultado){
					if(err2) callback({"error":err2,"resultado":"error en base de datos"});//{poolClusterdb._nodes["test"].errorCount=0; return console.log("error en base de datos");connectiondb.destroy();}// if(sql=="error")...
					else{
						callback({"error":err2,"resultado":resultado});
						connectiondb.destroy();
					}
				});
				
			}
		});
	}else{callback({"error":{code:"error en base de datos errorCount>0","resultado":"error en base de datos errorCount>0"}});}
}

function registroTransaccion(body,callback){
	var mailOptions = {from:"pagina web <talestales777@gmail.com>", subject:"registro",
	   to:"usuario <"+body.email+">", cc:"", bcc:"admin <jhoneao@gmail.com>",
	   html: "<h1>Hola "+body.nombre+"</h1><br></br>tu registro ha sido exitoso<br></br><br></br>", text:""
	};
	if((Object.keys(poolClusterdb._nodes).length>0 && poolClusterdb._nodes["test"].errorCount==0) || sendEmail=="error"){		
		poolClusterdb.getConnection("test",function(err, connectiondb){
			if(err){
				console.log("error poolClusterdb getconnection:"+err);
				//registroTransaccion("error",{},"", function(err,resultado){console.log("error en base de datos");});//opcional
				return callback({"error":err,"resultado":"error en base de datos"});								
			}else{						
				connectiondb.beginTransaction(function(err2){
					if(err2) return connectiondb.rollback(function(){callback({"error":err2,"resultado":"error2 en base de datos"});connectiondb.destroy();});				
					if(sendEmail=="error") return connectiondb.rollback(function(){poolClusterdb._nodes["test"].errorCount=0;connectiondb.destroy();});
					connectiondb.query('SELECT * FROM usuarios WHERE ?',{email:body.email}, function(err3, resultado){							
						if(err3) return connectiondb.rollback(function(){callback({"error":err3,"resultado":"error3 en base de datos"});connectiondb.destroy();});
						if(resultado.length==0){//a resultado != 'undefined'								
							connectiondb.query('INSERT INTO usuarios SET ?',{email:body.email, contrasena:body.password, nombre:body.nombre},function(err4,resultado2){
								if(err4) return connectiondb.rollback(function(){callback({"error":err4,"resultado":"error4 en base de datos"});connectiondb.destroy();});
								//console.log(resultado2);							
								sendEmail.send(mailOptions,function(err5, resultado3){
									if(err5) return connectiondb.rollback(function(){callback({"error":err5,"resultado":"error en envio de e-mail"});connectiondb.destroy();});
									connectiondb.commit(function(err6){
										if(err6) return connectiondb.rollback(function(){callback({"error":err6,"resultado":"error en envio de e-mail"});connectiondb.destroy();});
										callback({"error":err,"resultado":"registro exitoso, revisa tu correo."});
										connectiondb.destroy();		
									});
								});								
							});
						}else if(resultado.length>0){	
							callback({"error":err,"resultado":"email ya existe"});
						}							
					});				
				});						
				connectiondb.on("error",function (err){
					console.log("error connectionbd event:"+err);
					connectiondb.destroy();
					//registroTransaccion("error",{},"", function(err,resultado){});//opcional
				});				
			}
		});
	}else{callback({"error":{code:"error en base de datos errorCount>0","resultado":"error en base de datos errorCount>0"}});}
}*/
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//exports.query=query;
//exports.registroTransaccion=registroTransaccion;
exports.insertUsuariosactuartolima=insertUsuariosactuartolima;
exports.findOneUsuariosactuartolima=findOneUsuariosactuartolima;
exports.findUsuariosactuartolima=findUsuariosactuartolima;
exports.removeUsuariosactuartolima=removeUsuariosactuartolima;