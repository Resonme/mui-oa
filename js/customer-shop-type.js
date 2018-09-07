document.addEventListener('plusready', function() {	
	var tpl = Handlebars.compile(
		'{{#each list}}' +
		'<li class="mui-table-view-cell">'+
		'	{{typeName}}'+
		'	<button class="mui-btn mui-btn-sm mui-btn-primary shopTypeEdit" style="margin-right:45px;" data-id="{{shopTypeId}}">编辑</button>'+
		'	<button class="mui-btn mui-btn-sm mui-btn-danger shopTypeRemove" data-id="{{shopTypeId}}">删除</button>'+
		/*'	<div class="mui-slider-right mui-disabled">'+
		'		<a class="mui-btn mui-btn-yellow mui-icon mui-icon-compose shopTypeEdit" data-id="{{shopTypeId}}"></a>'+
		'		<a class="mui-btn mui-btn-red mui-icon mui-icon-trash shopTypeRemove" data-id="{{shopTypeId}}"></a>'+
		'	</div>'+
		'	<div class="mui-slider-handle">'+
		'		<div class="mui-table-cell">'+
		'			{{typeName}}'+
		'		</div>'+
		'	</div>'+*/
		'</li>'+
		'{{/each}}' +
		'{{#if nomessage}}<div class="am-margin-sm am-text-center">{{nomessage}}</div>{{/if}}'),
	
		list = $('#list'),
	
		listEvent = function() {
			$("button.shopTypeRemove").off('click').on('click', function() {
				var shopTypeId = $(this).data('id');
				o2o.confirm('确定删除该店铺类型？', function(msg) {
					if (msg == "yes") {
						o2o.request({
							url: o2o.path.modifyShopType,
							data: {
								shopTypeId: shopTypeId,
								isDelete: 1
							},
							success: function(respones) {
								init();
							},
	
							fail: function(code, error) {
								o2o.prompt(error);
							}
						});
					}
				});
			});
			
			$("button.shopTypeEdit").off('click').on('click', function() {
				var id = $(this).data('id');
				var detailPage = null;
				if(!detailPage){
				    detailPage = plus.webview.getWebviewById('customer-shop-type-add.html');
				}
				mui.openWindow({
					url: 'customer-shop-type-add.html',
					extras:{
						shopTypeId : id
					}
				});
			});
		};

	
	
	var init = function(){
		o2o.request({
			url: o2o.path.queryShopTypes,
			success: function(respones) {
				list.html(tpl(respones));
				listEvent();
			},
	
			fail: function(code, error) {
				o2o.prompt(error);
			}
		});
	};
	init();
	
	mui('body').on('tap','#add', function(){
		mui.openWindow({
			url: 'customer-shop-type-add.html'
		});
	});
	window.addEventListener('refresh', function(){
		init();
	});
	
}, false);