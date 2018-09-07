document.addEventListener('plusready', function() {	
	var getSearchCustomers = function(name) {
		$('#customersContent').html('');
		var data ={
			pageSize:30,
			pageIndex:1
		};
		if($.trim(name)){
			data.name = name;
		}
		o2o.request({
			url: o2o.path.shopQueryCustomerBasic,
			noWin:true,
			data: data,
			success: function(respones) { 
				var form = "";
				if(respones.list&&respones.list.length>0){
					$(respones.list).each(function() {
						form += '<div class="mui-input-row mui-radio">'+
							'<label>' + this.nickName + ' <span class="mui-badge"> ' + this.phone +'</span></label>'+
							'<input name="customer" type="radio" value="' + this.accountId + '">'+
						'</div>';
					});
					$('#customersContent').html(form);
				}else{
					$('#customersContent').html("<span class='no-data'>没有查询到客户！</span>");
				}
				
			},

			fail: function(code, error) {
				$('#customersContent').html("<span class='no-data'>没有查询到客户！</span>");
			}
		});
	};
	
	getSearchCustomers();
	$('#search').on('keyup', function(){
		getSearchCustomers($(this).val());
	});
	$('#searchForm').on('submit', function(){
		getSearchCustomers($('#search').val());
		$('#search').blur();
	});
	$('#confirm').on('click', function(){
		var checked = $('input[name=customer]:checked').val(),
			shopId = o2o.getUrlParam('shopId');
		console.log($('input[name=customer]:checked').val());
		if($.trim(checked)){
			o2o.confirm('确认转让？', function(msg) {
				if (msg == "yes") {
					o2o.request({
						url: o2o.path.shopModifyAccountShop,
						data: {
							shopId: shopId,
							accountId: checked
						},
						success: function(respones) {
							o2o.prompt('店铺转让成功', function() {
								mui.back();
							});
						},
						fail: function(code, error) {
							o2o.prompt(error);
						}
					});
				}
			});
		}else{
			o2o.prompt('请选择要转让客户！');
		}
	});
}, false);