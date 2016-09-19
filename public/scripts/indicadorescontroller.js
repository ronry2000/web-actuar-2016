(function(){
	var app=angular.module("local");
	
	app.controller("indicadoresController",function($scope,$rootScope,$http,$window,$location,$anchorScroll,$timeout,Page){
		$window.scrollTo(0,0);
		Page.setTitle('Indicadores | Actuar Tolima');
		
		$rootScope.fbkDivFloating=false;
		
		
		$scope.$on('$destroy',function(){
			//$rootScope.proyectosycapacitacionSelected="";
			//socketio.removeListener("echo",echoFunction);
			//socketio.disconnect();
		});
		
		var echoFunction=function(msg){
			console.log("echo "+msg)
		};
		//socketio.connect('/echo');
		//socketio.on("echo",echoFunction);
		//socketio.emit("echo","ecoo");
		
		$scope.selectIndicadores=function(val){
			if($rootScope.indicadoresSelected==val){
				$rootScope.indicadoresSelected="";
			}else{
				$rootScope.indicadoresSelected=val;
			}
		}
		//console.log($rootScope.indicadoresFotos);
		$scope.indicadoresSocioeconomicos=$rootScope.indicadoresFotos.fotos.filter(function(element,index,array){return /socioeconomicos/.test(element)});
		$scope.indicadoresFinancieros=$rootScope.indicadoresFotos.fotos.filter(function(element,index,array){return /financieros/.test(element)});
		//console.log($scope.indicadoresFinancieros,$scope.indicadoresSocioeconomicos);
	});
	
	
	
	
	
	
	
}());
