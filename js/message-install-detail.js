document.addEventListener('plusready', function() {
	var tpl = Handlebars.compile(
			'<div class="mui-input-group">' +
			'    <div class="mui-input-row" id="toShop" style="height:auto">' +
			'        <label>店铺名称：</label>' +
			'		 <a class="mui-navigate-right">'+
			'        <div style="padding:11px 15px 11px 0;line-height:1.1;">{{shopDO.shopName}}</div>' +
			'		 </a>'+
			'    </div>' +
			'</div>' +
			'<div class="mui-input-group" style="margin-top:10px;">' +
			'    <div class="mui-input-row">' +
			'        <label>店铺编号：</label>' +
			'        <div style="padding:11px 15px 11px 0;line-height:1.1;">{{shopDO.shopNo}}</div>' +
			'    </div>' +
			'    <div class="mui-input-row" style="margin-top:-15px;">' +
			'        <label>店铺类型：</label>' +
			'        <div style="padding:11px 15px 11px 0;line-height:1.1;">{{shopDO.shopTypeName}}</div>' +
			'    </div>' +
			'    <div class="mui-input-row" style="margin-top:-15px;">' +
			'        <label>所属区域：</label>' +
			'        <div style="padding:11px 15px 11px 0;line-height:1.1;">{{shopDO.areaName}}</div>' +
			'    </div>' +
			'{{#if shopDO.leader}}'+
			'    <div class="mui-input-row" style="margin-top:-15px;">' +
			'        <label>负&nbsp;&nbsp;责&nbsp;&nbsp;人：</label>' +
			'        <div style="padding:11px 15px 11px 0;line-height:1.1;">{{shopDO.leader}}</div>' +
			'    </div>' +
			'    <div class="mui-input-row" style="margin-top:-15px;">' +
			'        <label>电&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;话：</label>' +
			'        <div style="padding:11px 15px 11px 0;line-height:1.1;">{{shopDO.leaderPhone}}</div>' +
			'    </div>' +
			'{{/if}}'+
			'    <div class="mui-input-row" style="height:auto;margin-top:-15px;">' +
			'        <label>套餐信息：</label>' +
			'        <div style="padding:11px 15px 11px 0;line-height:1.1;">{{packageDO.packageName}} ({{packageDO.packageServiceFee}}元/{{packageDO.packageServiceTime}}个月)</div>' +
			'    </div>' +
			'    <div class="mui-input-row" style="height:auto;margin-top:-15px;">' +
			'        <label>详细地址：</label>' +
			'        <div style="padding:11px 15px 11px 0;line-height:1.1;float:right;width:65%;">{{shopDO.shopAddress}}</div>' +
			'    </div>' +
			'</div>'+
			'<div class="mui-input-group" style="margin: 10px 0 0;">'+
			'    <div class="mui-input-row">' +
			'        <label>任务类型：</label>' +
			'        <div style="padding:11px 15px 11px 0;line-height:1.1;">{{serviceDO.serviceType}}</div>' +
			'    </div>' +
			'    <div class="mui-input-row" style="height:auto;margin-top:-15px">' +
			'        <label>任务说明：</label>' +
			'        <div style="padding:11px 15px 11px 0;line-height:1.1;float:right;width:65%;">{{serviceDO.serviceContent}}</div>' +
			'    </div>' +
			'</div>'+
			'<form class="mui-input-group" style="margin: 10px 0 0;">'+
			'{{#unless serviceDO.close}}'+
			'{{#if serviceDO.servicerId}}'+
			'    <div class="mui-input-row">' +
			'        <label style="padding-right:5px;">安装维护人员：</label>' +
			'        <div style="padding:11px 15px 11px 0;line-height:1.1;">{{serviceDO.servicerName}}</div>' +
			'    </div>' +
			'{{else}}'+
			'    <div class="mui-input-row">' +
			'        <label style="padding-right:5px;">安装维护人员：</label>' +
			'        <input type="hidden" name="servicerId" id="servicerId" value="{{serviceDO.servicerId}}">' +
			'        <input type="text" value="{{serviceDO.servicerName}}" id="installEmpName" placeholder="选择人员..." readonly>' +
			'		 <a class="mui-navigate-right"></a>'+
			'    </div>' +
			'{{/if}}'+
			'{{/unless}}'+
			'{{#unless serviceDO.doing}}'+
			'{{#if serviceDO.examineContent}}'+
			'	<div class="mui-input-row" style="height:auto;">'+
			'        <label>审核批复：</label>' +
			'        <div style="padding:11px 15px 11px 0;line-height:1.1;">{{serviceDO.examineContent}}</div>' +
			'	</div>'+
			'{{else}}'+
			'	<div class="mui-input-row" style="height:auto;">'+
			'        <label>审核批复：</label>' +
			'		<textarea rows="4" id="examineContent" placeholder="请输入审核批复内容..">{{serviceDO.examineContent}}</textarea>'+
			'	</div>'+
			'{{/if}}'+
			'{{/unless}}'+
			'</form>'),
			
		foot0 ='<div class="mui-col-xs-6">' +
		  ' <button class="mui-btn mui-btn-block mui-btn-default examine" data-state="2">打回</button>' +
		  '</div>' +
		  '<div class="mui-col-xs-6">' +
		  '  <button class="mui-btn mui-btn-block mui-btn-active examine" data-state="1">同意</button>' +
		  '</div>',
		  
		foot1 ='  <button class="mui-btn mui-btn-block mui-btn-active examine" data-state="3"><span class="am-icon-check"></span>结束任务</button>',
			
		foot2 ='<div class="mui-col-xs-6">' +
		  ' <button class="mui-btn mui-btn-block mui-btn-default" id="cancel">放弃</button>' +
		  '</div>' +
		  '<div class="mui-col-xs-6">' +
		  '  <button class="mui-btn mui-btn-block mui-btn-active" id="toInstall">重新发起</button>' +
		  '</div>',

		_list = $('#list'),serviceType,
		cw = plus.webview.currentWebview(),
		serviceId = cw.serviceId || o2o.getUrlParam('serviceId'),
		shopId = cw.shopId || o2o.getUrlParam('shopId');
		var userPicker = new mui.PopPicker();
		var btnEvent = function(){
			$('button.examine').on('click', function() {
				var state = $(this).data('state')
				var examineContent = $('#examineContent').val(),
					servicerId = $('#servicerId').val();
				if(state==3){
					o2o.confirm('确认结束', function(msg) {
						if (msg == "yes") {
							o2o.request({
								url: o2o.path.shopFinishService,
								data: {
									serviceId: serviceId,
									shopId: shopId
								},
								success: function(respones) {
									o2o.prompt('操作成功', function() {
										var opener = plus.webview.currentWebview().opener();
										mui.fire(opener,'changeState', {
											serviceId:serviceId,
											state:3
										});
										mui.back();
									});
								},
		
								fail: function(code, error) {
									if (code == 101) {
										o2o.confirm(error, function(msg) {
											if (msg == "yes") {
												o2o.request({
													url: o2o.path.shopComfirmFinishService,
													data: {
														serviceId: serviceId,
														shopId: shopId
													},
													success: function(respones) {
														o2o.prompt('操作成功', function() {
															var opener = plus.webview.currentWebview().opener();
															mui.fire(opener,'changeState', {
																serviceId:serviceId,
																state:3
															});
															mui.back();
														});
													},
													fail: function(code, error) {
														o2o.prompt(error);
													}
												});
											}
										});
									} else {
										o2o.prompt(error);
									}
								}
							});
						}
					});
				}else{
					if (state == 2 && !$.trim(examineContent)) {
						o2o.prompt('请输入审核批复内容');
					} else {
						if (state == 1 && !$.trim(servicerId)) {
							o2o.prompt('请选择安装人员');
							return;
						}
						o2o.confirm('是否确认？', function(msg) {
							if (msg == "yes") {
								var data = {
									examineContent: examineContent,
									examineState: state,
									serviceId: serviceId,
									servicerId: servicerId,
									shopId: shopId
								};
								o2o.request({
									url: o2o.path.messageInstallCheck,
									data: data,
									success: function(respones) {
										o2o.prompt('操作成功', function() {
											var opener = plus.webview.currentWebview().opener();
											mui.fire(opener,'changeState', {
												serviceId:serviceId,
												state:state
											});
											mui.back();
										});
									},
		
									fail: function(code, error) {
										o2o.prompt(error);
									}
								});
							}
						});
					}
				}
			});
			
			$('#toShop').on('click', function(){
				mui.openWindow({
					url:"customer-business-info.html",
					extras:{
						shopId:shopId,
						serviceId:serviceId
					}
				});
			});
			
			$('#cancel').on('click', function(){
				o2o.confirm('确定放弃？', function(){
					o2o.request({
						url: o2o.path.shopModifyService,
						data: {
							serviceId: serviceId,
							isDelete: 1
						},
						success: function(respones) {
							o2o.prompt('操作成功！')
							var opener = plus.webview.currentWebview().opener();
							mui.fire(opener,'changeState', {
								serviceId:serviceId,
								state:3
							});
							mui.back();
						},
						fail: function(code, error) {
							o2o.prompt(error);
						}
					});
				});
			});
			
			$('#toInstall').on('click', function(){
				if(serviceType == 0){
					mui.openWindow({
						url:"customer-info-new-install.html",
						extras:{
							shopId:shopId,
							serviceId:serviceId
						}
					});
				}else{
					mui.openWindow({
						url:"shop-business-add.html",
						extras:{
							shopId:shopId,
							serviceId:serviceId
						}
					});
				}
				
			});
		}
		o2o.request({
			url: o2o.path.messageInstallInfo,
			data: {
				serviceId: serviceId,
				shopId: shopId
			},
			success: function(respones) {
				serviceType = respones.serviceDO.serviceType;
				switch (respones.serviceDO.serviceType) {
					case 0:
						respones.serviceDO.serviceType = "安装";
						break;
					case 2:
						respones.serviceDO.serviceType = "设备变更";
						break;
					case 3:
						respones.serviceDO.serviceType = "移机";
						break;
					case 4:
						respones.serviceDO.serviceType = "拆机";
						break;
					case 5:
						respones.serviceDO.serviceType = "套餐变更";
						break;
				}
				switch( parseInt(respones.serviceDO.examineState) ){
					case 0:
						$('#footer').html(foot0);
						break;
					case 1:
						$('#footer').html(foot1);
						respones.serviceDO.doing = 1;
						break;
					case 2:
						$('#footer').html(foot2);
						respones.serviceDO.close = 1;
						break;
				}
				respones.serviceDO.serviceContent = new Handlebars.SafeString(respones.serviceDO.serviceContent.replace(/\n/g, '<br>'));
				_list.html(tpl(respones));
				var employeesStr = [];
				if (respones.employees && respones.employees.length > 0) {
					$(respones.employees).each(function() {
						employeesStr.push({
							text: this.employeeName + " （" + this.areaName + "）",
							value: this.employeeId
						});
					});
					userPicker.setData(employeesStr);
					$('#installEmpName').on('click', function(){
						userPicker.show(function(items) {
							$('#installEmpName').val(items[0].text); 
							$('#servicerId').val(items[0].value); 
							//返回 false 可以阻止选择框的关闭
							//return false;
						});
					});
				}
				btnEvent();
			},
			fail: function(code, error) {
				o2o.prompt(error);
			}
		});
}, false);