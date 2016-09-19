(function(){
	var app=angular.module("local");
	app.controller("registroController",function($scope,$rootScope,$http,$window,$routeParams,Page){
		Page.setTitle('Registro | Actuar Tolima');
		//console.log($routeParams,"sadfsadfsadfsdaf");
		$rootScope.fbkDivFloating=false;
		
		
		$scope.registroAccesibilidad="";
		$scope.registroNombre="";
		$scope.registroPassword="";
		$scope.registroPassword2="";
		$scope.registroEmail="";
		//$scope.registroLista=[];
		
		$scope.registro=function(){
			//console.log($scope.registroPassword,$scope.registroPassword2);
			if($scope.registroPassword!=$scope.registroPassword2)
				$scope.registroErrorP="contraseñas no coinciden";
			else{
				var registroSuccess=function(response){
					if(response.status==200){
						getusers();
						angular.element($("#registroErrorDiv")).html("<p style='color:rgba(51,124,66,1)'>"+response.data+"</p>");
					}
					if(response.status==0){
						$window.open("./continuarcerthttps.html","_self");
					}
				};
				var registroError=function(response){
					angular.element($("#registroErrorDiv")).html("<p style='color:red'>"+response.data+"</p>");
					if(response.data=="email ya existe"){
						angular.element($("#registroEmail")).focus(function(){
							$(this).addClass("inputFocus");
						},function(){
							$(this).removeClass("inputFocus");
						});
					}
				};
				$http({
					method:'POST',
					url:'./intranetregistro',
					data:{"email":$scope.registroEmail,"password":$scope.registroPassword,"nombre":$scope.registroNombre,"accesibilidad":$scope.registroAccesibilidad}//encodeURIComponent("email="+$scope.registroEmail+"&password="+$scope.registroPassword+"&nombre="+$scope.registroNombre)
					//,headers: {'Content-Type': 'application/x-www-form-urlencoded'}
				}).then(registroSuccess,registroError);
				angular.element($("#registroErrorDiv")).html("<p style='color:rgba(51,124,66,1)'>procesando...</p>");
				
			}
		}
		$scope.deleteUser=function(nombre,id){
			if(window.confirm("borrar al usuario\n"+nombre+" \nemail: "+id+"?")){
				var registroSuccessDelete=function(response){
					if(response.status==200){
						getusers();
						angular.element($("#registroErrorDiv")).html("<p style='color:rgba(51,124,66,1)'>"+response.data+"</p>");
					}
					if(response.status==0){
						$window.open("./continuarcerthttps.html","_self");
					}
				};
				var registroErrorDelete=function(response){
					angular.element($("#registroErrorDiv")).html("<p style='color:red'>"+response.data+"</p>");
				};
				$http({
					method:'DELETE',
					url:'./intranetregistro',
					data:{"email":id},
					headers:{"Content-Type":"application/json;charset=utf-8"}
				}).then(registroSuccessDelete,registroErrorDelete);
			}
			
		}
		
		function getusers(){
			var registroSuccessGet=function(response){
				if(response.status==200){
					$scope.registroLista=response.data;
					//console.log($scope.registroLista);
				}
				if(response.status==0){
					$window.open("./continuarcerthttps.html","_self");
				}
			};
			var registroErrorGet=function(response){
				angular.element($("#registroErrorDiv")).html("<p style='color:red'>"+response.data+"</p>");
			};
			$http({
				method:'GET',
				url:'./intranetregistro'
			}).then(registroSuccessGet,registroErrorGet);
		}
		getusers();
		
		
	});
}());