document.addEventListener('plusready', function() {	
	var tpl = Handlebars.compile(' <ul class="am-list am-list-static"> ' +
			'{{#each list}}' +
			'       <li>' +
			'          <input id="shop{{employeeChargeId}}" name="empids" type="checkbox" value="{{employeeChargeId}}">' +
			'          <label for="shop{{employeeChargeId}}">' +
			'       <div class="am-cf li-tnt">' +
			'          <div class="am-u-sm-4">' +
			'            <span>{{createDate}}</span>' +
			'          </div>' +
			'          <div class="am-u-sm-4 am-text-center">' +
			'            <span>{{shopName}}<br>（<span class="am-text-success">{{otherContent}}</span>）</span>' +
			'          </div>' +
			'          <div class="am-u-sm-4 am-text-right">' +
			'             <span class="am-vertical-align-middle">{{money}} 元</span>' +
			'          </div>' +
			'       </div>' +
			'     </label>' +
			'       </li>' +
			'    {{/each}}' +
			'   </ul>'),

		list = $('#customerMoneyList'),
		cw = plus.webview.currentWebview(),
		accountId = cw.accountId || o2o.getUrlParam('accountId'),

		submit = function(employeeChargeIds) {
			if ($.trim(employeeChargeIds)) {
				o2o.confirm('确认入账？', function(msg) {
					if (msg == "yes") {
						o2o.request({
							url: o2o.path.moneyAffirmEmployeeCharge,
							data: {
								employeeChargeIds: employeeChargeIds
							},
							success: function(respones) {
								o2o.prompt('操作成功', function() {
									mui.back(); 
								});
							},
							fail: function(code, error) {
								o2o.prompt(error);
							}
						});
					}
				});
			} else {
				o2o.prompt('请选择要入账的数据');
			}
		};

		var roles = JSON.parse(localStorage.loginInfo).employeeRoles;
		if (roles.indexOf(10) > -1 || roles.indexOf(4) > -1 || roles.indexOf(6) > -1 || roles.indexOf(9) > -1) {
			$('#submit').on('click', function() {
				var employeeChargeIds = "";
				$('input[name=empids]:checked').each(function() {
					employeeChargeIds += $(this).val() + ",";
				});
				submit(employeeChargeIds.substring(0, employeeChargeIds.length - 1));
			});
		} else {
			$('#submit').remove();
		}
		o2o.request({
			url: o2o.path.moneyEmployeeChargeList,
			data: {
				accountId: accountId
			},
			success: function(respones) {
				if(respones.list && respones.list.length > 0){
					for (var i = 0; i < respones.list.length; i++) {
						respones.list[i].createDate = new Date(respones.list[i].createDate).Format('yyyy-MM-dd');
					};
				}
				
				list.html(tpl(respones));
			},

			fail: function(code, error) {
				o2o.prompt(error);
			}
		});

}, false);