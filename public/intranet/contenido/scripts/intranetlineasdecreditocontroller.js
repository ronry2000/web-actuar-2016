(function(){
	var app=angular.module("local");
	
	app.controller("intranetlineasdecreditoController",function($scope,$rootScope,$http,$window,$routeParams,$location,$anchorScroll,$timeout,Page,p5,Upload){//$rootScope,$window,$location,$timeout,p5
		//console.log('app.controller("intranetarchivosController"');
		Page.setTitle('Líneas de crédito | testActuar Tolima');
		
		$rootScope.fbkDivFloating=false;
		
		
		//console.log($rootScope.proyectosycapacitacionSelected);
		
		$scope.$on('$destroy',function(){
			//console.log("$scope.$on('$destroy'");
		});
		
		$scope.intranetLineaTitulo="";
		$scope.intranetLineaDesc="";
		$scope.intranetLineaSelected="";
		
		$scope.itemClicked=function(id){
			if($rootScope.intranetlineaselected!=id){
				$rootScope.intranetlineaselected=id;
				$scope.intranetLineaTitulo=id;
				var lineadesc=$rootScope.lineasdecreditoLista.lista.find(function(element,index,array){return (element.linea==id)});
				if(!lineadesc) $scope.intranetLineaDesc="";
				else $scope.intranetLineaDesc=lineadesc.desc;
			}else{
				$rootScope.intranetlineaselected="";
				$scope.intranetLineaTitulo="";
				$scope.intranetLineaDesc="";
			}
		};
		$scope.itemSelected=function(id){
			if($scope.intranetLineaSelected!=id){
				$scope.intranetLineaSelected=id;
			}else{
				$scope.intranetLineaSelected="";
			}
		};
		$scope.itemChanged=function(linea){
			$rootScope.intranetlineaselected=linea;
			var lineadesc=$rootScope.lineasdecreditoLista.lista.find(function(element,index,array){return (element.linea==linea)});
			if(!lineadesc) $scope.intranetLineaDesc="";
			else $scope.intranetLineaDesc=lineadesc.desc;
		};
		
		$scope.descFilter=function(Linea){
			if(Linea.linea==$rootScope.intranetlineaselected) return true;
			else return false;
		};
		
		$scope.agregarLinea=function(){
			var LineaSuccessPut=function(response){
				if(response.status==200){
					getLinea();
					angular.element($("#intranetLineasdecreditoErrorDiv")).html("<p style='color:rgba(51,124,66,1)'>"+response.data+"</p>");
				}
				if(response.status==0){
					$window.open("./continuarcerthttps.html","_self");
				}
			};
			var LineaErrorPut=function(response){
				angular.element($("#intranetLineasdecreditoErrorDiv")).html("<p style='color:red'>"+response.data+"</p>");
			};
			//console.log("titulo",$scope.intranetLineaTitulo,"-",$scope.intranetLineaTitulo2,"desc",$scope.intranetLineaDesc);
			$http({
				method:'PUT',
				url:'./intranetlineasdecredito',
				data:{"linea":$rootScope.intranetlineaselected,"desc":$scope.intranetLineaDesc}
			}).then(LineaSuccessPut,LineaErrorPut);
			angular.element($("#intranetLineasdecreditoErrorDiv")).html("<p style='color:rgba(51,124,66,1)'>enviando...</p>");
		}
		
		
		$scope.deleteLinea=function(titulo){
			if(window.confirm("borrar "+titulo+"?")){
				var LineaSuccessDelete=function(response){
					if(response.status==200){
						getLinea();
						angular.element($("#intranetLineasdecreditoErrorDiv")).html("<p style='color:rgba(51,124,66,1)'>"+response.data+"</p>");
					}
					if(response.status==0){
						$window.open("./continuarcerthttps.html","_self");
					}
				};
				var LineaErrorDelete=function(response){
					angular.element($("#intranetLineasdecreditoErrorDiv")).html("<p style='color:red'>"+response.data+"</p>");
				};
				$http({
					method:'DELETE',
					url:'./intranetlineasdecredito',
					data:{"linea":titulo},
					headers:{"Content-Type":"application/json;charset=utf-8"}
				}).then(LineaSuccessDelete,LineaErrorDelete);
				angular.element($("#intranetLineasdecreditoErrorDiv")).html("<p style='color:rgba(51,124,66,1)'>enviando...</p>");
			}
		}
		
		
		function getLinea(){
			var dataSuccess=function(response){
				$rootScope.lineasdecreditoLista=response.data;
			};
			var dataError=function(response){
				console.log(response);
			};
			$http({
				method:'GET',
				url:"./datos/modificables/lineasdecreditolista.json"
			}).then(dataSuccess,dataError);
		}
		getLinea();
		
		$scope.uploadArchivo=function(lista,$file){
			//console.log(lista.linea,$scope.path,$scope.lineaFile,$file);
			if(!!$file){
				Upload.upload({
					url:'./intranetlineasdecredito?linea='+lista.linea,
					method:"POST",
					data:{file:$file,sdf:"sadf"}
				}).then(function(resp){
					//console.log(resp.config,resp.data);
					angular.element($("#intranetLineasdecreditoErrorDiv")).html("<p style='color:rgba(51,124,66,1)'>"+resp.data+"</p>");
				},function(resp){
					angular.element($("#intranetLineasdecreditoErrorDiv")).html("<p style='color:red'>"+resp.data+"</p>");
				},function(evt){
					var progressPercentage=parseInt(100.0*evt.loaded/evt.total);
					angular.element($("#intranetLineasdecreditoErrorDiv")).html("<p style='color:rgba(51,124,66,1)'>"+'progreso: '+progressPercentage+'% '+evt.config.data.file.name+"</p>");
				});
			}else{
				angular.element($("#intranetLineasdecreditoErrorDiv")).html("<p style='color:red'>archivo no valido. tamaño maximo 1MB</p>");
			}
		};
		
	});
	
	
	
	
	
	
	
}());
