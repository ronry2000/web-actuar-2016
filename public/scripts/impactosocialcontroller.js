(function(){
	var app=angular.module("local");
	
	app.controller("impactosocialController",function($scope,$rootScope,$http,$window,$location,$anchorScroll,$timeout,Page){
		$window.scrollTo(0,0);
		Page.setTitle('Impacto social | Actuar Tolima');
		
		$rootScope.fbkDivFloating=false;
		if($rootScope.impactosocialSelected==""){
			angular.element($("#impactosocialOrgDesc")).html("");
			angular.element($("#impactosocialOrgTittle")).html("");
		}else{
			$timeout(function(){angular.element($("#impactosocialOrgDesc")).html($rootScope.impactosocialLista.descripciones[$rootScope.impactosocialSelected][0]);
			angular.element($("#impactosocialOrgTittle")).html("<span style='margin:0px;padding:2%;'>"+$rootScope.impactosocialLista.descripciones[$rootScope.impactosocialSelected][1]+"</span>");},500);
		}
		//$scope.impactosocialOrgDesc=$rootScope.impactosocialLista.descripciones[$rootScope.impactosocialSelected];
		$scope.$on('$destroy',function(){
			//$rootScope.proyectosycapacitacionSelected="";
		});
		
		
		$scope.selectItem=function(grupo){
			$rootScope.impactosocialChanged=true;
			if($rootScope.impactosocialSelected==grupo){
				$rootScope.impactosocialSelected="";
				angular.element($("#impactosocialOrgTittle")).html("");
			}else{
				$rootScope.impactosocialSelected=grupo;
				angular.element($("#impactosocialOrgTittle")).html("<span style='margin:0px;padding:2%;'>"+$rootScope.impactosocialLista.descripciones[$rootScope.impactosocialSelected]+"</span>");
			}
			
		}
		
	});
	
	
	
	
	
	
	
}());
