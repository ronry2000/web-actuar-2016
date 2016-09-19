var filesystem=require("fs"),
http=require("http"),
path=require("path"),
cluster=require('cluster'),
js2xmlparser=require("js2xmlparser"),
minify=require('node-minify'),
websocketConsola=require("./enrutadorwebsockethttp.js"),
watches={"registrohttp.txt":{size1:filesystem.statSync("./registros/registrohttp.txt").size,size2:0,socket:null},
"registrohttps.txt":{size1:filesystem.statSync("./registros/registrohttps.txt").size,size2:0,socket:null}};




var actualizarMinified=function(){
	new minify.minify({
		type:'uglifyjs',
		buffer:1000*1024,
		//publicFolder: 'public/scripts/',
		fileIn:['./public/scripts/lib/jquery-1.11.3.js',
			'./public/scripts/lib/jquery-ui.js',
			'./public/scripts/lib/video/videojs5.js',
			'./public/scripts/lib/video/videojs-ie8.min.js',
			'./public/scripts/lib/socket.io-1.4.3.js',
			'./public/scripts/lib/timetable.min.js',
			'./public/scripts/lib/processing/p50422.js',
			'./public/scripts/lib/processing/p50422.dom.js',
			'./public/scripts/lib/angular.js',
			'./public/scripts/lib/ocLazyLoad.js',
			'./public/scripts/lib/angular-cookies.js',
			'./public/scripts/lib/angular-route.js',
			'./public/scripts/lib/angular-sanitize.js',
			'./public/scripts/lib/maps/ng-map.min.js',
			'./public/scripts/lib/angular-tree-control.js',
			'./public/scripts/lib/ng-file-upload-shim.js',
			'./public/scripts/lib/ng-file-upload.js',
			'./public/scripts/lib/processing/angular-p5.js',
			'./public/scripts/app.js',
			'./public/scripts/processing/indexslider.js',
			'./public/scripts/processing/conocenosslider.js',
			'./public/scripts/processing/proyectosycapacitacionslider.js',
			'./public/scripts/processing/impactosocialslider.js',
			'./public/scripts/logincontroller.js',
			'./public/scripts/indexcontroller.js',
			'./public/scripts/proyectosycapacitacioncontroller.js',
			'./public/scripts/contactocontroller.js',
			'./public/scripts/404errorcontroller.js',
			'./public/scripts/conocenoscontroller.js',
			'./public/scripts/nuestrasoficinascontroller.js',
			'./public/scripts/lineasdecreditocontroller.js',
			'./public/scripts/indicadorescontroller.js',
			'./public/scripts/impactosocialcontroller.js',
			'./public/scripts/sitemapcontroller.js',
			'./public/scripts/trabajaconnosotroscontroller.js',
			'./public/scripts/intranetcontroller.js',
			'./public/scripts/solicitarcreditocontroller.js'
		],
		fileOut:'./public/min.js',
		//sync:true,
		callback:function(err,min){
			console.log('minifyjavascript');
			//console.log(err);
		}
	});
	new minify.minify({
		type:'sqwish',
		//publicFolder:'public/scripts/',
		fileIn:['./public/css/lib/video/video-js.css',
			'./public/css/lib/tree-control/tree-control-attribute.css',
			'./public/css/lib/tree-control/tree-control.css',
			'./public/css/lib/timetable/timetablejs.css',
			'./public/css/lib/jquery-ui.css',
			'./public/css/estilo.css'
		],
		fileOut:'./public/min.css',
		//sync:true,
		callback:function(err,min){
			console.log('minifycss');
			//console.log(err);
		}
	});
	new minify.minify({
		type:'sqwish',
		//publicFolder:'public/scripts/',
		fileIn:'./public/css/mobile.css',
		fileOut:'./public/mobilemin.css',
		//sync:true,
		callback:function(err,min){
			console.log('minifycssmobileº');
			//console.log(err);
			//console.log(min);
		}
	});
}
if(cluster.isMaster) actualizarMinified();






