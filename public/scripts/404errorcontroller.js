(function(){
	var app=angular.module("local");
	
	app.controller("404errorController",function($scope,$rootScope,$http,$window,$routeParams,Page){
		Page.setTitle('Página no encontrada - 404 error | Actuar Tolima');
		$rootScope.fbkDivFloating=false;
		$window.scrollTo(0,0);
	});
}());
