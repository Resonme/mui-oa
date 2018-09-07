document.addEventListener('plusready', function() {	
	var tpl = Handlebars.compile('<div class="panel content-bg">' +
			'    <table class="am-table table-li">' +
			'      <tr>' +
			'        <td width="100">客户姓名：</td>' +
			'        <td>{{name}}</td>' +
			'      </tr>' +
			'      <tr>' +
			'        <td>联系电话：</td>' +
			'        <td>{{phone}}</td>' +
			'      </tr>' +
			'      <tr>' +
			'        <td>客户地址：</td>' +
			'        <td>{{address}}</td>' +
			'      </tr>' +
			'    </table>' +
			'  </div>' +
			'  <div class="panel">' +
			'    <div data-am-widget="titlebar" class="am-titlebar am-titlebar-default" >' +
			'      <h2 class="am-titlebar-title ">' +
			'          安保区域' +
			'      </h2>' +
			'    </div>' +
			'    <ul class="am-list">' +
			'     {{#each shops}}' +
			'      <li onclick="{{localhref}}">' +
			'        <div class="warning am-cf">' +
			'            <div class="am-u-sm-3 left am-text-{{fontcolor}} panel-table">' +
			'             <div class="panel-table-cell">' +
			'              <span class="am-icon-{{stateicon}}"></span>' +
			'              <span>{{state}}</span>' +
			'             </div>' +
			'            </div>' +
			'            <div class="am-u-sm-9 right">' +
			'              <p class="am-text-truncate">' +
			'                <span class="am-icon-university"></span>' +
			'                <a href="javascript:void(0)">{{shopNo}}-{{shopName}} ' +
			'                  <span class="am-icon-chevron-circle-right {{hideRight}}"></span>' +
			'                </a>' +
			'              </p>' +
			'              <p class="am-text-truncate"><span class="am-icon-map-marker"></span>{{shopAddress}}</p>' +
			'              <p class="am-text-truncate"><span class="am-icon-indent"></span>{{shopPackageDO.packageName}}({{shopPackageDO.packageFree}}元/{{shopPackageDO.serviceTime}}个月)</p>' +
			'            </div>' +
			'        </div>' +
			'      </li>' +
			'     {{/each}}<div class="am-text-center">{{nullMessage}}</div>' +
			'    </ul> ' +
			'  </div>'),

		content = $('#customerDetail'),
		cw = plus.webview.currentWebview(),
		accountId = cw.accountId ||  o2o.getUrlParam('accountId');

	o2o.request({
		url: o2o.path.customerViewCustomerDetails,
		data: {
			accountId: accountId
		},
		success: function(respones) {
			if (!respones.customerDO.shops || respones.customerDO.shops.length == 0) {
				respones.customerDO.nullMessage = "暂无安保区域！";
			} else {
				for (var i = 0; i < respones.customerDO.shops.length; i++) {
					respones.customerDO.shops[i].localhref =
						"window.location.href='customer-business-info.html?shopId=" + respones.customerDO.shops[i].shopId + "'";
					var state = "", stateicon = "", fontcolor = "";
					switch (respones.customerDO.shops[i].shopState) {
						case 0:
							state = "安装中";
							stateicon = "chain";
							fontcolor = "primary"; 
							break;
						case 1:
							state = "正常";
							stateicon = "check";
							fontcolor = "success";
							break;
						case 2:
							state = "设备变更中";
							stateicon = "chain";
							fontcolor = "primary";
							break;
						case 3:
							state = "移机中";
							stateicon = "ticket";
							fontcolor = "primary";
							break;
						case 4:
							state = "拆机中";
							stateicon = "ticket";
							fontcolor = "primary";
							break;
						case 5:
							state = "变更套餐中";
							stateicon = "ticket";
							fontcolor = "primary";
							break;
						case 6:
							state = "停止服务";
							stateicon = "remove";
							fontcolor = "danger";
							break;
						case 7:
							state = "待审核";
							stateicon = "bolt";
							fontcolor = "warning";
							respones.customerDO.shops[i].hideRight = "am-hide";
							respones.customerDO.shops[i].localhref = "void(0)";
							break;
					}
					respones.customerDO.shops[i].state = state;
					respones.customerDO.shops[i].stateicon = stateicon;
					respones.customerDO.shops[i].fontcolor = fontcolor;
				}
			}
			content.html(tpl(respones.customerDO))
		},

		fail: function(code, error) {
			o2o.prompt(error);
		}
	});
}, false);