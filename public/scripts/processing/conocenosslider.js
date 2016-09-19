(function(){

	var app=angular.module("local");
	
	
	app.factory('conocenosSliderSketchFac',["$rootScope","$window","$location","$timeout",'p5',function($rootScope,$window,$location,$timeout,p5){
		return function(p){
			var navigationGraphic,
			minimapGraphic,
			navigationScale,
			minimapScale,
			canvasWidth,
			canvasHeight,
			graphicWidth,
			graphicHeight,
			translationX,
			translationY,
			mouseOver,
			rotacion,
			img=[],
			objects,
			scaling,
			containerCanvas,
			fontNormal,
			sliderMillis,
			difMillis,
			sliderTime,
			i0,
			i1,
			translateDirection,
			sliderOn,
			noRender;
			
			p.preload=function(){
				for(var i=0;i<$rootScope.conocenosSliderFotos.fotos.length;i++){
					img[i]=p.loadImage("fotos/conocenos/"+$rootScope.conocenosSliderFotos.fotos[i]);
				}
				//fontNormal=p.loadFont("css/fuentes/lsn.ttf");
			}
			p.setup=function(){
				p.imageMode(p.CENTER);
				p.background(255);
				canvasWidth=angular.element($("#conocenosSliderDiv")).outerWidth();
				canvasHeight=angular.element($("#conocenosSliderDiv")).outerHeight();
				translationX=0;
				translationY=0;
				mouseOver=false;
				if(angular.element($("body")).outerWidth()<800){console.log(angular.element($("body")).outerWidth(),angular.element($("#principal")).outerWidth(),angular.element($("#conocenosSliderDiv")).outerHeight());
					graphicWidth=angular.element($("#principal")).outerWidth();
					graphicHeight=angular.element($("#conocenosSliderDiv")).outerHeight();
				}else{
					graphicWidth=canvasWidth;
					graphicHeight=canvasHeight;
				}
				objects=[];
				i0=img.length-1;
				i1=0;
				sliderMillis=0;
				sliderTime=7000;
				translateDirection=1;
				sliderOn=true;
				noRender=false;
				$rootScope.animationOn=false;
				
				
				containerCanvas=p.createCanvas(canvasWidth,canvasHeight,"p2d");
				containerCanvas.parent('conocenosSliderCanvasDiv');
				containerCanvas.id("containerCanvas");
				containerCanvas.mouseOver(function(){
					sliderOn=false;
				});
				containerCanvas.mouseOut(function(){sliderOn=true;});
				/*containerCanvas.mouseClicked(function(){
					$window.location.href="./contacto";
					//$location.path("./contacto");
				});*/
				
				
				navigationGraphic=p.createGraphics(graphicWidth,graphicHeight,'p2d');
				navigationGraphic.imageMode(p.CENTER);
				
				/*img[0].mouseClicked(function(){
						console.log("wee");
					});*/
				
				//smooth();
				//noLoop();
				
				//window.alert(p.pixelDensity()+"  "+p.displayDensity());
				//p.pixelDensity(p.displayDensity());
				//window.alert(p.pixelDensity()+"  "+p.displayDensity());
				//p.pixelDensity(1);
				//window.alert(p.pixelDensity()+"  "+p.displayDensity());
				p.textStyle(p.BOLD);
				p.textSize(50);
				//p.textFont(fontNormal);
				p.frameRate(1);
				//$timeout(function(){$rootScope.animationOn=true;sliderMillis=p.millis();},sliderTime);
				
			}
			
			p.draw=function(){//console.log("conocenosslider",p.frameRate().toFixed(1),$rootScope.animationOn && p.focused && $location.path()=="/conocenos");
				
				difMillis=p.millis()-sliderMillis;
				if(difMillis>sliderTime && sliderOn && p.focused){
					if(i0>=img.length-1)i0=0;
					else i0=i0+1;
					if(i1>=img.length-1)i1=0;
					else i1=i1+1;
					
					sliderMillis=p.millis();
					noRender=true;
					$rootScope.animationOn=false;
					if($rootScope.animationOn && p.focused && $location.path()=="/conocenos") p.frameRate(20);
					difMillis=0;
					p.loop();
				}
				
				if(noRender){
					p.background(255,255,255,0);
					navigationGraphic.background(255,255,255,0);
				}
				else{
					p.background(255,255,255,255);
					navigationGraphic.background(255,255,255,255);
				}
				drawScene(navigationGraphic);
				p.image(navigationGraphic,canvasWidth/2, canvasHeight/2);
				
				
				//p.text(p.frameRate().toFixed(1), 12, 40);
				
			}
			
			function drawScene(pg){
				//pg.push();
				pg.imageMode(p.CORNER);
				if(noRender){pg.tint(255,0);noRender=false;}
				else pg.tint(255,255);
				//pg.image(img[i1],0,0,img[i1].width,img[i1].height,0,0,canvasWidth,canvasHeight);//pg.image(img[i1], pg.width/2, pg.height/2);
				pg.image(img[i1],0,0,img[i1].width,img[i1].height,0,0,img[i1].width/p.pixelDensity(),canvasHeight/p.pixelDensity());
				if($rootScope.animationOn && difMillis<500 && p.focused && $location.path()=="/conocenos"){
					pg.push();
					pg.imageMode(p.CENTER);
					pg.translate(translateDirection*(difMillis/(sliderTime/(pg.width*3/4))),0);
					pg.tint(255,255-difMillis/((500)/255));
					pg.image(img[i0], pg.width/2, pg.height/2);//pg.image(img[i0], 0, 0,img[i0].width, img[i0].height,canvasWidth/2,canvasHeight/2,img[i0].width*1.4, img[i0].height*1.4);
					pg.pop();
					
				}else{
					//p.frameRate(1);
				}//pg.pop();
				pg.imageMode(p.CENTER);
				
				
			}
			function drawAxis(pg){
				pg.strokeWeight(2);
				pg.stroke(255, 0, 0);
				pg.line(0, 0, 100, 0);
				pg.text("X", 100 + 5, 0);
				pg.stroke(0, 0, 255);
				pg.line(0, 0, 0, 100 );
				pg.text("Y", 0, 100 + 15);
			}
			
			
			function actualizarInnerHTML(id,valor){
				document.getElementById(id).innerHTML=valor;
			}
			function setFrameRate(n){
				p.frameRate(n);
			}
			
			function setRotacion(n){
				rotacion=n*PI/180;
			}
			
			p.mouseDragged=function(){
				/*if(mouseOver){
					console.log(navigationGraphic.positionX);
					var X=parseInt(translationX+((p.winMouseX-p.pwinMouseX)/navigationScale));
					//console.log(X , X*navigationScale ,-(canvasWidth-graphicWidth*navigationScale)/2);
					//console.log(X*navigationScale <= -(canvasWidth-graphicWidth*navigationScale)/2 , X*navigationScale >= -(canvasWidth-graphicWidth*navigationScale)/2);
					if(X*navigationScale <= -(canvasWidth-graphicWidth*navigationScale)/2 && X*navigationScale >= (canvasWidth-graphicWidth*navigationScale)/2){
						translationX=X;
					}
					var Y=parseInt(translationY+((p.winMouseY-p.pwinMouseY)/navigationScale));
					console.log(Y*navigationScale <= -(canvasHeight-graphicHeight*navigationScale)/2, Y*navigationScale >= (canvasHeight-graphicHeight*navigationScale)/2);
					console.log(translationY,Y*navigationScale, -(canvasHeight-graphicHeight*navigationScale)/2, navigationScale);
					if(Y*navigationScale <= -(canvasHeight-graphicHeight/navigationScale) && Y*navigationScale >= (canvasHeight-graphicHeight*navigationScale)/2){
						translationY=Y;
					}
					//console.log(canvasWidth,X,navigationScale,graphicWidth*navigationScale,(winMouseY-pwinMouseY));
				}*/
			}
			p.mouseWheel=function(e){
				/*if(mouseOver){
					//console.log(e);
					if(e.detail!=0){var delta=(e.detail%(0.0989898989898/navigationScale));}
					else{var delta=(e.deltaY%(0.0989898989898/navigationScale));}
					console.log(delta,navigationScale,(navigationScale-delta)*graphicWidth,canvasWidth);
					console.log(navigationGraphic.positionX);
					if((navigationScale-delta)*graphicWidth >= canvasWidth && (navigationScale-delta)*graphicHeight >= canvasHeight && navigationScale-delta <= 8 ){
						navigationGraphic.translate(canvasWidth/2,canvasHeight/2);
						navigationGraphic.scale(1/navigationScale);
						navigationScale=navigationScale-delta;
						navigationGraphic.scale(navigationScale);
						navigationGraphic.translate(-canvasWidth/2,-canvasHeight/2);
						////console.log(translationX*navigationScale ,Math.round(canvasWidth-graphicWidth*navigationScale));
						//if(translationX*navigationScale <= Math.round(canvasWidth-graphicWidth*navigationScale)){
						//	translationX+=Math.round(canvasWidth-graphicWidth*navigationScale-translationX*navigationScale);
						//}
						//if(translationY*navigationScale <= Math.round(canvasHeight-graphicWidth*navigationScale)){
						//	translationY+=Math.round(canvasHeight-graphicHeight*navigationScale-translationY*navigationScale);
						//}
					}
				}*/	
			}
			
			p.windowResized=function(){
				canvasWidth=document.getElementById("conocenosSliderDiv").offsetWidth;
				canvasHeight=document.getElementById("conocenosSliderDiv").offsetHeight;
				p.resizeCanvas(canvasWidth,canvasHeight);
				navigationGraphic.resize(canvasWidth,canvasHeight);
			}
			
		};
		
		
		
	
	}]);
	
}());