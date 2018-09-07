document.addEventListener('plusready', function() {	
	var tpl = Handlebars.compile(
		'{{#each list}}' +
	    '<div class="mui-card" style="margin-bottom:15px;">'+
		'	<ul class="mui-table-view" id="customerPackage">'+
				'<li class="mui-table-view-cell mui-collapse mui-active">'+
		'			<a class="mui-navigate-right" href="#">{{packageName}}</a>'+
		'			<div class="mui-collapse-content">'+
						'<ul class="mui-table-view">'+
						'<li class="mui-table-view-cell"><span class="mui-ellipsis-2">{{packageContent}}</span>'+
						'</li>'+
						'	<li class="mui-table-view-cell">服务周期:<span class="mui-badge mui-badge-inverted" style="font-size:14px;">{{packageServiceTime}}个月</span>'+
						'	</li>'+
						'	<li class="mui-table-view-cell">有效期限：<span class="mui-badge mui-badge-inverted" style="font-size:14px;">{{validityTime}}个月</span>'+
						'	</li>'+
						'	<li class="mui-table-view-cell">服务费用：<span class="mui-badge mui-badge-inverted" style="font-size:14px;">{{packageServiceFee}}元</span>'+
						'	</li>'+
						'	<li class="mui-table-view-cell">&nbsp;'+
						'		<button style="position:relative;top:8px;" data-id="{{packageId}}" class="mui-btn mui-btn-sm mui-btn-primary pakeageEdit">编辑</button>'+
								'{{#if open}}'+
						'        <button style="position:relative;top:8px;" class="mui-btn mui-btn-sm mui-btn-success packageState" data-state="0"  data-id={{packageId}}>已启用</button>' +
								'{{else}}'+
						'        <button style="position:relative;top:8px;" class="mui-btn mui-btn-sm mui-btn-danger packageState" data-state="1"  data-id={{packageId}}>已禁用</button>' +
								'{{/if}}'+
						'	</li>'+
						'</ul>'+ 
		'			</div>'+
		'		</li>'+ 
		'	</ul>'+
		'</div>'+
		' {{/each}}'
		
		/*'{{#each list}}' +
		'<dl class="am-accordion-item">' +
		'        <dt class="am-accordion-title">' +
		'            {{packageName}}' +
		'        </dt>' +
		'        <dd class="am-accordion-bd am-collapse ">' +
		'          <div class="am-accordion-content">' +
		'            <div class="am-text-right">' +
		'        <a href="customer-package-add.html?packageId={{packageId}}" class="am-btn am-btn-primary am-btn-xs packageEdit">编辑</a>' +
				'{{#if open}}'+
		'        <button type="button" class="am-btn am-btn-success am-btn-xs packageState" data-state="0"  data-id={{packageId}}>已启用</button>' +
				'{{else}}'+
		'        <button type="button" class="am-btn am-btn-danger am-btn-xs packageState" data-state="1"  data-id={{packageId}}>已禁用</button>' +
				'{{/if}}'+
		'            </div>' +
		'      <p>{{packageContent}}</p>' +
		'      <hr data-am-widget="divider" style="" class="am-divider am-divider-default am-no-layout">' +
		'      <p><label>服务周期：</label>{{packageServiceTime}}月</p>' +
		'      <p><label>有效期限：</label>{{validityTime}}月</p>' +
		'      <hr data-am-widget="divider" style="" class="am-divider am-divider-default am-no-layout">' +
		'      <p><label>服务费用：</label>{{packageServiceFee}}元</p>' +
		'          </div>' +
		'        </dd>' +
		'      </dl>' +
		' {{/each}}'*/),

	list = $('#customerPackage'),

	btnEvent = function() {
		$('button.pakeageEdit').off('click').on('click', function(){
			var id = $(this).data('id');
			mui.openWindow({
				url: 'customer-package-add.html', 
				extras:{
					packageId : id
				}
			});
		});
		$('button.packageState').off('click').on('click', function() {
			console.log($(this).attr('data-state'));
			var _self = $(this),
				packageId = _self.data('id'),
				state = _self.attr('data-state'),
				classStr,
				textStr,
				newState,
				msg = "确定禁用该套餐？";
			if(state==1){
				msg = "确定启用该套餐？"
				classStr = "mui-btn mui-btn-sm mui-btn-success packageState";
				textStr = "已启用";
				newState = 0;
			}else if(state==0){
				classStr = "mui-btn mui-btn-sm mui-btn-danger packageState";
				newState = 1;
				textStr = "已禁用";
			}
			o2o.confirm(msg, function(msg) {
				if (msg == "yes") {
					o2o.request({
						url: o2o.path.customerModifyPackage,
						data: {
							packageId: packageId,
							isUsing: state
						},
						success: function(respones) {
							_self.text(textStr).attr('class', classStr).attr('data-state', newState);
							o2o.prompt('操作成功');
						},

						fail: function(code, error) {
							o2o.prompt(error);
						}
					});
				}
			});
		});
	},

	resetUI = function() {
		/*$.each(['accordion'], function(i, m) {
			var module = $.AMUI[m];
			module && module.init && module.init();
		});*/
	},

	getList = function() {
		o2o.request({
			url: o2o.path.customerQueryPackages,
			success: function(respones) {
				for (var i = 0; i < respones.list.length; i++) {
					if(respones.list[i].isUsing == 1){
						respones.list[i].open = 1;
					}
					respones.list[i].packageContent = new Handlebars.SafeString(respones.list[i].packageContent.replace(/\n/g,'<br>'))
				}
				list.html(tpl(respones));
				btnEvent();
				//resetUI();
			},

			fail: function(code, error) {
				o2o.prompt(error);
			}
		});
	};
	getList();
	
	
	 //href="customer-package-add.html"
	 mui('body').on('tap','#add', function(){
	 	mui.openWindow({
	 		url:"customer-package-add.html" 
	 	});
	 });
	 
	 window.addEventListener('refresh', function(){
		getList();
	});
}, false);