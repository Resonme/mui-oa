document.addEventListener('plusready', function() {	
	var tpl = Handlebars.compile(
		'{{#each notices}}' +
		'<li class="mui-table-view-cell mui-media" data-noticeid="{{noticeId}}">' +
		'	<a class="mui-navigate-right">' +
		'		<p class="mui-ellipsis">【 {{title}} 】 {{content}}</p>' +
		'		<p class="mui-ellipsis"><span class="mui-badge mui-badge-inverted {{timechange}}" title="{{createDate}}">{{createDate}}</span></p>' +
		'	</a>' +
		'</li>' +
		'{{/each}}'),
		
	liEvent = function(){
		mui('#list').on('tap','li',function(){
			var noticeId = $(this).data('noticeid');
			mui.openWindow({
				url:'message-list-detail.html',
				extras:{
					noticeId:noticeId
				}
			})
		});
	},

	list = $('#list');
	
	o2o.request({
		url: o2o.path.messageQueryNotices,
		success: function(respones) {
			if (respones.notices && respones.notices.length > 0) {
				for (var i = 0; i < respones.notices.length; i++) {
					var d =(new Date().getTime() - respones.notices[i].createDate)/(24*60*60*1000);
					if(d <= 7){
						respones.notices[i].timechange = "time-change-text";
					}
					respones.notices[i].createDate = new Date(respones.notices[i].createDate).Format('yyyy-MM-dd hh:mm:ss');
					respones.notices[i].content = new Handlebars.SafeString(respones.notices[i].content.replace(/\n/g, '<br>'))
				}
			}
			list.append(tpl(respones));
			$('.time-change-text').timeago();
			liEvent();
		},

		fail: function(code, error) {
			o2o.prompt(error);
		}
	});
}, false);