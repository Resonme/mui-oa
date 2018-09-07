document.addEventListener('plusready', function() {	
	var tpl = Handlebars.compile(
		'   {{#each list}}' +
		'    <li onclick="{{localhref}}">' +
		'      <div class="warning am-cf">' +
		'          <div class="am-u-sm-3 left panel-table">' +
		'            <div class="panel-table-cell">' +
		'             <span class="{{stateicon}}"></span>' +
		'             <span>{{state}}</span>' +
		'            </div>' +
		'          </div>' +
		'          <div class="am-u-sm-9 right">' +
		/*'            <p class="am-text-truncate">' +
		'              <span class="am-icon-university"></span>' +
		'              <a href="javascript:void(0)">{{shopName}} ' +
		'                <span class="am-icon-chevron-circle-right {{hide}}"></span>' +
		'              </a>' +
		'            </p>' +*/
		'            <p class="am-text-truncate"><span class="am-icon-bolt"></span><span class="am-text-danger">{{alarmStyle}}</span></p>' +
		'            <p class="am-text-truncate"><span class="am-icon-map-marker"></span>{{protectedName}}</p>' +
		'            <p class="am-text-truncate"><span class="am-icon-location-arrow"></span>{{createDate}}</p>' +
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
			url: o2o.path.shopAlarmList,
			data: {
				sTime : sTime + " 00:00:00",
				eTime : eTime + " 23:59:59",
				shopId: shopId,
				type : 1
			},
			success: function(respones) {
				$('.dropload-down').hide();
				if (respones.list && respones.list.length > 0) {
					for (var i = 0; i < respones.list.length; i++) {
						switch (parseInt(respones.list[i].state)) {
							case 1:
								respones.list[i].state = "已派警";
								respones.list[i].stateicon = "am-icon-check am-text-success";
								break;
							default:
								respones.list[i].state = "未派警";
								respones.list[i].stateicon = "am-icon-remove am-text-danger";
								break;
						}
						respones.list[i].createDate = new Date(respones.list[i].createDate).Format('yyyy-MM-dd hh:mm:ss');
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
				url: o2o.path.shopAlarmList,
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
						for (var i = 0; i < respones.list.length; i++) {
							switch (parseInt(respones.list[i].state)) {
								case 1:
									respones.list[i].state = "已派警";
									respones.list[i].stateicon = "am-icon-check am-text-success";
									break;
								default:
									respones.list[i].state = "未派警";
									respones.list[i].stateicon = "am-icon-remove am-text-danger";
									break;
							}
							respones.list[i].createDate = new Date(respones.list[i].createDate).Format('yyyy-MM-dd hh:mm:ss');
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