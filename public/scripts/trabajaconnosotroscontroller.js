(function(){
	var app=angular.module("local");
	
	app.controller("trabajaconnosotrosController",function($scope,$rootScope,$http,$window,$location,$anchorScroll,$timeout,Page,Upload){
		$window.scrollTo(0,0);
		Page.setTitle('Trabaja con nosotros | Actuar Tolima');
		
		$rootScope.fbkDivFloating=false;
		
		
		$scope.$on('$destroy',function(){
			//$rootScope.proyectosycapacitacionSelected="";
		});
		
		
		
		
		$scope.trabajaconnosotrosEmail="";
		$scope.trabajaconnosotrosNombre="";
		//$scope.trabajaconnosotrosCargo="";
		//$scope.trabajaconnosotrosFile="";
		
		
		
		$scope.trabajaconnosotros=function(){
			if($scope.trabajaconnosotrosForm.trabajaconnosotrosFile.$valid && $scope.trabajaconnosotrosFile){
				var cargoTitulo=$rootScope.convocatoriasLista.lista.filter(function(obj) {
					return obj.id==$scope.trabajaconnosotrosCargo;
				});
				//console.log("&cargoTitulo="+cargoTitulo[0].titulo);
				Upload.upload({
					url:'./trabajaconnosotroshojadevida?email='+$scope.trabajaconnosotrosEmail+"&nombre="+$scope.trabajaconnosotrosNombre+"&cargotitulo="+$scope.trabajaconnosotrosCargo,//+"&cargo="+$scope.trabajaconnosotrosCargo   cargoTitulo[0].titulo
					method:"POST",
					data:{file:$scope.trabajaconnosotrosFile,"sdf":$scope.trabajaconnosotrosEmail},
					query:{"email":$scope.trabajaconnosotrosEmail}//pass file as data, should be user ng-model
				}).then(function(resp){
					//console.log(resp.config,resp.data);
					angular.element($("#trabajaconnosotrosErrorDiv")).html("<p style='color:rgba(51,124,66,1)'>"+resp.data+"</p>");
					
				},function(resp){ //catch error
					angular.element($("#trabajaconnosotrosErrorDiv")).html("<p style='color:red'>"+resp.data+"</p>");
				},function(evt){
					var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
					angular.element($("#trabajaconnosotrosErrorDiv")).html("<p style='color:rgba(51,124,66,1)'>"+'progreso: '+progressPercentage+'% '+evt.config.data.file.name+"</p>");
				});
			}
		}
		
		$scope.itemClicked=function(id){
			if($rootScope.convocatoriaSelected!=id){
				$rootScope.convocatoriaSelected=id;
			}else{
				$rootScope.convocatoriaSelected="";
			}
		}
		
		$scope.convocatoriasListaFilter=function(lista){
			lista.titulo=lista.titulo.split("-")[0];
			return true;
		}
		
	});
	
	
	
	
	
	
	
}());
