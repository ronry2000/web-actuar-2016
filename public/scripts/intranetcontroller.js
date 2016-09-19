(function(){
	var app=angular.module("local");
	
	app.controller("intranetController",function($scope,$rootScope,$http,$window,$routeParams,$location,$anchorScroll,$timeout,$cookies,$ocLazyLoad,Page,p5){//$rootScope,$window,$location,$timeout,p5
		
		/*$ocLazyLoad.load({
			serie:false,
			files:[
				'./intranet/scripts/intranetarchivoscontroller.js'
			]
		}).then(function success(args){*/
			$window.scrollTo(0,0);
			$scope.routeParams=[];
			//$scope.netError=false;
			var link="";
			for(var i=0;i<Object.keys($routeParams).length;i++){
				link=link+"/"+$routeParams[Object.keys($routeParams)[i]];
				$scope.routeParams[i]={"link":link.slice(1,link.length),"text":$routeParams[Object.keys($routeParams)[i]]}
			}
			
			var headError=function(response){
				console.log("headError");
				if(response.status===404){
					$scope.intranetTemplate="./templates/secondary/404error.html";
					Page.setTitle('Página no encontrada - error 404 | Actuar Tolima');
				}else if(response.status===403){
					$scope.intranetTemplate="./templates/secondary/403error.html";
					Page.setTitle('Permisos requeridos - error 403 | Actuar Tolima');
				}else if(response.status===401){
					$scope.intranetTemplate="./templates/secondary/401error.html";
					Page.setTitle('Autenticación requerida - error 401 | Actuar Tolima');
					//console.log($scope.intranetTemplate);
				}else if(response.status===500){
					$scope.error=response.data;
					$scope.intranetTemplate="./templates/secondary/500error.html";
					Page.setTitle('Error interno - error 500 | Actuar Tolima');
					//console.log($scope.intranetTemplate);
				}
				else if(response.status===400){
					$scope.error=response.data;
					$scope.intranetTemplate="./templates/secondary/400error.html";
					Page.setTitle('Solicitud incorrecta - error 400 | Actuar Tolima');
					//console.log($scope.intranetTemplate);
				}else{
					//$scope.netError=true;
					//$scope.intranetTemplate='<h1 align="center">ERROR</h1><div align="center"><a ng-href="./"><img src="../img/logoactuartolima.png" alt="unauthorized" title="unauthorized" width="30%"></a></div><div style="clear:both;"></div>';
					Page.setTitle('ERROR DE RED | Actuar Tolima');
					angular.element($("#breadcrumbDiv")).html("<div style='overflow:auto'><h1 style='color:red'>ERROR DE RED</h1>"+JSON.stringify(response)+"</div>");
					//console.log($scope.intranetTemplate);
				}
			};
			if(!!$routeParams.p2){///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
				Page.setTitle($routeParams.p2+' | Actuar Tolima');
				var headSuccessP2=function(response){
					$scope.intranetTemplate="./intranet/"+$routeParams.p1+"/templates/"+$routeParams.p2+".html";
				};
				$http({
					method:'HEAD',
					url:"./intranet/"+$routeParams.p1+"/templates/"+$routeParams.p2+".html",
					//,headers:{'Content-Type':'application/x-www-form-urlencoded'}
				}).then(headSuccessP2,headError);
			}else if(!!$routeParams.p1){///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
				Page.setTitle($routeParams.p1+' | Actuar Tolima');
				var path="";
				var headErrorP1=function(response){
					//console.log("headErrorP1");
					path="./intranet/"+$routeParams.p1;
					$http({
						method:'HEAD',
						url:path
					}).then(headSuccessP1,headError);
				};
				var headSuccessP1=function(response){
					//console.log("headSuccessP1");
					$scope.intranetTemplate=path;//"./intranet/templates/"+$routeParams.p1+".html"
				};
				path="./intranet/templates/"+$routeParams.p1+".html";
				$http({
					method:'HEAD',
					url:path
				}).then(headSuccessP1,headErrorP1);
			}
			else{///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
				Page.setTitle('Intranet | Actuar Tolima');
				var headSuccessP0=function(response){
					$scope.intranetTemplate="./intranet/main.html";
				};
				$http({
					method:'HEAD',
					url:"./intranet/main.html",
					//,headers:{'Content-Type':'application/x-www-form-urlencoded'}
				}).then(headSuccessP0,headError);
			}
		/*},function error(err){
			return console.log(err);
		});*/
		
		$rootScope.fbkDivFloating=false;
		//console.log($rootScope.proyectosycapacitacionSelected);
		
		$scope.$on('$destroy',function(){
			//$rootScope.proyectosycapacitacionSelected="";
		});
		
		
		
		//if(!$routeParams.p1) $routeParams.p1="main";
		//$scope.proyectosycapacitacionTemplate="./proyectosycapacitacion/"+$rootScope.proyectosycapacitacionTabSelected+".html";
		
		
		$scope.logout=function(){
			var logoutSuccess=function(response){
				//console.log(response);
				if(response.status==200){
						angular.element($("#loginErrorDiv")).html("<p style='color:rgba(51,124,66,1)'>"+response.data+"</p>");
						$location.url("/login");
				}
				if(response.status==0){
					$window.open("./continuarcerthttps.html","_self");
				}
			};
			var logoutError=function(response){
				angular.element($("#loginErrorDiv")).html("<p style='color:red'>"+response.data+"</p>");
				console.log("logouterror"+JSON.stringify(arguments));
				if(response.status==0){
					$window.open("./continuarcerthttps.html","_self");
				}
			};
			$http({
				method:'POST',
				url:'./logout',
				//data:{"email":$scope.loginEmail,"password":$scope.loginPassword}//encodeURIComponent("usuario="+$scope.loginUsuario+"&password="+$scope.loginPassword)
				//,headers: {'Content-Type': 'application/x-www-form-urlencoded'}
			}).then(logoutSuccess,logoutError);
			angular.element($("#loginErrorDiv")).html("<p style='color:rgba(51,124,66,1)'>procesando...</p>");
		};
		
		$scope.menuClicked=function(){
			$rootScope.intranetMenuExpanded=!$rootScope.intranetMenuExpanded;
			
		};
		
	});
	
	
	
	
	
	
	
}());
