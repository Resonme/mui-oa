var dataDeviceSetting = (function(){

	var path = {
		imageShot:"/peopleCounting/peopleCountingManage/imageShot.do",
		setPeopleCounting:"/peopleCounting/peopleCountingManage/setPeopleCounting.do"
	};
	var w = $('#imgbox').width();
	var h = $('#imgbox').height();
	var leftMove = function(){
		var _move=false;//移动标记
		var _x,_y;//鼠标离控件左上角的相对位置
		$("#left").on('touchstart', function(evt){
		    var e = evt.originalEvent.targetTouches[0]; 
			_move=true;
			_x=e.pageX-parseInt($(".dataline").css("left"));
			//_y=e.pageY-parseInt($(".in-moveDiv-box").css("top"));
			$(".dataline").fadeTo(20, 0.7);//点击后开始拖动并透明显示
		});
		$(".dataline").on('touchmove', function(evt){
		    var e = evt.originalEvent.targetTouches[0]; 
			if(_move){
				var x=e.pageX-_x;//移动时根据鼠标位置计算控件左上角的绝对位置
				//var y=e.pageY-_y;
				if(x < 0){
					x = 0;
				}
				if( x > w/2-50){
					x = w/2-50;
				}
				$(".dataline").css({left:x});//控件新位置
			}
		}).on('touchend', function(){
			if(_move){
				$(".dataline").fadeTo("fast", 1);//松开鼠标后停止移动并恢复成不透明
			}
			_move=false;
		});
	};
	
	var rightMove = function(){
		var _move=false;//移动标记
		var _x,_y;//鼠标离控件左上角的相对位置
		$("#right").on('touchstart', function(evt){
		    var e = evt.originalEvent.targetTouches[0]; 
			_move=true;
			_x = (w-e.pageX)-parseInt($(".dataline").css("right"));
			//_y=e.pageY-parseInt($(".in-moveDiv-box").css("top"));
			$(".dataline").fadeTo(20, 0.7);//点击后开始拖动并透明显示
		});
		$(".dataline").on('touchmove', function(evt){
		    var e = evt.originalEvent.targetTouches[0]; 
			if(_move){
				var x =(w-e.pageX) - _x;//移动时根据鼠标位置计算控件左上角的绝对位置
				//var y=e.pageY-_y;
				if(x<0){
					x=0;
				}
				if( x > (w/2-50)){
					x = w/2-50;
				}
				$(".dataline").css({right: x});//控件新位置
			}
		}).on('touchend', function(){
			if(_move){
				$(".dataline").fadeTo("fast", 1);//松开鼠标后停止移动并恢复成不透明
			}
			_move=false;
		});
	};
	
	var topMove = function(){
		var _move=false;//移动标记
		var _x,_y;//鼠标离控件左上角的相对位置
		$("#hand").on('touchstart', function(evt){
		    var e = evt.originalEvent.targetTouches[0]; 
			_move = true;
			_y = e.pageY-parseInt($(".linebg").position().top);
			$(".linebg").fadeTo(20, 0.7);//点击后开始拖动并透明显示
		});
		$(".linebg").on('touchmove', function(evt){
		    var e = evt.originalEvent.targetTouches[0]; 
		    if(_move){
		    	var y = e.pageY - _y;
				if(y < 6){
					y = 6;
				}
				if(y > h-6){
					y = h-6;
				}
				$(".linebg").css({top: y});//控件新位置
			}
		}).on('touchend', function(){
			if(_move){
				$(".linebg").fadeTo("fast", 1);//松开鼠标后停止移动并恢复成不透明
			}
			_move=false;
			//getPOS();
		});
	};
	
	var getPOS = function(){
		var x1 = parseInt($('.dataline').css('left')),
			x2 = w - parseInt($('.dataline').css('right')),
			y = $('.linebg').position().top;
			console.log(x1,x2,y);
		return [ [x1, y], [x2,y] ]
	};
	


	document.addEventListener('plusready', function() {
		Request({
			url: path.imageShot,
			success: function(respones) {
			
			}, 

			fail: function(code, error) {
				o2o.prompt(error);
			}
		});
	});
	
	leftMove();
	rightMove(); 
	topMove(); 
		

})();
