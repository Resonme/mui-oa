document.addEventListener('plusready', function() {	
	var _list = $('#list'),
		tpl = Handlebars.compile(
			'{{#each list}}' +
			'<li id="{{serviceId}}" class="mui-table-view-cell mui-media" data-shopid="{{shopId}}" data-serviceid="{{serviceId}}">' +
			'	<a class="mui-navigate-right">' +
			'       <div class="mui-media-object mui-pull-left">' +
			'             <span class="{{icon}}" style="margin:10px 0 0;"></span>' +
			'             <p>{{examineState}}</p>' +
			'             <p style="font-size:12px;">({{serviceType}})</p>' +
			'       </div>' +
			'		<div class="mui-media-body">' +
			'			<p class="mui-ellipsis"><span class="icon-shop"></span>{{shopNo}}-{{shopName}}</p>' +
			'			<p class="mui-ellipsis"><span class="icon-area"></span>{{areaName}}</p>' +
			'			<p class="mui-ellipsis"><span class="icon-address"></span>{{shopAddress}}</p>' +
			'			<p class="mui-ellipsis"><span class="icon-time"></span><span class="{{timechange}} am-link-muted" title="{{createDate}}">{{createDate}}</span></p>' +
			'		</div>' +
			'	</a>' +
			'</li>' +
			'{{/each}}');
	var liEvent = function(){
		mui('#list').off('tap', 'li');
		mui('#list').on('tap', 'li',function(){
			var shopId = $(this).data('shopid');
			var serviceId = $(this).data('serviceid');
			mui.openWindow({
				url:"message-install-detail.html",
				extras:{
					shopId:shopId,
					serviceId:serviceId
				}
			});
		});
	};
	
	var count = 1, areaId, serviceType, examineState;
	var pullupRefresh = function(){
		var shopNo = $('#shopNo').val();
		if(count == 1){
			$('#list').html('');
		}
		var data = {
			pageSize: 10,
			pageIndex: count
		};
		if($.trim(areaId)){
			data.areaId = areaId;
		}
		if($.trim(serviceType)){
			data.serviceType = serviceType;
		}
		if($.trim(examineState)){
			data.examineState = examineState;
		}
		if($.trim(shopNo)){
			data.shopNo = shopNo;
		}
		o2o.request({
			url: o2o.path.queryShopServiceListByApp,
			noWin: true,
			data: data,
			success: function(respones) {
				count++;
				if (respones.list && respones.list.length > 0) {
					for (var i = 0; i < respones.list.length; i++) {
						var click = "alert(12345)";
						switch (respones.list[i].examineState) {
							case 0:
								respones.list[i].examineState = "待审核";
								respones.list[i].icon = "icon-ready"; 
								break;
							case 1:
								respones.list[i].examineState = "进行中";
								respones.list[i].icon = "icon-doing"; 
								break;
							case 2:
								respones.list[i].examineState = "未通过";
								respones.list[i].icon = "icon-close"; 
								/*if(respones.list[i].serviceType == 0){
									click = "window.location.href ='customer-info-new-install.html?shopId=" + respones.list[i].shopId + "&serviceId=" + respones.list[i].serviceId + "'";
								}else{
									click = "window.location.href ='shop-business-add.html?shopId=" + respones.list[i].shopId + "&serviceId=" + respones.list[i].serviceId + "'";
								}*/
								break;
						}
						switch (respones.list[i].serviceType) {
							case 0:
								respones.list[i].serviceType = "安装";
								break;
							case 2:
								respones.list[i].serviceType = "设备变更";
								break;
							case 3:
								respones.list[i].serviceType = "移机";
								break;
							case 4:
								respones.list[i].serviceType = "拆机";
								break;
							case 5:
								respones.list[i].serviceType = "套餐变更";
								break;
						}
						var d =(new Date().getTime() - respones.list[i].createDate)/(24*60*60*1000);
						if(d <= 7){
							respones.list[i].timechange = "time-change-text";
						}
						respones.list[i].createDate = new Date(respones.list[i].createDate).Format('yyyy-MM-dd hh:mm:ss');
						//respones.list[i].click = click;
					}
					mui('#pullrefresh').pullRefresh().refresh(true);
					mui('#pullrefresh').pullRefresh().endPullupToRefresh((respones.list.length < data.pageSize));
				} else {
					mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);
				}
				$('#list').append(tpl(respones));
				liEvent();
				$('.time-change-text').timeago();
			},
			fail: function(code, error) {
				mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);
				o2o.prompt(error);
			}
		});
	};
	
	mui.init({
		pullRefresh: {
			container: '#pullrefresh',
			up: {
				contentrefresh: '正在加载...', 
				callback: pullupRefresh
			}
		}
	});
	var cw = plus.webview.currentWebview();
	var searchState = cw.searchState;
	if($.trim(searchState)){
		$('form').on('submit', function(){
			var shopNo = $('#shopNo').val();
			var reg = /^[\u4E00-\u9FA5A-Za-z0-9]{0,20}$/;
			if(!shopNo.match(reg)){
				o2o.prompt('搜索条件格式有误！');
				return;
			}
			if ($.trim(shopNo)) {
				$('#shopNo').blur();
				count = 1;
				setTimeout(function(){
					mui('#pullrefresh').pullRefresh().pullupLoading(); 
				}, 200);
			}else{
				o2o.prompt('请输入搜索内容！');
			}
		});
	}else{
		if (mui.os.plus) {
			mui.plusReady(function() {
				setTimeout(function(){
					mui('#pullrefresh').pullRefresh().pullupLoading();
				}, 500);
			});
		} else {
			mui.ready(function() {
				setTimeout(function(){
					mui('#pullrefresh').pullRefresh().pullupLoading(); 
				}, 500); 
			});
		}
	}
	
	mui('.mui-popover .mui-scroll-wrapper').scroll({
	    bounce: false,
	    indicators: false
	});
	var checkSelect = function(){
		$('.o2o-select>.o2o-select-item').on('click', function(){
			var href = $(this).data('href');
			if($(this).hasClass('active')){
				mui(href).popover('hide');
			}else{
				$(this).addClass('active').siblings().removeClass('active');
				mui(href).popover('show');
			}
		});
		
		mui('body').on('hidden', '.mui-popover', function(e) {
			if( !$('.mui-popover').hasClass('mui-active') ){
				$('.o2o-select>.o2o-select-item.active').removeClass('active');
			}
		});
		
		var areas = JSON.parse(localStorage.areas);
		$(areas).each(function(){
			$('#areaPanel').append(
				'<li class="mui-table-view-cell" data-areaid="'+this.areaId+'"><a><span class="text">'+this.areaName+'</span><span class="mui-badge mui-badge-inverted">5</span></a></li>'
			);
		});
		$('#areaPanel>li').on('click', function(){
			areaId = $(this).data('areaid');
			var areaText = $(this).find('span.text').text();
			$('#areaText').text(areaText);
			if(!$(this).hasClass('mui-active')){
				$(this).addClass('mui-active').siblings().removeClass('mui-active');
			}
			mui('.mui-popover').popover('hide');
			
			//列表
			count = 1;
			mui('#pullrefresh').pullRefresh().pullupLoading();
		});
		
		$('#statePanel>li').on('click', function(){
			examineState = $(this).data('examinestate');
			var taskText = $(this).find('.text').text();
			if(!$(this).hasClass('mui-active')){
				$(this).addClass('mui-active').siblings().removeClass('mui-active');
			}
			$('#stateText').text(taskText);
			mui('.mui-popover').popover('hide');
			//列表
			count = 1;
			mui('#pullrefresh').pullRefresh().pullupLoading();
		});
		
		$('#typePanel>li').on('click', function(){
			serviceType = $(this).data('servicetype');
			var taskText = $(this).find('.text').text();
			if(!$(this).hasClass('mui-active')){
				$(this).addClass('mui-active').siblings().removeClass('mui-active');
			}
			$('#typeText').text(taskText);
			mui('.mui-popover').popover('hide');
			//列表
			count = 1;
			mui('#pullrefresh').pullRefresh().pullupLoading();
		});
		
		$('.mui-backdrop').on('click', function(e){
			e.stopPropagation();
		});
	};
	
	checkSelect();
	
	window.addEventListener('changeState', function(e){
		var state = parseInt(e.detail.state);
		var serviceId = parseInt(e.detail.serviceId);
		switch(state){
			case 1:
				$('#'+serviceId).find('.icon-ready').next().html('进行中');
				$('#'+serviceId).find('.icon-ready').addClass('icon-doing').removeClass('icon-ready');
				break;
			case 2:
				$('#'+serviceId).find('.icon-ready').next().html('未通过');
				$('#'+serviceId).find('.icon-ready').addClass('icon-close').removeClass('icon-ready');
				break;
			case 3:
				$('#'+serviceId).remove();
				break;
		}
	});
	
	$('#toSearch').on('click', function(){
		mui.openWindow({
			url:"search-task.html",
			extras:{
				searchState:1
			}
		});
	});
}, false);