document.addEventListener('plusready', function() {	
	var tpl = Handlebars.compile(
			'{{#each list}}' +
			'<dl class="am-accordion-item">' +
			'        <dt class="am-accordion-title">' +
			'          <div class="am-cf">' +
			'            <div class="am-u-sm-6 am-text-truncate {{textcolor}}">{{title}}</div>' +
			'            <div class="am-u-sm-6 am-text-truncate am-text-right">{{createDate}}</div>' +
			'          </div>' +
			'        </dt>' +
			'        <dd class="am-accordion-bd am-collapse ">' +
			'          <div class="am-accordion-content">' +
			'            <div class="am-text-right {{hide}}">' +
			'              <a href="customer-notice-add.html?noticeId={{noticeId}}" class="am-btn am-btn-primary am-btn-xs am-margin-bottom-sm">编辑</a>' +
			'              <button type="button" data-id="{{noticeId}}" class="am-btn am-btn-danger am-btn-xs am-margin-bottom-sm sendNotice">发布</button>' +
			'            </div>' +
			'            <p>{{content}}</p>' +
			'          </div>' +
			'        </dd>' +
			'      </dl>' +
			'     {{/each}}'+
			'{{#if nodata}}	 <div class="nodata">暂无更多数据！</div>	{{/if}}'),

		list = $('#list'),

		searchBtn = $('#search'),

		listEvent = function() {
			$('button.sendNotice').on('click', function() {
				var noticeId = $(this).data('id');
				o2o.confirm('确定发送？', function(msg) {
					if (msg == "yes") {
						//发送消息
						o2o.request({
							url: o2o.path.customerModifyNotice,
							data: {
								noticeId: noticeId,
								isPublish: 1
							},
							success: function(respones) {
								o2o.prompt('发布成功', function() {
									window.location.reload();
								});
							},

							fail: function(code, error) {
								o2o.prompt(error);
							}
						});
					}
				});

			});
		},

		getTimeData = function() {
			var startDate = $('#startDate').val(),
				endDate = $('#endDate').val();
			if( new Date(startDate).getTime() > new Date(endDate).getTime() ){
				o2o.prompt('开始时间不能大于结束时间');
				return;
			}
			o2o.request({
				url: o2o.path.customerQueryNotices,
				data: {
					sDate: startDate,
					eDate: endDate
				},
				success: function(respones) {
					if(respones.list &&respones.list.length>0){
						for (var i = 0; i < respones.list.length; i++) {
							respones.list[i].createDate = new Date(respones.list[i].createDate).Format('yyyy-MM-dd hh:mm:ss');
							if (respones.list[i].isPublish == 1) {
								respones.list[i].hide = "am-hide";
							}
							if (respones.list[i].isPublish == 0) {
								respones.list[i].textcolor = "am-text-danger";
							}
							respones.list[i].content = new Handlebars.SafeString(respones.list[i].content.replace(/\n/g, '<br>'));
						}
					}else{
						respones.nodata = 1;
					}
					list.html(tpl(respones));
					listEvent();
					resetUI();
				},

				fail: function(code, error) {
					o2o.prompt(error);
				}
			});
		},

		resetUI = function() {
			$.each(['accordion'], function(i, m) {
				var module = $.AMUI[m];
				module && module.init && module.init();
			});
		};

		searchBtn.on('click', function() {
			getTimeData();
		});
		var nowDay = new Date();
		$('#startDate').val(o2o.addDays(nowDay, -6));
		$('#endDate').val(o2o.addDays(nowDay, 0));
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
}, false);