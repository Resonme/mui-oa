document.addEventListener('plusready', function() {	
	var tpl = Handlebars.compile(' <ul class="am-list am-list-static"> ' +
			'{{#each list}}' +
			'    <li onclick="window.location.href=\'customer-money-list.html?accountId={{accountId}}\'">' +
			'       <div class="am-cf li-tnt">' +
			'          <div class="am-u-sm-3 am-text-center">' +
			'            <span>{{employeeName}}</span>' +
			'          </div>' +
			'          <div class="am-u-sm-5 line-active am-text-center">' +
			'            <span>{{roleNames}}</span>' +
			'          </div>' +
			'          <div class="am-u-sm-4 am-text-right am-text-right">' +
			'             <span class="am-vertical-align-middle">{{totalMoney}} 元</span>' +
			'            <a href="javascript:void(0)">' +
			'              <span class="am-icon-chevron-circle-right"></span>' +
			'            </a>' +
			'          </div>' +
			'       </div>' +
			'    </li>' +
			'   {{/each}}' +
			'   </ul>'), 

		list = $('#customerMoneyItems');

		o2o.request({
			url: o2o.path.moneyChargeList,
			success: function(respones) {
				if (!respones.list || respones.list.length == 0) {
					o2o.prompt('未查询到要入账数据');
				} else {
					for (var i = 0; i < respones.list.length; i++) {
						respones.list[i].roleNames = "";
						if (respones.list[i].employeeRoles && respones.list[i].employeeRoles.length > 0) {
							for (var j = 0; j < respones.list[i].employeeRoles.length; j++) {
								respones.list[i].roleNames += respones.list[i].employeeRoles[j].roleName + " ";
							}
						}
					}
				}
				list.html(tpl(respones));
			},

			fail: function(code, error) {
				o2o.prompt(error);
			}
		});
}, false);