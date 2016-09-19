(function(){
	var app=angular.module("local");
	
	app.controller("sitemapController",function($scope,$rootScope,$http,$window,$location,$anchorScroll,$timeout,Page){
		$window.scrollTo(0,0);
		Page.setTitle('Mapa del sitio | testActuar Tolima');
		
		$rootScope.fbkDivFloating=false;
		
		
		$scope.$on('$destroy',function(){
			//$rootScope.proyectosycapacitacionSelected="";
		});
		
		$scope.treeOptions = {
			nodeChildren: "nodes",
			dirSelectable: true,
			injectClasses: {
				ul: "a1",
				li: "a2",
				liSelected: "a7",
				iExpanded: "a3",
				iCollapsed: "a4",
				iLeaf: "a5",
				label: "a6",
				labelSelected: "a8"
			}
		}
		$scope.sitemapLista=$rootScope.sitemapLista;
		
		$scope.expandedNodes=[
			$scope.sitemapLista.lista[0]
		];
		$scope.selectedNodes=$scope.sitemapLista.lista[0];
		
	});
	
	
	
	
	
	
	
}());
