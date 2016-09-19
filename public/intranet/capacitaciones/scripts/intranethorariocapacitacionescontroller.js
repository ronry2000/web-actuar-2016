(function(){
	var app=angular.module("local");
	
	app.controller("intranethorariocapacitacionesController",function($scope,$rootScope,$http,$window,$routeParams,$location,$anchorScroll,$timeout,Page,p5,Upload){//$rootScope,$window,$location,$timeout,p5
		Page.setTitle('Horario de capacitaciones | Actuar Tolima');
		
		$rootScope.fbkDivFloating=false;
		
		
		//console.log($rootScope.proyectosycapacitacionSelected);
		
		$scope.$on('$destroy',function(){
			//$rootScope.proyectosycapacitacionSelected="";
		});
		$scope.selectedWeek=$.datepicker.iso8601Week(new Date());
		$scope.selectedYear=new Date().getFullYear();
		$scope.intranetHorarioDia=[];
		$scope.intranetHorarioJornada=[];
		$scope.intranetHorarioCurso="";
		//$scope.intranetHorarioFile=null;
		
		$scope.selectCurso=function(curso){
			if($rootScope.intranetHorariocursoSelected==curso){
				$rootScope.intranetHorariocursoSelected="";
			}else{
				$rootScope.intranetHorariocursoSelected=curso;
			}
		}
		$scope.range=new Array(10);
		$scope.horarioCount=1;
		$scope.agregarDia=function(n){
			if($scope.horarioCount+n<11 && $scope.horarioCount+n>0)$scope.horarioCount=$scope.horarioCount+n;
			//console.log($scope.horarioCount,n,$scope.intranetHorarioDia,$scope.intranetHorarioJornada);
		}
		
		$("#datepicker").datepicker({
			selectWeek:true,
			firstDay: 1,
			yearRange: "2016:2512",
			monthNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
			monthNamesShort: ['Ene','Feb','Mar','Abr', 'May','Jun','Jul','Ago','Sep', 'Oct','Nov','Dic'],
			dayNames: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
			dayNamesShort: ['Dom','Lun','Mar','Mié','Juv','Vie','Sáb'],
			dayNamesMin: ['Do','Lu','Ma','Mi','Ju','Vi','Sá'],
			onSelect:function(date){
				//console.log(date,$.datepicker.iso8601Week(new Date(date)),new Date(date).getFullYear());
				$scope.selectedWeek=$.datepicker.iso8601Week(new Date(date));
				$scope.selectedYear=new Date(date).getFullYear();
				var dataSuccess2=function(response){
					if(response.data.lista.length==0) $rootScope[response.config.params["var"]]={};
					else{
						response.data.lista.forEach(function(element,index,array){
							element.horario2=[];
							for(var i=0;i<element.horario.split(".").length;i++){
								element.horario2[i]={"dia":element.horario.split(".")[i].split("-")[0],"jornada":element.horario.split(".")[i].split("-")[1]};
							}
						});
						$rootScope[response.config.params["var"]]=response.data;
					}
				};
				var dataError2=function(response){
					angular.element($("#intranetHorariocapacitacionesErrorDiv")).html("<p style='color:red'>"+response.data+"</p>");
				};
				$http({
					method:'GET',
					url:"./datos/horarioscapacitaciones/proyectosycapacitacionhorariolista"+$scope.selectedYear+$scope.selectedWeek+".json",
					params:{'var':'proyectosycapacitacionhorarioLista'}
				}).then(dataSuccess2,dataError2);
			}
		});
		
		$scope.actualizarHorario=function(){
			//console.log("sdfaasf",$scope.intranetHorariocapacitacionesForm.intranetHorarioFile.$valid,$scope.up.intranetHorarioFile,$scope);
			if($scope.intranetHorariocapacitacionesForm.intranetHorarioFile.$valid && $scope.up.intranetHorarioFile){
				//console.log("sdfaasf",$scope.intranetHorariocapacitacionesForm.intranetHorarioFile.$valid,$scope.up.intranetHorarioFile);
				Upload.upload({
					url:'./intranethorariocapacitaciones?curso='+$scope.intranetHorarioCurso+
					"&dia="+JSON.stringify($scope.intranetHorarioDia.slice(0,$scope.horarioCount))+
					"&jornada="+JSON.stringify($scope.intranetHorarioJornada.slice(0,$scope.horarioCount))+
					"&yearweek="+$scope.selectedYear+$scope.selectedWeek,
					method:"PUT",
					data:{file:$scope.up.intranetHorarioFile,"sdf":$scope.trabajaconnosotrosEmail},
					//query:{"email":$scope.trabajaconnosotrosEmail}//pass file as data, should be user ng-model
				}).then(function(response){
					angular.element($("#intranetHorariocapacitacionesErrorDiv")).html("<p style='color:rgba(51,124,66,1)'>"+response.data+"</p>");
					getcursos();
				},function(response){ //catch error
					angular.element($("#intranetHorariocapacitacionesErrorDiv")).html("<p style='color:red'>"+response.data+"</p>");
				},function(evt){
					var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
					angular.element($("#intranetHorariocapacitacionesErrorDiv")).html("<p style='color:rgba(51,124,66,1)'>"+'progreso: '+progressPercentage+'% '+evt.config.data.file.name+"</p>");
				});
			}
			
			
			
			
			
			
			
			/*
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
					"curso":$scope.intranetHorarioCurso,
					"dia":JSON.stringify($scope.intranetHorarioDia.slice(0,$scope.horarioCount)),
					"horainicio":JSON.stringify($scope.intranetHorarioHorainicio.slice(0,$scope.horarioCount)),
					"horafin":JSON.stringify($scope.intranetHorarioHorafin.slice(0,$scope.horarioCount)),
					"borrar":$scope.borrar
				}
			}).then(actualizarHorarioSuccess,actualizarHorarioError);
			angular.element($("#intranetHorariocapacitacionesErrorDiv")).html("<p style='color:rgba(51,124,66,1)'>procesando...</p>");
			*/
		}
		$scope.deleteHorario=function(id){
			if(window.confirm("borrar el horario de "+id+"?")){
				var registroSuccessDelete=function(response){
					if(response.status==200){
						getcursos();
						angular.element($("#intranetHorariocapacitacionesErrorDiv")).html("<p style='color:rgba(51,124,66,1)'>"+response.data+"</p>");
					}
					if(response.status==0){
						$window.open("./continuarcerthttps.html","_self");
					}
				};
				var registroErrorDelete=function(response){
					angular.element($("#intranetHorariocapacitacionesErrorDiv")).html("<p style='color:red'>"+response.data+"</p>");
				};
				$http({
					method:'DELETE',
					url:'./intranethorariocapacitaciones',
					data:{"curso":id,"yearweek":$scope.selectedYear.toString()+$scope.selectedWeek.toString()},
					headers:{"Content-Type":"application/json;charset=utf-8"}
				}).then(registroSuccessDelete,registroErrorDelete);
			}
			
		}
		
		
		function getcursos(){
			var dataSuccess2=function(response){
				response.data.lista.forEach(function(element,index,array){
					element.horario2=[];
					for(var i=0;i<element.horario.split(".").length;i++){
						element.horario2[i]={"dia":element.horario.split(".")[i].split("-")[0],"jornada":element.horario.split(".")[i].split("-")[1]};
					}
				});
				$rootScope[response.config.params["var"]]=response.data;
			};
			var dataError2=function(response){
				angular.element($("#intranetHorariocapacitacionesErrorDiv")).html("<p style='color:red'>"+response.data+"</p>");
			};
			$http({
				method:'GET',
				url:"./datos/horarioscapacitaciones/proyectosycapacitacionhorariolista"+$scope.selectedYear+$scope.selectedWeek+".json",
				params:{'var':'proyectosycapacitacionhorarioLista'}
			}).then(dataSuccess2,dataError2);
		}
		
	});
	
	
	
	
	
	
	
}());
