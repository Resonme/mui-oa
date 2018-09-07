document.addEventListener('plusready', function() {	
	var tpl_host = Handlebars.compile(
		'<ul class="mui-table-view" >'+
		'	{{#each shopDeviceChannelDOs}}' +
		'						<li class="mui-table-view-cell alarmItem" data-id="{{deviceChannelId}}">'+
		'							 <a class="mui-navigate-right">'+
		'						      通道：{{installationSite}}'+
		'						    </a>'+
		'							<div class="mui-switch alarmChanelState {{#if using}}mui-active{{/if}}" style="margin-right: 30px;" data-state="{{isUsing}}" data-id="{{deviceChannelId}}">'+
		'								<div class="mui-switch-handle " ></div>'+
		'							</div>'+
		'						</li>'+
		'	{{/each}}' +
		'</ul>'+
		'   {{#if nomessage}}<div class="am-margin-sm am-text-center">{{nomessage}}</div>{{/if}}'),

	tpl_device = Handlebars.compile('{{#each list}}' +
		'<ul class="mui-table-view mui-table-view-chevron">'+
		'						<li class="mui-table-view-cell mui-collapse mui-active">'+
		'							<a class="mui-navigate-right" href="#">主机：{{#if hostIp}}{{hostIp}}:{{hostPort}}{{else}}{{hostSerial}}{{/if}}</a>'+
		'							<ul class="mui-table-view mui-table-view-chevron">'+
		'             				{{#each shopDeviceChannelDOs}}' +
		'								<li class="mui-table-view-cell alarmItem" data-id="{{deviceChannelId}}">'+
		'									<a class="mui-navigate-right" href="#">通道：{{installationSite}}</a>'+
		'									<div class="mui-switch cameraChanelState {{#if using}}mui-active{{/if}}" data-state="{{isUsing}}" data-id="{{deviceChannelId}}" style="margin-right: 30px;">'+
		'										<div class="mui-switch-handle"></div>'+
		'									</div>'+
		'								</li>'+
		'             				{{/each}}' +
		'							</ul>'+
		'						</li>'+
		'</ul>'+
		'           {{/each}}'+
		'   {{#if nomessage}}<div class="am-margin-sm am-text-center">{{nomessage}}</div>{{/if}}'),

	shopId = o2o.getUrlParam('shopId'),
	hostlist = $('#hostlist'),
	devicelist = $('#devicelist'),
	alarmListEvent = function() {
		$('#hostlist .alarmItem').off('click').on('click', function() {
			var deviceChannelId = $(this).data('id');
			mui.openWindow({
				url:"shop-alarm-add.html",
				extras:{
					shopId:shopId,
					deviceChannelId:deviceChannelId
				}
			});
		});
		$('#hostlist .alarmChanelState').off('click').on('click', function(e) {
			e.stopPropagation();
			var deviceChannelId = $(this).data('id'),
				state = $(this).data('state'),
				info = "确定禁用此通道！";
			if(state==0){
				state = 1;
				info = "确定启用此通道!"
			}else{
				state = 0;
			}
			o2o.confirm(info, function(msg){
				if(msg=="yes"){
					o2o.request({
						url: o2o.path.shopModifyDeviceChannel,
						noWin:true,
						data: {
							deviceChannelId: deviceChannelId,
							isUsing : state
						},
						success: function(respones) {
							o2o.prompt('操作成功！');
							getHostList();
						},
		
						fail: function(code, error) {
							o2o.prompt(error);
						}
					});
				}
			});
			
		});
	},
	
	cameraListEvent = function(){
		$('#devicelist .alarmItem').off('click').on('click', function() {
			var deviceChannelId = $(this).data('id'),
				hostSerial = $(this).parent().data('serial');
			
			mui.openWindow({
				url:"shop-camera-add.html",
				extras:{
					shopId:shopId,
					deviceChannelId:deviceChannelId
				}
			});
		});
		$('#devicelist .cameraChanelState').off('click').on('click', function(e) {
			e.stopPropagation();
			var deviceChannelId = $(this).data('id'),
				state = $(this).data('state'),
				info = "确定禁用此通道！";
				if(state==0){
					state = 1;
					info = "确定启用此通道!"
				}else{
					state = 0;
				}
				o2o.confirm(info, function(msg){
					if(msg=="yes"){
						o2o.request({
							url: o2o.path.shopModifyDeviceChannel,
							noWin:true,
							data: {
								deviceChannelId: deviceChannelId,
								isUsing : state
							},
							success: function(respones) {
								o2o.prompt('操作成功！');
								getDeviceList();
							},
			
							fail: function(code, error) {
								o2o.prompt(error);
							}
						});
					}
				});
			
			
		});
	},

	getDeviceList = function() {
		//视频设备
		o2o.request({
			url: o2o.path.messageInstallDeviceChannelCamera,
			noWin:true,
			data: {
				shopId: shopId
			},
			success: function(respones) {
				if (!respones.list || respones.list.length == 0) {
					respones.nomessage = '暂无视频设备防区信息';
				}else{
					$(respones.list).each(function(){
						
					});
					if(respones.list && respones.list.length>0){
						for(var i =0;i<respones.list.length;i++){
							if(respones.list[i].shopDeviceChannelDOs && respones.list[i].shopDeviceChannelDOs.length>0){
								for(var j=0; j<respones.list[i].shopDeviceChannelDOs.length;j++){
									if( respones.list[i].shopDeviceChannelDOs[j].isUsing == 1 ){
										respones.list[i].shopDeviceChannelDOs[j].using = 1;
									}
								}
							}
						}
					}
					
				}
				devicelist.html(tpl_device(respones));
				cameraListEvent();
			},

			fail: function(code, error) {
				o2o.prompt(error);
			}
		});
	},

	getHostList = function() {
		o2o.request({
			url: o2o.path.messageInstallDeviceChannelAlarm,
			noWin:true,
			data: {
				shopId: shopId
			},
			success: function(respones) {
				if (respones.shopDeviceChannelDOs && respones.shopDeviceChannelDOs.length > 0) {
					for (var i = 0; i < respones.shopDeviceChannelDOs.length; i++) {
						var state = respones.shopDeviceChannelDOs[i].channelState;
						switch (state) {
							case 0:
								respones.shopDeviceChannelDOs[i].state = "待测试";
								respones.shopDeviceChannelDOs[i].stateclass = "am-text-warning";
								break;
							case 1:
								respones.shopDeviceChannelDOs[i].state = "通过";
								respones.shopDeviceChannelDOs[i].stateclass = "am-text-success";
								respones.shopDeviceChannelDOs[i].hideTest = "am-hide";
								break;
							case 2:
								respones.shopDeviceChannelDOs[i].state = "未通过";
								respones.shopDeviceChannelDOs[i].stateclass = "am-text-danger";
								break;
							default:
								respones.shopDeviceChannelDOs[i].state = "待测试";
								respones.shopDeviceChannelDOs[i].stateclass = "am-text-warning";
								break;
						}
						if (respones.shopDeviceChannelDOs[i].sensorId == 0) {
							respones.shopDeviceChannelDOs[i].sensorId = "红外对射";
						} else if (respones.shopDeviceChannelDOs[i].sensorId == 1) {
							respones.shopDeviceChannelDOs[i].sensorId = "门磁";
						}
						if( respones.shopDeviceChannelDOs[i].isUsing == 1 ){
							respones.shopDeviceChannelDOs[i].using = 1;
						}
					}
				} else {
					respones.nomessage = '暂无主机防区信息';
				}
				hostlist.html(tpl_host(respones));
				alarmListEvent();
			},

			fail: function(code, error) {
				o2o.prompt(error);
			}
		});

	};
	
	window.addEventListener('getHostList', function(){
		getHostList();
	});
	window.addEventListener('getDeviceList', function(){
		getDeviceList();
	});
	getHostList();
	getDeviceList();
}, false);