document.addEventListener('plusready', function() {	
 	var tpl = Handlebars.compile(
		'{{#each list}}' +
		'<li class="mui-table-view-cell">'+
		'	{{repairName}}'+
		'	<button class="mui-btn mui-btn-sm mui-btn-primary repairTypeEdit" style="margin-right:45px;" data-id="{{repairTypeId}}">编辑</button>'+
		'	<button class="mui-btn mui-btn-sm mui-btn-danger repairTypeRemove" data-id="{{repairTypeId}}">删除</button>'+
		/*'	<div class="mui-slider-right mui-disabled">'+ 
		'		<a class="mui-btn mui-btn-yellow mui-icon mui-icon-compose repairTypeEdit" data-id="{{repairTypeId}}"></a>'+
		'		<a class="mui-btn mui-btn-red mui-icon mui-icon-trash repairTypeRemove" data-id="{{repairTypeId}}"></a>'+
		'	</div>'+
		'	<div class="mui-slider-handle">'+
		'		<div class="mui-table-cell">'+
		'			{{repairName}}'+
		'		</div>'+
		'	</div>'+*/
		'</li>'+
		'{{/each}}' +
		'{{#if nomessage}}<div class="am-margin-sm am-text-center">{{nomessage}}</div>{{/if}}'),
	
	list = $('#list'),
	
	listEvent = function() {
		$("button.repairTypeRemove").off('click').on('click', function() {
			var repairTypeId = $(this).data('id');
			o2o.confirm('确定删除该维修类型？', function(msg) {
				if (msg == "yes") {
					o2o.request({
						url: o2o.path.modifyRepairType, 
						data: {
							repairTypeId: repairTypeId,
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
		$("button.repairTypeEdit").off('click').on('click', function() {
			var id = $(this).data('id');
			var detailPage = null;
			if(!detailPage){
			    detailPage = plus.webview.getWebviewById('customer-repair-type-add.html');
			}
			mui.openWindow({
				url: 'customer-repair-type-add.html',
				extras:{
					repairTypeId : id
				}
			});
		});
	};
	
	var init = function(){
		o2o.request({
			url: o2o.path.queryRepairType,
			success: function(respones) {
				console.log(respones);
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
			url: 'customer-repair-type-add.html'
		});
	});
	window.addEventListener('refresh', function(){
		init();
	});
}, false);