var actualizarRegistros=function(event,filename){
	filesystem.stat("./registros/"+filename, function(err,stat){
		if(err){try{watches[filename].socket.write(websocketConsola.codificar("\n\n\nerror stats\n\n\n\n"));}catch(e){console.log(e,watches[filename]);}return console.log("\n\n\nerror stats\n\n\n\n",err);}
		if(watches[filename].size2<stat.size){
			watches[filename].size2=stat.size;
				filesystem.createReadStream("./registros/"+filename,{start: watches[filename].size1, end: watches[filename].size2})
				.on("data",function(data){
					try {watches[filename].socket.write(websocketConsola.codificar(data));}
					catch(e){}
					console.log(data.toString());
				});
			watches[filename].size1=watches[filename].size2;
		}
	});
}
//if(cluster.isMaster) filesystem.watch("./registros/registrohttp.txt",actualizarRegistros).on("error",function(err){console.log("filesystem.watch.on(error)",err.stack);});
//if(cluster.isMaster) filesystem.watch("./registros/registrohttps.txt",actualizarRegistros).on("error",function(err){console.log("filesystem.watch.on(error)",err.stack);});






var actualizarFotos=function(event,filename){
	//console.log(arguments);
	filesystem.readdir("./public/fotos/",function(err, datos){
		if(err) return console.log(err);
		var fotos=[];
		for(var i=0;i<datos.length;i++){
			if(/index/.test(datos[i])) fotos.push({"link":datos[i].split(".")[0].split("_")[1],"img":datos[i]});
		}
		var indexsliderfotosJson=filesystem.createWriteStream("./public/datos/indexsliderfotos.json",{"flags":"w"});//write
		indexsliderfotosJson.end(JSON.stringify({"fotos":fotos},null,4));
		//console.log(JSON.stringify({imagenes:imagenes},null,4));
	});
	filesystem.readdir("./public/fotos/proyectosycapacitacion",function(err, datos){
		if(err) return console.log(err);
		var proyectosycapacitacionsliderfotosJson=filesystem.createWriteStream("./public/datos/proyectosycapacitacionsliderfotos.json",{"flags":"w"});//write
		proyectosycapacitacionsliderfotosJson.end(JSON.stringify({"fotos":datos.filter(function(element,index,array){return filesystem.statSync("./public/fotos/proyectosycapacitacion/"+element).isFile()})},null,4));
		//console.log(JSON.stringify({imagenes:imagenes},null,4));
	});
	filesystem.readdir("./public/fotos/conocenos",function(err, datos){
		if(err) return console.log(err);
		var conocenossliderfotosJson=filesystem.createWriteStream("./public/datos/conocenossliderfotos.json",{"flags":"w"});//write
		conocenossliderfotosJson.end(JSON.stringify({"fotos":datos},null,4));
		//console.log(JSON.stringify({imagenes:imagenes},null,4));
	});
	filesystem.readdir("./public/fotos/impactosocial",function(err, datos){
		if(err) return console.log(err);
		var impactosocialsliderfotosJson=filesystem.createWriteStream("./public/datos/impactosocialsliderfotos.json",{"flags":"w"});//write
		impactosocialsliderfotosJson.end(JSON.stringify({"fotos":datos},null,4));
		//console.log(JSON.stringify({imagenes:imagenes},null,4));
	});
	filesystem.readdir("./public/fotos/indicadores",function(err, datos){
		if(err) return console.log(err);
		var impactosocialsliderfotosJson=filesystem.createWriteStream("./public/datos/indicadoresfotos.json",{"flags":"w"});//write
		impactosocialsliderfotosJson.end(JSON.stringify({"fotos":datos},null,4));
		//console.log(JSON.stringify({imagenes:imagenes},null,4));
	});
	
	actualizarAppcache(event,filename);
}
//if(cluster.isMaster) filesystem.watch("./public/fotos",actualizarFotos).on("error",function(err){console.log("filesystem.watch.on(error)",err.stack);});
//if(cluster.isMaster) filesystem.watch("./public/fotos/indicadores",actualizarFotos).on("error",function(err){console.log("filesystem.watch.on(error)",err.stack);});






