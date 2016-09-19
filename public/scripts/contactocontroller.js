(function(){
	
	var app=angular.module("local");
	app.controller("contactoController",function($scope,$rootScope,$http,$window,$routeParams,Page,NgMap){
		$window.scrollTo(0,0);
		Page.setTitle('Contacto | Actuar Tolima');
		
		localStorage.contactoCount=Number(localStorage.contactoCount)+1;
		
		var element=angular.element($("#principal"));
		
		if(element.outerWidth()>800 && Number(localStorage.contactoCount)%10=="1"){
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
		
		
		$scope.contactoEmail="";
		$scope.contactoNombre="";
		$scope.contactoEmpresa="";
		$scope.contactoTelefono="";
		$scope.contactoMensaje="";
		
		
		
		$scope.contacto=function(){
			if(!/^[áàãâäéèêëíìîïóòõôöúùûüÁÀÃÂÄÉÈÊËÍÌÎÏÓÒÕÖÔÚÙÛÜÝýỲỳŶŷŸÿỸỹçÇñÑa-zA-Z0-9.:,;%=\/*+-_?¿¡!$\s@]{1,600}$/.test($scope.contactoMensaje)){
				angular.element($("#contactoErrorDiv")).html("<p style='color:red'>campo 'Mensaje' erroneo<br></br>máxima longitud: 600 caracteres<br></br>caracteres especiales aceptados: .:,;%=/*+-_?¿¡!$@</p>");
			}else{
				angular.element($("#contactoErrorDiv")).html("<p style='color:rgba(51,124,66,1)'>enviando mensaje...</p>");
				var contactoSuccess=function(response){
					if(response.status==200){
						angular.element($("#contactoErrorDiv")).html("<p style='color:rgba(51,124,66,1)'>"+response.data+"</p>");
					}
					if(response.status==0){
						$window.open("./continuarcerthttps.html","_self");
					}
				};
				var contactoError=function(response){
					angular.element($("#contactoErrorDiv")).html("<p style='color:red'>"+response.data+"</p>");
				};
				$http({
					method:'POST',
					url:'./contactoemail',
					data:{"email":$scope.contactoEmail,"mensaje":$scope.contactoMensaje,"nombre":$scope.contactoNombre,"telefono":$scope.contactoTelefono,"empresa":$scope.contactoEmpresa,"ciudad":$scope.contactoCiudad,"direccion":$scope.contactoDireccion}//encodeURIComponent("email="+$scope.registroEmail+"&password="+$scope.registroPassword+"&nombre="+$scope.registroNombre)
					//,headers: {'Content-Type': 'application/x-www-form-urlencoded'}
				}).then(contactoSuccess,contactoError);
			}
		}
		
		
	});
	
}());