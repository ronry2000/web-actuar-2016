(function(){
	var app=angular.module("local");
	
	app.controller("intranetarchivosController",function($scope,$rootScope,$http,$window,$routeParams,$location,$anchorScroll,$timeout,Page,p5,Upload){//$rootScope,$window,$location,$timeout,p5
		//console.log('app.controller("intranetarchivosController"');
		Page.setTitle('Archivos | Actuar Tolima');
		
		$rootScope.fbkDivFloating=false;
		
		
		//console.log($rootScope.proyectosycapacitacionSelected);
		
		$scope.$on('$destroy',function(){
			
		});
		
		//$scope.intranetarchivosdocumentosLista=$rootScope.intranetarchivosdocumentosLista;
		$scope.selectedNode="";
		$scope.expandedNodes=[
			
		];
		$scope.selectedNodes={
			
		};
		$scope.onselected=function(node, selected, $parentNode, $index, $first, $middle, $last, $odd, $even){
			//console.log("$scope.onselected",arguments);
			if(selected){
				$scope.selectedNode=node.nombre;
				if(/documentos/.test(node.nombre) || /man_perfil_cargo/.test(node.nombre)) $scope.path=$parentNode.nombre+"/"+node.nombre+"/";
				
			}
			else{
				$scope.selectedNode="";
				delete $scope.path;
				
			}
			
		};
		
		$scope.onnodetoggle=function(node, expanded, $parentNode, $index, $first, $middle, $last, $odd, $even){
			if(expanded){
				//$scope.expandedNodes=[node];
			}else{
				//$scope.expandedNodes=[node];
			}
		};
		$scope.treeOptions={
			nodeChildren:"nodes",
			dirSelectable:true,
			isLeaf:function(node){
				return (/.pdf/i.test(node.nombre)
				|| /.doc/i.test(node.nombre)
				|| /.docx/i.test(node.nombre)
				|| /.xls/i.test(node.nombre)
				|| /.xlsx/i.test(node.nombre));
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
			return (($rootScope.user.accesibilidad=='administrador' || $rootScope.user.accesibilidad=='gestioncalidad') && (/.pdf/i.test(node.nombre) || /.doc/i.test(node.nombre) || /.docx/i.test(node.nombre) || /.xls/i.test(node.nombre) || /.xlsx/i.test(node.nombre)))
		};
		$scope.isInsertable=function(node){
			return (($rootScope.user.accesibilidad=='administrador' || $rootScope.user.accesibilidad=='gestioncalidad') && (/documentos/.test(node.nombre) || /man_perfil_cargo/.test(node.nombre)))
		};
		function getLista(){
			var dataSuccess=function(response){
				$scope.intranetarchivosdocumentosLista=response.data;
			};
			var dataError=function(response){
				console.log(response);
			};
			$http({
				method:'GET',
				url:"./datos/intranetarchivosdocumentoslista.json"
			}).then(dataSuccess,dataError);
		}
		getLista();
		
		$scope.deleteArchivo=function(node){
			if(!$scope.path || /undefined/.test($scope.path)){
				window.alert("Error: elija la ruta del archivo a borrar haciendo click a su carpeta contenedora");
			}else{
				if(window.confirm("borrar el archivo "+node.nombre+"?")){
					var dataSuccess=function(response){
						angular.element($("#archivosErrorDiv")).html("<p style='color:rgba(51,124,66,1)'>"+response.data+"</p>");
						$timeout(function(){getLista();},1000);
					};
					var dataError=function(response){
						angular.element($("#archivosErrorDiv")).html("<p style='color:red'>"+response.data+"</p>");
					};
					$http({
						method:'DELETE',
						url:"/intranetarchivos",
						data:{"path":$scope.path+node.nombre},
						headers:{"Content-Type":"application/json;charset=utf-8"}
					}).then(dataSuccess,dataError);
				}
			}
			
			//console.log(node);
		};
		$scope.uploadArchivo=function(node,$file){
			//console.log(node.nombre,$scope.path,$scope.archivosFile,$file);
			if(!!$file){
				Upload.upload({
					url:'./intranetarchivos?path='+$scope.path,
					method:"POST",
					data:{file:$file,sdf:"sadf"}
				}).then(function(resp){
					//console.log(resp.config,resp.data);
					angular.element($("#archivosErrorDiv")).html("<p style='color:rgba(51,124,66,1)'>"+resp.data+"</p>");
					$timeout(function(){getLista();},1000);
				},function(resp){ //catch error
					angular.element($("#archivosErrorDiv")).html("<p style='color:red'>"+resp.data+"</p>");
				},function(evt){
					var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
					angular.element($("#archivosErrorDiv")).html("<p style='color:rgba(51,124,66,1)'>"+'progreso: '+progressPercentage+'% '+evt.config.data.file.name+"</p>");
				});
			}else{
				angular.element($("#archivosErrorDiv")).html("<p style='color:red'>archivo no valido. tamaño maximo 200MB</p>");
			}
		};
		
		
		
	});
	
	
	
	
	
	
	
}());
