document.addEventListener('plusready', function() {	
	var tpl = Handlebars.compile(
			'{{#each list}}' +
			'    <li onclick="window.location.href=\'customer-business-info.html?shopId={{shopId}}&serviceId={{serviceId}}&serviceState={{shopState}}\'">' +
			'      <div class="warning am-cf">' +
			'          <div class="am-u-sm-3 left am-text-{{statetext}} panel-table">' +
			'           <div class="panel-table-cell">' +
			'            <span class="{{stateicon}}"></span>' +
			'            <span>{{state}}</span>' +
			'           </div>' +
			'          </div>' +
			'          <div class="am-u-sm-9 right">' +
			'            <p class="am-text-truncate">' +
			'              <span class="am-icon-university"></span>' +
			'             {{shopNo}} - {{shopName}} ' +
			'               <a class="am-icon-chevron-circle-right right-icon"></a>' +
			'            </p>' +
			'            <p class="am-text-truncate"><span class="am-icon-train"></span><span class="am-text-primary">{{areaName}}</span></p>' +
			'            <p class="am-text-truncate"><span class="am-icon-map-marker"></span>{{shopAddress}}</p>' +
			'            <p class="am-text-truncate"><span class="am-icon-indent"></span>{{packageName}}({{packageFee}}元)</p>' +
			'          </div>' +
			'      </div>' +
			'    </li>' +
			'    {{/each}}' +
			'   {{#if nomessage}}<div class="am-margin-sm am-text-center">{{nomessage}}</div>{{/if}}'),

		tpl2 = Handlebars.compile(
			'{{#each list}}' +
			'    <li class="li-h80" onclick="window.location.href=\'customer-business-info.html?shopId={{shopId}}&serviceId={{serviceId}}&serviceState={{shopState}}\'">' +
			'      <div class="warning am-cf">' +
			'          <div class="am-u-sm-3 left am-text-{{statetext}} panel-table">' +
			'           <div class="panel-table-cell">' +
			'            <span class="{{stateicon}}"></span>' +
			'            <span>{{state}}</span>' +
			'           </div>' +
			'          </div>' +
			'          <div class="am-u-sm-9 right">' +
			'            <p class="am-text-truncate">' +
			'              <span class="am-icon-university"></span>' +
			'              {{shopNo}} - {{shopName}}  ' +
			'               <a class="am-icon-chevron-circle-right right-icon"></a>' +
			'            </p>' +
			'            <p class="am-text-truncate"><span class="am-icon-train"></span><span class="am-text-primary">{{areaName}}</span></p>' +
			'            <p class="am-text-truncate"><span class="am-icon-map-marker"></span>{{shopAddress}}</p>' +
			'          </div>' +
			'      </div>' +
			'    </li>' + 
			'    {{/each}}' +
			'   {{#if nomessage}}<div class="am-margin-sm am-text-center">{{nomessage}}</div>{{/if}}'),

		tpl3 = Handlebars.compile(
			'{{#each list}}' +
			'    <li class="li-h80" onclick="window.location.href=\'customer-business-info.html?shopId={{shopId}}&serviceId={{serviceId}}&serviceState={{shopState}}\'">' +
			'      <div class="warning am-cf">' +
			'          <div class="am-u-sm-3 left am-text-{{statetext}} panel-table">' +
			'           <div class="panel-table-cell">' +
			'            <span class="{{stateicon}}"></span>' +
			'            <span>{{state}}</span>' +
			'           </div>' +
			'          </div>' +
			'          <div class="am-u-sm-9 right">' +
			'            <p class="am-text-truncate">' +
			'              <span class="am-icon-university"></span>' +
			'              {{shopNo}} - {{shopName}} ' +
			'               <a class="am-icon-chevron-circle-right right-icon"></a>' +
			'            </p>' +
			'            <p class="am-text-truncate"><span class="am-icon-map-marker"></span>{{shopAddress}}</p>' +
			'            <p class="am-text-truncate"><span class="am-icon-calendar-o"></span>{{simStartTime}} 至 {{simEndTime}}</p>' +
			'          </div>' +
			'      </div>' +
			'    </li>' +
			'    {{/each}}' +
			'   {{#if nomessage}}<div class="am-margin-sm am-text-center">{{nomessage}}</div>{{/if}}'), 

		list = $('#list'),
		cw = plus.webview.currentWebview(),
		stateU = cw.stateU || o2o.getUrlParam('state'),
		shopState = cw.shopState || o2o.getUrlParam('shopState'),
		type = cw.type || o2o.getUrlParam('type'),
		shopNo = cw.shopNo || o2o.getUrlParam('shopNo') || "",
		SIMState = cw.SIMState || o2o.getUrlParam('SIMState'),
		shopStyle = cw.shopStyle || o2o.getUrlParam('shopStyle'),
		data = {};
	if ($.trim(shopNo)) {
		$('h1.am-header-title').html('店铺');
		o2o.request({
			url: o2o.path.shopQueryShopList,
			data: {
				search: shopNo,
				pageSize:100,
				pageindex:1
			},
			success: function(respones) {
				if (respones.list.length > 0) {
					for (var i = 0; i < respones.list.length; i++) {
						switch (parseInt(respones.list[i].shopState)) {
								case 0:
									respones.list[i].state = "安装中";
									respones.list[i].stateicon = "am-icon-chain";
									respones.list[i].statetext = "warning";
									break;
								case 1:
									respones.list[i].state = "正常";
									respones.list[i].stateicon = "am-icon-check";
									respones.list[i].statetext = "success";
									break;
								case 2:
									respones.list[i].state = "设备变更中";
									respones.list[i].stateicon = "am-icon-ticket";
									respones.list[i].statetext = "warning";
									break;
								case 3:
									respones.list[i].state = "移机中";
									respones.list[i].stateicon = "am-icon-chain";
									respones.list[i].statetext = "warning";
									break;
								case 4:
									respones.list[i].state = "拆机中";
									respones.list[i].stateicon = "am-icon-chain";
									respones.list[i].statetext = "warning";
									break;
								case 5:
									respones.list[i].state = "套餐变更中";
									respones.list[i].stateicon = "am-icon-ticket";
									respones.list[i].statetext = "warning";
									break;
							}
					}
				} else {
					respones.nomessage = "暂无更多数据";
				}
				list.html(tpl2(respones));
			},
			
			fail: function(code, error) {
				o2o.prompt(error);
			}
		});
	}else if($.trim(SIMState)){
		var statetext = "";
			
		switch (parseInt(SIMState)) {
			case 0:
				$('h1.am-header-title').html('已到期');
				statetext = '已到期';
				break;
			case 1:
				$('h1.am-header-title').html('3天内到期');
				statetext = '3天内到期';
				break;
			case 2:
				$('h1.am-header-title').html('7天内到期');
				statetext = '7天内到期';
				break;
			case 3:
				$('h1.am-header-title').html('15天内到期');
				statetext = '15天内到期';
				break;
			case 4:
				$('h1.am-header-title').html('30天内到期');
				statetext = '30天内到期';
				break;
			case 5:
				$('h1.am-header-title').html('30天以上');
				statetext = '30天以上';
				break;
		}
		var page =1;
		$('#messageInstall').dropload({
		    scrollArea: window,
		    loadDownFn: function(me) {
		        o2o.request({
					url: o2o.path.queryShopListBySimState,
					noWin:true,
					data: {
						state: SIMState,
		                pageSize: 10,
		                pageIndex: page
					},
					success: function(respones) {
						if (respones.list.length > 0) {
							for (var i = 0; i < respones.list.length; i++) {
								/*switch (parseInt(respones.list[i].defenceState)) {
									case 0:
										respones.list[i].state = "撤防";
										respones.list[i].stateicon = "am-icon-unlock";
										respones.list[i].statetext = "default";
										break;
									case 1:
										respones.list[i].state = "布防";
										respones.list[i].stateicon = "am-icon-lock";
										respones.list[i].statetext = "success";
										break;
									default:
										respones.list[i].state = "未明";
										respones.list[i].stateicon = "am-icon-chain";
										respones.list[i].statetext = "warning";
										break;
								}*/
								
								respones.list[i].state = statetext;
								respones.list[i].stateicon = "am-icon-chain";
								respones.list[i].statetext = "danger";
								respones.list[i].simStartTime = new Date(respones.list[i].simStartTime).Format('yyyy-MM-dd');
								respones.list[i].simEndTime = new Date(respones.list[i].simEndTime).Format('yyyy-MM-dd');
							}
							if(respones.list.length < 10){
			                    me.lock();
			                    me.noData();
							}
						} else {
							//respones.nomessage = "暂无更多数据";
		                    me.lock();
		                    me.noData();
						}
						list.append(tpl3(respones));
						me.resetload();
					},

					fail: function(code, error) {
						//o2o.prompt(error);
		                me.lock();
		                me.noData();
		                me.resetload();
					}
				});
		        page++;
		    }
		});
		
	}else if ($.trim(type)) {
		
    	var statetext = "";
		switch (parseInt(type)) {
			case 1:
				$('h1.am-header-title').html('布防');
				break;
			case 2:
				$('h1.am-header-title').html('撤防');
				break;
			case 3:
				$('h1.am-header-title').html('在线');
				break;
			case 4:
				$('h1.am-header-title').html('离线');
				break;
			case 5:
				$('h1.am-header-title').html('未明');
				break;
			case 6:
				$('h1.am-header-title').html('布防异常');
				statetext = "布防异常";
				break;
			case 7:
				$('h1.am-header-title').html('撤防异常');
				statetext = "撤防异常";
				break;
			case 8:
				$('h1.am-header-title').html('过去一天离线');
				statetext = "过去一天离线";
				break;
			case 9:
				$('h1.am-header-title').html('过去一周离线');
				statetext = "过去一周离线";
				break;
			/*case 10:
				$('h1.am-header-title').html('过去一天未明');
				statetext = "过去一天未明";
				break;*/
		}
		var page =1;
		$('#messageInstall').dropload({
		    scrollArea: window,
		    loadDownFn: function(me) {
		        o2o.request({
					url: o2o.path.dataQueryShopList,
					noWin: true,
					data: {
						type: type,
		                pageSize: 10,
		                pageIndex: page
					},
					success: function(respones) {
						if (respones.list.length > 0) {
							for (var i = 0; i < respones.list.length; i++) {
								var state = respones.list[i].shopState;
								switch (parseInt(type)) {
									case 1:
										respones.list[i].state = "布防";
										respones.list[i].stateicon = "am-icon-lock";
										respones.list[i].statetext = "success";
										break;
									case 2:
										respones.list[i].state = "撤防";
										respones.list[i].stateicon = "am-icon-unlock";
										respones.list[i].statetext = "default";
										break;
									case 3:
										respones.list[i].state = "在线";
										respones.list[i].stateicon = "am-icon-sun-o";
										respones.list[i].statetext = "success";
										break;
									case 4:
										respones.list[i].state = "离线";
										respones.list[i].stateicon = "am-icon-chain";
										respones.list[i].statetext = "default";
										break;
									case 5:
										respones.list[i].state = "未明";
										respones.list[i].stateicon = "am-icon-chain";
										respones.list[i].statetext = "warning";
										break;
									default:
										respones.list[i].state = statetext;
										respones.list[i].stateicon = "am-icon-chain";
										respones.list[i].statetext = "warning";
										break;
								}
								
							}
							if(respones.list.length < 10){
			                    me.lock();
			                    me.noData();
							}
						} else {
							//respones.nomessage = "暂无更多数据";
		                    me.lock();
		                    me.noData();
						}
						list.append(tpl2(respones));
						if(type==6 || type==7){
							me.lock();
		                    me.noData();
						}
    					me.resetload();
					},

					fail: function(code, error) {
						//o2o.prompt(error);
		                me.lock();
		                me.noData();
		                me.resetload();
					}
				});
		        page++;
		    }
		});
	} else if ($.trim(stateU)) {
		var statetext = "",
			url = o2o.path.queryShopListByShopTimeState;
		switch (parseInt(stateU)) {
			case 0:
				$('h1.am-header-title').html('已到期');
				statetext = '已到期';
				break;
			case 1:
				$('h1.am-header-title').html('3天内到期');
				statetext = '3天内到期';
				break;
			case 2:
				$('h1.am-header-title').html('7天内到期');
				statetext = '7天内到期';
				break;
			case 3:
				$('h1.am-header-title').html('15天内到期');
				statetext = '15天内到期';
				break;
			case 4:
				$('h1.am-header-title').html('30天内到期');
				statetext = '30天内到期';
				break;
			case 5:
				$('h1.am-header-title').html('30天以上');
				statetext = '30天以上';
				break;
		}
		var page =1;
		$('#messageInstall').dropload({
		    scrollArea: window,
		    loadDownFn: function(me) {
		        o2o.request({
					url: o2o.path.queryShopListByShopTimeState,
					noWin:true,
					data: {
						state:stateU,
		                pageSize: 10,
		                pageIndex: page
					},
					success: function(respones) {
						if (respones.list && respones.list.length > 0) {
							for (var i = 0; i < respones.list.length; i++) {
								/*switch (parseInt(respones.list[i].defenceState)) {
									case 0:
										respones.list[i].state = "撤防";
										respones.list[i].stateicon = "am-icon-unlock";
										respones.list[i].statetext = "default";
										break;
									case 1:
										respones.list[i].state = "布防";
										respones.list[i].stateicon = "am-icon-lock";
										respones.list[i].statetext = "success";
										break;
									default:
										respones.list[i].state = "未明";
										respones.list[i].stateicon = "am-icon-chain";
										respones.list[i].statetext = "warning";
										break;
								}*/
								respones.list[i].state = statetext;
								respones.list[i].stateicon = "am-icon-chain";
								respones.list[i].statetext = "danger";
								respones.list[i].simStartTime = new Date(respones.list[i].simStartTime).Format('yyyy-MM-dd');
								respones.list[i].simEndTime = new Date(respones.list[i].simEndTime).Format('yyyy-MM-dd');
							}
							if(respones.list.length < 10){
			                    me.lock();
			                    me.noData();
							}
						} else {
							//respones.nomessage = "暂无更多数据";
		                    me.lock();
		                    me.noData();
						}
						list.append(tpl3(respones));
						me.resetload();
					},

					fail: function(code, error) {
						//o2o.prompt(error);
		                me.lock();
		                me.noData();
		                me.resetload();
					}
				});
		        page++;
		    }
		});
		
	}else if ($.trim(shopState)) {
		switch (parseInt(shopState)) {
			case 0:
				$('h1.am-header-title').html('安装中');
				break;
			case 2:
				$('h1.am-header-title').html('设备变更中');
				break;
			case 3:
				$('h1.am-header-title').html('移机中');
				break;
			case 4:
				$('h1.am-header-title').html('拆机中');
				break;
			case 5:
				$('h1.am-header-title').html('套餐变更中');
				break;
		}
		var page =1;
		$('#messageInstall').dropload({
		    scrollArea: window,
		    loadDownFn: function(me) {
		        o2o.request({
					url: o2o.path.customerQueryInstallationTaskdue,
					noWin:true,
					data: {
						shopState:shopState,
		                pageSize: 10,
		                pageIndex: page
					},
					success: function(respones) {
						if (respones.list && respones.list.length > 0) {
							for (var i = 0; i < respones.list.length; i++) {
								var state = respones.list[i].shopState;
								switch (state) {
									case 0:
										respones.list[i].state = "安装中";
										respones.list[i].stateicon = "am-icon-chain";
										respones.list[i].statetext = "primary";
										break;
									case 1:
										respones.list[i].state = "正常";
										respones.list[i].stateicon = "am-icon-check";
										respones.list[i].statetext = "success";
										break;
									case 2:
										respones.list[i].state = "设备变更中";
										respones.list[i].stateicon = "am-icon-ticket";
										respones.list[i].statetext = "primary";
										break;
									case 3:
										respones.list[i].state = "移机中";
										respones.list[i].stateicon = "am-icon-chain";
										respones.list[i].statetext = "warning";
										break;
									case 4:
										respones.list[i].state = "拆机中";
										respones.list[i].stateicon = "am-icon-chain";
										respones.list[i].statetext = "warning";
										break;
									case 5:
										respones.list[i].state = "套餐变更中";
										respones.list[i].stateicon = "am-icon-ticket";
										respones.list[i].statetext = "primary";
										break;
									case 6:
										respones.list[i].state = "停止服务";
										respones.list[i].stateicon = "am-icon-remove";
										respones.list[i].statetext = "danger";
										break;
								}
							}
							if(respones.list.length < 10){
			                    me.lock();
			                    me.noData();
							}
						} else {
							//respones.nomessage = "暂无更多数据";
		                    me.lock();
		                    me.noData();
						}
						list.append(tpl(respones));
		                me.resetload();
					},

					fail: function(code, error) {
						//o2o.prompt(error);
		                me.lock();
		                me.noData();
		                me.resetload();
					}
				});
		        page++;
		    }
		});
		
	}else if($.trim(shopStyle)){
		
		$('h1.am-header-title').html('店铺列表');
		var page =1;
		$('#messageInstall').dropload({
		    scrollArea: window,
		    loadDownFn: function(me) {
		        o2o.request({
					url: o2o.path.queryShopListByShopStyle,
					noWin:true,
					data: {
						shopStyle:shopStyle,
		                pageSize: 10, 
		                pageIndex: page
					},
					success: function(respones) {
						if (respones.list && respones.list.length > 0) {
							for (var i = 0; i < respones.list.length; i++) {
								var state = respones.list[i].shopState;
								switch (state) {
									case 0:
										respones.list[i].state = "安装中";
										respones.list[i].stateicon = "am-icon-chain";
										respones.list[i].statetext = "primary";
										break;
									case 1:
										respones.list[i].state = "正常";
										respones.list[i].stateicon = "am-icon-check";
										respones.list[i].statetext = "success";
										break;
									case 2:
										respones.list[i].state = "设备变更中";
										respones.list[i].stateicon = "am-icon-ticket";
										respones.list[i].statetext = "primary";
										break;
									case 3:
										respones.list[i].state = "移机中";
										respones.list[i].stateicon = "am-icon-chain";
										respones.list[i].statetext = "warning";
										break;
									case 4:
										respones.list[i].state = "拆机中";
										respones.list[i].stateicon = "am-icon-chain";
										respones.list[i].statetext = "warning";
										break;
									case 5:
										respones.list[i].state = "套餐变更中";
										respones.list[i].stateicon = "am-icon-ticket";
										respones.list[i].statetext = "primary";
										break;
									case 6:
										respones.list[i].state = "停止服务";
										respones.list[i].stateicon = "am-icon-remove";
										respones.list[i].statetext = "danger";
										break;
									default:
										respones.list[i].state = "未明";
										respones.list[i].stateicon = "am-icon-chain";
										respones.list[i].statetext = "warning";
										break;
								}
							}
							if(respones.list.length < 10){
			                    me.lock();
			                    me.noData();
							}
						} else {
							//respones.nomessage = "暂无更多数据";
		                    me.lock();
		                    me.noData();
						}
						list.append(tpl(respones));
		                me.resetload();
					},

					fail: function(code, error) {
						//o2o.prompt(error);
		                me.lock();
		                me.noData();
		                me.resetload();
					}
				});
		        page++;
		    }
		});
	}
		
}, false);