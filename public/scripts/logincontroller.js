(function(){
	var app=angular.module("local");

	app.controller("loginController",function($scope,$rootScope,$http,$window,$routeParams,$cookies,$timeout,$location,Page){
		$window.scrollTo(0,0);
		Page.setTitle('Login | Actuar Tolima');
		
		if(!!$cookies.get("user")) $rootScope.user=JSON.parse($cookies.get("user"));
		
		$scope.loginEmail="";
		$scope.loginPassword="";
		//console.log(JSON.stringify($cookies.getAll()));
		
		(function(){
			if(!!$cookies.get("session")){
				$scope.loginMensaje=$rootScope.user.email;
				angular.element($("#loginErrorDiv")).html("<p style='color:rgba(51,124,66,1);margin:5px;font-family:appBold;'>"+$rootScope.user.email+"</p>");
				angular.element($("#loginTable")).css("display","none");
				angular.element($("#logoutButton")).css("display","inline");
				angular.element($("#intranetButton")).css("display","inline");
				$scope.loginEmail="a@a.aa";
				$scope.loginPassword="asdasd";
		}
		}());
		
		
		
		$scope.login=function(){
			//console.log($scope.loginEmail,$scope.loginPassword);
			var loginSuccess=function(response){
				//console.log(response.data);
				if(response.status==200){
					if(response.data.correcto){
						angular.element($("#loginErrorDiv")).html("<p style='color:rgba(51,124,66,1);font-family:appBold;'>usuario: "+JSON.parse(response.data.msg).email+"</p>");
						angular.element($("#loginTable")).css("display","none");
						angular.element($("#logoutButton")).css("display","inline");
						angular.element($("#intranetButton")).css("display","inline");
						$location.url("/intranet");
						$rootScope.user=JSON.parse(response.data.msg);
					}else{
						angular.element($("#loginErrorDiv")).html("<p style='color:red;font-family:appBold;'>"+response.data.msg+"</p>");
						if(response.datamsg=="contraseña incorrecta") document.getElementById("loginPassword").focus();
						if(response.data=="usuario no encontrado") document.getElementById("loginEmail").focus();
					}
				}
				if(response.status==0){
					$window.open("./continuarcerthttps.html","_self");
				}
			};
			var loginError=function(response){
				angular.element($("#loginErrorDiv")).html("<p style='color:red;font-family:appBold;'>"+response.data+"</p>");
				console.log("loginerror"+JSON.stringify(arguments));
				if(response.status==0){
					$window.open("./continuarcerthttps.html","_self");
				}
			};
			$http({
				method:'POST',
				url:'./login',
				data:{"email":$scope.loginEmail,"password":$scope.loginPassword}//encodeURIComponent("usuario="+$scope.loginUsuario+"&password="+$scope.loginPassword)
				//,headers: {'Content-Type': 'application/x-www-form-urlencoded'}
			}).then(loginSuccess,loginError);
			angular.element($("#loginErrorDiv")).html("<p style='color:rgba(51,124,66,1);font-family:appBold;'>procesando...</p>");
			
		};
		
		$scope.logout=function(){
			var logoutSuccess=function(response){
				//console.log(response);
				if(response.status==200){
						$scope.loginEmail="";
						$scope.loginPassword="";
						angular.element($("#loginErrorDiv")).html("<p style='color:rgba(51,124,66,1);font-family:appBold;'>"+response.data+"</p>");
						angular.element($("#loginTable")).css("display","inline");
						angular.element($("#logoutButton")).css("display","none");
						angular.element($("#intranetButton")).css("display","none");
				}
				if(response.status==0){
					$window.open("./continuarcerthttps.html","_self");
				}
			};
			var logoutError=function(response){
				angular.element($("#loginErrorDiv")).html("<p style='color:red;font-family:appBold;'>"+response.data+"</p>");
				console.log("logouterror"+JSON.stringify(arguments));
				if(response.status==0){
					$window.open("./continuarcerthttps.html","_self");
				}
			};
			$http({
				method:'POST',
				url:'./logout',
				//data:{"email":$scope.loginEmail,"password":$scope.loginPassword}//encodeURIComponent("usuario="+$scope.loginUsuario+"&password="+$scope.loginPassword)
				//,headers: {'Content-Type': 'application/x-www-form-urlencoded'}
			}).then(logoutSuccess,logoutError);
			angular.element($("#loginErrorDiv")).html("<p style='color:rgba(51,124,66,1);font-family:appBold;'>procesando...</p>");
		}
		
		
		//$scope.init();
	});

}());