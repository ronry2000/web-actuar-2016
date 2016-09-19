var express=require('express'),
bodyParser=require("body-parser"),
cors=require("cors"),
compression=require("compression"),
multer=require("multer"),
bcrypt=require("bcryptjs"),
csurf=require('csurf'),
cookieParser=require('cookie-parser'),
passport=require("passport"),
session=require("express-session"),
mongoStore=require('connect-mongo/es5')(session),
mime=require('mime'),
util=require('util'),
rimraf=require('rimraf'),
cluster=require('cluster'),
http=require("http"),
filesystem=require('fs'),
sendEmail=require("./sendemail.js"),
watches=require("./watches.js"),
database=require("./database.js");



app=express();
//var server=app.listen(80,function(err){if(err)console.log("app.listen error")});//console.log('Example app listening at http://%s:%s',server.address().address,server.address().port);
var servidor=http.createServer(app);
servidor.on("listening",function(){});//console.log(cluster.worker.id+"-"+cluster.worker.process.pid+" http "+servidor.address().port);
servidor.on("error",function(err){console.log("["+cluster.worker.id+"]errror http:",err);servidor.close();});
servidor.on("connection",function(socket){console.log("["+cluster.worker.id+"]connection http:",socket.remoteAddress,socket.remotePort,socket.remoteFamily);});//socket.on("data",function(data){console.log("connection http on(data)",data.toString());});
servidor.on("close",function(){console.log("["+cluster.worker.id+"]close http:",arguments)});//util.inspect(arguments,{showHidden:true,depth:null,colors:true})
servidor.on("checkContinue",function(){console.log("["+cluster.worker.id+"]checkContinue http:",util.inspect(arguments,{showHidden:true,depth:null,colors:true}))});
servidor.on("clientError",function(exception,socket){console.log("["+cluster.worker.id+"]clientError http:",exception,socket.remoteAddress,socket.remotePort,socket.remoteFamily)});
servidor.on("connect",function(request,socket,head){console.log("["+cluster.worker.id+"]connect http:"+socket.remoteAddress);});
servidor.on("upgrade",function(request,socket,head){console.log("["+cluster.worker.id+"]upgrade http:"+socket.remoteAddress);});
servidor.listen(80);

//var sessionStore=new mongoStore({url:"mongodb://test11test.mooo.com/usuariosactuartolima"});
var sessionStore=new mongoStore({url:"mongodb://localhost/usuariosactuartolima"});
var sessionTime=1*60*60*1000;
//http.globalAgent.maxSockets = 50;
var router=express.Router();



//app.set("port",80);
app.disable('x-powered-by');
//app.set('view engine','ejs');//csrf protection
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json({strict:false}));
app.use(cookieParser());
app.use(session({
	secret:"isadbf8734qgho3q4hfoq39f4hqfh0q37fuhauiosdfj90q87rhf",
	name:"session",
	store:sessionStore,
	saveUninitialized:false,
	resave:false,
	rolling:true,
	unset:"destroy",//"keep"
	cookie:{
		httpOnly:false,
		path:"/",
		secure:false,
		maxAge:sessionTime
	}
}));
require("./passport.js")(app);
app.use(function(solicitud,respuesta,next){
	if(solicitud.user){
		//console.log(solicitud.session.id," ",solicitud.session.cookie.maxAge,solicitud.session.cookie.expires);
		//solicitud.session.touch();
		solicitud.session.cookie.expires=new Date(Date.now()+sessionTime)
		solicitud.session.cookie.maxAge=sessionTime;
		//solicitud.session.save(function(err){})
	}else{
		respuesta.clearCookie('user');
	}
	var d=new Date();
	//console.log(solicitud.url);//url.parse(solicitud.url)
	/*filesystem.createWriteStream("./registros/registrohttp.txt",{"flags":"a"}).end("\n<<["+cluster.worker.id+"]"+d.getHours()+":"+d.getMinutes()+":"+d.getSeconds()+":"+d.getMilliseconds()+"<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<"+
		"\n<<<<http "+solicitud.method+" "+solicitud.headers.host+solicitud.url+" [query:"+JSON.stringify(solicitud.query)+"] [remoteaddress:"+solicitud.socket.remoteAddress+":"+solicitud.socket.remotePort+"]\n"+//" from:"+data.city+"-"+data.country+"-"+data.org+
		JSON.stringify(solicitud.headers)+"\nbody"+JSON.stringify(solicitud.body)+"\nsession "+solicitud.session.id+JSON.stringify(solicitud.session)+"\nuser"+JSON.stringify(solicitud.user)+
		"\n<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<\n",function(){}
	);*/
	respuesta.on("finish",function(){log(solicitud,respuesta,solicitud.body)});
	respuesta.on("error",function(){console.log("respuesta.onerror",err,respuesta.socket.remoteAddress);});
	respuesta.on("close",function(){if(!respuesta._header) respuesta._header="noheader";log(solicitud,respuesta,[solicitud.body,"connection closed"])});
	
	if(/get/i.test(solicitud.method)){
		if(solicitud.path=="/viewpdf") solicitud.url="/viewer.html";
		//if(solicitud.url=="/") solicitud.url="/main.html"
		if(solicitud.url=="/index" || solicitud.url=="/index/") solicitud.url="/main.html";
		if(solicitud.url=="/main" || solicitud.url=="/main/") solicitud.url="/main.html";
		//if(solicitud.url=="/intranet/registro" || solicitud.url=="/intranet/registro/") solicitud.url="/main.html";
		if(solicitud.url=="/contacto" || solicitud.url=="/contacto/") solicitud.url="/main.html";
		if(solicitud.url=="/proyectosycapacitacion" || solicitud.url=="/proyectosycapacitacion/") solicitud.url="/main.html";
		if(solicitud.url=="/proyectosycapacitacion/proyecto1" || solicitud.url=="/proyectosycapacitacion/proyecto1") solicitud.url="/main.html";
		if(solicitud.url=="/conocenos" || solicitud.url=="/conocenos/") solicitud.url="/main.html";
		if(solicitud.url=="/conocenos" || solicitud.url=="/conocenos/") solicitud.url="/main.html";
		if(solicitud.url=="/lineasdecredito" || solicitud.url=="/lineasdecredito/") solicitud.url="/main.html";
		if(solicitud.url=="/nuestrasoficinas" || solicitud.url=="/nuestrasoficinas/") solicitud.url="/main.html";
		if(solicitud.url=="/indicadores" || solicitud.url=="/indicadores/") solicitud.url="/main.html";
		if(solicitud.url=="/impactosocial" || solicitud.url=="/impactosocial/") solicitud.url="/main.html";
		if(solicitud.url=="/sitemap" || solicitud.url=="/sitemap/") solicitud.url="/main.html";
		if(solicitud.url=="/trabajaconnosotros" || solicitud.url=="/trabajaconnosotros/") solicitud.url="/main.html";
		if(solicitud.url=="/login" || solicitud.url=="/login/") solicitud.url="/main.html";
		if(solicitud.url=="/intranet" || solicitud.url=="/intranet/") solicitud.url="/main.html";
	}
	
	
	respuesta.set('Cache-Control','no-cache, must-revalidate');
	//respuesta.set('Access-Control-Allow-Origin',"*");//'https://actuartolima.com'
	
	if(!!solicitud.query.download) respuesta.set('Content-Disposition',"attachment");
	next();
});


//app.use(cors());
//app.use(csurf({cookie:true}));
app.use('/',router);
app.use(compression({filter:compressFilter,level:9,memLevel:9}));
app.use(express.static(__dirname+"/../public",{'index':'main.html',setHeaders:function(respuesta,path,stat){
	if(path=="/"){
		path="/main.html"
		respuesta.type(mime.lookup(path)+"; charset=utf-8");
	}
	//console.log(__dirname+"/public",stat);
	//respuesta.setHeader('Content-Length',"3");
}}));


router.param('p1',function(solicitud,respuesta,next,p1){
	//console.log('router.param(p1)'+p1);
	solicitud.p1=p1;
	next();
});
router.param('p2',function(solicitud,respuesta,next,p2){
	//console.log('router.param(p2)'+p2);
	solicitud.p2=p2;
	next();
});

router.route("/intranetscripts*")
	.all(function(solicitud,respuesta,next){
		if(!solicitud.user){
			respuesta.status(401);
			respuesta.set("WWW-Authenticate",'Intranetauth realm="intranet", tittle="Login to /login"');
			respuesta.end("unauthorized");
		}else{
			next();
		}
	});


router.route('/intranet/:p1*')//:p1 *
	.all(function(solicitud,respuesta,next){
		//console.log("router.route('/intranet/:p1*')",solicitud.user,solicitud.p1);
		if(!solicitud.user){
			respuesta.status(401);
			respuesta.set("WWW-Authenticate",'Intranetauth realm="intranet", tittle="Login to /login"');
			respuesta.end("unauthorized");
		}else{
			switch(true){
				case(/registro/.test(solicitud.p1)):
					if(solicitud.user.accesibilidad=="administrador"){
						//if((solicitud.url=="/intranet/registro" || solicitud.url=="/intranet/registro/") && !solicitud.get("referer")) solicitud.url="/main.html";
						if((solicitud.p1=="registro" || solicitud.p1=="registro/") && !solicitud.get("referer")) solicitud.url="/main.html";
						next();
					}else{
						respuesta.status(403);
						respuesta.end("forbidden");
					}
				break;
				case(/archivos/.test(solicitud.p1)):
					if((solicitud.p1=="archivos" || solicitud.p1=="archivos/") && !solicitud.get("referer")){
						solicitud.url="/main.html";
						next();
					}else{
						//solicitud.url="/main.html";
						next();
					}
				break;
				case(/capacitaciones/.test(solicitud.p1)):
					if(solicitud.user.accesibilidad=="capacitacion" || solicitud.user.accesibilidad=="administrador"){
						if((solicitud.url=="/intranet/capacitaciones" || solicitud.url=="/intranet/capacitaciones/") && !solicitud.get("referer")) solicitud.url="/main.html";
						next();
					}else{
						respuesta.status(403);
						respuesta.end("forbidden");
					}
				break;
				case(/ofertalaboral/.test(solicitud.p1)):
					if(solicitud.user.accesibilidad=="gestionhumana" || solicitud.user.accesibilidad=="administrador"){
						if((solicitud.url=="/intranet/ofertalaboral" || solicitud.url=="/intranet/ofertalaboral/") && !solicitud.get("referer")) solicitud.url="/main.html";
						next();
					}else{
						respuesta.status(403);
						respuesta.end("forbidden");
					}
				break;
				case(/contenido/.test(solicitud.p1)):
					if(solicitud.user.accesibilidad=="contenido" || solicitud.user.accesibilidad=="administrador"){
						if((solicitud.url=="/intranet/contenido" || solicitud.url=="/intranet/contenido/") && !solicitud.get("referer")) solicitud.url="/main.html";
						next();
					}else{
						respuesta.status(403);
						respuesta.end("forbidden");
					}
				break;
				default:
					//respuesta.status(404);
					//respuesta.end("Pagina no encontrada");
					//solicitud.url="/main.html";
					next();
				break;
			}
			
		}
	});

