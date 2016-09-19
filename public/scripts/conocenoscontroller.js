(function(){
	var app=angular.module("local");
	
	app.controller("conocenosController",function($scope,$rootScope,$http,$window,$routeParams,$sce,Page){
		$window.scrollTo(0,0);
		Page.setTitle('Quienes somos | Actuar Tolima');
		
		$rootScope.fbkDivFloating=false;
		
		$scope.$on('$destroy',function(){
			for(var i=0;i<players.length;i++){players[i].dispose();} players=[];
			//angular.element($("#conocenosSliderDiv")).remove();
		});
		$scope.activeVideoDiv="";
		$scope.videos=[
			{url:"https://www.youtube.com/embed/fUV68CN4VRs",titulo:"Institucional abril 2011"}
		];
		
		$scope.trustSrc=function(src){
			return $sce.trustAsResourceUrl(src);
		}
		$scope.selectItem=function(id){
			if($rootScope.conocenosSelected==id){
				$rootScope.conocenosSelected="";
			}else{
				$rootScope.conocenosSelected=id;
			}
			
		}
		var players=[];
		var logoActuar=angular.element("<img />");
		logoActuar.css("vertical-align","bottom");
		logoActuar.css("width","30px");
		logoActuar.attr("src","./img/videoicon.png");
		
		var videoIcon=angular.element("<img />");
		videoIcon.css("vertical-align","bottom");
		videoIcon.css("width","30px");
		videoIcon.attr("src","./img/videoicon.png");
		
		var playingGif=angular.element("<img />");
		playingGif.attr("src","./img/playing.gif");
		playingGif.css("width","200px");
		//playingGif.css("position","absolute");
		playingGif.css("left","4px");
		playingGif.css("top","2px");
		playingGif.css("float","left");
		
		var clearDiv=angular.element("<div />");
		clearDiv.addClass("separador");
		
		function clearElement(e){
			while(e.children().length>1){
				//console.log("sd",e,e.children().length,e.children());
				e.children()[1].remove();
			}
			//console.log("sd",e,e.children().length,e.children());
		}
		
		$scope.videoDivClicked=function(id){
			
			//console.log(players);
			var element=angular.element($("#"+id));
			//console.log(id,element.children().length,element.children());
			
			if($scope.activeVideoDiv==id){
				clearElement(element);
				$scope.activeVideoDiv="";
				for(var i=0;i<players.length;i++) {players[i].dispose();} players=[];
				
			}else{
				//element.children()[0].append(playingGif);
				$scope.activeVideoDiv=id;
				
				//clearElement(angular.element($("#premios")));
				clearElement(angular.element($("#institucional")));
				//clearElement(angular.element($("#ceremonia")));
				/*for(var i=0;i<$scope.videos;i++){
					var video=angular.element("<iframe />");
					video.css("max-width","640px");
					video.css("max-height","480px");
					video.css("width","100%");
					video.css("height","480px");
					video.attr("src",$scope.trustSrc($scope.videos[i].url));
					video.attr("frameborder","0");
					video.attr("allowfullscreen","");
					var videoDesc=angular.element("<p />");
					videoDesc.append(videoIcon);
					videoDesc.html($scope.videos[i].titulo);
					videoDesc.css("font-size","75%");
					videoDesc.css("margin","0px");
					videoDesc.css("margin-top","20px");
					videoDesc.css("color","rgba(255,255,255,1)");
					element.append(videoDesc);
					element.append(video);
				}*/
				/*for(var i=0;i<players.length;i++) {players[i].dispose();} players=[];
				for(var i=0;i<$rootScope.videosLista.videos.conocenos[id].videos.length;i++){
					var vHeight,vWidth,marginLeft;
					if(element.outerWidth()>640){
						vWidth="640px";
						vHeight="480px";
						//if(element.outerWidth()>704)marginLeft="5%";//640+10%
						//else marginLeft=element.outerWidth()-640+"px";
					}else{
						vWidth=element.outerWidth()+"px";
						vHeight=element.outerWidth()*0.666+"px";
					}
					var video=angular.element("<video />");
					//video.css("margin","0 auto");
					//video.css("width",vWidth);
					//video.css("margin-left","10%");
					video.attr("id",$rootScope.videosLista.videos.conocenos[id].videos[i].split(".")[0]);
					video.bind("contextmenu",function(e){e.preventDefault();e.stopPropagation();},false);
					var videoDiv=angular.element("<div />");
					//videoDiv.css("display","inline");
					videoDiv.css("width",vWidth);
					videoDiv.css("height",vHeight);
					//videoDiv.css("width","80%");
					//videoDiv.css("height","auto");
					//videoDiv.css("max-width","640px");
					//videoDiv.css("max-height","480px");
					videoDiv.css("display","inline-block");
					//videoDiv.css("margin-left",marginLeft);
					//video.css("float","left");
					videoDiv.append(video);
					var videoDesc=angular.element("<p />");
					videoDesc.append(videoIcon);
					videoDesc.html(videoDesc.html()+$rootScope.videosLista.videos.conocenos[id].desc[i]);
					videoDesc.css("font-size","75%");
					videoDesc.css("margin","0px");
					videoDesc.css("margin-top","20px");
					//videoDesc.css("margin-left",marginLeft);
					videoDesc.css("color","rgba(255,255,255,1)");
					//videoDesc.css("font-family","sans-serif");
					//videoDesc.css("width","10%");
					element.append(videoDesc);
					element.append(videoDiv);
					var clearDivClone=clearDiv.clone()
					if(i==$rootScope.videosLista.videos.conocenos[id].videos.length-1) clearDivClone.css("background","rgba(0,0,0,0)");
					element.append(clearDivClone);
					var setup={"width":vWidth,"height":vHeight,"class":"video-js vjs-default-skin","controls":true,"allowFullScreen":true};//,"techOrder":["flash","html5"] , "type":"video/mp4" , "src":"./videos/"+mp4s[i] , "preload": "auto"
					players[i] = videojs($rootScope.videosLista.videos.conocenos[id].videos[i].split(".")[0],setup,function(){
						//this.play(); // if you don't trust autoplay for some reason
						
						this.on('ended',function(e){
							console.log('awww...over so soon?');
						});
						this.on('play',function(e){
							if(this.isFullscreen)this.exitFullscreen;
						});
						this.on('error',function(e){
							//window.alert(JSON.stringify(e));
							//window.alert(e.target.error+"  "+e.code);
							var code = e.target.error ? e.target.error.code : e.code;
							var messages={1: "MEDIA_ERR_ABORTED - intente otravez",2: "MEDIA_ERR_NETWORK - intente otravez",3: "MEDIA_ERR_DECODE",4: "MEDIA_ERR_SRC_NOT_SUPPORTED",5: "MEDIA_ERR_ENCRYPTED(Chrome)",unknown: "undefined error: intente abrir con otro navegador.(firefox, opera, uc browser, dolphin browser, android browser)"};
							var alerta=angular.element('<h1 />');
							alerta.css("color","red");
							alerta.html(messages[code] || messages['unknown']);
							window.alert(alerta.html());
							clearElement(this.el());
							this.el().append(alerta);
							//alert(messages[code] || messages['unknown']);
						});
					});
					players[i].poster("./videos/conocenos/"+$rootScope.videosLista.videos.conocenos[id].videos[i].split(".")[0]+".jpg");
					players[i].src([
							{type:"video/mp4",src:"./videos/conocenos/"+$rootScope.videosLista.videos.conocenos[id].videos[i]},
							{type:"video/webm",src:"./videos/conocenos/"+$rootScope.videosLista.videos.conocenos[id].videos[i].split(".")[0]+".webm"}
						]);
					players[i].addClass("video-js vjs-default-skin");
					//element.append(players[i]);
				}*/
			}
			
			
			
			
		}
		
	});
	
}());