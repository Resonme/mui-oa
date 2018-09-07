document.addEventListener('plusready', function() {	
	var	url = o2o.path.createRepairType,
		msg = "添加成功！";
	var cw = plus.webview.currentWebview();
	var id = cw.repairTypeId;
	console.log(cw.repairTypeId);
	if ($.trim(id)) {
		msg = "修改成功！";
		url = o2o.path.modifyRepairType;
		$('input[name=repairTypeId]').val(id);
		o2o.request({
			url: o2o.path.getRepairTypeById,
			noWin:true,
			data: {
				repairTypeId: id
			},
			success: function(respones) {
				$('input[name=repairName]').val(respones.repairType.repairName);
			},

			fail: function(code, error) {
				o2o.prompt(error);
			}
		});
	}
	mui("body").on('tap', '#submit', function() {
		o2o.request({
			url: url,
			data: $('#form').serialize(),
			validator: "#form",
			success: function(respones) {
				//获得列表界面的webview
				var list = plus.webview.currentWebview().opener();
				//触发列表界面的自定义事件（refresh）,从而进行数据刷新
				mui.fire(list,'refresh');
				o2o.prompt('操作成功', function(){
					mui.back();
				});
			},
			fail: function(code, error) {
				o2o.prompt(error);
			}
		});
	});
	
	/*mui('body').on('tap','#close-page', function(){
		mui.openWindow({
			url: 'index.html',
			show:{
		      aniShow:"fade-in",//页面显示动画，默认为”slide-in-right“；
		    }
		});
	});*/
}, false);