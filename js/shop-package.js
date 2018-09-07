document.addEventListener('plusready', function() {	
	var tpl = Handlebars.compile('  <ul class="am-list">' +
		'    <li>' +
		'        <div class="am-cf">' +
		'            <div class="am-u-sm-4"><label>套餐名称：</label></div>' +
		'            <div class="am-u-sm-8">{{packageName}}</div>' +
		'        </div>' +
		'    </li>' +
		'    <li>' +
		'        <div class="am-cf">' +
		'            <div class="am-u-sm-4"><label>服务周期：</label></div>' +
		'            <div class="am-u-sm-8">{{packageServiceTime}}个月</div>' +
		'        </div>' +
		'    </li>' +
		'    <li>' +
		'        <div class="am-cf">' +
		'            <div class="am-u-sm-4"><label>服务费用：</label></div>' +
		'            <div class="am-u-sm-8">{{packageServiceFee}}元</div>' +
		'        </div>' +
		'    </li>' +
		'    <li>' +
		'        <div class="am-cf">' +
		'            <div class="am-u-sm-4"><label>套餐描述：</label></div>' +
		'            <div class="am-u-sm-8">' +
		'                <p>{{packageContent}}</p>' +
		'            </div>' +
		'        </div>' +
		'    </li>' +
		'    {{#if startTime}}' +
		'    <li>' +
		'        <div class="am-cf">' +
		'            <div class="am-u-sm-4"><label>开始时间：</label></div>' +
		'            <div class="am-u-sm-8">{{startTime}}</div>' +
		'        </div>' +
		'        <hr data-am-widget="divider" style="" class="am-divider am-divider-default" />' +
		'        <div class="am-cf">' +
		'            <div class="am-u-sm-4"><label>结束时间：</label></div>' +
		'            <div class="am-u-sm-8">{{endTime}}</div>' +
		'        </div>' +
		'    </li>' +
		'    {{/if}}' +
		'  </ul>' +
		'  <div class="am-cf am-margin-lg">' +
		'      <div class="am-u-sm-12"><button class="am-btn am-btn-default am-btn-block am-btn-xl" data-packageid="{{packageId}}" data-customerid="{{companyId}}" id="exchange"><span class="am-icon-exchange"></span>更换套餐</button></div>'
		/*+
		'      <div class="am-u-sm-6"><button class="am-btn am-btn-default am-btn-block am-btn-xl" data-packageid="{{shopPackageId}}" id="renewal"><span class="am-icon-ticket"></span>我要续费</button></div>' +
		'  </div>'*/
	),

	list = $('#packageMy'),

	shopId = o2o.getUrlParam('shopId'),

	editBack = o2o.getUrlParam('editBack') || "",

	exchangeEvent = function() {
		if ($.trim(editBack)) {
			$('#backMenu').attr('href', 'javascript:history.go(-' + editBack + ')');
		}
		$('#exchange').on('click', function() {
			var accountId = $(this).data('accountId'),
				packageId = $(this).data('packageid'),
				url = "customer-business-whether.html?shopId=" + shopId + "&accountId=" + accountId + "&packageId=" + packageId;
			if ($.trim(editBack)) {
				url += "&editBack=" + editBack;
			}
			window.location.href = url;
		});
		$('#renewal').on('click', function() {
			var shopPackageId = $(this).data('packageid');
			o2o.confirm('确定续费?', function(msg) {
				if (msg == "yes") {
					o2o.request({
						url: o2o.path.customerModifyShopPackage,
						data: {
							shopPackageId: shopPackageId
						},
						success: function(respones) {
							o2o.prompt('续费成功！', function() {
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
	};

	o2o.request({
		url: o2o.path.shopPackage,
		data: {
			shopId: shopId
		},
		success: function(respones) {
			if (respones.shopPackage.startTime && respones.shopPackage.endTime) {
				respones.shopPackage.startTime = new Date(respones.shopPackage.startTime).Format('yyyy-MM-dd hh:mm:ss');
				respones.shopPackage.endTime = new Date(respones.shopPackage.endTime).Format('yyyy-MM-dd hh:mm:ss');
			}
			respones.shopPackage.packageContent = new Handlebars.SafeString(respones.shopPackage.packageContent.replace(/\n/g, '<br>'));
			list.html(tpl(respones.shopPackage));
			exchangeEvent();
		},

		fail: function(code, error) {
			o2o.prompt(error);
		}
	});
}, false);