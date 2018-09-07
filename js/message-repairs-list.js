document.addEventListener('plusready', function() {	
	var tpl = Handlebars.compile(
			'{{#each list}}' +
			'<li id="{{repairId}}" class="mui-table-view-cell mui-media">' +
			'	<a class="mui-navigate-right">' +
			'       <div class="mui-media-object mui-pull-left">' +
			'             <span class="{{icon}}" style="margin:15px 0 0;"></span>' +
			'             <p>{{repairState}}</p>' +
			'       </div>' +
			'		<div class="mui-media-body">' +
			'			<p class="mui-ellipsis"><span class="icon-odd"></span>单&nbsp;&nbsp;&nbsp;&nbsp;号：{{repairNO}}</p>' +
			'			<p class="mui-ellipsis"><span class="icon-area"></span>区&nbsp;&nbsp;&nbsp;&nbsp;域：{{areaName}}</p>' +
			'			<p class="mui-ellipsis"><span class="icon-proposer"></span>申请人：{{customerName}}</p>' +
			'			<p class="mui-ellipsis"><span class="icon-time"></span>时&nbsp;&nbsp;&nbsp;&nbsp;间：<span class="{{timechange}} am-link-muted" title="{{createDate}}">{{createDate}}</span></p>' +
			'		</div>' +
			'	</a>' +
			'</li>' +
			'   {{/each}}' ),
	areaId,repairState,shopNo

	list = $('#list'),
	shopId = o2o.getUrlParam('shopId') || "",
	listEvent = function(){
		mui('#list').off('tap', 'li');
		mui('#list').on('tap', 'li',function(){
			var repairId = $(this).attr('id');
			console.log();
			mui.openWindow({
				url:'message-repairs-info.html',
				extras:{
					repairId:repairId,
					shopId:shopId
				}
			});
		});
	};
	
	var count = 1; 
	var pullupRefresh = function(){
		var shopNo = $('#shopNo').val();
		if( count == 1){
			list.html('');
		}
		var data = {
			pageSize:10,
			pageIndex:count
		};
		if ($.trim(shopId)) {
			data.shopId = shopId;
		}
		if ($.trim(areaId)) {
			data.areaId = areaId;
		}
		if ($.trim(repairState)) {
			data.repairState = repairState;
		}
		if ($.trim(shopNo)) {
			data.shopNo = shopNo;
		}
		o2o.request({
			url: o2o.path.queryRepairListByApp,
			noWin:true,
			data: data,
			success: function(respones) {
				count++;
				if (respones.list && respones.list.length > 0) {
					for (var i = 0; i < respones.list.length; i++) {
						var repairState = parseInt(respones.list[i].repairState);
						switch (repairState) {
							case 0:
								respones.list[i].repairState = "待指派";
								respones.list[i].icon = "icon-ready";
								break;
							case 1:
								respones.list[i].repairState = "已派单";
								respones.list[i].icon = "icon-doing";
								break;
							case 2:
								respones.list[i].repairState = "待评价";
								respones.list[i].icon = "icon-doing";
								break;
							case 3:
								respones.list[i].repairState = "已解决";
								respones.list[i].icon = "icon-doing";
								break;
						}
						if($.trim(shopId)){
							respones.list[i].shopId = shopId;
						}
						var d =(new Date().getTime() - respones.list[i].createDate)/(24*60*60*1000);
						if(d <= 7){
							respones.list[i].timechange = "time-change-text";
						}
						respones.list[i].createDate = new Date(respones.list[i].createDate).Format('yyyy-MM-dd hh:mm:ss');
					};
					mui('#pullrefresh').pullRefresh().refresh(true);
					mui('#pullrefresh').pullRefresh().endPullupToRefresh((respones.list.length < data.pageSize));
				} else {
					mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);
				}
				list.append(tpl(respones));
				listEvent();
				$('.time-change-text').timeago();
			},
			fail: function(code, error) {
				mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);
				o2o.prompt(error);
			}
		});
	}
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
		$('#statePanel>li').on('click', function(){
			repairState = $(this).data('repairstate');
			console.log(repairState);
			var stateText = $(this).find('span.text').text();
			$('#stateText').text(stateText);
			if(!$(this).hasClass('mui-active')){
				$(this).addClass('mui-active').siblings().removeClass('mui-active');
			}
			mui('.mui-popover').popover('hide');
			//列表
			count = 1;
			mui('#pullrefresh').pullRefresh().pullupLoading();
		});
		
		var areas = JSON.parse(localStorage.areas);
		$(areas).each(function(){
			$('#areaPanel').append(
				'<li class="mui-table-view-cell" data-areaid="'+this.areaId+'"><a><span class="text">'+this.areaName+'</span><span class="mui-badge mui-badge-inverted">5</span></a></li>'
			);
		});
		$('#areaPanel>li').on('click', function(){
			areaId = $(this).data('areaid');
			console.log(areaId);
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
		
		$('.mui-backdrop').on('click', function(e){
			e.stopPropagation();
		});
	};
	checkSelect();
	
	window.addEventListener('listRefresh', function(e){
		var repairId = e.detail.repairId;
		$('#'+repairId).find('.mui-media-object>p').html('已派单');
		$('#'+repairId).find('.mui-media-object>span').attr('class','icon-doing');
	});
	
	$('#toSearch').on('click', function(){
		mui.openWindow({
			url:"search-repair.html",
			extras:{
				searchState:1
			}
		});
	});
}, false);