var actualizarVideos=function(event,filename){
	//console.log(arguments);
	var videos={};
	filesystem.readdir("./public/videos/conocenos",function(err, datos){
		if(err) return console.log(err);
		var mp4s={};
		mp4s["institucional"]={};
		//mp4s["premios"]={};
		//mp4s["ceremonia"]={};
		mp4s["institucional"]["videos"]=[];
		//mp4s["premios"]["videos"]=[];
		//mp4s["ceremonia"]["videos"]=[];
		mp4s["institucional"]["desc"]=["Video Institucional Abril 2011"];
		//mp4s["premios"]["desc"]=["Categoria Comercio","Categoria Producción","Categoria Servicio"];
		//mp4s["ceremonia"]["desc"]=["Ceremonia 2011 - 25 años"];
		mp4s["institucional"]["titulo"]="VIDEO INSTITUCIONAL";
		//mp4s["premios"]["titulo"]="PREMIOS MICROEMPRESARIO 2010";
		//mp4s["ceremonia"]["titulo"]="CEREMONIA ACTUAR 25 AÑOS";
		for(var i=0;i<datos.length;i++){
			if(path.extname(datos[i])==".mp4")
				if(/institucional/.test(datos[i])) mp4s["institucional"]["videos"].push(datos[i]);
				//else if(/premios/.test(datos[i])) mp4s["premios"]["videos"].push(datos[i]);
				//else if(/ceremonia/.test(datos[i])) mp4s["ceremonia"]["videos"].push(datos[i]);
		}
		videos["conocenos"]=mp4s;
		var videosJson=filesystem.createWriteStream("./public/datos/videoslista.json",{"flags":"w"});//write
		videosJson.end(JSON.stringify({"videos":videos},null,4));
		//console.log(JSON.stringify({videos:videos},null,4));
		console.log("actualizarvideos"/*,"videos",videos*/);
	});
	//actualizarAppcache(event,filename);
}
//if(cluster.isMaster) filesystem.watch("./public/videos",actualizarVideos).on("error",function(err){console.log("filesystem.watch.on(error)",err.stack);});





var actualizarAppcache=function(event, filename){
	var archivos=[];
	var statAppcache=null;
	filesystem.stat("./public/manifest.appcache",function(err,stat){
		if(err) return console.log(err);
		statAppcache=stat;
	});
	var appcache=filesystem.createWriteStream("./public/manifest.appcache",{"flags":"r+","start":97});//read and write	
	var path="./public/datos";
	//filesystem.readdir(path,function(err, datos){
		//if(err) return console.log(err);
		//map(datos);
		path="./public/fotos";
		filesystem.readdir(path,function(err2, datos){
			if(err2) return console.log(err2);
			map(datos);
			path="./public/img";
			filesystem.readdir(path,function(err3, datos){
				if(err3) return console.log(err3);
				map(datos);
				path="./public/templates";
				filesystem.readdir(path,function(err4, datos){
					if(err4) return console.log(err4);
					map(datos);
					path="./public/css";
					filesystem.readdir(path,function(err5, datos){
						if(err5) return console.log(err5);
						map(datos);
						path="./public/scripts";
						filesystem.readdir(path,function(err6, datos){
							if(err6) return console.log(err6);
							map(datos);
							var payload=archivos.toString().replace(/,.\/public|.\/public/g,"\n")
							appcache.end(payload);
							filesystem.truncate("./public/manifest.appcache",payload.length+97,function(err){});
							console.log("actualizarAppcache"/*,"archivos",payload*/);
						});
					});
				});
			});
		});
	//});
	var map=function(datos){
		for(var i=0;i<datos.length;i++){
			if (filesystem.statSync(path+"/"+datos[i]).isDirectory()){
				path=path+"/"+datos[i];
				var datos2=filesystem.readdirSync(path);
				map(datos2);
				path=path.slice(0,path.length-datos[i].length-1);
			}else archivos.push(path+"/"+datos[i]);
		}
	};
}
if(cluster.isMaster) filesystem.watch("./public/img",actualizarAppcache).on("error",function(err){console.log("filesystem.watch.on(error)",err.stack);});
if(cluster.isMaster) filesystem.watch("./public/audio",actualizarAppcache).on("error",function(err){console.log("filesystem.watch.on(error)",err.stack);});
if(cluster.isMaster) filesystem.watch("./public/css",actualizarAppcache).on("error",function(err){console.log("filesystem.watch.on(error)",err.stack);});
if(cluster.isMaster) filesystem.watch("./public/scripts",actualizarAppcache).on("error",function(err){console.log("filesystem.watch.on(error)",err.stack);});

