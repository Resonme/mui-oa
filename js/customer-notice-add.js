document.addEventListener('plusready', function() {	
	var tpl = Handlebars.compile(
			'    <form class="mui-input-group" onsubmit="return false;" id="addForm">' +
			'      <div class="mui-input-row">' +
			'        <label class="am-u-sm-3 am-form-label">标题：</label>' +
			'          <input type="text" name="title" value="{{title}}" placeholder="请输入标题">' +
			'      </div>' +
			'      <div class="mui-input-row">' +
			'        <label class="am-u-sm-3 am-form-label">公告类型：</label>' +
			'		 <select name="type">'+
			'			<option value="1">公告</option>'+
			'			<option value="2">通知</option>'+
			'			<option value="3">故障</option>'+
			'		 </select>'+
			'		<a class="mui-navigate-right"></a>'+
			'      </div>' +
			'      <div class="mui-input-row">' +
			'        <label class="am-u-sm-3 am-form-label">接收人员：</label>' +
			'		 <select id="receiverTypeId" multiple>'+
			'			<option value="1">员工</option>'+
			'			<option value="2">客户</option>'+
			'			<option value="3">巡逻人员</option>'+
			'		 </select>'+
			'		<a class="mui-navigate-right"></a>'+
			'      </div>' +
			'      <div class="mui-input-row" style="height:auto;">' +
			'        <label class="am-u-sm-3 am-form-label">公告内容：</label>' +
			'          <textarea rows="4" class="form-control" name="content" placeholder="请输入公告内容">{{content}}</textarea>' +
			'      </div>' +
			'    </form>'),
		
		cw = plus.webview.currentWebview(),
		noticeId = cw.noticeId || o2o.getUrlParam('noticeId') || "",
		content = $('#content'),

		formEvent = function() {
			$.downselectInit();
			var url = o2o.path.customerCreateNotice;
			//发送
			$('#sendNotice').on('click', function() {
				var data = $('#addForm').serialize(),
					receives = $('#receiverTypeId').val(),
					title = $('input[name=title]').val(),
					content = $('textarea[name=content]').val();
				if(!$.trim(title)){
					o2o.prompt('标题不能为空');
					return;
				}else if(title.length>20){
					o2o.prompt('标题长度不能超过20位');
					return;
				}
				if(receives&&receives.length>0){
					for (var i = 0; i < receives.length; i++) {
						switch (parseInt(receives[i])) {
							case 1:
								data += "&employeeReceiver=1";
								break;
							case 2:
								data += "&customerReceiver=1";
								break;
							case 3:
								data += "&guardReceiver=1";
								break;
						}
					}
				}else{
					o2o.prompt('请选择接收人员！');
					return;
				}
				if(!$.trim(content)){
					o2o.prompt('公告内容不能为空');
					return;
				}else if(content.length>200){
					o2o.prompt('公告内容不能超过200位');
					return;
				}
				if (noticeId && $.trim(noticeId)) {
					data += "&noticeId=" + noticeId;
					url = o2o.path.customerModifyNotice;
				}
				data += "&isPublish=1";
				console.log(data);
				o2o.confirm('确定发送？', function(msg) {
					if (msg == "yes") {
						//发送消息
						o2o.request({
							url: url,
							data: data,
							success: function(respones) {
								o2o.prompt('发布成功', function() {
									mui.back();
								});
							},
							fail: function(code, error) {
								o2o.prompt(error);
							}
						});

					}
				});
				
			});
			//保存
			$('#saveNotice').on('click', function() {
				console.log($('#addForm').serialize());
				var data = $('#addForm').serialize(),
					receives = $('#receiverTypeId').val().split(',');

				for (var i = 0; i < receives.length; i++) {
					switch (parseInt(receives[i])) {
						case 1:
							data += "&employeeReceiver=1";
							break;
						case 2:
							data += "&customerReceiver=1";
							break;
						case 3:
							data += "&guardReceiver=1";
							break;

					}
				}
				if (noticeId && $.trim(noticeId)) {
					data += "&noticeId=" + noticeId;
					url = o2o.path.customerModifyNotice;
				}
				data += "&isPublish=0";
				o2o.request({
					url: url,
					data: data,
					validator: "#addForm",
					success: function(respones) {
						o2o.prompt('保存成功', function() {
							mui.back();
						});
					},

					fail: function(code, error) {
						o2o.prompt(error);
					}
				});
			});
			//删除
			$('#removeNotice').on('click', function() {
				o2o.confirm('确定删除？', function(msg) {
					if (msg == "yes") {
						o2o.request({
							url: o2o.path.customerModifyNotice,
							data: {
								noticeId: noticeId,
								isDelete: 1
							},
							success: function(respones) {
								o2o.prompt('删除成功', function() {
									window.location.href = "customer-notice-list.html";
								});
							},

							fail: function(code, error) {
								o2o.prompt(error);
							}
						});
					}
				});
			});
		};

	if (noticeId && $.trim(noticeId)) {
		$('h1.am-header-title').html('修改公告');
		o2o.request({
			url: o2o.path.customerViewNoticeDetails,
			data: {
				noticeId: noticeId
			},
			success: function(respones) {
				switch (respones.noticeDetail.type) {
					case 1:
						respones.noticeDetail.styleName = "公告";
						break;
					case 2:
						respones.noticeDetail.styleName = "通知";
						break;
					case 3:
						respones.noticeDetail.styleName = "故障";
						break;
				}
				content.html(tpl(respones.noticeDetail));

				var receives = [],
					receiveName = [];
				if (respones.noticeDetail.employeeReceiver == 1) {
					receives.push(1);
					receiveName.push("员工");
				}
				if (respones.noticeDetail.customerReceiver == 1) {
					receives.push(2);
					receiveName.push("客户");
				}
				if (respones.noticeDetail.guardReceiver == 1) {
					receives.push(3);
					receiveName.push("巡逻人员");
				}
				$('#receiverTypeId').val(receives.toString());
				$('#receiverTypeId').next().val(receiveName.toString());
				formEvent();
			},

			fail: function(code, error) {
				o2o.prompt(error);
			}
		});
	} else {
		content.html(tpl());
		$('#removeNotice').remove();
		formEvent();
	}
}, false);