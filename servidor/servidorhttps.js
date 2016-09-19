var mime=require('mime'),
filesystem=require('fs'),
url=require('url'),
path=require('path'),
querystring=require('querystring'),
zlib=require('zlib'),
crypto=require('crypto'),
cluster=require('cluster'),
runner=require("child_process"),
sendEmail=require("./sendemail.js"),
database=require("./database.js"),
d=new Date(),
domain=require("domain"),
https=require("https"),
http=require("http"),
websocketHttps=require("./enrutadorwebsockethttps.js");

var serverkey;
var options;
var certdone=function(err,data){
	if(err) return console.log("error servercert:"+err);
	options={key: serverkey, cert: data};
	var servidor=https.createServer(options);
	servidor.on("request",enrutar);
	servidor.on("listening",function(){});//console.log(cluster.worker.id+"-"+cluster.worker.process.pid+" https "+servidor.address().port)
	servidor.on("error",function(err){console.log("errror https:"+err);servidor.close();});
	servidor.on("connection",function(socket){console.log("["+cluster.worker.id+"]connection https:"+socket.remoteAdress)});
	servidor.on("close",function(){console.log("close https:"+JSON.stringify(arguments))});
	servidor.on("checkContinue",function(){console.log("checkContinue https:"+JSON.stringify(arguments))});
	servidor.on("clientError",function(exception, socket){console.log("clientError https:",exception, socket.remoteAdress)});
	servidor.on("connect",function(request, socket, head){console.log("connect https:"+socket.remoteAdress+" -",head);});
	servidor.on("upgrade",websocketHttps.enrutar);
	servidor.listen(443);
};
var keydone=function(err,data){
	if(err) return console.log("error serverkey:"+err);
	serverkey=data;
	filesystem.readFile('./certificadoshttps/servercert.pem',certdone);
};
filesystem.readFile('./certificadoshttps/serverkey.pem',keydone);



