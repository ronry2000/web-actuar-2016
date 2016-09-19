(function(){
	
	var app=angular.module("local");
	app.controller("solicitarcreditoController",function($scope,$rootScope,$http,$window,$routeParams,Page,NgMap){
		$window.scrollTo(0,0);
		Page.setTitle('Solicitar crédito | Actuar Tolima');
		
		localStorage.solicitarcreditoCount=Number(localStorage.solicitarcreditoCount)+1;
		
		var element=angular.element($("#principal"));
		
		if(element.outerWidth()>800 && Number(localStorage.solicitarcreditoCount)%10=="1"){
			$rootScope.fbkDivFloating=true;
		}else{
			$rootScope.fbkDivFloating=false;
		}
		
		
		NgMap.getMap().then(function(map){
			google.maps.event.trigger(map, "resize");
			map.setCenter({lat:Number($rootScope.mapLat),lng:Number($rootScope.mapLng)});
			/*var marker=new google.maps.Marker({
				position:{lat:Number($rootScope.mapLat),lng:Number($rootScope.mapLng)},
				title:"Actuar "+$rootScope.markerName,
				map:map
			});*/
		});
		
		
		$scope.solicitarcreditoEmail="";
		$scope.solicitarcreditoNombre="";
		$scope.solicitarcreditoEmpresa="";
		$scope.solicitarcreditoTelefono="";
		$scope.solicitarcreditoMensaje="";
		
		
		
		$scope.solicitar=function(){
			if(!/^[áàãâäéèêëíìîïóòõôöúùûüÁÀÃÂÄÉÈÊËÍÌÎÏÓÒÕÖÔÚÙÛÜÝýỲỳŶŷŸÿỸỹçÇñÑa-zA-Z0-9.:,;%=\/*+-_?¿¡!$\s@]{1,600}$/.test($scope.solicitarcreditoMensaje)){
				angular.element($("#solicitarcreditoErrorDiv")).html("<p style='color:red'>campo 'Mensaje' erroneo<br></br>máxima longitud: 600 caracteres<br></br>caracteres especiales aceptados: .:,;%=/*+-_?¿¡!$@</p>");
			}else{
				angular.element($("#solicitarcreditoErrorDiv")).html("<p style='color:rgba(51,124,66,1)'>enviando mensaje...</p>");
				var solicitarcreditoSuccess=function(response){
					if(response.status==200){
						angular.element($("#solicitarcreditoErrorDiv")).html("<p style='color:rgba(51,124,66,1)'>"+response.data+"</p>");
					}
					if(response.status==0){
						$window.open("./continuarcerthttps.html","_self");
					}
				};
				var solicitarcreditoError=function(response){
					angular.element($("#solicitarcreditoErrorDiv")).html("<p style='color:red'>"+response.data+"</p>");
				};
				$http({
					method:'POST',
					url:'./solicitarcreditoemail',
					data:{"email":$scope.solicitarcreditoEmail,"mensaje":$scope.solicitarcreditoMensaje,"nombre":$scope.solicitarcreditoNombre,"telefono":$scope.solicitarcreditoTelefono,"ciudad":$scope.solicitarcreditoCiudad,"direccion":$scope.solicitarcreditoDireccion}//encodeURIComponent("email="+$scope.registroEmail+"&password="+$scope.registroPassword+"&nombre="+$scope.registroNombre)
					//,headers: {'Content-Type': 'application/x-www-form-urlencoded'}
				}).then(solicitarcreditoSuccess,solicitarcreditoError);
			}
		}
		
		
	});
	
}());