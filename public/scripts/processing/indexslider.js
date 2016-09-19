(function(){

	var app=angular.module("local");
	
	
	app.factory('indexSliderSketchFac',["$rootScope","$window","$location","$timeout",'p5',function($rootScope,$window,$location,$timeout,p5){
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
			noRender,
			resumeTimer,
			hidebuttonsTimer,
			leftButton,
			rightButton;
			
			p.preload=function(){
				for(var i=0;i<$rootScope.indexSliderFotos.fotos.length;i++){
					img[i]=p.loadImage("fotos/"+$rootScope.indexSliderFotos.fotos[i].img);
					//console.log(img,"fotos/"+$rootScope.indexSliderFotos.fotos[i].img);
					//img[i]=p.createImg("/fotos/"+$rootScope.indexSliderFotos.fotos[i].img);
					
				}
				//fontNormal=p.loadFont("css/fuentes/lsn.ttf");
			}
			p.setup=function(){
				p.imageMode(p.CENTER);
				p.background(255);
				canvasWidth=angular.element($("#indexSliderDiv")).outerWidth();
				canvasHeight=angular.element($("#indexSliderDiv")).outerHeight();
				translationX=0;
				translationY=0;
				mouseOver=false;
				//if(angular.element($("body")).outerWidth()<800){
				//	graphicWidth=angular.element($("#principal")).outerWidth();
				//	graphicHeight=angular.element($("#indexSliderDiv")).outerHeight();
				//}else{
					graphicWidth=canvasWidth;
					graphicHeight=canvasHeight;
				//}
				objects=[];
				i0=img.length-1;
				i1=0;
				sliderMillis=0;
				sliderTime=7000;
				translateDirection=1;
				sliderOn=true;
				noRender=false;
				$rootScope.animationOn=false;
				
				//console.log(canvasWidth, canvasHeight);
				containerCanvas=p.createCanvas(canvasWidth,canvasHeight,"p2d");
				containerCanvas.parent('indexSliderCanvasDiv');
				containerCanvas.id("indexCanvas");
				//containerCanvas.mouseOver(function(){				});
				//containerCanvas.mouseOut(function(){			});
				containerCanvas.mouseClicked(function(){
					//if(translateDirection>0) $window.location.href="./link"+i1;
					//else $window.location.href="./link"+i0;
					if(translateDirection>0) $window.open($rootScope.indexSliderFotos.fotos[i1].link,"_self");
					else $window.open($rootScope.indexSliderFotos.fotos[i0].link,"_self");
					//$location.url("./linkfoto"+i0);
					//$window.location="./linkfoto"+i0;
				});
				containerCanvas.mouseMoved(function(){
					//console.log(p.mouseX,canvasWidth,p.mouseY,canvasHeight);
					leftButton.show();
					rightButton.show();
					sliderOn=false;
					
					$timeout.cancel(hidebuttonsTimer);
					hidebuttonsTimer=$timeout(function(){
						if(!mouseOver){
							leftButton.hide();
							rightButton.hide();
						}
					},2000);
					$timeout.cancel(resumeTimer);
					resumeTimer=$timeout(function(){
						if(!mouseOver){
							sliderOn=true;
							$rootScope.animationOn=false;
							//p.loop();
							//sliderMillis=p.millis();
							//difMillis=0;
						}
					},sliderTime);
				});
				
				
				//navigationGraphic=p.createGraphics(graphicWidth,graphicHeight,'p2d');
				//navigationGraphic.imageMode(p.CENTER);
				//console.log(navigationGraphic);
				//navigationGraphic.mouseClicked(function(){									});
				//navigationGraphic.mouseOver(function(){mouseOver=true;console.log(mouseOver);});
				//navigationGraphic.mouseOut(function(){mouseOver=false;console.log(mouseOver);});
				
				
				
				leftButton=p.createImg('img/leftbutton.png');
				leftButton.parent("indexSliderCanvasDiv");
				leftButton.style("left:0px");
				leftButton.style("position:absolute");
				leftButton.style("display:inline");
				leftButton.style("top:0px");
				leftButton.style("float:left");
				leftButton.style("width:10%");
				leftButton.style("height:400px");
				leftButton.style("cursor:pointer");
				leftButton.mousePressed(function(){
					if(translateDirection<0){
						if(i0<=0)i0=img.length-1;
						else i0=i0-1;
						if(i1<=0)i1=img.length-1;
						else i1=i1-1;
					}
					sliderMillis=p.millis();
					difMillis=0;
					translateDirection=-1;
					sliderOn=false;
					$rootScope.animationOn=false;
					if($rootScope.animationOn && p.focused && ($location.path()=="/" || $location.path()=="/index" || $location.path()=="/main")) p.frameRate(20);
					p.loop();
				});
				leftButton.mouseOver(function(){mouseOver=true;});
				leftButton.mouseOut(function(){
					mouseOver=false;
					$timeout.cancel(resumeTimer);
					resumeTimer=$timeout(function(){
						leftButton.hide();
						rightButton.hide();
						sliderOn=true;
						$rootScope.animationOn=false;
					},sliderTime);
				});
				
				rightButton=p.createImg('img/rightbutton.png');
				rightButton.parent("indexSliderCanvasDiv");
				rightButton.style("right:0px");
				rightButton.style("position:absolute");
				leftButton.style("display:inline");
				rightButton.style("top:0px");//+Math.ceil(angular.element($("#indexSliderDiv")).position().top)+"px"				
				rightButton.style("float:right");
				rightButton.style("width:10%");
				rightButton.style("height:400px");
				rightButton.style("cursor:pointer");
				rightButton.mousePressed(function(){
					if(translateDirection>0){
						if(i0>=img.length-1)i0=0;
						else i0=i0+1;
						if(i1>=img.length-1)i1=0;
						else i1=i1+1;
					}
					sliderMillis=p.millis();
					difMillis=0;
					translateDirection=1;
					sliderOn=false;
					$rootScope.animationOn=false;
					if($rootScope.animationOn && p.focused && ($location.path()=="/" || $location.path()=="/index" || $location.path()=="/main")) p.frameRate(20);
					p.loop();
				});
				rightButton.mouseOver(function(){mouseOver=true;});
				rightButton.mouseOut(function(){
					mouseOver=false;
					$timeout.cancel(resumeTimer);
					resumeTimer=$timeout(function(){
						leftButton.hide();
						rightButton.hide();
						sliderOn=true;
						$rootScope.animationOn=false;
					},sliderTime);
				});
				
				leftButton.hide();
				rightButton.hide();
				
				/*animationButton=p.createButton('asfd');
				animationButton.style("position:absolute");
				animationButton.style("top:"+Math.ceil(angular.element($("#indexSliderDiv")).position().top)+400+"px");
				animationButton.style("right:50%");
				animationButton.style("float:right");
				animationButton.mousePressed(function(){
					$rootScope.animationOn=!$rootScope.animationOn;
				});*/
				
				
				
				
				
				
				
				
				//p.cursor(p.HAND);
				p.textStyle(p.BOLD);
				p.textSize(50);
				//p.textFont(fontNormal);
				p.frameRate(1);
				
			}
			p.draw=function(){//console.log("indexslider",p.frameRate().toFixed(1),$rootScope.animationOn && p.focused && ($location.path()=="/" || $location.path()=="/index"));
				
				difMillis=p.millis()-sliderMillis;
				if(difMillis>sliderTime && sliderOn && p.focused){
					if(translateDirection>0){
						if(i0>=img.length-1)i0=0;
						else i0=i0+1;
						if(i1>=img.length-1)i1=0;
						else i1=i1+1;
					}else{
						if(i0<=0)i0=img.length-1;
						else i0=i0-1;
						if(i1<=0)i1=img.length-1;
						else i1=i1-1;
					}
					
					sliderMillis=p.millis();
					noRender=true;
					$rootScope.animationOn=false;
					if($rootScope.animationOn && p.focused && ($location.path()=="/" || $location.path()=="/index" || $location.path()=="/main")) p.frameRate(20);
					difMillis=0;
					//p.loop();
					//p.resetMatrix();
					//console.log(navigationGraphic,containerCanvas,img[i0]);
				}
				if(noRender){
					p.background(255,255,255,0);
					//navigationGraphic.background(255,255,255,0);
				}
				else{
					p.background(255,255,255,255);
					//navigationGraphic.background(255,255,255,255);
				}
				drawScene();//navigationGraphic
				//p.image(navigationGraphic,canvasWidth/2, canvasHeight/2);
				//p.image(img[0],canvasWidth/2, canvasHeight/2);
				
				
				//p.text(p.frameRate().toFixed(1), 12, 40);
				
			}
			function drawScene(){//pg
				//pg.push();
				//pg.imageMode(p.CORNER);
				if(noRender){p.tint(255,0);noRender=false;}
				else p.tint(255,255);
				if(translateDirection>0) p.image(img[i1],0,0,img[i1].width,img[i1].height,(canvasWidth/2)/p.pixelDensity(),(canvasHeight/2)/p.pixelDensity(),img[i1].width/p.pixelDensity(),img[i1].height/p.pixelDensity());//pg.image(img[i1], pg.width/2, pg.height/2);
				else p.image(img[i0],0,0,img[i0].width,img[i0].height,(canvasWidth/2)/p.pixelDensity(),(canvasHeight/2)/p.pixelDensity(),img[i0].width/p.pixelDensity(),img[i0].height/p.pixelDensity());//pg.image(img[i0], pg.width/2, pg.height/2);
				//console.log($rootScope.animationOn && difMillis<1000 && p.focused && ($location.path()=="/" || $location.path()=="/index"));
				if($rootScope.animationOn && difMillis<1000 && p.focused && ($location.path()=="/" || $location.path()=="/index" || $location.path()=="/main")){ 
					//p.push();
					//pg.imageMode(p.CENTER);
					//p.translate(translateDirection*(difMillis/(sliderTime/(canvasWidth))),0);
					p.tint(255,255-difMillis/((1000)/255));
					if(translateDirection>0)p.image(img[i0],0,0,img[i0].width,img[i0].height,(canvasWidth/2)/p.pixelDensity(),(canvasHeight/2)/p.pixelDensity(),img[i0].width/p.pixelDensity(),img[i0].height/p.pixelDensity());//pg.image(img[i0], pg.width/2, pg.height/2);//pg.image(img[i0], 0, 0,img[i0].width, img[i0].height,canvasWidth/2,canvasHeight/2,img[i0].width*1.4, img[i0].height*1.4);
					else p.image(img[i1],0,0,img[i1].width,img[i1].height,(canvasWidth/2)/p.pixelDensity(),(canvasHeight/2)/p.pixelDensity(),img[i1].width/p.pixelDensity(),img[i1].height/p.pixelDensity());//pg.image(img[i1], pg.width/2, pg.height/2);
					//p.pop();
					
				}else{
					p.frameRate(1);
				}
				//pg.pop();
				//pg.imageMode(p.CENTER);
				
				
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
				
			}
			p.mouseWheel=function(e){
					
			}
			
			p.windowResized=function(){
				canvasWidth=document.getElementById("indexSliderDiv").offsetWidth;
				canvasHeight=document.getElementById("indexSliderDiv").offsetHeight;
				p.resizeCanvas(canvasWidth,canvasHeight);
				navigationGraphic.resize(canvasWidth,canvasHeight);
				//leftButton.style("top:"+Math.ceil(angular.element($("#indexSliderDiv")).position().top)+"px");
				//rightButton.style("top:"+Math.ceil(angular.element($("#indexSliderDiv")).position().top)+"px");
			}
			
		};
		
		
		
	
	}]);
	
}());