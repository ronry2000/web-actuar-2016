(function(){
	
	var app=angular.module("local");
	app.controller("nuestrasoficinasController",function($scope,$rootScope,$http,$window,$routeParams,Page,NgMap){
		$window.scrollTo(0,0);
		Page.setTitle('Nuestras oficinas | Actuar Tolima');
		$rootScope.fbkDivFloating=false;
		
		
		NgMap.getMap().then(function(map){
			//console.log(map.getCenter());
			//console.log('markers', map.markers);
			//console.log('shapes', map.shapes);
			google.maps.event.trigger(map,"resize");
			google.maps.event.addDomListener(window,'resize',function(){
				map.setCenter({lat:Number($rootScope.mapLat),lng:Number($rootScope.mapLng)});
			});
			map.setCenter({lat:Number($rootScope.mapLat),lng:Number($rootScope.mapLng)});
			/*var marker=new google.maps.Marker({
				position:{lat:Number($rootScope.mapLat),lng:Number($rootScope.mapLng)},
				title:"Actuar "+$rootScope.markerName,
				map:map
			});*/
		});
		
		
		
	});
	
}());