function enrutar(solicitud, respuesta){	
var serverdomain=domain.create();
serverdomain.add(solicitud);
serverdomain.add(respuesta);
serverdomain.run(function(){
serverdomain.on('error', function(err) {
  try {
	var count=0;
	for(var a in head){count++;if(count>4)delete head[a];}		
	status=500;
	respuesta.on("finish",function(){console.log("\ndomain Error["+cluster.worker.id+"]",err.stack,"\n");});
	respuesta.writeHead(status,"Internal Server Error", head);
	respuesta.write("500 Internal Server Error: "+err);
	respuesta.end();
	servidorHttps.close();
  } catch (err) {
	console.error('\n\n\n\n\ndomain Error sending 500\n\n\n\n', err.stack);
  }
  setTimeout(function(){cluster.worker.disconnect();},5000).unref();
});	
	
	respuesta.sendDate=true;
	var urlSol=url.parse(solicitud.url);
	var ruta=decodeURIComponent(urlSol.pathname);		
	var filePath=path.parse(ruta);
	var params=querystring.parse(decodeURIComponent(urlSol.query));
	d=new Date();
	//ipLocation(solicitud.socket.remoteAddress, function(data){
		filesystem.createWriteStream("./registros/registrohttps.txt",{"flags":"a"}).end("<<["+cluster.worker.id+"]"+d.getHours()+":"+d.getMinutes()+":"+d.getSeconds()+":"+d.getMilliseconds()+"<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<"+
		"\n<<<<https "+solicitud.method+" <--"+solicitud.headers.host+ruta+"   [address:"+solicitud.socket.remoteAddress+":"+solicitud.socket.remotePort+/*" from:"+data.city+"-"+data.country+"-"+data.org+*/"] [params:"+JSON.stringify(urlSol)+"] \n"+
		JSON.stringify(solicitud.headers)+	
		"\n<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<\n", function(){})	;
	//});
	var head={"Connection":"keep-alive","Transfer-Encoding":"chunked","Accept-Ranges":"bytes","Access-Control-Allow-Origin": "http://jhoneao.chickenkiller.com"};//","Access-Control-Allow-Credentials":"true",		Access-Control-Allow-Headers":"Origin, Referrer, Host, Content-Type, Date, Proxy-Authorization, Via, Warning, TE, User-Agent, Cache-Control, Cookie, Connection, Accept-Language, Accept-Encoding", 	"Access-Control-Expose-Headers":"Origin, Referrer, Host, Content-Type, Date, Proxy-Authorization, Via, Warning, TE, User-Agent, Cache-Control, Cookie, Connection, Accept-Language, Accept-Encoding",	"Access-Control-Allow-Headers":"Origin, Referrer, Host, Content-Type, Date, Proxy-Authorization, Via, Warning, TE, User-Agent, Cache-Control, Cookie, Connection, Accept-Language, Accept-Encoding", 	"Access-Control-Request-Headers":"Origin, Referrer, Host, Content-Type, Date, Proxy-Authorization, Via, Warning, TE, User-Agent, Cache-Control, Cookie, Connection, Accept-Language, Accept-Encoding, X-Forwarded-For, Proxy-Connection"
	var status=200;
	respuesta.writeHead(status,head);
	
	
	var log = function(){		
		d=new Date();
		var argumentsLog=arguments;
		ipLocation(solicitud.socket.remoteAddress, function(data){
			// filesystem.createWriteStream("./registros/registrohttps.txt",{"flags":"a"}).end(">>["+cluster.worker.id+"]"+d.getHours()+":"+d.getMinutes()+":"+d.getSeconds()+":"+d.getMilliseconds()+">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>"+
			// "\n>>>>"+status+"::::::> "+solicitud.socket.remoteAddress+":"+solicitud.socket.remotePort+ruta+"   ("+head["Content-Encoding"]+")\n"+
			// respuesta._header.replace(/\r\n/g,'      ')+"\nargumentslog"+JSON.stringify(argumentsLog)+"\niplocation"+JSON.stringify(arguments)+//Buffer.byteLength(data.toString(),"string")
			// "\n>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>\n", function(){});
		// 
		});
	}
	var sendError=function(err){
		var count=0;
		for(var o in head){count++;if(count>5)delete head[o];}
		status=500;
		respuesta._events.finish=null;
		respuesta.on("finish",function(){log(err)});
		respuesta.writeHead(status,"Internal Server Error", head);
		respuesta.end("500 Internal Server Error: "+err.code);
	}
	
	
	/*setTimeout(function(){*/	
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
	if(solicitud.method=="POST"){
		switch(ruta){
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
			case "/listarpanoramicas":
				respuesta.on("finish",function(){log()});				
				solicitud.method="GET";
				if(params.type=="json") solicitud.url="/panoramicasPrincipal.json";
				else if(params.type=="xml") solicitud.url="/panoramicasPrincipal.xml";
				enrutar(solicitud,respuesta);		
			break;
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
			case "/registro":
				var body="";
				solicitud.on('data', function (data) {
					body += data;			
					if (body.length > 1e6)solicitud.connection.destroy();// FLOOD ATTACK OR FAULTY CLIENT, NUKE REQUEST// 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
				});
				solicitud.on('end', function () {			
					body = querystring.parse(body);	
					respuesta.on("finish",function(){log(body)});	
					var mailOptions = {from:"pagina web <talestales777@gmail.com>", subject:"registro",
					   to:"usuario <"+body.email+">", cc:"", bcc:"admin <jhoneao@gmail.com>",
					   html: "<h1>Hola "+body.nombre+"</h1><br>tu registro ha sido exitoso<br><br>", text:""
					};
					database.registroTransaccion(sendEmail, mailOptions,body,function(res){
						if(!!res.error) return sendError(res.error);
						respuesta.end(res.resultado);
					});			
				});
			break;
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
			case "/envioEmail":
				var body="";
				solicitud.on('data', function (data) {
					body += data;			
					if (body.length > 1e6)solicitud.connection.destroy();// FLOOD ATTACK OR FAULTY CLIENT, NUKE REQUEST// 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
				});
				solicitud.on('end', function () {
				console.log(body);
					body = querystring.parse(body);			
					console.log(body);
					respuesta.on("finish",function(){log(body)});
					body.mensaje=body.mensaje.replace(/\n/gi,"<br>");
					//body.email=decodeURIComponent(body.email);//decode autamatico por querystring.parse					
					console.log(body);
					var mailOptions = {from:"pagina web <talestales777@gmail.com>", subject:"respuesta automatica",
					   to:"usuario <"+body.email+">", cc:"", bcc:"admin <jhoneao@gmail.com>",
					   html: "<h1>Hola "+body.nombre+"</h1><br>En breve responderemos tu mensaje:<br><br>"+body.mensaje+"<br><br><br><img src='cid:wait'/>", text:"",
					   attachments:[{filePath:"./registro.txt"},{filePath:"./public/img/descarga(7).gif", cid:"wait"}] 
					};
					sendEmail.send(mailOptions, function(err, respuesta2){
						if(err)	respuesta.end("error al enviar mensaje.");
						else respuesta.end("mensaje enviado, recibiras confirmacion.");
					});	
				});
			break;
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
			case "/login":
				respuesta.on("finish",function(){log(body);});
				var body="";
				solicitud.on('data', function (data) {
					body += data;			
					if (body.length > 1e6)solicitud.connection.destroy();// FLOOD ATTACK OR FAULTY CLIENT, NUKE REQUEST// 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
				});		
				solicitud.on('end', function () {
					console.log(body);
					body = parseJSON(body);			
					body.usuario=decodeURIComponent(body.usuario);
					body.password=decodeURIComponent(body.password);
					database.query('SELECT * FROM usuarios WHERE email="'+body.usuario+'"',{},function (res){//comillas
						console.log(res.resultado);
						if(!!res.error) return sendError(res.error);						
						else if(res.resultado.length==0){//o resultado != 'undefined'
							respuesta.end("usuario no encontrado");	
						}else if(res.resultado[0].pass!=body.password){
							respuesta.end("contraseña no coincide");	
						}else{
							respuesta.end("bienvenido "+res.resultado[0].email);	
						}
					});			
				});		
			break;
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
			default:
				respuesta.on("finish",function(){log()});
				if(".php"==(path.extname(ruta))){
					solicitud.method="GET";
					status=300;
					enrutar(solicitud,respuesta);
				}
				else{
					respuesta.on("finish",function(){log()});
					var body="";
					solicitud.on('data', function (data) {
						body += data;			
						if (body.length > 1e6)solicitud.connection.destroy();// FLOOD ATTACK OR FAULTY CLIENT, NUKE REQUEST// 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
					});		
					solicitud.on('end', function () {
						body = querystring.parse(decodeURIComponent(body));			
						status=402;
						respuesta.writeHead(status,"402 Payment Required Gonorrea", head);
						respuesta.end("402 Payment Required Gonorrea");
						log(body);		
					});
				}
			break;
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		}
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
	}else if(solicitud.method=="PUT"){
		respuesta.on("finish",function(){log(params,body)});
		var body="";
		solicitud.on('data', function (data) {
			body += data;			
			//if (body.length > 1e6)solicitud.connection.destroy();// FLOOD ATTACK OR FAULTY CLIENT, NUKE REQUEST// 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
		});		
		solicitud.on('end', function () {
			body = querystring.parse(decodeURIComponent(body));			
			respuesta.writeHead(status,head);
			respuesta.end();		
		});		
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
	}else if(solicitud.method=="HEAD"){
		respuesta.on("finish",function(){log(params,body)});
		var body="";
		solicitud.on('data', function (data) {
			body += data;			
			//if (body.length > 1e6)solicitud.connection.destroy();// FLOOD ATTACK OR FAULTY CLIENT, NUKE REQUEST// 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
		});		
		solicitud.on('end', function () {
			body = querystring.parse(decodeURIComponent(body));			
			respuesta.writeHead(status,head);
			respuesta.end();
		});	
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
	}else if(solicitud.method=="DELETE"){
		respuesta.on("finish",function(){log(params,body)});
		var body="";
		solicitud.on('data', function (data) {
			body += data;			
			//if (body.length > 1e6)solicitud.connection.destroy();// FLOOD ATTACK OR FAULTY CLIENT, NUKE REQUEST// 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
		});		
		solicitud.on('end', function () {
			body = querystring.parse(decodeURIComponent(body));			
			respuesta.writeHead(status,head);
			respuesta.end();		
		});	
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
	}else if(solicitud.method=="OPTIONS"){
		respuesta.on("finish",function(){log(params,body)});
		var body="";
		solicitud.on('data', function (data) {
			body += data;			
			//if (body.length > 1e6)solicitud.connection.destroy();// FLOOD ATTACK OR FAULTY CLIENT, NUKE REQUEST// 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
		});		
		solicitud.on('end', function () {
			body = querystring.parse(decodeURIComponent(body));			
			head["Access-Control-Allow-Origin"]="http://jhoneao.chickenkiller.com";
			head["Access-Control-Allow-Headers"]=solicitud.headers['access-control-request-headers'];
			head["Access-Control-Allow-Methods"]="HEAD,GET,POST,PUT,DELETE,OPTIONS";
			head["Allow"]="HEAD,GET,POST,PUT,DELETE,OPTIONS";
			head["Access-Control-Max-Age"]="1728000";//20dias
			respuesta.writeHead(status,head);
			respuesta.end();
		});
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
	
	}else{//solicitud.method				
		var body="";
		solicitud.on('data', function (data) {
			body += data;			
			if (body.length > 1e6)solicitud.connection.destroy();// FLOOD ATTACK OR FAULTY CLIENT, NUKE REQUEST// 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
		});		
		solicitud.on('end', function () {
			body = querystring.parse(body);					
		});		
		var responderStream=function(){	
			ruta="./public"+ruta;	
			filePath=path.parse(ruta);
			var responderErr=function(err){
				if(ruta=="./public/"){ruta="/404error.html";responderStream();}
				else if(ruta=="/404error.html"){sendError(err);}
				else{status=404;body=ruta;ruta="/404error.html";responderStream();}			
			}
			if(".php"==filePath.ext && !!params.download){
				console.log("php "+__dirname+ruta+" "+params);
				runner.exec("php "+__dirname+ruta+" "+params, function(err,stdout,stderr){
					head["Content-Encoding"]="identity";
					if(err){
						if(/Could not open input file/.test(stderr)){
							responderErr(err);							
						}else{
							status=500;
							head["Content-Length"]=stderr.length;												
							respuesta.writeHead(status, head);
							respuesta.end(stderr);
						}
					}else{  						
						head["Content-Length"]=stdout.length;						
						respuesta.writeHead(status, head);
						respuesta.end(stdout);
					}
				});
			}else{
				filesystem.stat(ruta, function(err,stat){
					if(err || ruta=="./public/") {
						responderErr(err);
					}else if(stat.isDirectory()){						
						ruta="/sitemap.xml";
						responderStream();
					}else {
						head["Content-Length"]=stat.size;/*head["ETag"]=crypto.createHash('md5').update(new Buffer(stat.mtime.toUTCString())).digest('hex');*/
						head["Last-Modified"]=stat.mtime.toUTCString();
						head["Content-Type"]=mime.lookup(ruta)+"; charset=utf-8";	
						head["Cache-Control"]="no-cache, no-store, must-revalidate";	//no-cache, no-store, max-age=99999, must-revalidate
						switch (true){
							case (/image/.test(head["Content-Type"])):
							case (/audio/.test(head["Content-Type"])):
							case (/video/.test(head["Content-Type"])):
								d.setFullYear(d.getFullYear()+1);
								head["Expires"]=d.toUTCString();
							case (/compressed/.test(head["Content-Type"])):							
							default:
								switch(true){	
									case (!solicitud.headers["accept-encoding"] || !!params.uncompress):
										head["Content-Encoding"]="identity";
										respuesta.writeHead(status, head);
										filesystem.createReadStream(ruta).on("error",responderErr).pipe(respuesta);
									break;
									case (/deflate/i.test(solicitud.headers["accept-encoding"])):				
										head["Content-Encoding"]="deflate";	
										respuesta.writeHead(status, head);
										filesystem.createReadStream(ruta).on("error",responderErr)
										.pipe(zlib.createDeflate({memlevel:9}).on("error",sendError))
										.pipe(respuesta);		
									break;
									case (/gzip/i.test(solicitud.headers["accept-encoding"])):
										head["Content-Encoding"]="gzip";
										respuesta.writeHead(status, head);
										filesystem.createReadStream(ruta).on("error",responderErr)
										.pipe(zlib.createGzip({memlevel:9}).on("error",sendError))
										.pipe(respuesta);						
									break;	
									default:
										head["Content-Encoding"]="identity";
										respuesta.writeHead(status, head);
										filesystem.createReadStream(ruta).on("error",responderErr).pipe(respuesta);
									break;
								}
							break;
						}
					}					
				});
			}
						
		}
		
		respuesta.on("finish",function(){log(body);});
		respuesta.on("error",log);
		respuesta.on("close",function(){status=500;log("connection closed X( ");});
		
		responderStream();
		if(!!params.download) head["Content-Disposition"]="attachment";//not null or undefined	
	}
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
	
	/*},50);*/
});
}


function ipLocation(ip, callback){
		var timeoutIpLocation = setTimeout(function(){
			callback({});
		},1000);
		var options = {method: 'GET', host: 'ipinfo.io', path: "/"+ip+'/json',port: 80};
		var req = http.request(options, function(res) {
			var data="";
			res.on("data",function(chunk){
				data+=chunk;
			});
			res.on("end",function(){
				//console.log(ip,data,typeof data);		
				if(timeoutIpLocation._idleNext!==null){
					clearTimeout(timeoutIpLocation);					
					callback(parseJSON(data));
				}
				else{
					console.log("respuesta tardia ipLocation:",parseJSON(data));
				}
			});				
		});		
		req.on("error",function(err){
			console.log("error ipLocation req:",err,options);
		});	
		req.end();		
}

function parseJSON(string){
	try {
		string = JSON.parse(string);					
	}catch(e){
		string={error:e.toString()+string};
	}
	return string;
}

