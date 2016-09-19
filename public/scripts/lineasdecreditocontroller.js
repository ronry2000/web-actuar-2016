(function(){
	
	var app=angular.module("local");
	app.controller("lineasdecreditoController",function($scope,$rootScope,$http,$window,$routeParams,Page,NgMap){
		$window.scrollTo(0,0);
		Page.setTitle('Líneas de crédito | Actuar Tolima');
		$rootScope.fbkDivFloating=false;
		
		
		
		$scope.itemClicked=function(id){
			if($rootScope.lineasdecreditoSelected!=id){
				$rootScope.lineasdecreditoSelected=id;
			}else{
				$rootScope.lineasdecreditoSelected="";
			}
			
		}
		
		
	});
	
}());