if(cluster.isMaster) actualizarFotos();
if(cluster.isMaster) actualizarVideos();






var getWallflux=function(){
	var options = {
		hostname: 'www.wallflux.com',
		port: 80,
		path: '/iframe/1571037699774341',
		method: 'GET',
		/*headers: {
		'Content-Type': 'application/x-www-form-urlencoded',
		'Content-Length': postData.length
		}*/
	};
	var req=http.request(options,function(res){
		//console.log(res.statusCode,'HEADERS:'+JSON.stringify(res.headers));
		res.setEncoding('utf8');
		var body="";
		res.on('data',function(chunk){
			body+=chunk;
		});
		res.on('end',function(){
			//body = querystring.parse(decodeURIComponent(body));
			body=body.replace('document.write("<iframe','//');
			body=body.replace('display: inline-block;',"display: none;");
			//body=body.replace('color:grey',"display:none");
			//body=body.replace('float:right; color:grey',"display:none");
			body=body.replace('color: grey;',"display:none");
			//body=body.replace('"color: grey;"',"display:none");
			body=body.replace('$(window).b',"//");
			body=body.replace('<div style="float: left;','<div style="display:none;float:left;');
			body=body.replace('float: right;','display: none;');
			body=body.replace('on Facebook -','');
			body=body.replace(/"\/image\//g,'"/img/lib/wallflux/image/');
			//body=body.replace('"http://www.wallflux.com/image/','"/img/lib/wallflux/image/');
			
			
			var fbk=filesystem.createWriteStream("./public/wallflux.html",{"flags":"w","start":0});
			fbk.end(body);
		})
	});req.on('error',function(e){
		console.log('problem with request: '+e.message);
	});
	req.end();
};
setInterval(getWallflux,5*60*1000);
if(cluster.isMaster) getWallflux();



var actualizarSitemap=function(event,filename){
	filesystem.readdir("./public/templates/",function(err, datos){
		if(err) return console.log(err);
		var sitemapJson=filesystem.createWriteStream("./public/datos/sitemaplista.json",{"flags":"w"}),
		sitemapXml=filesystem.createWriteStream("./public/sitemap.xml",{"flags":"w"}),//write
		options={"declaration":{"include":false,"encoding":null}},
		loc=[{"loc":"./index/","nodes":[],"desc":"Inicio"}],
		path="./public";
		
		sitemapXml.write('<?xml version="1.0" encoding="utf-8"?>\n');
		sitemapXml.write('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">\n');
		var data={
			"@":{},
			"loc":{
				"@":{},
				"#":"http://actuartolima.com/"
			},
			"xhtml:link":[
				{"@":{"rel":"alternate","hreflang":"x-default","href":"http://actuartolima.com/"}},
				{"@":{"rel":"alternate","hreflang":"es","href":"http://actuartolima.com/"}},
				{"@":{"rel":"alternate","hreflang":"en","href":"http://en.actuartolima.com/"}}
			],
			"changefreq":{
				"@":{},
				"#":"daily"
			}
		};
		sitemapXml.write(js2xmlparser("url",data,options)+"\n");
		
		var locDesc=JSON.parse(filesystem.readFileSync('./public/templates/description.json', 'utf8'));
		/*filesystem.readFile('./public/templates/description.json','utf8',function(err,data){
			if(err) throw err;
			locDesc=JSON.parse(data);
		});*/
		var map=function(name,locList){//console.log(name,locList,path+"/"+name);
			try{//console.log(name,locList,path+"/"+name,filesystem.statSync(path+"/"+name).isDirectory());
				
				if(filesystem.statSync(path+"/"+name).isDirectory() && !/intranet/.test(name)){
					path=path+"/"+name;
					var locDesc2={}
					try{locDesc2=JSON.parse(filesystem.readFileSync(path+'/description.json', 'utf8'))}catch(e){}
					//console.log(locDesc2,path+'/description.json',name)
					var datos2=filesystem.readdirSync(path);
					//console.log("datos2",datos2);
					for(var j=0;j<datos2.length;j++){
						var locItem={};
						locItem["loc"]="./"+path.replace("./public/","")+"/"+datos2[j].split(".")[0]+"/";
						locItem["nodes"]=[];
						locItem["desc"]=locDesc2[datos2[j].split(".")[0]];
						//console.log(path+"/"+datos2[j].split(".")[0]);
						var data={
							"@":{},
							"loc":{
								"@":{},
								"#":"http://actuartolima.com/"+path.replace("./public/","")+"/"+datos2[j].split(".")[0]+"/"
							},
							"xhtml:link":[
								{"@":{"rel":"alternate","hreflang":"x-default","href":"http://actuartolima.com/"+path.replace("./public/","")+"/"+datos2[j].split(".")[0]+"/"}},
								{"@":{"rel":"alternate","hreflang":"es","href":"http://actuartolima.com/"+path.replace("./public/","")+"/"+datos2[j].split(".")[0]+"/"}},
								{"@":{"rel":"alternate","hreflang":"en","href":"http://en.actuartolima.com/"+path.replace("./public/","")+"/"+datos2[j].split(".")[0]+"/"}}
							],
							"changefreq":{
								"@":{},
								"#":"daily"
							}
						};
						if(filesystem.statSync(path+"/"+datos2[j]).isDirectory()){
							sitemapXml.write(js2xmlparser("url",data,options)+"\n");
							map(datos2[j].split(".")[0],locItem["nodes"]);
							locList.push(locItem);
						}else{
							if(!/undefined/g.test(datos2[j]) && !/description/g.test(datos2[j])){
								locList.push(locItem);
								sitemapXml.write(js2xmlparser("url",data,options)+"\n");
							}
							//console.log("loclist",locList)
						}
						
					}
					//path=path.slice(0,path.length-datos.length-1);
				}
			}catch(e){}
		};
		
		for(var i=0;i<datos.length;i++){
			if(!filesystem.statSync("./public/templates/"+datos[i]).isDirectory()  && !/index/.test(datos[i]) && !/description/.test(datos[i]) && !/intranet/.test(datos[i])){//
				var locItem={};
				locItem["loc"]="./"+datos[i].split(".")[0]+"/";
				locItem["nodes"]=[];
				locItem["desc"]=locDesc[datos[i].split(".")[0]];
				var data={
					"@":{},
					"loc":{
						"@":{},
						"#":"http://actuartolima.com/"+datos[i].split(".")[0]+"/"
					},
					"xhtml:link":[
						{"@":{"rel":"alternate","hreflang":"x-default","href":"http://actuartolima.com/"+datos[i].split(".")[0]+"/"}},
						{"@":{"rel":"alternate","hreflang":"es","href":"http://actuartolima.com/"+datos[i].split(".")[0]+"/"}},
						{"@":{"rel":"alternate","hreflang":"en","href":"http://en.actuartolima.com/"+datos[i].split(".")[0]+"/"}}
					],
					"changefreq":{
						"@":{},
						"#":"daily"
					}
				};
				sitemapXml.write(js2xmlparser("url",data,options)+"\n");
				path="./public";
				map(datos[i].split(".")[0],locItem["nodes"]);//console.log("./public/"+datos[i].split(".")[0]+"/");
				//if(locItem["nodes"].length>0) if(cluster.isMaster) filesystem.watch("./public/"+datos[i].split(".")[0]+"/",actualizarSitemap).on("error",function(err){console.log("filesystem.watch.on(error)",err.stack);});
				loc[0].nodes.push(locItem);
			}
		}
		//console.log(datos);
		sitemapXml.end();
		sitemapJson.end(JSON.stringify({"lista":loc},null,"	"));
		console.log("actualizarSitemap"+JSON.stringify(arguments));//,"archivos",payload
		
	});
	
	
}
if(cluster.isMaster) filesystem.watch("./public/templates/",actualizarSitemap).on("error",function(err){console.log("filesystem.watch.on(error)",err.stack);});
if(cluster.isMaster) actualizarSitemap();


var actualizarIntranetarchivos=function(event,filename){
	var intranetarchivosdocumentosJson=filesystem.createWriteStream("./public/datos/intranetarchivosdocumentoslista.json",{"flags":"w"}),
	intranetarchivosuploadsJson=filesystem.createWriteStream("./public/datos/intranetarchivosuploadslista.json",{"flags":"w"}),
	path="./public/private",
	hrefPath="./private",
	intranetarchivos=[{"nombre":"archivos actuar tolima","href":"","nodes":[]}],//,{"nombre":"datos actuar tolima","href":"","nodes":[]}
	intranetuploads=[{"nombre":"archivos actuar tolima","href":"","nodes":[]}];//,{"nombre":"datos actuar tolima","href":"","nodes":[]}
	
	filesystem.readdir(path,function(err,datos){
		if(err) return console.log(err);
		else{
			for(var i=0;i<datos.length;i++){
				path="./public/private";
				var intranetarchivosItem={};
				var intranetuploadsItem={};
				if(/archivos/.test(datos[i])){
					if(filesystem.statSync(path+"/"+datos[i]).isDirectory()){
						intranetarchivosItem["nombre"]=datos[i];
						//intranetarchivosItem["href"]="javascript:void(0)";
						intranetarchivosItem["nodes"]=[];
						map(datos[i],intranetarchivosItem["nodes"],path);
						intranetarchivos[0].nodes.push(intranetarchivosItem);
						//if(intranetarchivosItem["nodes"].length>0) if(cluster.isMaster) filesystem.watch("./public/private/"+datos[i]+"/",actualizarIntranetarchivos).on("error",function(err){console.log("filesystem.watch.on(error)",err.stack);});
						
					}else{
						intranetarchivosItem["nombre"]=datos[i];
						intranetarchivosItem["href"]="viewpdf?file="+path.replace("./public/","")+"/"+datos[i];
						intranetarchivosItem["nodes"]=[];
						intranetarchivos[0].nodes.push(intranetarchivosItem);
					}
				}else if(/uploads/.test(datos[i])){
					if(filesystem.statSync(path+"/"+datos[i]).isDirectory()){
						intranetuploadsItem["nombre"]=datos[i];
						//intranetarchivosItem["href"]="javascript:void(0)";
						intranetuploadsItem["nodes"]=[];
						map(datos[i],intranetuploadsItem["nodes"],path);
						intranetuploads[0].nodes.push(intranetuploadsItem);
						//if(intranetuploadsItem["nodes"].length>0) if(cluster.isMaster) filesystem.watch("./public/private/"+datos[i]+"/",actualizarIntranetarchivos).on("error",function(err){console.log("filesystem.watch.on(error)",err.stack);});
						
					}else{
						intranetuploadsItem["nombre"]=datos[i];
						intranetuploadsItem["href"]="viewpdf?file="+path.replace("./public/","")+"/"+datos[i];
						intranetuploadsItem["nodes"]=[];
						intranetuploads[0].nodes.push(intranetuploadsItem);
					}
					
				}
				
			}
			intranetarchivosdocumentosJson.end(JSON.stringify({"lista":intranetarchivos},null,"	"));
			intranetarchivosuploadsJson.end(JSON.stringify({"lista":intranetuploads},null,"	"));
			/*path="./public/datos/modificables";
			filesystem.readdir(path,function(err,datos){
				if(err) return console.log(err);
				else{
					for(var i=0;i<datos.length;i++){
						path="./public/datos/modificables";
						var intranetarchivosItem={};
						if(filesystem.statSync(path+"/"+datos[i]).isDirectory()){
							intranetarchivosItem["nombre"]=datos[i];
							//intranetarchivosItem["href"]="javascript:void(0)";
							intranetarchivosItem["nodes"]=[];
							map(datos[i],intranetarchivosItem["nodes"],path);
							intranetarchivos[1].nodes.push(intranetarchivosItem);
						}else{
							intranetarchivosItem["nombre"]=datos[i];
							intranetarchivosItem["href"]=path.replace("./public/","")+"/"+datos[i];
							intranetarchivosItem["nodes"]=[];
							intranetarchivos[1].nodes.push(intranetarchivosItem);
						}
					}
					
					
				}
			});*/
			
		}
		//console.log(datos);
		
	});
	var map=function(name,list,originalpath){
		try{
			//console.log(path+"/"+name,list,filesystem.statSync(path+"/"+name).isDirectory());
			if(filesystem.statSync(path+"/"+name).isDirectory()){
				path=path+"/"+name;
				var datos2=filesystem.readdirSync(path);
				if(datos2.length>0) if(cluster.isMaster) {
					//filesystem.unwatchFile(path+"/",actualizarIntranetarchivos);
					//filesystem.watch(path+"/",actualizarIntranetarchivos).on("error",function(err){console.log("filesystem.watch.on(error)",err.stack);});
				}
				//console.log("datos2",datos2.length,JSON.stringify(datos2));
				for(var j=0;j<datos2.length;j++){
					var intranetarchivosItem={};
					intranetarchivosItem["nombre"]=datos2[j];
					intranetarchivosItem["nodes"]=[];
					//console.log(path+"/"+datos2[j]);
					if(filesystem.statSync(path+"/"+datos2[j]).isDirectory()){
						//intranetarchivosItem["href"]="javascript:void(0)";
						map(datos2[j],intranetarchivosItem["nodes"],path);
						list.push(intranetarchivosItem);
						path=originalpath+"/"+name;
					}else{
						if(/.pdf/.test(datos2[j])) intranetarchivosItem["href"]="viewpdf?file="+path.replace("./public/","")+"/"+datos2[j];
						else if(/.doc/.test(datos2[j])) intranetarchivosItem["href"]=path.replace("./public/","")+"/"+datos2[j]+"?download=yes";
						else if(/.xls/.test(datos2[j])) intranetarchivosItem["href"]=path.replace("./public/","")+"/"+datos2[j]+"?download=yes";
						else intranetarchivosItem["href"]=path.replace("./public/","")+"/"+datos2[j];
						list.push(intranetarchivosItem);
						
						//console.log("list",list)
					}
				}
				//path=path.slice(0,path.length-datos.length-1);
			}
		}catch(e){}
	};
	console.log("actualizarIntranetarchivos",JSON.stringify(arguments));
}
//if(cluster.isMaster) filesystem.watch("./public/datos/modificables/",actualizarIntranetarchivos).on("error",function(err){console.log("filesystem.watch.on(error)",err.stack);});
//if(cluster.isMaster) filesystem.watch("./public/private/",actualizarIntranetarchivos).on("error",function(err){console.log("filesystem.watch.on(error)",err.stack);});
if(cluster.isMaster) actualizarIntranetarchivos();








function pasarSocket(archivo,socket){
	watches[archivo].socket=socket;
}


exports.pasarSocket=pasarSocket;
exports.actualizarMinified=actualizarMinified;
exports.actualizarFotos=actualizarFotos;
exports.actualizarIntranetarchivos=actualizarIntranetarchivos;