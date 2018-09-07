document.addEventListener('plusready', function() {	
	var url = o2o.path.createShopType;
		
	var cw = plus.webview.currentWebview();
	var id = cw.shopTypeId;
	
	if ($.trim(id)) {
		url = o2o.path.modifyShopType;
		$('input[name=shopTypeId ]').val(id);
		o2o.request({
			url: o2o.path.getShopTypeById,
			noWin:true,
			data: {
				shopTypeId: id
			},
			success: function(respones) {
				$('input[name=typeName]').val(respones.shopType.typeName);
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
}, false);