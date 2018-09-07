document.addEventListener('plusready', function() {	
	var tpl = Handlebars.compile(
		'          <table class="am-table am-table-bordered am-table-centered">' +
		'            <thead class="head">' +
		'              <tr>' +
		'                <th>布撤防状态</th>' +
		'                <th>操作人</th>' +
		'                <th>时间</th>' +
		'              </tr>' +
		'            </thead>' +
		'           {{#each list}}' +
		'            <tr>' +
		'              <td>{{alarmStyle}}</td>' +
		'              <td>{{handerDescribe}}</td>' +
		'              <td>{{time}}</td>' +
		'            </tr>' +
		'           {{/each}}' +
		'           {{#if nullMessage}}' +
		'            <tr>' +
		'              <td colspan=3>{{nullMessage}}</td>' +
		'            </tr>' +
		'           {{/if}}' +
		'          </table>'),

	list = $('#list'),

	shopId = o2o.getUrlParam('shopId'),

	getTimeData = function() {
		var startDate = $('input[name=startDate]').val() + " 00:00:00",
			endDate = $('input[name=endDate]').val() + " 23:59:59";
		if( new Date(startDate).getTime() > new Date(endDate).getTime() ){
			o2o.prompt('开始时间不能大于结束时间');
			return;
		} 
		o2o.request({
			url: o2o.path.shopDefenceList,
			data: {
				sTime: startDate,
				eTime: endDate,
				shopId: shopId
			},
			success: function(respones) {
				if (!respones.list || respones.list.length == 0) {
					respones.nullMessage = "没有查询到数据";
				} else {
					for (var i = 0; i < respones.list.length; i++) {
						respones.list[i].time = new Date(respones.list[i].time).Format('yyyy-MM-dd hh:mm:ss');
					}
				}

				list.html(tpl(respones));
			},

			fail: function(code, error) {
				o2o.prompt(error);
			}
		});
	};

	var nowDay = new Date();
	$('input[name=startDate]').val(o2o.addDays(nowDay, -6));
	$('input[name=endDate]').val(o2o.addDays(nowDay, 0));
	getTimeData();
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
	$('#search').on('click', function() {
		getTimeData();
	});
}, false);