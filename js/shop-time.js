document.addEventListener('plusready', function() {	
	var tpl = Handlebars.compile('<table class="am-table am-table-bordered am-table-centered">' +
		'      <thead class="head">' +
		'        <th>星期</th>' +
		'        <th>布防时间</th>' +
		'        <th>撤防时间</th>' +
		'        <th>操作</th>' +
		'      </thead>' +
		'      <tr>' +
		'        <td>周一</td>' +
		'        <td>{{monDeployedDate}}</td>' +
		'        <td>{{monRemovalDate}}</td>' +
		'        <td>' +
		'          {{#if monDeployedDate}}<a class="timeRemove" data-id="0">删除</a>{{/if}}' + 
		'        </td>' +
		'      </tr>' +
		'      <tr>' +
		'        <td>周二</td>' +
		'        <td>{{tuesDeployedDate}}</td>' +
		'        <td>{{tuesRemovalDate}}</td>' +
		'        <td>' +
		'          {{#if tuesDeployedDate}}<a class="timeRemove" data-id="1">删除</a>{{/if}}' +
		'        </td>' +
		'      </tr>' +
		'      <tr>' +
		'        <td>周三</td>' +
		'        <td>{{wedDeployedDate}}</td>' +
		'        <td>{{wedRemovalDate}}</td>' +
		'        <td>' +
		'          {{#if wedDeployedDate}}<a class="timeRemove" data-id="2">删除</a>{{/if}}' +
		'        </td>' +
		'      </tr>' +
		'      <tr>' +
		'        <td>周四</td>' +
		'        <td>{{thurDeployedDate}}</td>' +
		'        <td>{{thurRemovalDate}}</td>' +
		'        <td>' +
		'          {{#if thurDeployedDate}}<a class="timeRemove" data-id="3">删除</a>{{/if}}' +
		'        </td>' +
		'      </tr>' +
		'      <tr>' +
		'        <td>周五</td>' +
		'        <td>{{friDeployedDate}}</td>' +
		'        <td>{{friRemovalDate}}</td>' +
		'        <td>' +
		'          {{#if friDeployedDate}}<a class="timeRemove" data-id="4">删除</a>{{/if}}' +
		'        </td>' +
		'      </tr>' +
		'      <tr>' +
		'        <td>周六</td>' +
		'        <td>{{satDeployedDate}}</td>' +
		'        <td>{{satRemovalDate}}</td>' +
		'        <td>' +
		'          {{#if satDeployedDate}}<a class="timeRemove" data-id="5">删除</a>{{/if}}' +
		'        </td>' +
		'      </tr>' +
		'      <tr>' +
		'        <td>周日</td>' +
		'        <td>{{sunDeployedDate}}</td>' +
		'        <td>{{sunRemovalDate}}</td>' +
		'        <td>' +
		'          {{#if sunDeployedDate}}<a class="timeRemove" data-id="6">删除</a>{{/if}}' +
		'        </td>' +
		'      </tr>' +
		'    </table>'),

	addTime = $('#timeEdit'),
	shopId = o2o.getUrlParam('shopId');

	addtimeBtnEvent = function() {
			addTime.on('click', function() {
				var url = "shop-time-add.html?shopId=" + shopId;
				if (shopDeployedId && $.trim(shopDeployedId)) {
					url += "&shopDeployedId=" + shopDeployedId;
				}
				window.location.href = url;
				/*mui.openWindow({
					url:"shop-time-add.html",
					extras:{
						shopId:shopId
						shopDeployedId:shopDeployedId
					}
				})*/
			});
		},
	
		timeRemove = function(weekday) {
			var data = {
					shopId: shopId
				},
				timestart = " ",
				timeend = " ";
	
			if ($.trim(shopDeployedId)) {
				data.shopDeployedId = shopDeployedId;
			}
			switch (weekday) {
				case 0:
					data.monDeployedDate = timestart;
					data.monRemovalDate = timeend;
					data.monIsToday = 1;
					break;
				case 1:
					data.tuesDeployedDate = timestart;
					data.tuesRemovalDate = timeend;
					data.tuesIsToday = 1;
					break;
				case 2:
					data.wedDeployedDate = timestart;
					data.wedRemovalDate = timeend;
					data.wedIsToday = 1;
					break;
				case 3:
					data.thurDeployedDate = timestart;
					data.thurRemovalDate = timeend;
					data.thurIsToday = 1;
					break;
				case 4:
					data.friDeployedDate = timestart;
					data.friRemovalDate = timeend;
					data.friIsToday = 1;
					break;
				case 5:
					data.satDeployedDate = timestart;
					data.satRemovalDate = timeend;
					data.satIsToday = 1;
					break;
				case 6:
					data.sunDeployedDate = timestart;
					data.sunRemovalDate = timeend;
					data.sunIsToday = 1;
					break;
			}
	
			o2o.request({
				url: o2o.path.messageInstallCreateShopDeployed,
				data: data,
				success: function(respones) {
					o2o.prompt('删除成功', function() {
						window.location.reload();
					});
				},
	
				fail: function(code, error) {
					o2o.prompt(error);
				}
			});
		},
	
		timeEvent = function() {
			$('.timeRemove').on('click', function() {
				var id = $(this).data('id');
				o2o.confirm('确认删除该时间段布防？', function(msg) {
					if (msg == "yes") {
						timeRemove(id);
					}
				});
			});
		},
	
		list = $('#timeInfo'),
	
		shopDeployedId = "";
	
	addtimeBtnEvent();
	o2o.request({
		url: o2o.path.messageInstallQueryShopDeployed,
		data: {
			shopId: shopId
		},
		success: function(respones) {
			var week = respones.list[0] || {};
			week.monDeployedDate = $.trim(week.monDeployedDate).substring(0, $.trim(week.monDeployedDate).length - 3);
			week.monRemovalDate = $.trim(week.monRemovalDate).substring(0, $.trim(week.monRemovalDate).length - 3);
			week.tuesDeployedDate = $.trim(week.tuesDeployedDate).substring(0, $.trim(week.tuesDeployedDate).length - 3);
			week.tuesRemovalDate = $.trim(week.tuesRemovalDate).substring(0, $.trim(week.tuesRemovalDate).length - 3);
			week.wedDeployedDate = $.trim(week.wedDeployedDate).substring(0, $.trim(week.wedDeployedDate).length - 3);
			week.wedRemovalDate = $.trim(week.wedRemovalDate).substring(0, $.trim(week.wedRemovalDate).length - 3);
			week.thurDeployedDate = $.trim(week.thurDeployedDate).substring(0, $.trim(week.thurDeployedDate).length - 3);
			week.thurRemovalDate = $.trim(week.thurRemovalDate).substring(0, $.trim(week.thurRemovalDate).length - 3);
			week.friDeployedDate = $.trim(week.friDeployedDate).substring(0, $.trim(week.friDeployedDate).length - 3);
			week.friRemovalDate = $.trim(week.friRemovalDate).substring(0, $.trim(week.friRemovalDate).length - 3);
			week.satDeployedDate = $.trim(week.satDeployedDate).substring(0, $.trim(week.satDeployedDate).length - 3);
			week.satRemovalDate = $.trim(week.satRemovalDate).substring(0, $.trim(week.satRemovalDate).length - 3);
			week.sunDeployedDate = $.trim(week.sunDeployedDate).substring(0, $.trim(week.sunDeployedDate).length - 3);
			week.sunRemovalDate = $.trim(week.sunRemovalDate).substring(0, $.trim(week.sunRemovalDate).length - 3);
			shopDeployedId = week.shopDeployedId;
			week.dayStyle = 0;
			list.html(tpl(week));
			timeEvent();
		},
	
		fail: function(code, error) {
			o2o.prompt(error);
		}
	});
}, false);