(function(){
	var app=angular.module("local");
	
	app.controller("proyectosycapacitacionController",function($scope,$rootScope,$http,$window,$routeParams,$location,$anchorScroll,$timeout,Page,p5){//$rootScope,$window,$location,$timeout,p5
		//console.log($scope.proyectosycapacitacionTemplate,$routeParams);
		$window.scrollTo(0,0);
		if(!!$routeParams.p1) Page.setTitle($routeParams.p1+' Actuar Tolima');
		else Page.setTitle('Proyectos y capacitación | Actuar Tolima');
		
		$rootScope.fbkDivFloating=false;
		if($location.hash()!=""){
			$rootScope.proyectosycapacitacionCursosSelected=$location.hash().split("-")[0];
			$rootScope.proyectosycapacitacionCursosItemSelected=$location.hash().split("-")[1];
			$rootScope.proyectosycapacitacionTabSelected="cursos";
		}
		//console.log($rootScope.proyectosycapacitacionSelected);
		
		$scope.selectedMonth=new Date().getMonth();
		$scope.selectedMonday=new Date(new Date().getFullYear(),new Date().getMonth(),new Date().getDate()+(new Date().getDay() == 0?-6:1)-new Date().getDay());
		$scope.daysweek=[];
		for(var i=0;i<7;i++){
			$scope.daysweek[i]=new Date(new Date().getFullYear(),new Date().getMonth(),new Date().getDate()+(new Date().getDay() == 0?-6:1)-new Date().getDay()+i).getDate();;
		}
		$scope.selectedWeek=$.datepicker.iso8601Week(new Date());
		$scope.selectedYear=new Date().getFullYear();
		$scope.proyectosycapacitacionPreinscripcionNombre="";
		$scope.proyectosycapacitacionPreinscripcionEmail="";
		$scope.proyectosycapacitacionPreinscripcionCurso="";
		$scope.proyectosycapacitacionPreinscripcionTelefono="";
		$scope.proyectosycapacitacionTemplate="./templates/secondary/proyectosycapacitacion/"+$rootScope.proyectosycapacitacionTabSelected+".html";
		$scope.$on('$destroy',function(){
			//$rootScope.proyectosycapacitacionSelected="";
		});
		
		
		if(!$routeParams.p1) $routeParams.p1="cursos";
		
		/*var headSuccess=function(response){
			
			
			$scope.proyectosycapacitacionTemplate="./proyectosycapacitacion/"+$routeParams.p1+".html";
			console.log($scope.proyectosycapacitacionTemplate);
		};
		var headError=function(response){
			if(response.status===404){
				
				$scope.proyectosycapacitacionTemplate="./templates/secondary/404error.html";
				Page.setTitle('pagina no encontrada - error 404 Actuar Tolima');
				console.log($scope.proyectosycapacitacionTemplate);
			}
		};
		$http({
			method:'HEAD',
			url:"./proyectosycapacitacion/"+$routeParams.p1+".html",
			//,headers:{'Content-Type':'application/x-www-form-urlencoded'}
		}).then(headSuccess,headError);*/
		$scope.init=function(){
			
		};
		
		$scope.selectTabItem=function(id){
			$rootScope.proyectosycapacitacionTabSelected=id;
			$scope.proyectosycapacitacionTemplate="./templates/secondary/proyectosycapacitacion/"+id+".html";
			//console.log($rootScope.proyectosycapacitacionTabSelected,$scope.proyectosycapacitacionTemplate);
		}
		
		
		$scope.selectGrupo=function(grupo){
			$rootScope.proyectosycapacitacionChanged=true;
			if($rootScope.proyectosycapacitacionCursosSelected==grupo){
				$rootScope.proyectosycapacitacionCursosSelected="";
				$location.hash("");
			}else{
				$rootScope.proyectosycapacitacionCursosSelected=grupo;
				$location.hash(grupo);
			}
			var a=$window.scrollY;
			(function(){
				$window.scrollTo(0,a);
				//if(angular.element($("#"+grupo)).html().slice(angular.element($("#"+grupo)).html().length-2,angular.element($("#"+grupo)).html().length)==" -")angular.element($("#"+grupo)).html(angular.element($("#"+grupo)).html().slice(0,angular.element($("#"+grupo)).html().length-2)+" +");
				//if(angular.element($("#"+grupo)).html().slice(angular.element($("#"+grupo)).html().length-2,angular.element($("#"+grupo)).html().length)==" +")angular.element($("#"+grupo)).html(angular.element($("#"+grupo)).html().slice(0,angular.element($("#"+grupo)).html().length-2)+" -");
			}());
			
		}
		$scope.selectItem=function(titulo){
			if($rootScope.proyectosycapacitacionCursosItemSelected==titulo){
				$rootScope.proyectosycapacitacionCursosItemSelected="";
				//$location.hash("");
				
			}else{
				$rootScope.proyectosycapacitacionCursosItemSelected=titulo;
				//$location.hash($location.hash()+titulo);
				
			}
		}
		
		$scope.preinscripcion=function(){
			//console.log($scope.proyectosycapacitacionPreinscripcionNombre,$scope.proyectosycapacitacionPreinscripcionEmail,$scope.proyectosycapacitacionPreinscripcionCurso);
			/*if((!/^[áàãâäéèêëíìîïóòõôöúùûüÁÀÃÂÄÉÈÊËÍÌÎÏÓÒÕÖÔÚÙÛÜÝýỲỳŶŷŸÿỸỹçÇñÑa-zA-Z0-9.:,;%=\/*+-_?¿¡!$\s@]{0,600}$/.test($scope.proyectosycapacitacionPreinscripcioncursoSugerido) && $scope.proyectosycapacitacionPreinscripcionCurso=='sugerir')){
				angular.element($("#proyectosycapacitacionErrorDiv")).html("<p style='color:red'>campo 'curso sugerido' erroneo<br></br>máxima longitud: 600 caracteres<br></br>caracteres especiales aceptados: .:,;%=/*+-_?¿¡!$@</p>");
			}else{*/
				
				$scope.validWeek=$scope.selectedWeek>=$.datepicker.iso8601Week(new Date());
				if($scope.validWeek){
					var preinscripcionSuccess=function(response){
						if(response.status==200){
							angular.element($("#proyectosycapacitacionErrorDiv")).html("<p style='color:rgba(51,124,66,1)'>"+response.data+"</p>");
						}
						if(response.status==0){
							$window.open("./continuarcerthttps.html","_self");
						}
					};
					var preinscripcionError=function(response){
						angular.element($("#proyectosycapacitacionErrorDiv")).html("<p style='color:red'>"+response.data+"</p>");
					};
					$http({
						method:'POST',
						url:'./proyectosycapacitacionpreinscripcion',
						data:{"email":$scope.proyectosycapacitacionPreinscripcionEmail,
							"nombre":$scope.proyectosycapacitacionPreinscripcionNombre,
							"curso":$scope.proyectosycapacitacionPreinscripcionCurso,
							"telefono1":$scope.proyectosycapacitacionPreinscripcionTelefono1,
							"telefono2":$scope.proyectosycapacitacionPreinscripcionTelefono2,
							"yearweek":$scope.selectedYear.toString()+$scope.selectedWeek.toString(),
							"cursosugerido":$scope.proyectosycapacitacionPreinscripcioncursoSugerido
						}//encodeURIComponent("email="+$scope.registroEmail+"&password="+$scope.registroPassword+"&nombre="+$scope.registroNombre)
						//,headers: {'Content-Type': 'application/x-www-form-urlencoded'}
					}).then(preinscripcionSuccess,preinscripcionError);
					angular.element($("#proyectosycapacitacionErrorDiv")).html("<p style='color:rgba(51,124,66,1)'>enviando...</p>");
					
				}else{
					angular.element($("#proyectosycapacitacionErrorDiv")).html("<p style='color:red'>el curso seleccionado ya expiro</p>");
				}
			//}
			
			
		}
		
		$scope.range=["Lunes","Martes","Miércoles","Jueves","Viernes","Sábado"];
		
		function actualizarFotos(){
			$scope.fotos={};
			for(var i=0;i<$scope.range.length;i++){
				//for(var j=0;j<$rootScope.proyectosycapacitacionhorarioLista.lista.length;j++){
					$scope.fotos[$scope.range[i]+"-am"]=$rootScope.proyectosycapacitacionhorarioLista.lista.filter(function(element,index,array){return (new RegExp($scope.range[i]+"-am").test(element.horario))});
					$scope.fotos[$scope.range[i]+"-pm"]=$rootScope.proyectosycapacitacionhorarioLista.lista.filter(function(element,index,array){return (new RegExp($scope.range[i]+"-pm").test(element.horario))});
				//}
			}
			for(var i=0;i<$scope.range.length;i++){
				if($scope.fotos[$scope.range[i]+"-am"].length==0){
					$scope.fotos[$scope.range[i]+"-am"][0]={"img":"void300x200.png"};
				}
				if($scope.fotos[$scope.range[i]+"-pm"].length==0){
					$scope.fotos[$scope.range[i]+"-pm"][0]={"img":"void300x200.png"};;
				}
			}
			//console.log($scope.fotos);
		}
		function getHorario(){
			var dataSuccess2=function(response){
				response.data.lista.forEach(function(element,index,array){
					element.horario2=[];
					for(var i=0;i<element.horario.split(".").length;i++){
						element.horario2[i]={"dia":element.horario.split(".")[i].split("-")[0],"jornada":element.horario.split(".")[i].split("-")[1]};
					}
				});
				$rootScope[response.config.params["var"]]=response.data;
				actualizarFotos();
			};
			var dataError2=function(response){
				console.log(response.data);
				
			};
			$http({
				method:'GET',
				url:"./datos/horarioscapacitaciones/proyectosycapacitacionhorariolista"+$scope.selectedYear+$scope.selectedWeek+".json",
				params:{'var':'proyectosycapacitacionhorarioLista'}
			}).then(dataSuccess2,dataError2);
		}
		getHorario();
		
		
		$(".datepicker").datepicker({
			selectWeek:true,
			firstDay: 1,
			yearRange: "2016:2512",
			monthNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
			monthNamesShort: ['Ene','Feb','Mar','Abr', 'May','Jun','Jul','Ago','Sep', 'Oct','Nov','Dic'],
			dayNames: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
			dayNamesShort: ['Dom','Lun','Mar','Mié','Juv','Vie','Sáb'],
			dayNamesMin: ['Do','Lu','Ma','Mi','Ju','Vi','Sá'],
			onSelect:function(date){
				$scope.selectedWeek=$.datepicker.iso8601Week(new Date(date));
				$scope.selectedYear=new Date(date).getFullYear();
				$scope.selectedMonth=new Date(date).getMonth();
				$scope.selectedMonday=new Date(new Date(date).getFullYear(),new Date(date).getMonth(),new Date(date).getDate()+(new Date(date).getDay() == 0?-6:1)-new Date(date).getDay());
				$scope.daysweek=[];
				for(var i=0;i<7;i++){
					$scope.daysweek[i]=new Date(new Date(date).getFullYear(),new Date(date).getMonth(),new Date(date).getDate()+(new Date(date).getDay() == 0?-6:1)-new Date(date).getDay()+i).getDate();;
				}
				getHorario();
				//console.log($scope.selectedMonday,$scope.daysweek);
			}
		});
		
		
		
		
		
		
		
	});
	
	app.controller("proyectosycapacitacionHorariosTimetableController",function($scope,$rootScope,$http,$window,$routeParams,$location,$anchorScroll,$timeout,Page,p5){
		(function(){
			var timetable=new Timetable();
			timetable.setScope(7,21);
			timetable.addLocations(['Lunes','Martes','Miércoles','Jueves','Viernes']);
			//console.log(new Date($rootScope.proyectosycapacitacionhorarioLista.lista[0].horario[0].horainicio).getHours()+":"+new Date($rootScope.proyectosycapacitacionhorarioLista.lista[0].horario[0].horainicio).getMinutes());
			for(var i=0;i<$rootScope.proyectosycapacitacionhorarioLista.lista.length;i++){
				for(var j=0;j<$rootScope.proyectosycapacitacionhorarioLista.lista[i].horario.length;j++){
					timetable.addEvent($rootScope.proyectosycapacitacionhorarioLista.lista[i].curso,
						$rootScope.proyectosycapacitacionhorarioLista.lista[i].horario[j].dia,
						new Date(2015,7,17,$rootScope.proyectosycapacitacionhorarioLista.lista[i].horario[j].hi.split(":")[0],$rootScope.proyectosycapacitacionhorarioLista.lista[i].horario[j].hi.split(":")[1]),
						new Date(2015,7,17,$rootScope.proyectosycapacitacionhorarioLista.lista[i].horario[j].hf.split(":")[0],$rootScope.proyectosycapacitacionhorarioLista.lista[i].horario[j].hf.split(":")[1]),
						"./proyectosycapacitacion#manualidades"
					);
				}
			}
			
			/*timetable.addEvent('Sightseeing', 'Lunes', new Date(2015,7,17,10,43), new Date(2015,7,17,10,50), '#');
			timetable.addEvent('Zumba', 'Martes', new Date(2015,7,17,12), new Date(2015,7,17,13), '#');
			timetable.addEvent('Zumbu', 'Martes', new Date(2015,7,17,13,30), new Date(2015,7,17,15), '#');
			timetable.addEvent('Lasergaming', 'Jueves', new Date(2015,7,17,17,45), new Date(2015,7,17,19,30), '#');
			timetable.addEvent('All-you-can-eat grill', 'Viernes', new Date(2015,7,17,21), new Date(2015,7,18,1,30), '#');
			timetable.addEvent('Tokyo Hackathon Livestream', 'Miercoles', new Date(2015,7,17,12,30), new Date(2015,7,17,16,15)); // url is optional and is not used for this event
			*/
			var renderer=new Timetable.Renderer(timetable);
			renderer.draw('.timetable');
		}());
	});
	
	
	
	
	
}());
