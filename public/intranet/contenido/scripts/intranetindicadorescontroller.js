(function(){
	var app=angular.module("local");
	
	app.controller("intranetindicadoresController",function($scope,$rootScope,$http,$window,$routeParams,$location,$anchorScroll,$timeout,Page,p5,Upload){//$rootScope,$window,$location,$timeout,p5
		
		Page.setTitle('Indicadores | testActuar Tolima');
		
		$rootScope.fbkDivFloating=false;
		
		
		//console.log($rootScope.proyectosycapacitacionSelected);
		
		$scope.$on('$destroy',function(){
			//$rootScope.proyectosycapacitacionSelected="";
		});
		$scope.intranetIndicadoresTipo="";
		$scope.intranetIndicadorHover="";
		//$scope.intranetIndicadoresFile=null;
		$scope.itemHovered=function(id){
			if($scope.intranetIndicadorHover!=id){
				$scope.intranetIndicadorHover=id;
			}else{
				$scope.intranetIndicadorHover="";
			}
		};
		
		
		$scope.actualizarIndicadores=function(){
			//console.log("sdfaasf",$scope.intranetHorariocapacitacionesForm.intranetHorarioFile.$valid,$scope.up.intranetHorarioFile,$scope);
			if($scope.intranetIndicadoresForm.intranetIndicadoresFile.$valid && $scope.intranetIndicadoresFile){
				//console.log("sdfaasf",$scope.intranetHorariocapacitacionesForm.intranetHorarioFile.$valid,$scope.up.intranetHorarioFile);
				Upload.upload({
					url:'./intranetindicadores?tipo='+$scope.intranetIndicadoresTipo,
					method:"POST",
					data:{file:$scope.intranetIndicadoresFile}
					//query:{"email":$scope.trabajaconnosotrosEmail}//pass file as data, should be user ng-model
				}).then(function(response){
					angular.element($("#intranetIndicadoresErrorDiv")).html("<p style='color:rgba(51,124,66,1)'>"+response.data+"</p>");
					$timeout(function(){getIndicadores();},1000);
				},function(response){ //catch error
					angular.element($("#intranetIndicadoresErrorDiv")).html("<p style='color:red'>"+response.data+"</p>");
				},function(evt){
					var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
					angular.element($("#intranetIndicadoresErrorDiv")).html("<p style='color:rgba(51,124,66,1)'>"+'progreso: '+progressPercentage+'% '+evt.config.data.file.name+"</p>");
				});
			}
		}
		$scope.deleteIndicadores=function(foto){
			if(window.confirm("borrar la foto "+foto+"?")){
				var registroSuccessDelete=function(response){
					if(response.status==200){
						$timeout(function(){getIndicadores();},1000);
						angular.element($("#intranetIndicadoresErrorDiv")).html("<p style='color:rgba(51,124,66,1)'>"+response.data+"</p>");
					}
					if(response.status==0){
						$window.open("./continuarcerthttps.html","_self");
					}
				};
				var registroErrorDelete=function(response){
					angular.element($("#intranetIndicadoresErrorDiv")).html("<p style='color:red'>"+response.data+"</p>");
				};
				$http({
					method:'DELETE',
					url:'./intranetindicadores',
					data:{"foto":foto},
					headers:{"Content-Type":"application/json;charset=utf-8"}
				}).then(registroSuccessDelete,registroErrorDelete);
			}
		}
		
		
		function getIndicadores(){
			var dataSuccess2=function(response){
				$rootScope.indicadoresFotos=response.data;
			};
			var dataError2=function(response){
				angular.element($("#intranetIndicadoresErrorDiv")).html("<p style='color:red'>"+response.data+"</p>");
			};
			$http({
				method:'GET',
				url:"./datos/indicadoresfotos.json"
			}).then(dataSuccess2,dataError2);
		}
		
	});
	
	
	
	
	
	
	
}());
