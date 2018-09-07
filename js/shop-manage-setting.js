document.addEventListener('plusready', function() {	
	var cw = plus.webview.currentWebview();
	var account = cw.account;
	var shopId = cw.shopId;
	plus.webview.currentWebview().opener().close();
	$('#phone').html(account.phone);
	$('#customerName').html(account.nickName);
	$('#accountId').val(account.accountId);
	if(account.headImage && $.trim(account.headImage)){
		o2o.request({
			url : o2o.path.getQiniuUrl,
			data : {
				url:account.headImage
			},
			success: function(respones) {
				$('#customerHead').attr('src', respones.downloadUrl);
			},
			fail: function(code, error) {
				o2o.prompt(error);
			}
		});
	}
	
	$('.setPerson').on('click', function(){
		var type = $(this).data('type');
		o2o.confirm('确认此操作？', function(msg){
			if(msg=="yes"){
				o2o.request({
					url: o2o.path.customerCreateShopAndAccount,
					data:{
						type: type,
						shopId:shopId,
						accountId:$('#accountId').val()
					},
					success: function(respones) {
						o2o.prompt('绑定成功！');
						mui.back();
					},
					fail: function(code, error) {
						o2o.prompt(error); 
					}
				});
			}
		});
		
	});
}, false);