document.addEventListener('plusready', function() {	
	var tpl = Handlebars.compile(
		'   {{#each list}}' +
		'    <li>' +
		'      <div class="warning am-cf">' +
		'          <div class="am-u-sm-3 left panel-table">' +
		'            <div class="panel-table-cell">' +
		'             <span class="{{stateicon}}"></span><br>' +
		'             <span>{{state}}</span>' +
		'            </div>' +
		'          </div>' +
		'          <div class="am-u-sm-9 right">' +
		'            <p class="am-text-truncate">派警时间：<span class="">{{createDate}}</span></p>' +
		'            <p class="am-text-truncate">派警来源：<span class="am-text-danger">{{type}}</span></p>' +
		'            <p class="am-text-truncate">{{alarmdoType}}{{handlerStr}}</p>' + 
		'          </div>' +
		'      </div>' +
		'    </li>' +
		'   {{/each}}'),

	list = $('#list'),

	shopId = o2o.getUrlParam('shopId'),
	
	page = 1,

	getTimeData = function() {
		page =1;
		var data = {
				shopId: shopId,
				type : 1,
				pageSize:10,
				pageIndex:page
			},
			sTime = $('input[name=sTime]').val(),
			eTime = $('input[name=eTime]').val();
		if ($.trim(sTime)) {
			data.sTime = sTime + " 00:00:00";
		}
		if ($.trim(eTime)) {
			data.eTime = eTime + " 23:59:59";
		}
		if( new Date(sTime).getTime() > new Date(eTime).getTime() ){
			o2o.prompt('开始时间不能大于结束时间');
			return;
		} 
		o2o.request({
			url: o2o.path.queryAlarmSendByShopId,
			data: {
				sTime : sTime + " 00:00:00",
				eTime : eTime + " 23:59:59",
				shopId: shopId,
				type : 1
			},
			success: function(respones) {
				$('.dropload-down').hide();
				if(respones.list && respones.list.length > 0){
					for(i=0;i<respones.list.length;i++){
						respones.list[i].alarmdoType = '出警人员：';
						switch(parseInt(respones.list[i].state)){
			  				case 0:
			  					respones.list[i].state = "处理中";
			  					respones.list[i].stateicon = "icon icon-treating";
			  					break;
			  				case 1:
			  					respones.list[i].state = "已处理";
			  					respones.list[i].stateicon = "icon icon-treated";
			  					break;
			  				case 2:
			  					respones.list[i].state = "已消警";
			  					respones.list[i].stateicon = "icon icon-cancel";
								respones.list[i].alarmdoType = '消警人员：';
			  					break;
			  				case 3:
			  					respones.list[i].state = "未处理";
			  					respones.list[i].stateicon = "icon icon-untreated";
			  					break;
			  				case 4:
			  					respones.list[i].state = "超时未处理";
			  					respones.list[i].stateicon = "icon icon-runtime";
			  					break;
			  			}
			  			if(respones.list[i].type == 1){
			  				respones.list[i].type = '人工派警';
			  			}else if(respones.list[i].type == 0){
			  				respones.list[i].type = '自动派警';
			  			}
			  			if(respones.list[i].createDate){
			  				respones.list[i].createDate = new Date(respones.list[i].createDate).Format('yyyy-MM-dd hh:mm:ss');
			  			}
			  			if( !$.trim(respones.list[i].handlerStr) ){
			  				respones.list[i].handlerStr = '-';
			  			}
		  			}
					list.html(tpl(respones));
				} else {
					list.html('<div class="no-data">暂无更多数据</div>');
				}
			},

			fail: function(code, error) {
				o2o.prompt(error);
			}
		});
		
	};

	var nowDay = new Date(),
		sTime = o2o.addDays(nowDay, -6),
		eTime = o2o.addDays(nowDay, 0);
	$('input[name=sTime]').val(sTime);
	$('input[name=eTime]').val(eTime);
	$('#shop-warning').dropload({
	    scrollArea: window,
	    loadDownFn: function(me) {
	        o2o.request({
				url: o2o.path.queryAlarmSendByShopId,
				noWin:true,
				data: {
					sTime : sTime + " 00:00:00",
					eTime : eTime + " 23:59:59",
					shopId: shopId,
					type : 1,
					pageSize:10,
					pageIndex:page
				},
				success: function(respones) {
					if (respones.list && respones.list.length > 0) {
						for(i=0;i<respones.list.length;i++){
							respones.list[i].alarmdoType = '出警人员：';
							switch(parseInt(respones.list[i].state)){
				  				case 0:
				  					respones.list[i].state = "处理中";
				  					respones.list[i].stateicon = "icon icon-treating";
				  					break;
				  				case 1:
				  					respones.list[i].state = "已处理";
				  					respones.list[i].stateicon = "icon icon-treated";
				  					break;
				  				case 2:
				  					respones.list[i].state = "已消警";
				  					respones.list[i].stateicon = "icon icon-cancel";
									respones.list[i].alarmdoType = '消警人员：';
				  					break;
				  				case 3:
				  					respones.list[i].state = "未处理";
				  					respones.list[i].stateicon = "icon icon-untreated";
				  					break;
				  				case 4:
				  					respones.list[i].state = "超时未处理";
				  					respones.list[i].stateicon = "icon icon-runtime";
				  					break;
				  			}
				  			if(respones.list[i].type == 1){
				  				respones.list[i].type = '人工派警';
				  			}else if(respones.list[i].type == 0){
				  				respones.list[i].type = '自动派警';
				  			}
				  			if(respones.list[i].createDate){
				  				respones.list[i].createDate = new Date(respones.list[i].createDate).Format('yyyy-MM-dd hh:mm:ss');
				  			}
				  			if( !$.trim(respones.list[i].handlerStr) ){
				  				respones.list[i].handlerStr = '-';
				  			}
						}
					} else {
						//o2o.prompt('未查询到该时间段警情');
	                    me.lock()
	                    me.noData();
					}
					list.append(tpl(respones));
			 		me.resetload();
				},

				fail: function(code, error) {
					o2o.prompt(error);
	                me.lock()
	                me.noData();
	                me.resetload();
				}
			});
	        page++;
	        $('#search').off('click').on('click', function() {
	        	me.lock()
                me.noData();
				getTimeData();
			});
	    }
	});
	
	$('#startDate,#endDate').on('click', function(){
		var _self = $(this);
		var picker = new mui.DtPicker({
			type: "date",
			value: $(this).val()
		});
		picker.show(function(rs) {
			_self.val(rs.text);
			picker.dispose();
		});
	});
}, false);