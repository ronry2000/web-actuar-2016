(function(){
	var app=angular.module("local");
	
	app.controller("intranetcapacitacionesController",function($scope,$rootScope,$http,$window,$routeParams,$location,$anchorScroll,$timeout,Page,p5,Upload){//$rootScope,$window,$location,$timeout,p5
		//console.log($scope.proyectosycapacitacionTemplate,$routeParams);
		Page.setTitle('Cursos | Actuar Tolima');
		
		$rootScope.fbkDivFloating=false;
		
		
		//console.log($rootScope.proyectosycapacitacionSelected);
		
		$scope.$on('$destroy',function(){
			//$rootScope.proyectosycapacitacionSelected="";
		});
		$scope.intranetCursoArea="";
		$scope.intranetCursoGrupo="";
		$scope.intranetCapacitacionesFotoHover="";
		$scope.intranetCapacitacionesHover="";
		
		$scope.areaFilter=function(area){
			if(area.area==$rootScope.intranetCursoArea) return true;
			else return false;
		};
		$scope.fotoHovered=function(id){
			if($scope.intranetCapacitacionesFotoHover!=id){
				$scope.intranetCapacitacionesFotoHover=id;
			}else{
				$scope.intranetCapacitacionesFotoHover="";
			}
		};
		$scope.itemHovered=function(id){
			if($scope.intranetCapacitacionesHover!=id){
				$scope.intranetCapacitacionesHover=id;
			}else{
				$scope.intranetCapacitacionesHover="";
			}
		};
		$scope.itemChanged=function(area){
			$rootScope.intranetCursoArea=area;
			var areagrupo=$rootScope.proyectosycapacitacionLista.lista.find(function(element,index,array){return (element.area==area)});
			//console.log(areagrupo,$rootScope.intranetCursoArea!='',$rootScope.intranetCursoArea,area);
			if(!areagrupo) $scope.intranetCursoGrupo="";
			else $scope.intranetCursoGrupo=areagrupo.grupo;
		};
		
		$scope.agregarCurso=function(){
			var capacitacionesSuccessPut=function(response){
				if(response.status==200){
					getCursos();
					angular.element($("#intranetCapacitacionesErrorDiv")).html("<p style='color:rgba(51,124,66,1)'>"+response.data+"</p>");
				}
				if(response.status==0){
					$window.open("./continuarcerthttps.html","_self");
				}
			};
			var capacitacionesErrorPut=function(response){
				angular.element($("#intranetCapacitacionesErrorDiv")).html("<p style='color:red'>"+response.data+"</p>");
			};
			console.log({"curso":$scope.intranetCursoTitulo,"area":$scope.intranetCursoArea,"grupo":$scope.intranetCursoGrupo});
			$http({
				method:'PUT',
				url:'./intranetcapacitaciones',
				data:{"curso":$scope.intranetCursoTitulo,"area":$scope.intranetCursoArea,"grupo":$scope.intranetCursoGrupo}
			}).then(capacitacionesSuccessPut,capacitacionesErrorPut);
			angular.element($("#intranetCapacitacionesErrorDiv")).html("<p style='color:rgba(51,124,66,1)'>enviando...</p>");
		}
		
		
		$scope.deleteCurso=function(curso){
			if(window.confirm("borrar el curso "+curso+"?")){
				var capacitacionesSuccessDelete=function(response){
					if(response.status==200){
						getCursos();
						angular.element($("#intranetCapacitacionesErrorDiv")).html("<p style='color:rgba(51,124,66,1)'>"+response.data+"</p>");
					}
					if(response.status==0){
						$window.open("./continuarcerthttps.html","_self");
					}
				};
				var capacitacionesErrorDelete=function(response){
					angular.element($("#intranetCapacitacionesErrorDiv")).html("<p style='color:red'>"+response.data+"</p>");
				};
				$http({
					method:'DELETE',
					url:'./intranetcapacitaciones',
					data:{"curso":curso,"area":$scope.intranetCursoArea},
					headers:{"Content-Type":"application/json;charset=utf-8"}
				}).then(capacitacionesSuccessDelete,capacitacionesErrorDelete);
				angular.element($("#intranetCapacitacionesErrorDiv")).html("<p style='color:rgba(51,124,66,1)'>enviando...</p>");
			}
		}
		$scope.deleteCursosugerido=function(curso,nombre){
			if(window.confirm("borrar el curso sugerido"+curso+"?")){
				var capacitacionesSuccessDelete=function(response){
					if(response.status==200){
						getCursossugeridos();
						angular.element($("#intranetCapacitacionesErrorDiv")).html("<p style='color:rgba(51,124,66,1)'>"+response.data+"</p>");
					}
					if(response.status==0){
						$window.open("./continuarcerthttps.html","_self");
					}
				};
				var capacitacionesErrorDelete=function(response){
					angular.element($("#intranetCapacitacionesErrorDiv")).html("<p style='color:red'>"+response.data+"</p>");
				};
				$http({
					method:'DELETE',
					url:'./intranetcapacitaciones?deletecursosugerido=true',
					data:{"curso":curso,"nombre":nombre},
					headers:{"Content-Type":"application/json;charset=utf-8"}
				}).then(capacitacionesSuccessDelete,capacitacionesErrorDelete);
				angular.element($("#intranetCapacitacionesErrorDiv")).html("<p style='color:rgba(51,124,66,1)'>enviando...</p>");
			}
		}
		$scope.deleteArea=function(area){
			if(window.confirm("borrar el area "+area+"?")){
				var capacitacionesSuccessDelete=function(response){
					if(response.status==200){
						getCursos();
						angular.element($("#intranetCapacitacionesErrorDiv")).html("<p style='color:rgba(51,124,66,1)'>"+response.data+"</p>");
					}
					if(response.status==0){
						$window.open("./continuarcerthttps.html","_self");
					}
				};
				var capacitacionesErrorDelete=function(response){
					angular.element($("#intranetCapacitacionesErrorDiv")).html("<p style='color:red'>"+response.data+"</p>");
				};
				$http({
					method:'DELETE',
					url:'./intranetcapacitaciones?deletearea=true',
					data:{"area":area},
					headers:{"Content-Type":"application/json;charset=utf-8"}
				}).then(capacitacionesSuccessDelete,capacitacionesErrorDelete);
				angular.element($("#intranetCapacitacionesErrorDiv")).html("<p style='color:rgba(51,124,66,1)'>enviando...</p>");
			}
		}
		
		
		function getCursos(){
			var dataSuccess=function(response){
				$rootScope.proyectosycapacitacionLista=response.data;
			};
			var dataError=function(response){
				console.log(response);
			};
			$http({
				method:'GET',
				url:"./datos/modificables/proyectosycapacitacionlista.json"
			}).then(dataSuccess,dataError);
		}
		function getCursossugeridos(){
			var dataSuccess=function(response){
				$rootScope.proyectosycapacitacionCursossugeridos=response.data;
			};
			var dataError=function(response){
				console.log(response);
			};
			$http({
				method:'GET',
				url:"./datos/proyectosycapacitacioncursossugeridos.json"
			}).then(dataSuccess,dataError);
		}
		
		$scope.uploadFoto=function($file){
			//console.log($scope.capacitacionesFile,$file);
			if(!$scope.intranetCursoGrupo){
				window.alert("Error: elija un area")
			}else if(!!$file){
				Upload.upload({
					url:'./intranetcapacitaciones?grupo='+$scope.intranetCursoGrupo,
					method:"POST",
					data:{file:$file,sdf:"sadf"}
				}).then(function(resp){
					//console.log(resp.config,resp.data);
					angular.element($("#intranetCapacitacionesErrorDiv")).html("<p style='color:rgba(51,124,66,1)'>"+resp.data+"</p>");
					$timeout(function(){getFotos();},1000);
				},function(resp){ //catch error
					angular.element($("#intranetCapacitacionesErrorDiv")).html("<p style='color:red'>"+resp.data+"</p>");
				},function(evt){
					var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
					angular.element($("#intranetCapacitacionesErrorDiv")).html("<p style='color:rgba(51,124,66,1)'>"+'progreso: '+progressPercentage+'% '+evt.config.data.file.name+"</p>");
				});
			}else{
				angular.element($("#intranetCapacitacionesErrorDiv")).html("<p style='color:red'>archivo no valido. tamaño maximo 1MB</p>");
			}
		};
		
		$scope.deleteFoto=function(foto){
			if(window.confirm("borrar la foto "+foto+"?")){
				var capacitacionesSuccessDelete=function(response){
					if(response.status==200){
						$timeout(function(){getFotos();},1000);
						angular.element($("#intranetCapacitacionesErrorDiv")).html("<p style='color:rgba(51,124,66,1)'>"+response.data+"</p>");
					}
					if(response.status==0){
						$window.open("./continuarcerthttps.html","_self");
					}
				};
				var capacitacionesErrorDelete=function(response){
					angular.element($("#intranetCapacitacionesErrorDiv")).html("<p style='color:red'>"+response.data+"</p>");
				};
				$http({
					method:'DELETE',
					url:'./intranetcapacitaciones?deletefoto=true',
					data:{"foto":foto},
					headers:{"Content-Type":"application/json;charset=utf-8"}
				}).then(capacitacionesSuccessDelete,capacitacionesErrorDelete);
				angular.element($("#intranetCapacitacionesErrorDiv")).html("<p style='color:rgba(51,124,66,1)'>enviando...</p>");
			}
		}
		
		
		function getFotos(){
			var dataSuccess=function(response){
				$rootScope.proyectosycapacitacionSliderFotos=response.data;
			};
			var dataError=function(response){
				console.log(response);
			};
			$http({
				method:'GET',
				url:"./datos/proyectosycapacitacionsliderfotos.json"
			}).then(dataSuccess,dataError);
		}
		
	});
	
	
	
	
	
	
	
}());
