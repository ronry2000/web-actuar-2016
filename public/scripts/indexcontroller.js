(function(){
	var app=angular.module("local");
	
	/*app.config([
		"$routeProvider",
		"$httpProvider",
		function($routeProvider, $httpProvider){
			$httpProvider.defaults.headers.common['Access-Control-Allow-Headers'] = "*";
		}
	]);*/
	/*app.config(function($sceDelegateProvider) {
	 $sceDelegateProvider.resourceUrlWhitelist([
	   // Allow same origin resource loads.
	   'self',
	   // Allow loading from our assets domain.  Notice the difference between * and **.
	   'http://media.w3.org/**']);
	});*/
	
	
	
	app.controller("indexController",function($rootScope,$scope,$http,$timeout,$interval,$window,Page,$cookies){console.log("app.indexController");
		$window.scrollTo(0,0);
		Page.setTitle('Actuar Tolima');
		
		sessionStorage.indexCount=Number(sessionStorage.indexCount)+1;
		localStorage.indexCount=Number(localStorage.indexCount)+1;
		//console.log(localStorage,sessionStorage);
		
		$scope.message="helloe";
		$rootScope.fbkDivFloating=false;
		
		
		$scope.clock= "initializing";
		var getTime = function(){
			var d=new Date();
			$scope.clock= d.getHours()+":"+d.getMinutes()+":"+d.getSeconds()+":"+d.getMilliseconds();
		};
		$interval(getTime,100);
		
		
		$scope.getVideoUrl=function(nombre){
			return "./videos/"+nombre;
		};
		
		//console.log(JSON.stringify($cookies.getAll()));
		//if(!!$cookies.get("user")) console.log($cookies.get("user"));
		console.log("app.indexControllerend");
	});
	
	
	
	var videoUrl=function(nombres){
		alert("videourl"+JSON.stringify(arguments));
		if(!angular.isArray(nombres)){ return []; }

		return nombres.map(function(nombre){
			alert("nombresmap"+JSON.stringify(arguments));
			return "./videos/"+nombre;
		});
	};

	app.filter('videoUrl',function(){return videoUrl;});
	
	
	
	
	
	
	
	
}());


