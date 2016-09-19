window.onerror=function(){//errorMsg, url, lineNumber, column, errorObj
	//alert(JSON.stringify(arguments));
};

window.onload=function(){
	
};

(function(){
	var app=angular.module("local",["ngRoute",'angular-p5','ngMap','ngSanitize','treeControl','ngFileUpload','ngCookies','oc.lazyLoad']);//,'ui.tree','ngLoadScript'
	app.config(function($routeProvider,$locationProvider,$ocLazyLoadProvider){
		
		console.log("app.config");
		$locationProvider.html5Mode(true);
		$ocLazyLoadProvider.config({
			debug:false,
			events:true
		});
		$routeProvider
			.when("/",{templateUrl:"./templates/index.html",controller:"indexController"})
			.when("/index",{templateUrl:"./templates/index.html",controller:"indexController"})
			.when("/main",{templateUrl:"./templates/index.html",controller:"indexController"})
			.when("/proyectosycapacitacion/:p1",{templateUrl:"./templates/proyectosycapacitacion.html",controller:"proyectosycapacitacionController"})
			.when("/proyectosycapacitacion",{templateUrl:"./templates/proyectosycapacitacion.html",controller:"proyectosycapacitacionController"})
			.when("/contacto",{templateUrl:"./templates/contacto.html",controller:"contactoController"})
			.when("/solicitarcredito",{templateUrl:"./templates/solicitarcredito.html",controller:"solicitarcreditoController"})
			.when("/conocenos",{templateUrl:"./templates/conocenos.html",controller:"conocenosController"})
			.when("/nuestrasoficinas",{templateUrl:"./templates/nuestrasoficinas.html",controller:"nuestrasoficinasController"})
			.when("/lineasdecredito",{templateUrl:"./templates/lineasdecredito.html",controller:"lineasdecreditoController"})
			.when("/indicadores",{templateUrl:"./templates/indicadores.html",controller:"indicadoresController"})
			.when("/impactosocial",{templateUrl:"./templates/impactosocial.html",controller:"impactosocialController"})
			.when("/sitemap",{templateUrl:"./templates/secondary/sitemap.html",controller:"sitemapController"})
			.when("/trabajaconnosotros",{templateUrl:"./templates/trabajaconnosotros.html",controller:"trabajaconnosotrosController as up"})
			.when("/login",{templateUrl:"./templates/secondary/login.html",controller:"loginController"})
			.when("/intranet",{templateUrl:"./templates/intranet.html",controller:"intranetController"})
			.when("/intranet/:p1",{templateUrl:"./templates/intranet.html",controller:"intranetController"})
			.when("/intranet/:p1/:p2",{templateUrl:"./templates/intranet.html",controller:"intranetController"})
			//.when("/pdf",{templateUrl:"./viewer.html"})
			.otherwise({templateUrl:"./templates/secondary/404error.html",controller:"404errorController"})//redirectTo:"/index"
		console.log("app.configend");
		
	});
	
	app.run(function($rootScope,$http,$location,$anchorScroll,$timeout,$cookies,$window,Page){console.log("app.run");
		Page.setTitle('Actuar Tolima');
		
		if(!sessionStorage.indexCount)sessionStorage.indexCount="0";
		if(!localStorage.indexCount)localStorage.indexCount="0";
		if(!localStorage.contactoCount)localStorage.contactoCount="0";
		
		//$rootScope.fbkDivFloating=false;
		$rootScope.mapLat="4.443234";
		$rootScope.mapLng="-75.233993";
		$rootScope.markerName="Actuar Ibagué Interlaken";
		$rootScope.animationOn=true;
		$rootScope.proyectosycapacitacionCursosSelected="";
		$rootScope.proyectosycapacitacionCursosItemSelected="";
		$rootScope.proyectosycapacitacionChanged=false;
		$rootScope.impactosocialSelected="";
		$rootScope.impactosocialChanged=false;
		$rootScope.lineasdecreditoSelected="";
		$rootScope.convocatoriaSelected="";
		$rootScope.proyectosycapacitacionTabSelected="horarios";
		//$rootScope.activeSlider="";
		$rootScope.user={};
		if(!!$cookies.get("user")) $rootScope.user=JSON.parse($cookies.get("user"));
		$rootScope.intranetHorariocursoSelected="";
		$rootScope.intranetPreinscripcioncursoSelected="";
		$rootScope.indicadoresSelected="";
		$rootScope.intranetCursoArea="";
		$rootScope.intranetofertaselected="";
		$rootScope.intranetlineaselected="";
		$rootScope.intranetIndicadoresSelected="";
		$rootScope.intranetMenuExpanded=false;
		$rootScope.menuOpened=true;
		
		$rootScope.checkSession=function(){
			//console.log("$rootScope.checkSession");
			if(!!$cookies.get("session")) return true;
			else return false;
		};
		$rootScope.menuClicked=function(){
			$rootScope.menuOpened=!$rootScope.menuOpened;
		};
		$rootScope.checkMenuOpened=function(){
			if(angular.element($window).outerWidth()<780 && $location.path()!="/" && $location.path()!="/index") $rootScope.menuOpened=false;
			else $rootScope.menuOpened=true;
		};
		
		$rootScope.$on('$routeChangeSuccess',function(newRoute,oldRoute){
			$rootScope.checkMenuOpened();
			$timeout(function(){if($location.hash()) $anchorScroll();/*console.log(newRoute,oldRoute);*/},200);
		});
		
		
		
		
		var dataSuccess=function(response){
			$rootScope[response.config.params["var"]]=response.data;
		};
		var dataError=function(response){
			console.log(response);
		};
		$http({
			method:'GET',
			url:"./datos/indexsliderfotos.json",
			params:{'var':'indexSliderFotos'}
		}).then(dataSuccess,dataError);
		$http({
			method:'GET',
			url:"./datos/conocenossliderfotos.json",
			params:{'var':'conocenosSliderFotos'}
		}).then(dataSuccess,dataError);
		$http({
			method:'GET',
			url:"./datos/proyectosycapacitacionsliderfotos.json",
			params:{'var':'proyectosycapacitacionSliderFotos'}
		}).then(dataSuccess,dataError);
		$http({
			method:'GET',
			url:"./datos/modificables/proyectosycapacitacionlista.json",
			params:{'var':'proyectosycapacitacionLista'}
		}).then(dataSuccess,dataError);
		$http({
			method:'GET',
			url:"./datos/impactosocialsliderfotos.json",
			params:{'var':'impactosocialSliderFotos'}
		}).then(dataSuccess,dataError);
		$http({
			method:'GET',
			url:"./datos/modificables/impactosociallista.json",
			params:{'var':'impactosocialLista'}
		}).then(dataSuccess,dataError);
		$http({
			method:'GET',
			url:"./datos/modificables/lineasdecreditolista.json",
			params:{'var':'lineasdecreditoLista'}
		}).then(dataSuccess,dataError);
		$http({
			method:'GET',
			url:"./datos/modificables/nuestrasoficinaslista.json",
			params:{'var':'nuestrasoficinasLista'}
		}).then(dataSuccess,dataError);
		$http({
			method:'GET',
			url:"./datos/videoslista.json",
			params:{'var':'videosLista'}
		}).then(dataSuccess,dataError);
		$http({
			method:'GET',
			url:"./datos/sitemaplista.json",
			params:{'var':'sitemapLista'}
		}).then(dataSuccess,dataError);
		$http({
			method:'GET',
			url:"./datos/modificables/convocatoriaslista.json",
			params:{'var':'convocatoriasLista'}
		}).then(dataSuccess,dataError);
		$http({
			method:'GET',
			url:"./datos/intranetarchivosuploadslista.json",
			params:{'var':'intranetarchivosuploadsLista'}
		}).then(dataSuccess,dataError);
		$http({
			method:'GET',
			url:"./datos/proyectosycapacitacionpreinscripcionlista.json",
			params:{'var':'proyectosycapacitacionpreinscripcionLista'}
		}).then(dataSuccess,dataError);
		$http({
			method:'GET',
			url:"./datos/indicadoresfotos.json",
			params:{'var':'indicadoresFotos'}
		}).then(dataSuccess,dataError);
		$http({
			method:'GET',
			url:"./datos/proyectosycapacitacioncursossugeridos.json",
			params:{'var':'proyectosycapacitacionCursossugeridos'}
		}).then(dataSuccess,dataError);
		
		
		
		
		
		var dataSuccess2=function(response){
			response.data.lista.forEach(function(element,index,array){
				element.horario2=[];
				for(var i=0;i<element.horario.split(".").length;i++){
					element.horario2[i]={"dia":element.horario.split(".")[i].split("-")[0],"jornada":element.horario.split(".")[i].split("-")[1]};
				}
			});
			$rootScope[response.config.params["var"]]=response.data;
		};
		var dataError2=function(response){
			console.log(response);
		};
		$http({
			method:'GET',
			url:"./datos/horarioscapacitaciones/proyectosycapacitacionhorariolista"+new Date().getFullYear()+$.datepicker.iso8601Week(new Date())+".json",
			params:{'var':'proyectosycapacitacionhorarioLista'}
		}).then(dataSuccess2,dataError2);
		
		console.log("app.runend");
		
	});
	
	app.controller('appController',function($scope,$rootScope,$window,$location,$timeout,p5,$cookies){console.log("app.appController");
		$rootScope.fbkImgSrc="./img/logofbk.png";
		$scope.fbkToggle=function(){
			$rootScope.fbkDivFloating=!$rootScope.fbkDivFloating;
			//console.log($rootScope.fbkDivFloating);
		};
		$scope.onload=function(){
			//$timeout(function(){
				//console.log($location.path());
				//$scope.activeSlider=$location.path();
			//},500);
		};
		angular.element($window).bind('resize',function(){
			if(angular.element($window).outerWidth()>780) $rootScope.menuOpened=true;
			$scope.$apply();
		});
		
		//console.log(JSON.stringify($cookies.getAll()));
		//if(!!$cookies.get("user")) console.log($cookies.get("user"));
		console.log("app.appControllerend");
	});
	
	app.controller('sliderController',function($scope,$rootScope,$window,$location,$timeout,p5){console.log("app.sliderController");
		$scope.activeSlider=$location.path();
		$scope.$on('$routeChangeSuccess', function(){
			$scope.activeSlider=$location.path();
			$window.scrollTo(0,0);
		});
		//$timeout(function(){
			//console.log($scope.activeSlider);
			//$scope.activeSlider=$location.path();;
		//},13005);
		console.log("app.sliderControllerend");
	});
	
	
	
	
	app.factory('Page',function(){
		var title='Actuar Tolima';
		return{
			title:function(){return title;},
			setTitle:function(newTitle){title=newTitle;}
		};
	});
	
	app.filter('to_trusted',['$sce',function($sce){
		return function(text){
			return $sce.trustAsHtml(text);
		};
	}]);
	
	
	
	app.controller('appHeadCtrl',['$scope','Page',function($scope,Page){console.log("app.appHeadCtrl");
		$scope.Page=Page;
		console.log("app.appHeadCtrlend");
	}]);
	
	
	/*app.directive('videojs',function($http){
		var linker=function(scope, element, attrs){
			console.log(attrs);
			var player;
			
				//var videosJSON=response.data.videos;
				var mp4=attrs.id;
					var video=angular.element("<video />");
					video.attr("id", mp4.split(".")[0]);
					video.bind("contextmenu", function (e) { e.preventDefault(); e.stopPropagation(); }, false);
					element.append(video);
					var vHeight,vWidth;
					if(element.outerWidth()>640){
						vWidth="640px"
						vHeight="480px";
					}else{
						vWidth=element.outerWidth()
						vHeight=element.outerWidth()*0.666+"px";
					}
					var setup={"height":vHeight,"width":vWidth,"class":"video-js vjs-default-skin","controls": true,"allowFullScreen":true, "preload": "auto"};//, "type":"video/mp4", "src":"./videos/"+mp4s[i]
					player = videojs(mp4.split(".")[0],setup,function(){
						//this.play(); // if you don't trust autoplay for some reason
						
						this.on('ended',function(e){
							console.log('awww...over so soon?');
						});
						this.on('play',function(e){
							if(this.isFullscreen)this.exitFullscreen;
						});
						this.on('error',function(e){
							var code = e.target.error ? e.target.error.code : e.code;
							var messages={1: "MEDIA_ERR_ABORTED - intente otravez",2: "MEDIA_ERR_NETWORK - intente otravez",3: "MEDIA_ERR_DECODE",4: "MEDIA_ERR_SRC_NOT_SUPPORTED",5: "MEDIA_ERR_ENCRYPTED(Chrome)",unknown: "undefined - error: intente abrir con otro navegador.(firefox, opera, uc browser, dolphin browser, android browser)"};
							var alerta=angular.element('<h1 />');
							alerta.html=messages[code] || messages['unknown'];
							this.el().appendChild(alerta);
							//alert(messages[code] || messages['unknown']);
						});
					});
					player.poster("./videos/"+mp4.split(".")[0]+".jpg");
					player.src([{type:"video/mp4",src:"./videos/"+mp4},{type:"video/webm",src:"./videos/"+mp4.split(".")[0]+".webm"}]);
					player.addClass("video-js vjs-default-skin");
					//element.append(players[i]);
					var div=angular.element("<div />");
					div.attr("style","clear:both;");
					element.append(div);
				
				var div=angular.element("<div />");
				div.attr("style","clear:both;");
				element.append(div);
			
			
			
			
			scope.$on('$destroy', function () {
				//for(var i=0;i<player.length;i++)
					player.dispose();
			});
		}
		return {
			restrict : 'A',
			link : linker
		};
	});*/
	
	/*app.factory('socketio',["$rootScope",function($rootScope){
		var socket;
		return{
			connect:function(path,callback){
					//socket=io.connect("http://test11test.mooo.com:8001",{path:path},function(){//,transports : ['websocket']
					socket=io.connect("http://test11test.mooo.com:8001",{path:path},function(){//,transports : ['websocket']
					var args=arguments;
					$rootScope.$apply(function(){
						callback.apply(socket,args);
					});
				});
			},
			on:function(eventName,callback){
					socket.on(eventName,function(){
					var args=arguments;
					$rootScope.$apply(function(){
						callback.apply(socket,args);
					});
				});
			},
			once:function(eventName,callback){
					socket.once(eventName,function(){
					var args=arguments;
					$rootScope.$apply(function(){
						callback.apply(socket,args);
					});
				});
			},
			emit: function (eventName,data,callback){
				socket.emit(eventName,data,function(){
					var args=arguments;
					$rootScope.$apply(function(){
						if(callback){
							callback.apply(socket,args);
						}
					});
				})
			},
			disconnect: function (callback){
				socket.disconnect(function(){
					var args=arguments;
					$rootScope.$apply(function(){
						if(callback){
							callback.apply(socket,args);
						}
					});
				})
			},
			removeListener: function (eventName,data,callback){
				socket.removeListener(eventName,data,function(){
					var args=arguments;
					$rootScope.$apply(function(){
						if(callback){
							callback.apply(socket,args);
						}
					});
				})
			}
		};
	}]);
	*/
	app.service('myTemplateService',['$http','$templateCache',function($templateCache){
		$http("./templates/secondary/error.html").then(function(response){
			$templateCache.put('my-dynamic-template',response);
		},function(response){console.log(response.data)});
	}]);
	
	
	
	
	
	
	
	
	
	
}());






var get_params = function(search_string) {

	var parse = function(params, pairs) {
		var pair = pairs[0];
		var parts = pair.split('=');
		var key = decodeURIComponent(parts[0]);
		var value = decodeURIComponent(parts.slice(1).join('='));

		// Handle multiple parameters of the same name
		if (typeof params[key] === "undefined") {
			params[key] = value;
		} else {
			params[key] = [].concat(params[key], value);
		}

		return pairs.length == 1 ? params : parse(params, pairs.slice(1))
	}

	// Get rid of leading ?
	return search_string.length == 0 ? {} : parse({}, search_string.substr(1).split('&'));
}

var params = get_params(location.search);



