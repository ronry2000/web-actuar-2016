(function(){
	var app=angular.module("local");
	
	app.controller("intranetofertalaboralController",function($scope,$rootScope,$http,$window,$routeParams,$location,$anchorScroll,$timeout,Page,p5,Upload){//$rootScope,$window,$location,$timeout,p5
		//console.log('app.controller("intranetarchivosController"');
		Page.setTitle('Oferta laboral | Actuar Tolima');
		
		$rootScope.fbkDivFloating=false;
		
		
		//console.log($rootScope.proyectosycapacitacionSelected);
		
		$scope.$on('$destroy',function(){
			//console.log("$scope.$on('$destroy'");
		});
		
		$scope.intranetOfertaTitulo="";
		$scope.intranetOfertaDesc="";
		$scope.intranetOfertaSelected="";
		$scope.selectedNode="";
		$scope.expandedNodes=[
			
		];
		$scope.selectedNodes={
			
		};
		
		$scope.onselected=function(node, selected, $parentNode, $index, $first, $middle, $last, $odd, $even){
			//console.log("$scope.onselected",arguments);
			if(selected){
				$scope.selectedNode=node.nombre;
				if(!/uploads/.test(node.nombre) && !/trabajaconnosotros/.test(node.nombre) && !/archivos actuar tolima/.test(node.nombre) && !/.pdf/i.test(node.nombre) && !/.doc/i.test(node.nombre) && !/.docx/i.test(node.nombre))$scope.path=$parentNode.nombre+"/"+node.nombre+"/";
			}
			else{
				$scope.selectedNode="";
				delete $scope.path;
			}
			
		};
		$scope.itemSelected=function(id){
			if($scope.intranetOfertaSelected!=id){
				$scope.intranetOfertaSelected=id;
			}else{
				$scope.intranetOfertaSelected="";
			}
		};
		$scope.onnodetoggle=function(node, expanded, $parentNode, $index, $first, $middle, $last, $odd, $even){
			//console.log("$scope.onnodetoggle",arguments);
		};
		
		$scope.treeOptions={
			nodeChildren:"nodes",
			dirSelectable:true,
			isLeaf:function(node){
				return /.pdf/i.test(node.nombre)
				|| /.doc/i.test(node.nombre)
				|| /.docx/i.test(node.nombre);
			},
			injectClasses:{
				ul:"a1",
				li:"a2",
				liSelected:"a7",
				iExpanded:"a3",
				iCollapsed:"a4",
				iLeaf:"a5",
				label:"a6",
				labelSelected:"a8"
			}
		};
		
		$scope.isErasable=function(node){
			return (($rootScope.user.accesibilidad=='administrador' || $rootScope.user.accesibilidad=='gestionhumana') && (/.pdf/i.test(node.nombre) || /.doc/i.test(node.nombre) || /.docx/i.test(node.nombre)))
		};
		
		function getLista(){
			var dataSuccess=function(response){
				$scope.intranetarchivosuploadsLista=response.data;
			};
			var dataError=function(response){
				console.log(response);
			};
			$http({
				method:'GET',
				url:"./datos/intranetarchivosuploadslista.json"
			}).then(dataSuccess,dataError);
		}
		getLista();
		
		$scope.itemClicked=function(id){
			if($rootScope.intranetofertaselected!=id){
				$rootScope.intranetofertaselected=id;
				$scope.intranetOfertaTitulo=id;
				var ofertadesc=$rootScope.convocatoriasLista.lista.find(function(element,index,array){return (element.titulo==id)});
				if(!ofertadesc) $scope.intranetOfertaDesc="";
				else $scope.intranetOfertaDesc=ofertadesc.desc;
			}else{
				$rootScope.intranetofertaselected="";
				$scope.intranetOfertaTitulo="";
				$scope.intranetOfertaDesc="";
			}
		};
		
		$scope.itemChanged=function(oferta){
			$rootScope.intranetofertaselected=oferta;
			var ofertadesc=$rootScope.convocatoriasLista.lista.find(function(element,index,array){return (element.titulo==oferta)});
			if(!ofertadesc) $scope.intranetOfertaDesc="";
			else $scope.intranetOfertaDesc=ofertadesc.desc;
		};
		
		$scope.descFilter=function(oferta){
			if(oferta.titulo==$rootScope.intranetofertaselected) return true;
			else return false;
		};
		
		$scope.agregarOferta=function(){
			var ofertaSuccessPut=function(response){
				if(response.status==200){
					getOferta();
					$timeout(function(){getLista();},1000);
					angular.element($("#intranetofertalaboralErrorDiv")).html("<p style='color:rgba(51,124,66,1)'>"+response.data+"</p>");
				}
				if(response.status==0){
					$window.open("./continuarcerthttps.html","_self");
				}
			};
			var ofertaErrorPut=function(response){
				angular.element($("#intranetofertalaboralErrorDiv")).html("<p style='color:red'>"+response.data+"</p>");
			};
			//console.log("titulo",$scope.intranetOfertaTitulo,"-",$scope.intranetOfertaTitulo2,"desc",$scope.intranetOfertaDesc);
			$http({
				method:'PUT',
				url:'./intranetofertalaboral',
				data:{"titulo":$rootScope.intranetofertaselected,"desc":$scope.intranetOfertaDesc}
			}).then(ofertaSuccessPut,ofertaErrorPut);
			angular.element($("#intranetofertalaboralErrorDiv")).html("<p style='color:rgba(51,124,66,1)'>enviando...</p>");
		}
		
		
		$scope.deleteOferta=function(titulo){
			if(window.confirm("borrar "+titulo+"?")){
				var ofertaSuccessDelete=function(response){
					if(response.status==200){
						getOferta();
						$timeout(function(){getLista();},1000);
						angular.element($("#intranetofertalaboralErrorDiv")).html("<p style='color:rgba(51,124,66,1)'>"+response.data+"</p>");
					}
					if(response.status==0){
						$window.open("./continuarcerthttps.html","_self");
					}
				};
				var ofertaErrorDelete=function(response){
					angular.element($("#intranetofertalaboralErrorDiv")).html("<p style='color:red'>"+response.data+"</p>");
				};
				$http({
					method:'DELETE',
					url:'./intranetofertalaboral',
					data:{"titulo":titulo},
					headers:{"Content-Type":"application/json;charset=utf-8"}
				}).then(ofertaSuccessDelete,ofertaErrorDelete);
				angular.element($("#intranetofertalaboralErrorDiv")).html("<p style='color:rgba(51,124,66,1)'>enviando...</p>");
			}
		}
		
		
		function getOferta(){
			var dataSuccess=function(response){
				$rootScope.convocatoriasLista=response.data;
			};
			var dataError=function(response){
				console.log(response);
			};
			$http({
				method:'GET',
				url:"./datos/modificables/convocatoriaslista.json"
			}).then(dataSuccess,dataError);
		}
		getOferta();
		
		$scope.deleteArchivo=function(nombre){
			if(!$scope.path || /undefined/.test($scope.path)){
				window.alert("Error: elija la ruta del archivo a borrar haciendo click a su carpeta contenedora");
			}else{
				if(window.confirm("borrar el archivo "+nombre+"?")){
					var dataSuccess=function(response){
						angular.element($("#intranetofertalaboralErrorDiv")).html("<p style='color:rgba(51,124,66,1)'>"+response.data+"</p>");
						$timeout(function(){getLista();},1000);
					};
					var dataError=function(response){
						angular.element($("#intranetofertalaboralErrorDiv")).html("<p style='color:red'>"+response.data+"</p>");
					};
					$http({
						method:'DELETE',
						url:"/intranetofertalaboral?deletearchivo=true",
						data:{"path":$scope.path+nombre},
						headers:{"Content-Type":"application/json;charset=utf-8"}
					}).then(dataSuccess,dataError);
				}
			}
			
			//console.log(nombre);
		};
	});
	
	
	
	
	
	
	
}());
