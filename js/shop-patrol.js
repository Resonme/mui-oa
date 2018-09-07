document.addEventListener('plusready', function() {	
	var tpl = Handlebars.compile(
			'<table class="am-table am-table-bordered am-table-centered content-bg">' +
			'    <thead class="head">' +
			'      <th>巡逻时间</th>' +
			'      <th>巡逻人员</th>' +
			'    </thead>' +
			' {{#each list}}' +
			'    <tr>' +
			'      <td>{{createDate}}</td>' +
			'      <td>{{person}}</td>' +
			'    </tr>' +
			' {{/each}}' +
			' {{#if nullMessage}}' +
			'    <tr>' +
			'      <td colspan="2">{{nullMessage}}</td>' +
			'    </tr>' +
			' {{/if}}' +
			'  </table>'),

		list = $('#list'),

		shopId = o2o.getUrlParam('shopId'),

		today = new Date().Format('yyyy-MM-dd'),

		list = $('#patrol'),

		getTimeData = function(d) {
			o2o.request({
				url: o2o.path.shopInspectionRecordsList,
				data: {
					shopId: shopId,
					sTime: d,
					eTime: d
				},
				success: function(respones) {
					if (respones.list && respones.list.length > 0) {
						for (var i = 0; i < respones.list.length; i++) {
							respones.list[i].createDate = new Date(respones.list[i].createDate).Format('yyyy-MM-dd hh:mm:ss');
						};
					} else {
						respones.nullMessage = "暂无巡逻记录";
					}
					list.html(tpl(respones));
				},

				fail: function(code, error) {
					var respones = {
						nullMessage: "暂无巡逻记录"
					};
					list.html(tpl(respones));
					//o2o.prompt(error);
				}
			});
		};

	getTimeData(today);
	$('#datepicker').datepicker('open').on('changeDate.datepicker.amui', function(event) {
		var date = event.date,
			year = date.getFullYear(),
			month = date.getMonth() + 1,
			day = date.getDate(),
			time = year + '-' + month + '-' + day;
		getTimeData(time);
	});
}, false);