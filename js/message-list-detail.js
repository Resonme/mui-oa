mui.plusReady(function(){
	var tpl = Handlebars.compile(
		'<div class="mui-content-padded">'+
		'	<h3>{{title}}</h3>'+
		'	<p>'+
		'		<span class="mui-badge mui-badge-inverted">{{createDate}}</span>  '+
		'		<span class="mui-badge mui-badge-inverted" style="margin-left: 20px;">接收人：{{receiveName}}</span>'+
		'	</p>'+
		'</div>'+
		'<p id="content" class="mui-content-padded">{{content}}</p>'
	);
	var cw = plus.webview.currentWebview();
	var noticeId = cw.noticeId;
	o2o.request({
		url: o2o.path.customerViewNoticeDetails,
		noWin: true,
		data: {
			noticeId: noticeId
		},
		success: function(respones) {
			var receiveName = [];
			if (respones.noticeDetail.employeeReceiver == 1) {
				receiveName.push("员工");
			}
			if (respones.noticeDetail.customerReceiver == 1) {
				receiveName.push("客户");
			}
			if (respones.noticeDetail.guardReceiver == 1) {
				receiveName.push("巡逻人员");
			}
			respones.noticeDetail.receiveName = receiveName.toString();
			respones.noticeDetail.createDate = new Date(respones.noticeDetail.createDate).Format('yyyy-MM-dd hh:mm:ss');
			$('#content').html(tpl(respones.noticeDetail));
		},

		fail: function(code, error) {
			o2o.prompt(error);
		}
	});
});