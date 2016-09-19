var filesystem=require('fs'),
url=require('url'),
cluster=require('cluster'),
crypto=require('crypto'),
domain=require("domain"),
mathjs=require("mathjs"),
fragments={};

function enrutar(solicitud, socket, head){	
var serverdomain=domain.create();
serverdomain.add(solicitud);
serverdomain.add(socket);
serverdomain.run(function(){
serverdomain.on('error', function(err) {
  try {
	var count=0;
	for(var a in head){count++;if(count>4)delete head[a];}	
	console.log("\ndomain Error["+cluster.worker.id+"]",err.stack,"\n");
	socket.on("close",function(){console.log("socket.on(close)");});
	socket.write(codificar("500 Internal Server Error: "+err));
	socket.destroy();
  } catch (err) {
	console.error('\n\n\n\ndomain Error sending 500\n\n\n\n', err.stack);
  }
});

	var urlSol=url.parse(solicitud.url);
	var ruta=decodeURIComponent(urlSol.pathname);	
	var params=querystring.parse(decodeURIComponent(urlSol.query));
	
	socket.write( "HTTP/1.1 101 Web Socket Protocol Handshake\r\n"
	+ "Upgrade: WebSocket\r\n"
	+ "Connection: Upgrade\r\n"
	+ "WebSocket-Origin: "+solicitud.headers["origin"]+"\r\n"
	+ "WebSocket-Location: wss://jhoneao.chickenkiller.com\r\n"
	+ "Accept-Charset: utf-8\r\n"
	+ "Sec-WebSocket-Accept: "+crypto.createHash('SHA1')
		 .update(solicitud.headers["sec-websocket-key"] + "258EAFA5-E914-47DA-95CA-C5AB0DC85B11")
		 .digest('base64')
	+ "\r\n\r\n"
	);
	console.log("\nsec-websocket-key"+solicitud.headers["sec-websocket-key"]+"\n");
	var payload=null;
	switch(true){		
		case (ruta=="/eco"):
		default:
			socket.on('data',function(data){
				payload=decodificar(data);
				if(payload.payload[0]==137 || payload.payload[0]==9) socket.write(payload.payload);
				if(payload.complete==true){
					var a="";
					for(var i=0;i<2;i++){
						a=a+payload.payload.toString();
					}
					socket.write(codificar(a));
				}else{
					
				}
				
			});
		break;	
	}
	
	socket.on("connect",function(){
		console.log("socket.on(connect) from " + socket.remoteAddress);
		socket.end("Hello World\n");
	});			
	socket.on('end',function(){
		console.log("socket.on(end) ");		
	});	
	socket.on('timeout',function(){
		console.log("socket.on(timeout)");
	});	
	socket.on('drain',function(){
		console.log("socket.on(drain)");
	});	
	socket.on('close',function(witherr){
		console.log("socket.on(close) witherr:"+witherr);
	});	
	socket.on('error',function(err){
		console.log("socket.on(eror)"+JSON.stringify(err));
	});	
	socket.write(codificar("hello"));
	
});

	function decodificar(data){
		if(data[0]==137 || data[0]==9){//ping
			data[0]=data[0]+1;
			console.log("ping",data.tosString())
			return {"payload":data,"complete":true}
		}
		
		for( var i=0;i<=0;i++){
					console.log("data["+i+"]",data[i],data[i].toString(2));
				}
		if(data[0] == 129 || data[0] == 1 ){
			var datalength = data[1] & 127;			
			var indexFirstMask = 2;
			if (datalength == 126) {
				indexFirstMask = 4;
			} else if (datalength == 127) {
				indexFirstMask = 10;
				var totalSize = 14;
				for( var i=2;i<indexFirstMask;i++){
					totalSize=totalSize+parseInt(data[i] * Math.pow(2,(indexFirstMask-i-1)*8));
				}
				for( var i=0;i<indexFirstMask;i++){
					console.log("data["+i+"]",data[i].toString(2));
				}
				fragments[solicitud.headers["sec-websocket-key"]]={"size":0,"totalSize":0,"mask":"","payload":"","lastFrameBit":14,"continued":false};
				if(data[0] == 1){
					fragments[solicitud.headers["sec-websocket-key"]]={"size":0,"totalSize":0,"mask":"","payload":"","fin":false,"lastFrameBit":14,"continued":true};
				}else if(data[0] == 129){
					fragments[solicitud.headers["sec-websocket-key"]]={"size":0,"totalSize":0,"mask":"","payload":"","fin":true,"lastFrameBit":14,"continued":false};
				}
				fragments[solicitud.headers["sec-websocket-key"]].totalSize=totalSize;
				fragments[solicitud.headers["sec-websocket-key"]].size=data.length;
				fragments[solicitud.headers["sec-websocket-key"]].mask=data.slice(indexFirstMask,indexFirstMask + 4);
				fragments[solicitud.headers["sec-websocket-key"]].indexFirstMask=indexFirstMask;
				fragments[solicitud.headers["sec-websocket-key"]].payload=data;
				console.log(fragments[solicitud.headers["sec-websocket-key"]].size, fragments[solicitud.headers["sec-websocket-key"]].totalSize,data.length);
				
				if(fragments[solicitud.headers["sec-websocket-key"]].size!=fragments[solicitud.headers["sec-websocket-key"]].totalSize || data[0] == 1) return {"payload":undefined,"complete":false};
			}			
			var masks = data.slice(indexFirstMask,indexFirstMask + 4);
			var i = indexFirstMask + 4;
			var index = 0;
			var payload = "";
			while (i < data.length) {
				payload += String.fromCharCode(data[i++] ^ masks[index++ % 4]);
			}
			for( var i=0;i<indexFirstMask;i++){
				console.log("data["+i+"]",data[i].toString(2));
			}
			console.log("1codificada:   ",data.length,data.toString());
			console.log("1decodificada: ",payload.length, payload.toString());
			if(data[0] == 129)return {"payload":payload,"complete":true};
			else return {"payload":payload,"complete":false};
		
		
		}else{
			if(data[0] == 0 || data[0] == 128){
				if(data[1]==254){
					var totalSize = 8;				
					for( var i=2;i<4;i++){
						totalSize=totalSize+parseInt(data[i] * Math.pow(2,(4-i-1)*8));
					}
				}else{
					var totalSize = 14;				
					for( var i=2;i<10;i++){
						totalSize=totalSize+parseInt(data[i] * Math.pow(2,(10-i-1)*8));
					}
				}
				if(data[0] == 128){
					var masks =  fragments[solicitud.headers["sec-websocket-key"]].mask;
					var i = fragments[solicitud.headers["sec-websocket-key"]].lastFrameBit;
					var index = 0;
					var payload = "";
					while (i < fragments[solicitud.headers["sec-websocket-key"]].totalSize) {
						payload += String.fromCharCode(fragments[solicitud.headers["sec-websocket-key"]].payload[i++] ^ masks[index++ % 4]);
					}
					fragments[solicitud.headers["sec-websocket-key"]].payload=payload;
					for( var i=0;i<=20;i++){
						console.log("data["+i+"]",data[i].toString(16),data[i].toString(2));
					}
					if(data[1]==254){
						fragments[solicitud.headers["sec-websocket-key"]].mask=data.slice(4,8);
						data=data.slice(8,data.length);
						fragments[solicitud.headers["sec-websocket-key"]].lastFrameBit=fragments[solicitud.headers["sec-websocket-key"]].totalSize-14;
						fragments[solicitud.headers["sec-websocket-key"]].totalSize=fragments[solicitud.headers["sec-websocket-key"]].totalSize+totalSize-22;
					}else{
						fragments[solicitud.headers["sec-websocket-key"]].mask=data.slice(10,14);
						data=data.slice(14,data.length);
						fragments[solicitud.headers["sec-websocket-key"]].lastFrameBit=fragments[solicitud.headers["sec-websocket-key"]].totalSize-14;
						fragments[solicitud.headers["sec-websocket-key"]].totalSize=fragments[solicitud.headers["sec-websocket-key"]].totalSize+totalSize-28;
					}					
					fragments[solicitud.headers["sec-websocket-key"]].fin=true;
				}else if(data[0] == 0){
				
					fragments[solicitud.headers["sec-websocket-key"]].totalSize=fragments[solicitud.headers["sec-websocket-key"]].totalSize+totalSize;
					
				}
				console.log("1-",totalSize,data.length);				
			}
			fragments[solicitud.headers["sec-websocket-key"]].payload=Buffer.concat([new Buffer(fragments[solicitud.headers["sec-websocket-key"]].payload),data]);
			fragments[solicitud.headers["sec-websocket-key"]].size=fragments[solicitud.headers["sec-websocket-key"]].payload.length;				
			console.log("2-",fragments[solicitud.headers["sec-websocket-key"]].size, fragments[solicitud.headers["sec-websocket-key"]].totalSize, data.length ,fragments[solicitud.headers["sec-websocket-key"]].mask,fragments[solicitud.headers["sec-websocket-key"]].fin);
			if(fragments[solicitud.headers["sec-websocket-key"]].size!=fragments[solicitud.headers["sec-websocket-key"]].totalSize || !fragments[solicitud.headers["sec-websocket-key"]].fin) return {"payload":undefined,"complete":false};
			else{
				console.log("1codificada:   ",fragments[solicitud.headers["sec-websocket-key"]].payload.length,fragments[solicitud.headers["sec-websocket-key"]].payload.toString());
				var masks = fragments[solicitud.headers["sec-websocket-key"]].mask;
				var i = fragments[solicitud.headers["sec-websocket-key"]].lastFrameBit;
				var index = 0;
				var payload = "";	
				/*console.log("i",i);
				 for( var j=i-20;j<=i+5;j++){
						console.log("payload["+j+"]",fragments[solicitud.headers["sec-websocket-key"]].payload[j].toString(16));
					}*/
				while (i < fragments[solicitud.headers["sec-websocket-key"]].totalSize) {
					payload += String.fromCharCode(fragments[solicitud.headers["sec-websocket-key"]].payload[i++] ^ masks[index++ % 4]);
				}				
				if(fragments[solicitud.headers["sec-websocket-key"]].continued)fragments[solicitud.headers["sec-websocket-key"]].payload=fragments[solicitud.headers["sec-websocket-key"]].payload.slice(0,fragments[solicitud.headers["sec-websocket-key"]].lastFrameBit)+payload;
				else fragments[solicitud.headers["sec-websocket-key"]].payload=payload;
				console.log("1decodificada: ",fragments[solicitud.headers["sec-websocket-key"]].payload.length,fragments[solicitud.headers["sec-websocket-key"]].payload.toString());
				//if(data[0] == 128)fragments[solicitud.headers["sec-websocket-key"]]=null;
				console.log(fragments[solicitud.headers["sec-websocket-key"]].fin);
				if(fragments[solicitud.headers["sec-websocket-key"]].fin) return {"payload":fragments[solicitud.headers["sec-websocket-key"]].payload,"complete":true};
				else return {"payload":undefined,"complete":false};
			}
		}
		
	}

	
	function codificar(data){
	var a=18446744073709551616;
	//console.log("maximacapacidad",a);
		var dataB=new Buffer(data);
		var inicioData=2;	
		var payload=null;
		if(dataB.length>=126){		
			var payloadLenBin=dataB.length.toString(2);
			if(dataB.length<65535){
				inicioData=4;
				payload=new Buffer(inicioData+dataB.length);
				payload[0]=129;//10000001
				payload[1]=126;//01111110
				payload[2]=parseInt(payloadLenBin.slice(0,payloadLenBin.length-8),2);
				payload[3]=parseInt(payloadLenBin.slice(payloadLenBin.length-8,payloadLenBin.length),2);
			}else{
				if(dataB.length>18446744073709551616){
					console.log("error buffer muy grande");
				}
				inicioData=10;
				payload=new Buffer(inicioData+dataB.length);			
				console.log("dataB.length",dataB.length);
				console.log("payloadLenBin",payloadLenBin);
				payload[0]=129;//10000001
				payload[1]=127;//01111111
				
				var left = dataB.length;
				var unit = 256;
				for (var i = 9; i > 1; i--){                
					var a =left % unit;
					payload[i] = parseInt(a.toString(2),2);
					left = left / unit;
					if (left == 0)
						break;
				}			
									
			}			
		}else{		
			payload=new Buffer(inicioData+dataB.length);
			payload[0]=129;//10000001
			payload[1]=dataB.length;
		}	
		dataB.copy(payload,inicioData,0,dataB.length);
		for( var i=0;i<inicioData;i++){
			console.log("payload["+i+"]",payload[i].toString(2));
		}
		console.log("2decodificada: ",data.length,data.toString());
		console.log("2codificada:   ",payload.length, payload.toString(),"\n");
		return payload;
	}
	
	
}





exports.enrutar=enrutar;

