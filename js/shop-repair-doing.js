document.addEventListener('plusready', function() {
	var backButtonPress = 0;
	var imgs = {};
	plus.key.removeEventListener("backbutton", function(){});
	plus.key.addEventListener("backbutton", function() {
		backButtonPress++;
		if (backButtonPress > 1) {
			plus.runtime.quit();
		} else {
			plus.nativeUI.toast("再按一次退出应用程序！");
		}
		setTimeout(function() {
			backButtonPress = 0;
		}, 1000);
	}, false); 
	var shopRepairDo = (function(){
		var path = {
			//设备保修解决
			messageModifyRepair: "/company/repairManage/modifyRepair.do",
	        /*获取token*/
			getToken: "/web/cloudManage/getToken.do"
	    };
		var submit = function(){
			var cw = plus.webview.currentWebview();
			var shopId = cw.shopId,
			cardType = cw.cardType,
			repairId = cw.repairId,
			image = "";
			$.each(imgs, function(key, value){
				image+=value+",";
			});
			if( !$.trim($('textarea[name=repairResult]').val()) ){
				o2o.prompt('请输入现场描述！');
				return;
			}
			if($.trim(image)){
				image = image.substring(0, image.length-1);
			}else{
				o2o.prompt('请选择图片！');
				return;
			}
			var data = $('#form').serialize();
			data += "&image="+image;
			data += "&repairId="+repairId;
			data += "&cardType="+cardType;
			data += "&_repairTime="+new Date().Format('yyyy-MM-dd hh:mm:ss');
			o2o.request({
				url: path.messageModifyRepair,
				data: data,
				success: function(respones) {
					var pa = plus.webview.currentWebview().opener().opener();
					plus.webview.currentWebview().opener().close(); 
					mui.fire(pa,'changeState');
					o2o.prompt('操作成功');
					mui.back();
				},
				fail: function(code, error) {
					o2o.prompt(error);
				}
			});
		};
		
		
		var files=[];
		// 拍照添加文件
		function appendByCamera(){
			plus.camera.getCamera().captureImage(function(path){
				plus.io.resolveLocalFileSystemURL(path, function(entry) {
	                var localurl = entry.toLocalURL(); //把拍照的目录路径，变成本地url路径，例如file:///........之类的。 
	                plus.zip.compressImage({
							src: localurl,
							dst: localurl,
							width:"50%",
							quality:30,
							overwrite:true,
							format:"jpg"
						},
						function() {
							 plus.gallery.save(localurl, function () {
								console.log( "保存图片到相册成功" );
								appendFile(localurl);
							} ); 
						},function(error) {
							o2o.prompt("图片压缩失败!");
					});
	            });
			});	
		}
		var up = function(img, time){
			setTimeout(function(){appendFile(img);}, 1000*time);
		};
		// 从相册添加文件
		function appendByGallery(){
			/*plus.gallery.pick(function(p){
		        appendFile(p);
		    });*/
		    plus.gallery.pick( function(e){
		    	if(e.files.length > (4 - Object.keys(imgs).length) ){
		    		o2o.prompt('最多还能选择'+ (4-Object.keys(imgs).length) +'张图片！');
		    		return;
		    	}
		    	for(var i = 0; i < e.files.length; i++){
	    			var img = e.files[i];
		    		up(img, i);
		    	}
		    },function(e){},{filter:"image",multiple:true});
		}
		 
		// 添加文件
		var index=1;
		function appendFile(p){
			
	        var key = new Date().getTime(); 
			$('#select').before(
			  '<li class="mui-table-view-cell mui-media mui-col-xs-3">'+
	        	'<span class="icon-close" data-key="'+key+'">删除</span>'+
	          	'<a>'+
	              '<img img class="mui-media-object" data-preview-src="" data-preview-group="1" src="'+p+'"/>'+
	            '</a>'+
		      '</li>'
			);
			$('.mui-media img').css('height', $('.mui-media img').width()+"px");
			$('.mui-media>span.icon-close').off('click').on('click', function(){
				var keyR = $(this).data('key');
				$(this).parent().remove();
				var newImgs = {};
				$.each(imgs, function(key, value){
					if(keyR != key){
						newImgs[key] = value;
					}
				});
				imgs = newImgs;
				console.log(imgs );
			});
			o2o.request({
	            url: path.getToken,
	            noWin: true,
	            success: function(respones){
	            	plus.io.resolveLocalFileSystemURL( p, function( entry ) {
						//可通过entry对象操作test.html文件 
						entry.file( function(f){
							var fileReader = new plus.io.FileReader();
							fileReader.readAsDataURL(f);
							fileReader.onloadend = function(evt) {
								var pic = evt.target.result.substring(evt.target.result.indexOf(',')+1, evt.target.result.length )
								Qiniu_upload(pic, respones.token, key);
							} 
						} );
					}, function ( e ) {
						alert( "Resolve file URL failed: " + e.message );
					} );
	            	
	            },
	            fail: function(code, respones){
	                o2o.prompt(respones);
	            }
	        });
			
			index++;
			//empty.style.display="none";
		}
		// 产生一个随机数
		function getUid(){
			return Math.floor(Math.random()*100000000+10000000).toString();
		}
		var xhr, waiting;
		var Qiniu_upload = function(f, token, key) {
        	var	waiting = plus.nativeUI.showWaiting("正在上传第"+(Object.keys(imgs).length+1)+"张图片！");
			var url = "http://up.qiniu.com/putb64/-1"
			if(!xhr){
	        	xhr = new XMLHttpRequest();
			}
	        xhr.open('POST', url, true);
	        xhr.setRequestHeader("Content-Type", "image/jpeg");
			xhr.setRequestHeader("Authorization", "UpToken "+token);
			xhr.send(f);
	        var taking;
	        xhr.upload.addEventListener("progress", function(evt) {
	            if (evt.lengthComputable) {
	                var nowDate = new Date().getTime();
	                taking = nowDate - startDate;
	                var x = (evt.loaded) / 1024;
	                var y = taking / 1000;
	                var uploadSpeed = (x / y);
	                var formatSpeed;
	                if (uploadSpeed > 1024) {
	                    formatSpeed = (uploadSpeed / 1024).toFixed(2) + "Mb\/s";
	                } else {
	                    formatSpeed = uploadSpeed.toFixed(2) + "Kb\/s";
	                } 
	                var percentComplete = Math.round(evt.loaded * 100 / evt.total);
	            }
	        }, false);
	
	        xhr.onreadystatechange = function(response) {
	        	waiting.close();
	        	console.log(xhr);
	            if (xhr.readyState == 4 && xhr.status == 200 && xhr.responseText != "") {
	                var blkRet = JSON.parse(xhr.responseText);
	                imgs[key] = 'http://qiniujiexino2o.51icare.cn/'+blkRet.key;
	            } else if (xhr.status != 200 && xhr.responseText) {
					o2o.prompt('图片上传失败！');
	            }
	        };
  			//xhr.setRequestHeader("Authorization", "UpToken  填写你从服务端获取的上传token");
	        startDate = new Date().getTime();
	        //xhr.send(formData);
	    };
		
		$('#submit').on('click', function(){
			submit(); 
		});
		$('#select').on('click', function(){
			if(imgs && Object.keys(imgs).length >= 4){
				o2o.prompt('最多只能上传4张图片'); 
				return;
			}
			plus.nativeUI.actionSheet( {title:"选择方式",cancel:"取消",buttons:[{title:"拍照"},{title:"相册"}]}, function(e){
				if(e.index==1){
					appendByCamera();
				}else if(e.index==2){
					appendByGallery();
				}
			} );
		});
	
	}());	
});
