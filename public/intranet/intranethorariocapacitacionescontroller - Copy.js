(function(){
	var app=angular.module("local");
	
	app.controller("intranethorariocapacitacionesController",function($scope,$rootScope,$http,$window,$routeParams,$location,$anchorScroll,$timeout,Page,p5){//$rootScope,$window,$location,$timeout,p5
		//console.log($scope.proyectosycapacitacionTemplate,$routeParams);
		Page.setTitle('Horario capacitaciones | testActuar Tolima');
		
		$rootScope.fbkDivFloating=false;
		
		
		//console.log($rootScope.proyectosycapacitacionSelected);
		
		$scope.$on('$destroy',function(){
			//$rootScope.proyectosycapacitacionSelected="";
		});
		$scope.intranetHorarioDia=[];
		$scope.intranetHorarioHorainicio=[];
		$scope.intranetHorarioHorafin=[];
		$scope.intranetHorarioCurso="";
		
		$scope.selectCurso=function(curso){
			if($rootScope.intranetHorariocursoSelected==curso){
				$rootScope.intranetHorariocursoSelected="";
			}else{
				$rootScope.intranetHorariocursoSelected=curso;
			}
		}
		$scope.range=new Array(7);
		$scope.horarioCount=1;
		$scope.agregarDia=function(n){
			$scope.horarioCount=$scope.horarioCount+n;
			console.log($scope.horarioCount,n,$scope.intranetHorarioDia,$scope.intranetHorarioHorainicio,$scope.intranetHorarioHorafin);
		}
		$scope.actualizarHorario=function(){
			var actualizarHorarioSuccess=function(response){
				angular.element($("#intranetHorariocapacitacionesErrorDiv")).html("<p style='color:rgba(51,124,66,1)'>"+response.data+"</p>");
				var dataSuccess=function(response){
					$rootScope[response.config.params["var"]]=response.data;
				};
				var dataError=function(response){
					console.log(response);
				};
				$http({
					method:'GET',
					url:"./datos/proyectosycapacitacionhorariolista.json",
					params:{'var':'proyectosycapacitacionhorarioLista'}
				}).then(dataSuccess,dataError);
			};
			var actualizarHorarioError=function(response){
				angular.element($("#intranetHorariocapacitacionesErrorDiv")).html("<p style='color:red'>"+response.data+"</p>");
			};
			$http({
				method:'PUT',
				url:"./intranetHorariocapacitaciones",
				data:{
					'curso':$scope.intranetHorarioCurso,
					"dia":JSON.stringify($scope.intranetHorarioDia.slice(0,$scope.horarioCount)),
					"horainicio":JSON.stringify($scope.intranetHorarioHorainicio.slice(0,$scope.horarioCount)),
					"horafin":JSON.stringify($scope.intranetHorarioHorafin.slice(0,$scope.horarioCount)),
				}
			}).then(actualizarHorarioSuccess,actualizarHorarioError);
			angular.element($("#intranetHorariocapacitacionesErrorDiv")).html("<p style='color:rgba(51,124,66,1)'>procesando...</p>");
		}
		
	});
	
	
	
	
	
	
	
}());
