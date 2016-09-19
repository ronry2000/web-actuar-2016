var cluster=require("cluster"),
EventEmitter=require('events').EventEmitter,
e=new EventEmitter();


console.log("argv ",JSON.stringify(process.argv),"\nexecArgv ",JSON.stringify(process.execArgv),"\nexecPath ",JSON.stringify(process.execPath),"\nconnected ",JSON.stringify(process.connected));
process.on('uncaughtException',function(err){console.log("\nprocess.on(uncaughtException)["+process.pid+"]",err,err.stack,"\n\n\n\n\n\n\n\n\n\n")});//if(cluster.isWorker)process.kill(process.pid);
function iniciarServidor(){
	if(cluster.isMaster){
		process.title="node server actuartolima";
		console.log("version ",JSON.stringify(process.versions),
			"\nmemoryUsage ",process.memoryUsage(),
			"\nenv ",process.env,
			"\nconfig ",process.config,
			"\n__dirname "+__dirname,
			"\narchitecture "+process.arch,
			"\nplatform "+process.platform,
			"\nrelease "+JSON.stringify(process.release),
			"\n\n"+process.title+" 0-"+process.pid);
		var consola=1,
		os=require('os'),
		filesystem=require("fs"),
		watches=require("./servidor/watches.js");
		
		var database=require("./servidor/database.js");		
		database.insertUsuariosactuartolima({nombre:"nombre1 nombre2 apellido1 apellido2",email:"admin@actuartolima.com",password:"admin",accesibilidad:"administrador"},function(p){console.log("insertUsuariosactuartolima",p)});
		
		
		
		/*var io=require('socket.io').listen(8001,{path:'/echo'});
		
		io.on("connection",function(socket){
			socket.on("echo",function(msg){
				socket.emit("echo",msg+msg+msg);
				//console.log(socket.id,socket.nsp.connected.keys,socket.server.eio.clients.keys,socket.conn.server.clients.keys,socket.conn.request);//,socket.adapter.nsp.rooms.keys,socket.adapter.nsp.sids.keys,socket.nsp.socket.keys
			});
			socket.emit("echo","hola");
		});*/
		
		
		//servidorTftp.createServer(function(req, res){
		//	console.log("request=",req,"\n");
		//	filesystem.createReadStream("./tftp/"+req.path).pipe(res);
		//}).bind(69);	
		//console.log("0-"+process.pid+" master tftp");
		
		
		console.log("cluster.settings",cluster.settings);
		cluster.setupMaster({
			exec : "servidor.js",
			args : [],
			silent : false
		});
		
		for(var i=0;i<(os.cpus().length);i++){
			cluster.fork().send(Object.keys(cluster.workers)[0]);
			//console.log(Object.keys(cluster.workers));
		}
		cluster.on('exit',function(worker,code,signal){
			console.log('cluster.on(exit) worker #'+worker.id+' code: '+code+" signal: "+signal);
			if(consola==worker.id){//Object.keys(cluster.workers)[Object.keys(cluster.workers)[Object.keys(cluster.workers).lenght]];
				if(Math.max.apply(null,Object.keys(cluster.workers))<=consola) consola++;
				else consola=Math.max.apply(null,Object.keys(cluster.workers))+1;
			}
			cluster.fork().send(consola);
		});
		cluster.on('disconnect',function(worker){
			console.log('cluster.on(disconnect) worker#'+worker.id);
			worker.kill();//worker.process.kill(worker.process.pid);
		});	
		cluster.on("fork",function(worker){
			console.log("cluster.on(fork) "+worker.id);
		});
		cluster.on("online",function(worker){
			console.log("cluster.on(online) "+worker.id);
			worker.on('message', function(msg){
				console.log("worker.on(message) "+msg);
			});
			worker.on("error",function(err){
				console.log("worker.on(error) worker# "+worker.id,err,arguments);
			});
		});
		cluster.on('listening',function(worker,address){
			console.log("cluster.on(listening) address:",address,worker.id+"-"+worker.process.pid);
		});			
	}else if(cluster.isWorker){
		process.on('message',function(msg){
			//console.log("process.on(message) ",msg);
			//if(typeof msg != "string" && typeof msg != "number") e.emit("watches",msg);
			if(cluster.worker.id==msg){iniciar();}
			else{iniciar();}
			//process.send("as");
		});
	}


	function iniciar(){
		var servidorHttp=require("./servidor/servidorhttp.js");
		//servidorHttps=require("./servidor/servidorhttps.js");
		
	}

}

iniciarServidor();
exports.iniciar=iniciarServidor;