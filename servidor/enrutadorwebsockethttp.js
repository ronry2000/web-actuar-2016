var filesystem=require('fs'),
url=require('url'),
cluster=require('cluster'),
domain=require("domain"),
crypto=require('crypto');

function enrutar(solicitud, socket, head){
	var urlSol=url.parse(solicitud.url);
	var ruta=decodeURIComponent(urlSol.pathname);	
	var params=querystring.parse(decodeURIComponent(urlSol.query));
	
	socket.write( "HTTP/1.1 101 Web Socket Protocol Handshake\r\n"
	+ "Upgrade: WebSocket\r\n"
	+ "Connection: Upgrade\r\n"
	+ "WebSocket-Origin: "+solicitud.headers["origin"]+"\r\n"
	+ "WebSocket-Location: ws://jhoneao.chickenkiller.com\r\n"
	+ "Accept-Charset: utf-8\r\n"
	+ "Sec-WebSocket-Accept: "+crypto
		 .createHash('SHA1')
		 .update(solicitud.headers["sec-websocket-key"] + "258EAFA5-E914-47DA-95CA-C5AB0DC85B11")
		 .digest('base64')
	+ "\r\n\r\n"
	);
			
	switch(true){
		
		
		case (ruta=="/eco"):
		default:
			socket.on('data',function(data){		
				var payload=decodificar(data);
				var a=payload.toString()+payload.toString()+payload.toString()+payload.toString()+payload.toString();
				socket.write(codificar(a));
			});
		break;	
	}
	
	socket.on("connect",function(){// Every time someone connects, tell them hello and then close the connection.
		console.log("socket.on(connect) from " + socket.remoteAddress);
		socket.end("Hello World\n");
	});			
	socket.on('end',function(){
		console.log("socket.on(end) ");		
	});	
	socket.on('timeout',function(){
							
	});	
	socket.on('drain',function(){
						
	});	
	socket.on('close',function(witherr){
		console.log("socket.on(close) witherr:"+witherr);
	});	
	socket.on('error',function(err){
		console.log("socket.on(eror)"+JSON.stringify(err));
	});	
	socket.write(codificar("hello"));
	

}


function decodificar(data){
	var length=data[1] & 127;
	if(length==126){
		var masking=new Buffer(data.slice(4,8));
		var payload=new Buffer(data.slice(8,data.length));				
	}else{
		var masking=new Buffer(data.slice(2,6));
		var payload=new Buffer(data.slice(6,data.length));		
	}
	for (var i=0;i<payload.length;i++) {
		payload[i]=payload[i] ^ masking[i%4];
	}
	console.log("dec ",data.length,data);
	console.log("    ",payload.length, payload.toString());
	return payload;	
}


function codificar(data){
	var dataB=new Buffer(data);
	var inicioData=2;	
	var payload=null;
	if(dataB.length>=126){		
		var payloadLenBin=dataB.length.toString(2);
		if(dataB.length<65535){
			inicioData=4;
			payload=new Buffer(inicioData+dataB.length);
			payload[0]=129;
			payload[1]=126;
			payload[2]=parseInt(payloadLenBin.slice(0,payloadLenBin.length-8),2);
			payload[3]=parseInt(payloadLenBin.slice(payloadLenBin.length-8,payloadLenBin.length),2);
		}else{
			if(dataB.length>18446744073709551616){
				console.log("error");
			}
			inicioData=10;
			payload=new Buffer(inicioData+dataB.length);
			payload[0]=129;//10000001
			payload[1]=127;//01111111
			var left = dataB.length;
            var unit = 256;
			var a =0;
            for (var i = 9; i > 1; i--){                
				a =left % unit;
                payload[i] = parseInt(a.toString(2),2);
				left = left / unit;
                if (left == 0) break;
            }
		}
	}else{		
		payload=new Buffer(inicioData+dataB.length);
		payload[0]=129;
		payload[1]=dataB.length;
	}
	dataB.copy(payload,inicioData,0,dataB.length);
	//console.log("cod ",dataB.length,payload.toString());	
	return payload;
}





exports.enrutar=enrutar;