/*router.route('/intranet/archivos/:p2')
	.all(function(solicitud,respuesta,next){
		console.log("router.route('/intranet/:p1/:p2')",solicitud.user,solicitud.p1,solicitud.p2);
		if(!solicitud.user){
			respuesta.status(401);
			respuesta.set("WWW-Authenticate",'Intranetauth realm="intranet", tittle="Login to /login"');
			respuesta.end("unauthorized");
		}else{
			switch(true){
				
				default:
					//respuesta.status(404);
					//respuesta.end("Pagina no encontrada");
					//solicitud.url="/main.html";
					//next();
				break;
			}
			
		}
	});*/

router.route('/private/*')//:p1 *
	.all(function(solicitud,respuesta,next){
		//console.log("router.route('/private/*')",solicitud.user);
		if(!solicitud.user){
			respuesta.status(401);
			respuesta.set("WWW-Authenticate",'Intranetauth realm="intranet", tittle="Login to /login"');
			respuesta.end("unauthorized");
		}else{
			next();
			
			
		}
	});

router.route("/contactoemail")
	.post(function(solicitud,respuesta){
		if(!solicitud.body.nombre || !solicitud.body.telefono || !solicitud.body.mensaje || !solicitud.body.ciudad || !solicitud.body.direccion){respuesta.status(400);respuesta.end("error campos vacios");}
		else if(!/^[áàãâäéèêëíìîïóòõôöúùûüÁÀÃÂÄÉÈÊËÍÌÎÏÓÒÕÖÔÚÙÛÜÝýỲỳŶŷŸÿỸỹçÇñÑa-zA-Z0-9.:,;%=\/*+-_?¿¡!$\s@]{1,80}$/.test(solicitud.body.nombre)
			|| !/^[áàãâäéèêëíìîïóòõôöúùûüÁÀÃÂÄÉÈÊËÍÌÎÏÓÒÕÖÔÚÙÛÜÝýỲỳŶŷŸÿỸỹçÇñÑa-zA-Z0-9.:,;%=\/*+-_?¿¡!$\s@]{0,80}$/.test(solicitud.body.empresa)
			|| !/^[áàãâäéèêëíìîïóòõôöúùûüÁÀÃÂÄÉÈÊËÍÌÎÏÓÒÕÖÔÚÙÛÜÝýỲỳŶŷŸÿỸỹçÇñÑa-zA-Z0-9.:,;%=\/*+-_?¿¡!$\s@]{0,80}$/.test(solicitud.body.ciudad)
			|| !/^[áàãâäéèêëíìîïóòõôöúùûüÁÀÃÂÄÉÈÊËÍÌÎÏÓÒÕÖÔÚÙÛÜÝýỲỳŶŷŸÿỸỹçÇñÑa-zA-Z0-9.:,;%=\/*+-_?¿¡!$\s@]{0,80}$/.test(solicitud.body.direccion)
			|| !/^[(0-9+\s())(e?x?t?(\d*))]{7,50}$/.test(solicitud.body.telefono)
			|| !(!/^[a-z0-9._%+-]{1,50}@[a-z0-9.-]{1,50}\.[a-z]{2,6}$/.test(solicitud.body.email) | !!solicitud.body.email)
			|| !/^[áàãâäéèêëíìîïóòõôöúùûüÁÀÃÂÄÉÈÊËÍÌÎÏÓÒÕÖÔÚÙÛÜÝýỲỳŶŷŸÿỸỹçÇñÑa-zA-Z0-9.:,;%=\/*+-_?¿¡!$\s@]{1,600}$/.test(solicitud.body.mensaje)){respuesta.status(400);respuesta.end("error campos erroneos");}
		else{
			solicitud.body.mensaje=solicitud.body.mensaje.replace(/\n/g,"<br></br>");
			if(!!solicitud.body.empresa) solicitud.body.empresa=" - "+solicitud.body.empresa;
			else solicitud.body.empresa="";
			var mailOptions={
				from:"Actuar Tolima <famiactuar@actuartolima.com.co>",
				subject:"Contacto - respuesta automática",
				to:solicitud.body.nombre+solicitud.body.empresa+" <"+solicitud.body.email+">",cc:"admin <pqr@actuartolima.com.co>",bcc:"admin2 <luisalozano@actuartolima.com.co>",
				//attachments:[{path:"./public/img/logoactuartolima.png", cid:"logo"}],
				text:"",
				html:"./public/templates/secondary/contactoemail"
			};
			sendEmail.send(mailOptions,util._extend({},solicitud.body),function(err,respuesta2){//clonar solicitud.body
				if(!!solicitud.body.email){
					if(err) sendError(["error al enviar mensaje. Intente otra vez.",err,"respuesta2",respuesta2],solicitud,respuesta);
					else respuesta.end("mensaje enviado, recibirás confirmación.");
				}else{
					if(err) sendError(["error al enviar mensaje. Intente otra vez.",err,"respuesta2",respuesta2],solicitud,respuesta);
					else respuesta.end("mensaje enviado.");
				}
			});
		}
	});

router.route("/trabajaconnosotroshojadevida")
	.post(function(solicitud,respuesta){
		if(!solicitud.query.nombre || /*!solicitud.query.cargo || */!solicitud.query.cargotitulo){respuesta.status(400);respuesta.end("error campos vacios");}
		else if(!/^[áàãâäéèêëíìîïóòõôöúùûüÁÀÃÂÄÉÈÊËÍÌÎÏÓÒÕÖÔÚÙÛÜÝýỲỳŶŷŸÿỸỹçÇñÑa-zA-z0-9\s]{1,80}$/.test(solicitud.query.nombre)
			|| (!!solicitud.query.email && !/^[a-z0-9._%+-]{1,50}@[a-z0-9.-]{1,50}\.[a-z]{2,6}$/.test(solicitud.query.email))
		//	|| !/^[a-zA-z0-9]{1,200}$/.test(solicitud.query.cargo)
			|| !/^[áàãâäéèêëíìîïóòõôöúùûüÁÀÃÂÄÉÈÊËÍÌÎÏÓÒÕÖÔÚÙÛÜÝýỲỳŶŷŸÿỸỹçÇñÑa-zA-Z0-9.:,;%=\/*+-_?¿¡!$\s@()]{1,200}$/.test(solicitud.query.cargotitulo)){respuesta.status(400);respuesta.end("error campos erroneos");}
		else{
			trabajaconnosotrosUpload(solicitud,respuesta,function(err){
				if(err){console.log(err);
					sendError(["error al subir archivo.",JSON.stringify(err)],solicitud,respuesta);
				}else{
					//console.log(respuesta.config);
					watches.actualizarIntranetarchivos();
					if(!solicitud.query.email){
						respuesta.end("Archivo '"+solicitud.file.originalname+"' enviado.");
					}else{
						var mailOptions={
							from:"Actuar Tolima <famiactuar@actuartolima.com.co>",
							subject:"Recepción hoja de vida - respuesta automática",
							to:solicitud.query.nombre+" <"+solicitud.query.email+">",cc:"admin <gestionhumana@actuartolima.com.co>",bcc:"admin2 <famiactuar@actuartolima.com.co>",
							//attachments:[{path:"./public/img/logoactuartolima.png", cid:"logo"}],
							text:"",
							html:"./public/templates/secondary/trabajaconnosotroshojadevidaemail"
						};
						sendEmail.send(mailOptions,util._extend({},solicitud.query),function(err2,respuesta2){//clonar solicitud.query
							if(err2) sendError(["Archivo '"+solicitud.file.originalname+"' enviado, error al enviar email.",err2,"respuesta2",respuesta2],solicitud,respuesta);
							else respuesta.end("Archivo '"+solicitud.file.originalname+"' enviado, recibirás confirmación.");
						});
					}
				}
			});
		}
	});

router.route("/login")
	.post(function(solicitud,respuesta,next){
		if(!solicitud.body.email || !solicitud.body.password){respuesta.status(400);respuesta.end("error campos vacios");}
		else if(!/^[a-z0-9._%+-]{1,50}@[a-z0-9.-]{1,50}\.[a-z]{2,6}$/.test(solicitud.body.email)
			|| !/^[áàãâäéèêëíìîïóòõôöúùûüÁÀÃÂÄÉÈÊËÍÌÎÏÓÒÕÖÔÚÙÛÜÝýỲỳŶŷŸÿỸỹçÇñÑa-zA-z0-9.:,;%=\/*+-_?¿¡!$\s@]{4,20}$/.test(solicitud.body.password)){respuesta.status(400);respuesta.end("error campos erroneos");}
		else{
			passport.authenticate('local',function(err,user,info){
				console.log(arguments,err,user,info);
				if(!user){
					respuesta.json({msg:info.msg,correcto:false});
				}else{
					solicitud.login(user,function(err){
						if(err) next(err);
						else{
							setTimeout(function(){console.log("\n\n\n\n\n\nmaxAge "+sessionTime)},sessionTime-15000);
							user.password=null;
							respuesta.cookie("user",JSON.stringify(user),{httpOnly:false});//,maxAge:sessionTime
							respuesta.json({msg:JSON.stringify(user),correcto:true});
						}
					});
				}
				
			})(solicitud,respuesta,next);
		}
		
	});

router.route("/logout")
	.post(function(solicitud,respuesta){
		solicitud.logout();
		respuesta.clearCookie('session');
		respuesta.clearCookie('user');
		console.log(solicitud.session.id);
		sessionStore.destroy(solicitud.session.id,function(err){
			if(err) sendError({"error sessionStore.destroy.":err},solicitud,respuesta);
			else{
				solicitud.session.destroy(function(err2){
					if(err2) sendError({"error solicitud.session.destroy.":err2},solicitud,respuesta);
					else{
						respuesta.end("Ingresa tus datos");
					}
				});
			}
		});
		
		
	});

router.route("/intranetregistro")
	.all(function(solicitud,respuesta,next){
		if(!solicitud.user){respuesta.status(401);respuesta.set("WWW-Authenticate",'Intranetauth realm="intranet", tittle="Login to /login"');respuesta.end("unauthorized");}
		else if(solicitud.user.accesibilidad!="administrador"){respuesta.status(403);respuesta.end("error accesibilidad necesaria");}
		else{
			next();
		}
	})
	.get(function(solicitud,respuesta){
		database.findUsuariosactuartolima(solicitud.body,function(res){
			//console.log(res);
			if(!!res.error) sendError(res.error,solicitud,respuesta);
			else{
				respuesta.json(res.users);
			}
		});
		
	})
	.post(function(solicitud,respuesta){
		if(!solicitud.body.nombre || !solicitud.body.email || !solicitud.body.password){respuesta.status(400);respuesta.end("error campos vacios");}
		else if(!/^[áàãâäéèêëíìîïóòõôöúùûüÁÀÃÂÄÉÈÊËÍÌÎÏÓÒÕÖÔÚÙÛÜÝýỲỳŶŷŸÿỸỹçÇñÑa-zA-z0-9\s]{1,80}$/.test(solicitud.body.nombre)
			|| !/^[a-z0-9._%+-]{1,50}@[a-z0-9.-]{1,50}\.[a-z]{2,6}$/.test(solicitud.body.email)
			|| !/^[áàãâäéèêëíìîïóòõôöúùûüÁÀÃÂÄÉÈÊËÍÌÎÏÓÒÕÖÔÚÙÛÜÝýỲỳŶŷŸÿỸỹçÇñÑa-zA-z0-9.:,;%=\/*+-_?¿¡!$\s@]{4,20}$/.test(solicitud.body.password)
			|| !/^administrador|gestioncalidad|gestionhumana|capacitacion|funcionario|contenido$/.test(solicitud.body.accesibilidad)){respuesta.status(400);respuesta.end("error campos erroneos");}
		else{
			database.insertUsuariosactuartolima(solicitud.body,function(res){
				if(!!res.error) sendError(res.error,solicitud,respuesta);
				else{
					respuesta.end(res.resultado);
				}
			});
		}
	})
	.delete(function(solicitud,respuesta){
		console.log(solicitud.body);
		
		if(!solicitud.body.email){respuesta.status(400);respuesta.end("error campos vacios");}
		else if(!/^[a-z0-9._%+-]{1,50}@[a-z0-9.-]{1,50}\.[a-z]{2,6}$/.test(solicitud.body.email)){respuesta.status(400);respuesta.end("error campos erroneos");}
		else{
			database.removeUsuariosactuartolima(solicitud.body,function(res){
				if(!!res.error) sendError(res.error,solicitud,respuesta);
				else{
					respuesta.end(res.resultado);
				}
			});
		}
	});

router.route("/proyectosycapacitacionpreinscripcion")
	.post(function(solicitud,respuesta){console.log(solicitud.body);
		if(!solicitud.body.nombre || !solicitud.body.curso || !solicitud.body.telefono1 || !solicitud.body.yearweek){respuesta.status(400);respuesta.end("error campos vacios");}
		else if(!/^[áàãâäéèêëíìîïóòõôöúùûüÁÀÃÂÄÉÈÊËÍÌÎÏÓÒÕÖÔÚÙÛÜÝýỲỳŶŷŸÿỸỹçÇñÑa-zA-z0-9\s]{1,80}$/.test(solicitud.body.nombre)
			|| (!!solicitud.body.email && !/^[a-z0-9._%+-]{1,50}@[a-z0-9.-]{1,50}\.[a-z]{2,6}$/.test(solicitud.body.email))
			|| !/^[áàãâäéèêëíìîïóòõôöúùûüÁÀÃÂÄÉÈÊËÍÌÎÏÓÒÕÖÔÚÙÛÜÝýỲỳŶŷŸÿỸỹçÇñÑa-zA-Z0-9.:,;%=\/*+-_?¿¡!$\s@()]{1,500}$/.test(solicitud.body.curso)
			|| !/^[(0-9+\s())(e?x?t?(\d*))]{7,50}$/.test(solicitud.body.telefono1)
			|| !/^[áàãâäéèêëíìîïóòõôöúùûüÁÀÃÂÄÉÈÊËÍÌÎÏÓÒÕÖÔÚÙÛÜÝýỲỳŶŷŸÿỸỹçÇñÑa-zA-Z0-9.:,;%=\/*+-_?¿¡!$\s@]{0,600}$/.test(solicitud.body.cursosugerido)){respuesta.status(400);respuesta.end("error campos erroneos");}
		else{
			if(!solicitud.body.telefono2) solicitud.body.telefono2="undefined";
			if(solicitud.body.curso=="sugerir"){
				if(!solicitud.body.cursosugerido){respuesta.status(400);respuesta.end("error campos vacios");}
				else{
					filesystem.readFile("./public/datos/proyectosycapacitacioncursossugeridos.json",function(err,data){
					var cursosJson=JSON.parse(data);
					cursosJson.lista.push({"nombre":solicitud.body.nombre,"email":solicitud.body.email,"telefono1":solicitud.body.telefono1,"telefono2":solicitud.body.telefono2,"curso":solicitud.body.cursosugerido});
					filesystem.writeFile("./public/datos/proyectosycapacitacioncursossugeridos.json",JSON.stringify(cursosJson,null,"	"),function(err2){
						if(err2) sendError(err2,solicitud,respuesta);
						else respuesta.end("Datos enviados.");
						
					});
				});
				}
				
			}else{
				filesystem.readFile("./public/datos/horarioscapacitaciones/proyectosycapacitacionhorariolista"+solicitud.body.yearweek+".json",function(err,data){
					if(err) sendError(err,solicitud,respuesta);
					else{
						var preinscripcionJson=JSON.parse(data);
						
						var finded=false;
						for(var j=0;j<preinscripcionJson.lista.length;j++){
							if(preinscripcionJson.lista[j].curso==solicitud.body.curso){
								finded=true;
								if(!preinscripcionJson.lista[j].preinscritos) preinscripcionJson.lista[j].preinscritos=[];
								var aux=preinscripcionJson.lista[j].preinscritos.filter(function(element,index,array){
									return (element.nombre==solicitud.body.nombre && element.telefono1==solicitud.body.telefono1 && element.telefono2==solicitud.body.telefono2 && element.email==solicitud.body.email);
								});
								if(aux.length>0){
									respuesta.status(400);respuesta.end("error datos de "+solicitud.body.nombre+" ya estan guardados.");
								}
								else{
									preinscripcionJson.lista[j].preinscritos.forEach(function(element,index,array){
										if(element.nombre==solicitud.body.nombre) array.splice(index,1);
									});
									preinscripcionJson.lista[j].preinscritos.push({"nombre":solicitud.body.nombre,"email":solicitud.body.email,"telefono1":solicitud.body.telefono1,"telefono2":solicitud.body.telefono2});
									filesystem.writeFile("./public/datos/horarioscapacitaciones/proyectosycapacitacionhorariolista"+solicitud.body.yearweek+".json",JSON.stringify(preinscripcionJson,null,"	"),function(err2){
										if(err2) sendError(err2,solicitud,respuesta);
										else{
											if(!!solicitud.body.email && !/undefined/.test(solicitud.body.email)){
												var mailOptions={
													from:"Actuar Tolima <famiactuar@actuartolima.com.co>",
													subject:"Confirmación de preinscripción - respuesta automática",
													to:solicitud.body.nombre+" <"+solicitud.body.email+">",cc:"admin <capacitacion@actuartolima.com.co>",bcc:"admin2 <luciacorrea@actuartolima.com.co>",
													//attachments:[{path:"./public/img/logoactuartolima.png", cid:"logo"}],
													text:"",
													html:"./public/templates/secondary/preinscripcioncapacitaciones"
												};
												sendEmail.send(mailOptions,util._extend({},solicitud.body),function(err2,respuesta2){//clonar solicitud.body
													if(err2) sendError(err2,solicitud,respuesta);
													else respuesta.end("Datos guardados, recibirás confirmación.");
												});
											}else{
												respuesta.end("Datos guardados.");
											}
										}
									});
								}
							}
							
						}
						if(!finded){
							respuesta.status(500);
							respuesta.end("curso no encontrado");
						}
							
						
						
					}
				});
			}
			
			
			
		}
	});

router.route("/intranethorariocapacitaciones")
	.all(function(solicitud,respuesta,next){
		if(!solicitud.user){respuesta.status(401);respuesta.set("WWW-Authenticate",'Intranetauth realm="intranet", tittle="Login to /login"');respuesta.end("unauthorized");}
		else if(solicitud.user.accesibilidad!="administrador" && solicitud.user.accesibilidad!="capacitacion"){respuesta.status(403);respuesta.end("error accesibilidad necesaria");}
		else{
			next();
		}
	})
	.put(function(solicitud,respuesta){
		console.log("solicitud.body",solicitud.body,"solicitud.query",solicitud.query);
		if(!solicitud.query.curso || !solicitud.query.dia || !solicitud.query.jornada || !solicitud.query.yearweek){respuesta.status(400);respuesta.end("error campos vacios");}
		//else if(!/^[áàãâäéèêëíìîïóòõôöúùûüÁÀÃÂÄÉÈÊËÍÌÎÏÓÒÕÖÔÚÙÛÜÝýỲỳŶŷŸÿỸỹçÇñÑa-zA-Z0-9.:,;%=\/*+-_?¿¡!$\s@()]{1,500}$/.test(solicitud.query.curso)
		//	|| !solicitud.query.dia.every(function(element,index,array){return /^[Lunes]?[Martes]?[Miércoles]?[Jueves]?[Viernes]?$/.test(element)})
		//	|| !solicitud.query.jornada.every(function(element,index,array){return /^[am]?[pm]?$/.test(element)})){respuesta.status(400);respuesta.end("error campos erroneos");}
		else{
			intranetHorariocapacitacionesUpload(solicitud,respuesta,function(err){
				if(err){console.log(err);
					sendError(["error al subir archivo.",JSON.stringify(err)],solicitud,respuesta);
				}else{
					solicitud.query.dia=JSON.parse(solicitud.query.dia);
					solicitud.query.jornada=JSON.parse(solicitud.query.jornada);
					filesystem.readFile("./public/datos/horarioscapacitaciones/proyectosycapacitacionhorariolista"+solicitud.query.yearweek+".json",function(err,data){
						if(err) sendError(err,solicitud,respuesta);
						else{
							var horarioJson=JSON.parse(data);
							
							var finded=false;
							for(var j=0;j<horarioJson.lista.length;j++){
								if(horarioJson.lista[j].curso==solicitud.query.curso){
									finded=true;
									//if(horarioJson.lista[j].horario.length>solicitud.query.dia.length) horarioJson.lista[j].horario=horarioJson.lista[j].horario.slice(0,solicitud.query.dia.length);
									horarioJson.lista[j].horario="";
									for(var i=0;i<solicitud.query.dia.length;i++){
										horarioJson.lista[j].horario=horarioJson.lista[j].horario+solicitud.query.dia[i]+"-"+solicitud.query.jornada[i]+".";
									}
									horarioJson.lista[j].horario=horarioJson.lista[j].horario.slice(0,horarioJson.lista[j].horario.length-1);
									horarioJson.lista[j].img=solicitud.intranetHorariocapacitacionesImgName;
								}
								
							}
							if(!finded){
								var horario="";
								for(var i=0;i<solicitud.query.dia.length;i++){
									horario=horario+solicitud.query.dia[i]+"-"+solicitud.query.jornada[i]+".";
								}
								horario=horario.slice(0,horario.length-1);
								horarioJson.lista.push({
									"curso":solicitud.query.curso,
									"img":solicitud.intranetHorariocapacitacionesImgName,
									"horario":horario
								});
							}
							//if(!horarioJson.lista[solicitud.query.curso]) horarioJson.lista[solicitud.query.curso]=[];
							//var aux=horarioJson.lista[solicitud.query.curso].filter(function(element){
							//	return (element.nombre==solicitud.query.nombre);
							//});
							//if(aux.length>0){respuesta.status(400);respuesta.end("error datos de "+solicitud.query.nombre+" ya estan guardados.");}
							//else{
							//	horarioJson.lista[solicitud.query.curso].push({"nombre":solicitud.query.nombre,"email":solicitud.query.email,"telefono":solicitud.query.telefono});
								filesystem.writeFile("./public/datos/horarioscapacitaciones/proyectosycapacitacionhorariolista"+solicitud.query.yearweek+".json",JSON.stringify(horarioJson,null,"	"),function(err2){
									if(err2) sendError(err2,solicitud,respuesta);
									else{
										respuesta.end("Datos guardados.");
										
									}
								});
							//}
							
						}
					});
					
					
					
					
				}
			});
		}
		
		
		
		
		
		
		
		/*if(!solicitud.user){respuesta.status(403);respuesta.end("error autenticacion necesaria");}
		else if(solicitud.user.accesibilidad!="a" && solicitud.user.accesibilidad!="b"){respuesta.status(403);respuesta.end("error accesibilidad necesaria");}
		else if(!solicitud.body.curso || !solicitud.body.dia || !solicitud.body.horainicio || !solicitud.body.horafin){respuesta.status(400);respuesta.end("error campos vacios");}
		else if(solicitud.body.borrar===true){
			console.log("sadfsdfs");
		}//else if(!/^[áàãâäéèêëíìîïóòõôöúùûüÁÀÃÂÄÉÈÊËÍÌÎÏÓÒÕÖÔÚÙÛÜÝýỲỳŶŷŸÿỸỹçÇñÑa-zA-Z0-9.:,;%=\/*+-_?¿¡!$\s@()]{1,500}$/.test(solicitud.body.curso)
		//	|| !solicitud.body.dia.every(function(element,index,array){return /^[Lunes]?[Martes]?[Miércoles]?[Jueves]?[Viernes]?$/.test(element)})
		//	|| !solicitud.body.horainicio.every(function(element,index,array){return /^([01]?[0-9]|2[0-3]):([0-5][0-9]|[0-9])$/.test(element)})
		//	|| !solicitud.body.horafin.every(function(element,index,array){return /^([01]?[0-9]|2[0-3]):([0-5][0-9]|[0-9])$/.test(element)})){respuesta.status(400);respuesta.end("error campos erroneos");}
		else{
			solicitud.body.dia=JSON.parse(solicitud.body.dia);
			solicitud.body.horainicio=JSON.parse(solicitud.body.horainicio);
			solicitud.body.horafin=JSON.parse(solicitud.body.horafin);
			console.log(typeof solicitud.body.dia,solicitud.body.dia);
			filesystem.readFile("./public/datos/proyectosycapacitacionhorariolista.json",function(err,data){
				if(err) sendError(err,solicitud,respuesta);
				else{
					var horarioJson=JSON.parse(data);
					
					var finded=false;
					for(var j=0;j<horarioJson.lista.length;j++){
						if(horarioJson.lista[j].curso==solicitud.body.curso){
							finded=true;
							if(horarioJson.lista[j].horario.length>solicitud.body.dia.length) horarioJson.lista[j].horario=horarioJson.lista[j].horario.slice(0,solicitud.body.dia.length);
							for(var i=0;i<solicitud.body.dia.length;i++){
								horarioJson.lista[j].horario[i]={
									"dia":solicitud.body.dia[i],
									"hi":solicitud.body.horainicio[i],
									"hf":solicitud.body.horafin[i]
								}
							}
						}
						
						//horarioJson.lista.find(function(element, index, array){return element.curso==solicitud.body.curso}).horario[i]={
						//	"dia":solicitud.body.dia[i],
						//	"hi":solicitud.body.horainicio[i],
						//	"hf":solicitud.body.horafin[i],
						//	"horainicio":new Date(2015,7,17,horainicio[i].split(":")[0],horainicio[i].split(":")[1]),
						//	"horafin":new Date(2015,7,17,horafin[i].split(":")[0],horafin[i].split(":")[1])
						//}
						
					}
					if(!finded){
						var horario=[];
						for(var i=0;i<solicitud.body.dia.length;i++){
							horario[i]={
								"dia":solicitud.body.dia[i],
								"hi":solicitud.body.horainicio[i],
								"hf":solicitud.body.horafin[i]
							}
						}
						horarioJson.lista.push({
							"curso":solicitud.body.curso,
							"horario":horario
						});
					}
					//if(!horarioJson.lista[solicitud.body.curso]) horarioJson.lista[solicitud.body.curso]=[];
					//var aux=horarioJson.lista[solicitud.body.curso].filter(function(element){
					//	return (element.nombre==solicitud.body.nombre);
					//});
					//if(aux.length>0){respuesta.status(400);respuesta.end("error datos de "+solicitud.body.nombre+" ya estan guardados.");}
					//else{
					//	horarioJson.lista[solicitud.body.curso].push({"nombre":solicitud.body.nombre,"email":solicitud.body.email,"telefono":solicitud.body.telefono});
						filesystem.writeFile("./public/datos/proyectosycapacitacionhorariolista.json",JSON.stringify(horarioJson,null,"	"),function(err2){
							if(err2) sendError(err2,solicitud,respuesta);
							else{
								respuesta.end("Datos guardados.");
							}
						});
					//}
					
				}
			});
			
			
		}*/
	})
	.delete(function(solicitud,respuesta){
		if(!solicitud.body.curso || !solicitud.body.yearweek){respuesta.status(400);respuesta.end("error campos vacios");}
		else if(!/^[áàãâäéèêëíìîïóòõôöúùûüÁÀÃÂÄÉÈÊËÍÌÎÏÓÒÕÖÔÚÙÛÜÝýỲỳŶŷŸÿỸỹçÇñÑa-zA-Z0-9.:,;%=\/*+-_?¿¡!$\s@()]{1,500}$/.test(solicitud.body.curso)){respuesta.status(400);respuesta.end("error campos erroneos");}
		else{
			filesystem.readFile("./public/datos/horarioscapacitaciones/proyectosycapacitacionhorariolista"+solicitud.body.yearweek+".json",function(err,data){
				if(err) sendError(err,solicitud,respuesta);
				else{
					var horarioJson=JSON.parse(data);
					
					var finded=false;
					for(var j=0;j<horarioJson.lista.length;j++){
						if(horarioJson.lista[j].curso==solicitud.body.curso){
							finded=true;
							horarioJson.lista.splice(j,1);
						}
					}
					if(!finded){
						respuesta.status(500);
						respuesta.end("curso no encontrado.");
					}else{
						filesystem.writeFile("./public/datos/horarioscapacitaciones/proyectosycapacitacionhorariolista"+solicitud.body.yearweek+".json",JSON.stringify(horarioJson,null,"	"),function(err2){
							if(err2) sendError(err2,solicitud,respuesta);
							else{
								respuesta.end("curso borado.");
							}
						});
					}
					
				}
			})
		}
	});

router.route("/datos/horarioscapacitaciones*")
	.get(function(solicitud,respuesta,next){
		console.log("./public"+solicitud.path);
		filesystem.readFile("./public"+solicitud.path,function(err,data){
			if(err){
				filesystem.writeFile("./public"+solicitud.path,JSON.stringify({lista:[]}),function(err2){
					if(err2) sendError(err2,solicitud,respuesta);
					else{
						console.log("./public"+solicitud.path);
						next();
					}
				});
			}
			else next();
		});
	});

router.route("/intranetarchivos")
	.all(function(solicitud,respuesta,next){
		if(!solicitud.user){respuesta.status(401);respuesta.set("WWW-Authenticate",'Intranetauth realm="intranet", tittle="Login to /login"');respuesta.end("unauthorized");}
		else if(solicitud.user.accesibilidad!="administrador" && solicitud.user.accesibilidad!="gestioncalidad"){respuesta.status(403);respuesta.end("error accesibilidad necesaria");}
		else{
			next();
		}
	})
	.post(function(solicitud,respuesta){
		if(!solicitud.query.path){respuesta.status(400);respuesta.end("error campos vacios");}
		else{
			intranetArchivosUpload(solicitud,respuesta,function(err){
				if(err){console.log(err);
					sendError(["error al subir archivo.",JSON.stringify(err)],solicitud,respuesta);
				}else{
					//console.log(respuesta.config);
					watches.actualizarIntranetarchivos();
					respuesta.end("Archivo '"+solicitud.file.originalname+"' enviado.");
					
				}
			});
		}
		
	})
	.delete(function(solicitud,respuesta){
		if(!solicitud.body.path){respuesta.status(400);respuesta.end("error campos vacios");}
		else{
			filesystem.unlink('./public/private/archivos_gestion_de_calidad/'+solicitud.body.path,function(err){
				if(err) sendError(err,solicitud,respuesta);
				else{
					watches.actualizarIntranetarchivos();
					respuesta.end("archivo borado.");
				}
			})
		}
	});

router.route("/intranetcapacitaciones")
	.all(function(solicitud,respuesta,next){
		if(!solicitud.user){respuesta.status(401);respuesta.set("WWW-Authenticate",'Intranetauth realm="intranet", tittle="Login to /login"');respuesta.end("unauthorized");}
		else if(solicitud.user.accesibilidad!="administrador" && solicitud.user.accesibilidad!="capacitacion"){respuesta.status(403);respuesta.end("error accesibilidad necesaria");}
		else{
			next();
		}
	})
	.post(function(solicitud,respuesta){
		if(!solicitud.query.grupo){respuesta.status(400);respuesta.end("error campos vacios");}
		else{
			intranetCapacitacionesUpload(solicitud,respuesta,function(err){console.log(arguments)
				if(err){console.log(err);
					sendError(["error al subir archivo.",JSON.stringify(err)],solicitud,respuesta);
				}else{
					watches.actualizarFotos();
					respuesta.end("Archivo enviado.");
				}
			});
		}
		
	})
	.put(function(solicitud,respuesta){
		if(!solicitud.body.curso || !solicitud.body.area || !solicitud.body.grupo){respuesta.status(400);respuesta.end("error campos vacios");}
		else if(!/^[áàãâäéèêëíìîïóòõôöúùûüÁÀÃÂÄÉÈÊËÍÌÎÏÓÒÕÖÔÚÙÛÜÝýỲỳŶŷŸÿỸỹçÇñÑa-zA-Z0-9\s(),.]{1,5000}$/.test(solicitud.body.curso)
			|| !/^[a-z0-9]{1,80}$/.test(solicitud.body.grupo)){respuesta.status(400);respuesta.end("error campos erroneos");}
		else{
			
				filesystem.readFile("./public/datos/modificables/proyectosycapacitacionlista.json",function(err,data){
					if(err) sendError(err,solicitud,respuesta);
					else{
						var cursosJson=JSON.parse(data);
						
						var finded=false;
						var areafinded=false;
						for(var j=0;j<cursosJson.lista.length;j++){
							if(cursosJson.lista[j].area==solicitud.body.area){
								areafinded=true;
								//for(var k=0;k<cursosJson.lista[j].items.length;k++){
								//	if(cursosJson.lista[j].items[k].titulo==solicitud.body.curso){
								//		finded=true;
								//	}
								//}
								//if(!finded){
									cursosJson.lista[j].items.push({"titulo":solicitud.body.curso});
									cursosJson.lista[j].grupo=solicitud.body.grupo;
									filesystem.writeFile("./public/datos/modificables/proyectosycapacitacionlista.json",JSON.stringify(cursosJson,null,"	"),function(err2){
										if(err2) sendError(err2,solicitud,respuesta);
										else{
											respuesta.end("Datos guardados.");
										}
									});
								//}else{
								//	respuesta.status(500);
								//	respuesta.end("curso no encontrado.");
								//}
							}
						}
						if(!areafinded){
							cursosJson.lista.push({area:solicitud.body.area,grupo:solicitud.body.grupo,items:[{titulo:solicitud.body.curso}]});
							filesystem.writeFile("./public/datos/modificables/proyectosycapacitacionlista.json",JSON.stringify(cursosJson,null,"	"),function(err2){
								if(err2) sendError(err2,solicitud,respuesta);
								else{
									respuesta.end("Datos guardados.");
								}
							});
						}
						
					}
				});
				
			
		}
		
	})
	.delete(function(solicitud,respuesta){
		if(solicitud.query.deletearea){
				if(!solicitud.body.area){respuesta.status(400);respuesta.end("error campos vacios");}
				else{
					filesystem.readFile("./public/datos/modificables/proyectosycapacitacionlista.json",function(err,data){
						if(err) sendError(err,solicitud,respuesta);
						else{
							var cursosJson=JSON.parse(data);
							
							var finded=false;
							for(var j=0;j<cursosJson.lista.length;j++){
								if(cursosJson.lista[j].area==solicitud.body.area){
									finded=true;
									cursosJson.lista.splice(j,1);
								}
							}
							if(!finded){
								respuesta.status(500);
								respuesta.end("curso no encontrado.");
							}else{
								filesystem.writeFile("./public/datos/modificables/proyectosycapacitacionlista.json",JSON.stringify(cursosJson,null,"	"),function(err2){
									if(err2) sendError(err2,solicitud,respuesta);
									else{
										watches.actualizarIntranetarchivos();
										respuesta.end("area borada.");
									}
								});
							}
							
						}
					});
				}
				
		}else if(solicitud.query.deletefoto){
				if(!solicitud.body.foto){respuesta.status(400);respuesta.end("error campos vacios");}
				else{
					filesystem.unlink("./public/fotos/proyectosycapacitacion/"+solicitud.body.foto,function(err){
						if(err)sendError(err,solicitud,respuesta);
						else{
							watches.actualizarFotos();
							respuesta.end("foto borada.");
						}
					});
				}
				
		}else if(solicitud.query.deletecursosugerido){
				if(!solicitud.body.curso || !solicitud.body.nombre){respuesta.status(400);respuesta.end("error campos vacios");}
				else{
					filesystem.readFile("./public/datos/proyectosycapacitacioncursossugeridos.json",function(err,data){
						if(err) sendError(err,solicitud,respuesta);
						else{
							var cursosJson=JSON.parse(data);
							
							var finded=false;
							for(var j=0;j<cursosJson.lista.length;j++){
								if(cursosJson.lista[j].curso==solicitud.body.curso && cursosJson.lista[j].nombre==solicitud.body.nombre){
									finded=true;
									cursosJson.lista.splice(j,1);
								}
							}
							if(!finded){
								respuesta.status(500);
								respuesta.end("curso no encontrado.");
							}else{
								filesystem.writeFile("./public/datos/proyectosycapacitacioncursossugeridos.json",JSON.stringify(cursosJson,null,"	"),function(err2){
									if(err2) sendError(err2,solicitud,respuesta);
									else{
										watches.actualizarIntranetarchivos();
										respuesta.end("curso sugerido borado.");
									}
								});
							}
							
						}
					});
				}
				
		}else{
			if(!solicitud.body.curso || !solicitud.body.area){respuesta.status(400);respuesta.end("error campos vacios");}
			else if(!/^[áàãâäéèêëíìîïóòõôöúùûüÁÀÃÂÄÉÈÊËÍÌÎÏÓÒÕÖÔÚÙÛÜÝýỲỳŶŷŸÿỸỹçÇñÑa-zA-Z0-9\s(),.]{1,5000}$/.test(solicitud.body.curso)){respuesta.status(400);respuesta.end("error campos erroneos");}
			else{
				
				
				filesystem.readFile("./public/datos/modificables/proyectosycapacitacionlista.json",function(err,data){
					if(err) sendError(err,solicitud,respuesta);
					else{
						var cursosJson=JSON.parse(data);
						
						var finded=false;
						for(var j=0;j<cursosJson.lista.length;j++){
							if(cursosJson.lista[j].area==solicitud.body.area){
								for(var k=0;k<cursosJson.lista[j].items.length;k++){
									if(cursosJson.lista[j].items[k].titulo==solicitud.body.curso){
										finded=true;
										cursosJson.lista[j].items.splice(k,1);
									}
								}
							}
						}
						if(!finded){
							respuesta.status(500);
							respuesta.end("curso no encontrado.");
						}else{
							filesystem.writeFile("./public/datos/modificables/proyectosycapacitacionlista.json",JSON.stringify(cursosJson,null,"	"),function(err2){
								if(err2) sendError(err2,solicitud,respuesta);
								else{
									watches.actualizarIntranetarchivos();
									respuesta.end("curso borado.");
								}
							});
						}
						
					}
				});
				
			}
		}
	});

router.route("/intranetofertalaboral")
	.all(function(solicitud,respuesta,next){
		if(!solicitud.user){respuesta.status(401);respuesta.set("WWW-Authenticate",'Intranetauth realm="intranet", tittle="Login to /login"');respuesta.end("unauthorized");}
		else if(solicitud.user.accesibilidad!="administrador" && solicitud.user.accesibilidad!="gestionhumana"){respuesta.status(403);respuesta.end("error accesibilidad necesaria");}
		else{
			next();
		}
	})
	.put(function(solicitud,respuesta){
		if(!solicitud.body.titulo || !solicitud.body.desc){respuesta.status(400);respuesta.end("error campos vacios");}
		else if(!/^[áàãâäéèêëíìîïóòõôöúùûüÁÀÃÂÄÉÈÊËÍÌÎÏÓÒÕÖÔÚÙÛÜÝýỲỳŶŷŸÿỸỹçÇñÑa-zA-Z0-9\s-_]{1,300}$/.test(solicitud.body.titulo)){respuesta.status(400);respuesta.end("error campos erroneos");}
		else{
			filesystem.readFile("./public/datos/modificables/convocatoriaslista.json",function(err,data){
				if(err) sendError(err,solicitud,respuesta);
				else{
					var convocatoriasJson=JSON.parse(data);
					
					var finded=false;
					for(var j=0;j<convocatoriasJson.lista.length;j++){
						if(convocatoriasJson.lista[j].titulo==solicitud.body.titulo){
							finded=true;
							convocatoriasJson.lista[j].titulo=solicitud.body.titulo;
							convocatoriasJson.lista[j].desc=solicitud.body.desc;
							filesystem.writeFile("./public/datos/modificables/convocatoriaslista.json",JSON.stringify(convocatoriasJson,null,"	"),function(err2){
								if(err2) sendError(err2,solicitud,respuesta);
								else{
									respuesta.end("Datos guardados.");
								}
							});
						}
						
					}
					if(!finded){
						var d=new Date();
						convocatoriasJson.lista.push({titulo:solicitud.body.titulo+"_"+d.getUTCDate()+"-"+(d.getUTCMonth()+1)+"-"+d.getUTCFullYear(),desc:solicitud.body.desc});
						filesystem.writeFile("./public/datos/modificables/convocatoriaslista.json",JSON.stringify(convocatoriasJson,null,"	"),function(err2){
							if(err2) sendError(err2,solicitud,respuesta);
							else{
								respuesta.end("Datos guardados.");
							}
						});
					}
					
				}
			});
				
			
		}
		
	})
	.delete(function(solicitud,respuesta){
		if(!!solicitud.query.deletearchivo){
			if(!solicitud.body.path){respuesta.status(400);respuesta.end("error campos vacios");}
			else{
				filesystem.unlink('./public/private/uploads/'+solicitud.body.path,function(err){
					if(err) sendError(err,solicitud,respuesta);
					else{
						watches.actualizarIntranetarchivos();
						respuesta.end("archivo borado.");
					}
				})
			}
		}else{
			if(!solicitud.body.titulo){respuesta.status(400);respuesta.end("error campos vacios");}
			else if(!/^[áàãâäéèêëíìîïóòõôöúùûüÁÀÃÂÄÉÈÊËÍÌÎÏÓÒÕÖÔÚÙÛÜÝýỲỳŶŷŸÿỸỹçÇñÑa-zA-Z0-9\s-_]{1,300}$/.test(solicitud.body.titulo)){respuesta.status(400);respuesta.end("error campos erroneos");}
			else{
				filesystem.readFile("./public/datos/modificables/convocatoriaslista.json",function(err,data){
					if(err) sendError(err,solicitud,respuesta);
					else{
						var convocatoriasJson=JSON.parse(data);
						
						var finded=false;
						for(var j=0;j<convocatoriasJson.lista.length;j++){
							if(convocatoriasJson.lista[j].titulo==solicitud.body.titulo){
								finded=true;
								convocatoriasJson.lista.splice(j,1);
							}
						}
						if(!finded){
							respuesta.status(500);
							respuesta.end("oferta no encontrada.");
						}else{
							filesystem.writeFile("./public/datos/modificables/convocatoriaslista.json",JSON.stringify(convocatoriasJson,null,"	"),function(err2){
								if(err2) sendError(err2,solicitud,respuesta);
								else{
									rimraf("./public/private/uploads/trabajaconnosotros/"+solicitud.body.titulo.replace(/\s/g,"_")+"/",function(err2){
										if(err2) sendError(err2,solicitud,respuesta);
										else{
											watches.actualizarIntranetarchivos();
											respuesta.end("oferta borada.");
										}
									});
								}
							});
						}
						
					}
				})
			}
		}
		
	});

router.route("/intranetlineasdecredito")
	.all(function(solicitud,respuesta,next){
		if(!solicitud.user){respuesta.status(401);respuesta.set("WWW-Authenticate",'Intranetauth realm="intranet", tittle="Login to /login"');respuesta.end("unauthorized");}
		else if(solicitud.user.accesibilidad!="administrador" && solicitud.user.accesibilidad!="contenido"){respuesta.status(403);respuesta.end("error accesibilidad necesaria");}
		else{
			next();
		}
	})
	.post(function(solicitud,respuesta){
		if(!solicitud.query.linea){respuesta.status(400);respuesta.end("error campos vacios");}
		else{
			intranetLineasdecreditoUpload(solicitud,respuesta,function(err){console.log(arguments,err,solicitud.intranetLineasdecreditoImgName)
				if(err || !solicitud.intranetLineasdecreditoImgName){console.log(err);
					sendError(["error al subir archivo.",JSON.stringify(err)],solicitud,respuesta);
				}else{
					filesystem.readFile("./public/datos/modificables/lineasdecreditolista.json",function(err,data){
						if(err) sendError(err,solicitud,respuesta);
						else{
							var lineasJson=JSON.parse(data);
							
							var finded=false;
							for(var j=0;j<lineasJson.lista.length;j++){
								if(lineasJson.lista[j].linea==solicitud.query.linea){
									finded=true;
									lineasJson.lista[j].img=solicitud.intranetLineasdecreditoImgName;
									filesystem.writeFile("./public/datos/modificables/lineasdecreditolista.json",JSON.stringify(lineasJson,null,"	"),function(err2){
										if(err2) sendError(err2,solicitud,respuesta);
										else{
											watches.actualizarFotos();
											respuesta.end("Datos guardados.");
										}
									});
								}
							}
							if(!finded){
								respuesta.status(500);
								respuesta.end("linea no encontrada.");
							}
							
						}
					});
				}
			});
		}
		
	})
	.put(function(solicitud,respuesta){
		if(!solicitud.body.linea || !solicitud.body.desc){respuesta.status(400);respuesta.end("error campos vacios");}
		else if(!/^[áàãâäéèêëíìîïóòõôöúùûüÁÀÃÂÄÉÈÊËÍÌÎÏÓÒÕÖÔÚÙÛÜÝýỲỳŶŷŸÿỸỹçÇñÑa-zA-Z0-9\s]{1,300}$/.test(solicitud.body.linea)){respuesta.status(400);respuesta.end("error campos erroneos");}
		else{
			
				filesystem.readFile("./public/datos/modificables/lineasdecreditolista.json",function(err,data){
					if(err) sendError(err,solicitud,respuesta);
					else{
						var cursosJson=JSON.parse(data);
						
						var finded=false;
						for(var j=0;j<cursosJson.lista.length;j++){
							if(cursosJson.lista[j].linea==solicitud.body.linea){
								finded=true;
								cursosJson.lista[j].desc=solicitud.body.desc;
								filesystem.writeFile("./public/datos/modificables/lineasdecreditolista.json",JSON.stringify(cursosJson,null,"	"),function(err2){
									if(err2) sendError(err2,solicitud,respuesta);
									else{
										respuesta.end("Datos guardados.");
									}
								});
							}
						}
						if(!finded){
							cursosJson.lista.push({linea:solicitud.body.linea,desc:solicitud.body.desc,img:"logo.png"});
							filesystem.writeFile("./public/datos/modificables/lineasdecreditolista.json",JSON.stringify(cursosJson,null,"	"),function(err2){
								if(err2) sendError(err2,solicitud,respuesta);
								else{
									respuesta.end("Datos guardados.");
								}
							});
						}
						
					}
				});
				
			
		}
		
	})
	.delete(function(solicitud,respuesta){
		if(!solicitud.body.linea){respuesta.status(400);respuesta.end("error campos vacios");}
		else if(!/^[áàãâäéèêëíìîïóòõôöúùûüÁÀÃÂÄÉÈÊËÍÌÎÏÓÒÕÖÔÚÙÛÜÝýỲỳŶŷŸÿỸỹçÇñÑa-zA-Z0-9\s]{1,300}$/.test(solicitud.body.linea)){respuesta.status(400);respuesta.end("error campos erroneos");}
		else{
			filesystem.readFile("./public/datos/modificables/lineasdecreditolista.json",function(err,data){
				if(err) sendError(err,solicitud,respuesta);
				else{
					var lineasJson=JSON.parse(data);
					
					var finded=false;
					for(var j=0;j<lineasJson.lista.length;j++){
						if(lineasJson.lista[j].linea==solicitud.body.linea){
							finded=true;
							lineasJson.lista.splice(j,1);
						}
					}
					if(!finded){
						respuesta.status(500);
						respuesta.end("linea no encontrada.");
					}else{
						filesystem.writeFile("./public/datos/modificables/lineasdecreditolista.json",JSON.stringify(lineasJson,null,"	"),function(err2){
							if(err2) sendError(err2,solicitud,respuesta);
							else{
								respuesta.end("linea borada.");
							}
						});
					}
					
				}
			});
		}
		
	});

router.route("/intranetindicadores")
	.all(function(solicitud,respuesta,next){
		if(!solicitud.user){respuesta.status(401);respuesta.set("WWW-Authenticate",'Intranetauth realm="intranet", tittle="Login to /login"');respuesta.end("unauthorized");}
		else if(solicitud.user.accesibilidad!="administrador" && solicitud.user.accesibilidad!="contenido"){respuesta.status(403);respuesta.end("error accesibilidad necesaria");}
		else{
			next();
		}
	})
	.post(function(solicitud,respuesta){
		if(!solicitud.query.tipo){respuesta.status(400);respuesta.end("error campos vacios");}
		else{
			intranetIndicadoresUpload(solicitud,respuesta,function(err){console.log(arguments,err,solicitud.intranetIndicadoresImgName)
				if(err || !solicitud.intranetIndicadoresImgName){console.log(err);
					sendError(["error al subir archivo.",JSON.stringify(err)],solicitud,respuesta);
				}else{
					watches.actualizarFotos();
					respuesta.end("Archivo enviado.");
				}
			});
		}
		
	})
	.delete(function(solicitud,respuesta){
		if(!solicitud.body.foto){respuesta.status(400);respuesta.end("error campos vacios");}
		else{
			filesystem.unlink("./public/fotos/indicadores/"+solicitud.body.foto,function(err){
				if(err) sendError(err,solicitud,respuesta);
				else{
					watches.actualizarFotos();
					respuesta.end("Archivo borado.");
				}
			});
		}
		
	});

router.route("/solicitarcreditoemail")
	.post(function(solicitud,respuesta){
		if(!solicitud.body.nombre || !solicitud.body.telefono || !solicitud.body.mensaje || !solicitud.body.ciudad || !solicitud.body.direccion){respuesta.status(400);respuesta.end("error campos vacios");}
		else if(!/^[áàãâäéèêëíìîïóòõôöúùûüÁÀÃÂÄÉÈÊËÍÌÎÏÓÒÕÖÔÚÙÛÜÝýỲỳŶŷŸÿỸỹçÇñÑa-zA-Z0-9.:,;%=\/*+-_?¿¡!$\s@]{1,80}$/.test(solicitud.body.nombre)
			|| !/^[áàãâäéèêëíìîïóòõôöúùûüÁÀÃÂÄÉÈÊËÍÌÎÏÓÒÕÖÔÚÙÛÜÝýỲỳŶŷŸÿỸỹçÇñÑa-zA-Z0-9.:,;%=\/*+-_?¿¡!$\s@]{0,80}$/.test(solicitud.body.ciudad)
			|| !/^[áàãâäéèêëíìîïóòõôöúùûüÁÀÃÂÄÉÈÊËÍÌÎÏÓÒÕÖÔÚÙÛÜÝýỲỳŶŷŸÿỸỹçÇñÑa-zA-Z0-9.:,;%=\/*+-_?¿¡!$\s@]{0,80}$/.test(solicitud.body.direccion)
			|| !/^[(0-9+\s())(e?x?t?(\d*))]{7,50}$/.test(solicitud.body.telefono)
			|| !(!/^[a-z0-9._%+-]{1,50}@[a-z0-9.-]{1,50}\.[a-z]{2,6}$/.test(solicitud.body.email) | !!solicitud.body.email)
			|| !/^[áàãâäéèêëíìîïóòõôöúùûüÁÀÃÂÄÉÈÊËÍÌÎÏÓÒÕÖÔÚÙÛÜÝýỲỳŶŷŸÿỸỹçÇñÑa-zA-Z0-9.:,;%=\/*+-_?¿¡!$\s@]{1,600}$/.test(solicitud.body.mensaje)){respuesta.status(400);respuesta.end("error campos erroneos");}
		else{
			solicitud.body.mensaje=solicitud.body.mensaje.replace(/\n/g,"<br></br>");
			var mailOptions={
				from:"Actuar Tolima <famiactuar@actuartolima.com.co>",
				subject:"Solicitud de crédito - respuesta automática",
				to:solicitud.body.nombre+" <"+solicitud.body.email+">",cc:"admin <indicadoreslineas@actuartolima.com.co>",bcc:"admin2 <carolinacallejas@actuartolima.com.co>",
				//attachments:[{path:"./public/img/logoactuartolima.png", cid:"logo"}],
				text:"",
				html:"./public/templates/secondary/solicitudcreditoemail"
			};
			sendEmail.send(mailOptions,util._extend({},solicitud.body),function(err,respuesta2){//clonar solicitud.body
				if(!!solicitud.body.email){
					if(err) sendError(["error al enviar mensaje. Intente otra vez.",err,"respuesta2",respuesta2],solicitud,respuesta);
					else respuesta.end("mensaje enviado, recibirás confirmación.");
				}else{
					if(err) sendError(["error al enviar solicitud. Intente otra vez.",err,"respuesta2",respuesta2],solicitud,respuesta);
					else respuesta.end("solicictud enviada.");
				}
			});
		}
	});




router.route("*")
	.post(function(solicitud,respuesta){
		console.log("router.route(*)");
		respuesta.status(400);
		respuesta.end("400 Bad request");
	})
	.put(function(solicitud,respuesta){
		console.log("router.route(*)");
		respuesta.status(400);
		respuesta.end("400 Bad request");
	})
	.delete(function(solicitud,respuesta){
		console.log("router.route(*)");
		respuesta.status(400);
		respuesta.end("400 Bad request");
	})
	.options(function(solicitud,respuesta){
		respuesta.set('Access-Control-Allow-Methods','HEAD,GET,POST,PUT,DELETE,OPTIONS');
		respuesta.set('Allow','HEAD,GET,POST,PUT,DELETE,OPTIONS');
		respuesta.set('Access-Control-Max-Age','1728000');//20dias
		respuesta.status(200);
		respuesta.end();
	});



app.get("*",function(solicitud,respuesta){
	console.log("app.get(404)");
	respuesta.status(404);
	var options={root:'./public/',dotfiles:'deny',headers:{}
	};
	respuesta.type("text/html; charset=utf-8");
	respuesta.sendFile("main.html",options,function(err){
		if(err) sendError({"error respuesta.sendFile.":err},solicitud,respuesta);
	});
})

app.use(function(solicitud,respuesta){
	console.log("app.use(400)");
	respuesta.status(400);
	var options={root:'./public/',dotfiles:'deny',headers:{}
	};
	respuesta.type("text/html; charset=utf-8");
	respuesta.sendFile("main.html",options,function(err){
		if(err) sendError({"error respuesta.sendFile.":err},solicitud,respuesta);
	});
});

app.use(function(err,solicitud,respuesta,next){
	console.log("app.use(500)",err,err.stack);
	respuesta.type("text/html; charset=utf-8");
	respuesta.status(500);
	respuesta.end('500 Internal Server Error: '+JSON.stringify(err));
});











var log=function(solicitud,respuesta,a){//console.log(solicitud.socket);
	d=new Date();
	var argumentsLog=a;
	//ipLocation(solicitud.socket.remoteAddress, function(data){
		/*filesystem.createWriteStream("./registros/registrohttp.txt",{"flags":"a"}).end("\n>>["+cluster.worker.id+"]"+d.getHours()+":"+d.getMinutes()+":"+d.getSeconds()+":"+d.getMilliseconds()+">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>"+
		"\n>>>>http "+respuesta.statusCode+" "+solicitud.ip+":"+solicitud.socket.remotePort+solicitud.path+"   ("+respuesta._headers["content-encoding"]+")\n"+
		respuesta._header.replace(/\r\n/g,'      ')+"\nargumentslog"+JSON.stringify(argumentsLog)+"\nlocals"+JSON.stringify(respuesta.locals)+//"\niplocation"+JSON.stringify(arguments)+//Buffer.byteLength(data.toString(),"string")
		"\n>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>\n", function(){});
		*/
	//});
};

var sendError=function(err,solicitud,respuesta,next){console.log(err);
	respuesta.on("finish",function(){log(solicitud,respuesta,err);});
	respuesta.status(500);
	respuesta.end('500 Internal Server Error:<br></br>'+JSON.stringify(err));
};

var compressFilter=function(solicitud,respuesta){
	//console.log(solicitud.headers["accept-encoding"],/identity/i.test(solicitud.headers["accept-encoding"]));
	if(!!solicitud.query.download) return false;
	//return compression.filter(solicitud,respuesta);
	return true;
};

var trabajaconnosotrosStorage=multer.diskStorage({
	destination:function(solicitud,file,cb){
		//console.log(solicitud.query,solicitud.body,solicitud.files,file);
		var path='./public/private/uploads/trabajaconnosotros/'+solicitud.query.cargotitulo.replace(/\s/g,"_");
		try{
			filesystem.statSync('./public/private/uploads/trabajaconnosotros/'+solicitud.query.cargotitulo.replace(/\s/g,"_"));
		}catch(e){
			filesystem.mkdirSync('./public/private/uploads/trabajaconnosotros/'+solicitud.query.cargotitulo.replace(/\s/g,"_"));
		}
		cb(null,path);
	},
	filename:function(solicitud,file,cb){console.log(file);
		if(!/pdf/.test(file.mimetype)
			&& !/msword/.test(file.mimetype)
			&& !/vnd.openxmlformats-officedocument.wordprocessingml.document/.test(file.mimetype)) cb({error:"error campos erroneos"})
		else{
			var d=new Date(),
			nombre=solicitud.query.nombre.replace(/\s/g,"")+"_"+solicitud.query.email+"_"+d.getUTCDate()+"-"+(d.getUTCMonth()+1)+"-"+d.getUTCFullYear(),
			valido,
			cont=0;
			
			do{
				try{
					filesystem.statSync('./public/private/uploads/trabajaconnosotros/'+solicitud.query.cargotitulo.replace(/\s/g,"_")+"/"+nombre+"."+file.originalname.split('.')[file.originalname.split('.').length -1]);
					valido=false;
					cont=cont+1;
					nombre=solicitud.query.nombre.replace(/\s/g,"")+"_"+solicitud.query.email+"_"+d.getUTCDate()+"-"+(d.getUTCMonth()+1)+"-"+d.getUTCFullYear()+"("+cont+")";
				}catch(e){
					valido=true;
					cb(null,nombre+"."+file.originalname.split('.')[file.originalname.split('.').length-1]);
				}
			}while(!valido && cont<2)
			if(!valido)cb({error:'Máximo número de envíos alcanzado'});
		}
	},
	limits:{
		fileSize:50000000,//50mb
		files:20
	}
});

var trabajaconnosotrosUpload=multer({storage:trabajaconnosotrosStorage}).single("file");


var intranetHorariocapacitacionesStorage=multer.diskStorage({
	destination:function(solicitud,file,cb){
		//console.log(solicitud.query,solicitud.body,solicitud.files,file);
		var path='./public/fotos/proyectosycapacitacion/cursos/';
		cb(null,path);
	},
	filename:function(solicitud,file,cb){console.log(file);
		if(!/image/.test(file.mimetype)) cb({error:"error campos erroneos"})
		else{
			var nombre=solicitud.query.curso.replace(/\s/g,"_")+solicitud.query.yearweek+"."+file.originalname.split('.')[file.originalname.split('.').length-1];
			solicitud.intranetHorariocapacitacionesImgName=nombre;
			cb(null,nombre);
		}
	},
	limits:{
		fileSize:1000000,//1mb
		files:20
	}
});

var intranetHorariocapacitacionesUpload=multer({storage:intranetHorariocapacitacionesStorage}).single("file");



var intranetArchivosStorage=multer.diskStorage({
	destination:function(solicitud,file,cb){
		console.log(solicitud.query,solicitud.body,solicitud.files,file);
		var path='./public/private/archivos_gestion_de_calidad/'+solicitud.query.path;
		cb(null,path);
	},
	filename:function(solicitud,file,cb){console.log(file);
		if(!/pdf/.test(file.mimetype)
			&& !/msword/.test(file.mimetype)
			&& !/vnd.openxmlformats-officedocument.wordprocessingml.document/.test(file.mimetype)
			&& !/vnd.ms-excel/.test(file.mimetype)
			&& !/vnd.openxmlformats-officedocument.spreadsheetml.sheet/.test(file.mimetype)) cb({error:"error campos erroneos"})
		else{
			var nombre=file.originalname.replace(/\s/g,"_");
			cb(null,nombre);
		}
	},
	limits:{
		fileSize:200000000,//200mb
		files:20
	}
});

var intranetArchivosUpload=multer({storage:intranetArchivosStorage}).single("file");

var intranetCapacitacionesStorage=multer.diskStorage({
	destination:function(solicitud,file,cb){
		console.log(solicitud.query,solicitud.body,solicitud.files,solicitud.sdf,file);
		var path='./public/fotos/proyectosycapacitacion/';
		cb(null,path);
	},
	filename:function(solicitud,file,cb){
		console.log(file);
		if(!/image/.test(file.mimetype)) cb({error:"error campos erroneos"})
		else{
			var valido,
			cont=0,
			nombre=solicitud.query.grupo+cont;
			
			do{
				try{
					filesystem.statSync('./public/fotos/proyectosycapacitacion/'+nombre+"."+file.originalname.split('.')[file.originalname.split('.').length-1]);
					valido=false;
					cont=cont+1;
					nombre=solicitud.query.grupo+cont;
				}catch(e){
					valido=true;
					cb(null,nombre+"."+file.originalname.split('.')[file.originalname.split('.').length-1]);
				}
				console.log(cont,valido,nombre+"."+file.originalname.split('.')[file.originalname.split('.').length-1]);
			}while(!valido)
			if(!valido)cb({error:'Máximo número de envíos alcanzado'});
		}
	},
	limits:{
		fileSize:1000000,//1mb
		files:20
	}
});

var intranetCapacitacionesUpload=multer({storage:intranetCapacitacionesStorage}).single("file");

var intranetlineasdecreditoStorage=multer.diskStorage({
	destination:function(solicitud,file,cb){
		//console.log(solicitud.query,solicitud.body,solicitud.files,file);
		var path='./public/fotos/';
		cb(null,path);
	},
	filename:function(solicitud,file,cb){console.log(file);
		if(!/image/.test(file.mimetype)) cb({error:"error campos erroneos"})
		else{
			var nombre=solicitud.query.linea+"."+file.originalname.split('.')[file.originalname.split('.').length-1];
			solicitud.intranetLineasdecreditoImgName=nombre;
			cb(null,nombre);
		}
	},
	limits:{
		fileSize:1000000,//1mb
		files:20
	}
});

var intranetLineasdecreditoUpload=multer({storage:intranetlineasdecreditoStorage}).single("file");

var intranetIndicadoresStorage=multer.diskStorage({
	destination:function(solicitud,file,cb){
		//console.log(solicitud.query,solicitud.body,solicitud.files,file);
		var path='./public/fotos/indicadores/';
		cb(null,path);
	},
	filename:function(solicitud,file,cb){console.log(file);
		if(!/image/.test(file.mimetype)) cb({error:"error campos erroneos"})
		else{
			var nombre=solicitud.query.tipo+"_"+file.originalname;
			solicitud.intranetIndicadoresImgName=nombre;
			cb(null,nombre);
		}
	},
	limits:{
		fileSize:1000000,//1mb
		files:20
	}
});

var intranetIndicadoresUpload=multer({storage:intranetIndicadoresStorage}).single("file");






























/*router.route("/intranetHorariocapacitaciones")
	.put(function(solicitud,respuesta){
		console.log(solicitud.body);
		if(!solicitud.user){respuesta.status(403);respuesta.end("error autenticacion necesaria");}
		else if(solicitud.user.accesibilidad!="a" && solicitud.user.accesibilidad!="b"){respuesta.status(403);respuesta.end("error accesibilidad necesaria");}
		else if(!solicitud.body.curso || !solicitud.body.dia || !solicitud.body.horainicio || !solicitud.body.horafin){respuesta.status(400);respuesta.end("error campos vacios");}
		else if(solicitud.body.borrar===true){
			console.log("sadfsdfs");
		}//else if(!/^[áàãâäéèêëíìîïóòõôöúùûüÁÀÃÂÄÉÈÊËÍÌÎÏÓÒÕÖÔÚÙÛÜÝýỲỳŶŷŸÿỸỹçÇñÑa-zA-Z0-9.:,;%=\/*+-_?¿¡!$\s@()]{1,500}$/.test(solicitud.body.curso)
		//	|| !solicitud.body.dia.every(function(element,index,array){return /^[Lunes]?[Martes]?[Miércoles]?[Jueves]?[Viernes]?$/.test(element)})
		//	|| !solicitud.body.horainicio.every(function(element,index,array){return /^([01]?[0-9]|2[0-3]):([0-5][0-9]|[0-9])$/.test(element)})
		//	|| !solicitud.body.horafin.every(function(element,index,array){return /^([01]?[0-9]|2[0-3]):([0-5][0-9]|[0-9])$/.test(element)})){respuesta.status(400);respuesta.end("error campos erroneos");}
		else{
			solicitud.body.dia=JSON.parse(solicitud.body.dia);
			solicitud.body.horainicio=JSON.parse(solicitud.body.horainicio);
			solicitud.body.horafin=JSON.parse(solicitud.body.horafin);
			console.log(typeof solicitud.body.dia,solicitud.body.dia);
			filesystem.readFile("./public/datos/proyectosycapacitacionhorariolista.json",function(err,data){
				if(err) sendError(err,solicitud,respuesta);
				else{
					var horarioJson=JSON.parse(data);
					
					var finded=false;
					for(var j=0;j<horarioJson.lista.length;j++){
						if(horarioJson.lista[j].curso==solicitud.body.curso){
							finded=true;
							if(horarioJson.lista[j].horario.length>solicitud.body.dia.length) horarioJson.lista[j].horario=horarioJson.lista[j].horario.slice(0,solicitud.body.dia.length);
							for(var i=0;i<solicitud.body.dia.length;i++){
								horarioJson.lista[j].horario[i]={
									"dia":solicitud.body.dia[i],
									"hi":solicitud.body.horainicio[i],
									"hf":solicitud.body.horafin[i]
								}
							}
						}
						
						//horarioJson.lista.find(function(element, index, array){return element.curso==solicitud.body.curso}).horario[i]={
						//	"dia":solicitud.body.dia[i],
						//	"hi":solicitud.body.horainicio[i],
						//	"hf":solicitud.body.horafin[i],
						//	"horainicio":new Date(2015,7,17,horainicio[i].split(":")[0],horainicio[i].split(":")[1]),
						//	"horafin":new Date(2015,7,17,horafin[i].split(":")[0],horafin[i].split(":")[1])
						//}
						
					}
					if(!finded){
						var horario=[];
						for(var i=0;i<solicitud.body.dia.length;i++){
							horario[i]={
								"dia":solicitud.body.dia[i],
								"hi":solicitud.body.horainicio[i],
								"hf":solicitud.body.horafin[i]
							}
						}
						horarioJson.lista.push({
							"curso":solicitud.body.curso,
							"horario":horario
						});
					}
					//if(!horarioJson.lista[solicitud.body.curso]) horarioJson.lista[solicitud.body.curso]=[];
					//var aux=horarioJson.lista[solicitud.body.curso].filter(function(element){
					//	return (element.nombre==solicitud.body.nombre);
					//});
					//if(aux.length>0){respuesta.status(400);respuesta.end("error datos de "+solicitud.body.nombre+" ya estan guardados.");}
					//else{
					//	horarioJson.lista[solicitud.body.curso].push({"nombre":solicitud.body.nombre,"email":solicitud.body.email,"telefono":solicitud.body.telefono});
						filesystem.writeFile("./public/datos/proyectosycapacitacionhorariolista.json",JSON.stringify(horarioJson,null,"	"),function(err2){
							if(err2) sendError(err2,solicitud,respuesta);
							else{
								respuesta.end("Datos guardados.");
							}
						});
					//}
					
				}
			});
			
			
		}
	});*/




/*app.use(sessions({
	cookieName:"session",
	secret:"isadbf8734qgho3q4hfoq39f4hqfh0q37fuhauiosdfj90q87rhf",
	duration:3*60*1000,
	activeDuration:30*60*1000,
	//secure:true,
	httpOnly:false,
	ephemeral:true
}));*/



/*router.route("/login")
	.post(passport.authenticate('local'),function(solicitud,respuesta){
				//console.log(arguments);
				//if(!user){
				//	respuesta.json({msg:info.msg,correcto:false});
				//}else{
					//delete user.password;
					//respuesta.cookie("user",user.password,{httpOnly:false});
					respuesta.json({msg:solicitud.body.email,correcto:true});
				//}
				
			}
		
		
	);*/


