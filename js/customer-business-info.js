document.addEventListener('plusready', function() {	
	Handlebars.registerHelper("equal", function(v1, v2, options) {
		if (v1 == v2) {
			//满足添加继续执行
			return options.fn(this);
		} else {
			//不满足条件执行{{else}}部分
			return options.inverse(this);
		}
	});
	var tpl_baseInfo = Handlebars.compile('<div class="panel" style="padding:0 10px;">' +
		'<form class="am-form">' +
		'<table class="am-table table-li" id="shopInfo">' +
		'      <tr>' +
		'        <td width="100">店铺名称</td>' +
		'        <td class="shopState" style="padding-right:65px;">' +
		'           {{shopDO.shopName}}' +
		'           {{#equal defenceState shopState0}}' +
		'             <span style="color:#a3a3a3"><span class="am-icon-unlock"></span>撤防</span>' +
		'           {{/equal}}' +
		'           {{#equal defenceState shopState1}}' +
		'             <span style="color:#a3a3a3"><span class="am-icon-lock am-text-success"></span>布防</span>' +
		'           {{/equal}}' +
		'           {{#equal defenceState shopState2}}' +
		'             <span style="color:#a3a3a3"><span class="am-icon-warning am-text-warning"></span>未明</span>' +
		'           {{/equal}}' +
		'           {{#equal onlineState shopState0}}' +
		'             <span style="color:#a3a3a3"><span class="am-icon-sun-o am-text-success"></span>在线</span>' +
		'           {{/equal}}' +
		'           {{#equal onlineState shopState1}}' +
		'             <span style="color:#a3a3a3"><span class="am-icon-sun-o"></span>离线</span>' +
		'           {{/equal}}' +
		'           {{#equal onlineState shopState2}}' + 
		'             <span style="color:#a3a3a3"><span class="am-icon-warning"></span>未明</span>' +
		'           {{/equal}}' +
		'        </td>' +
		'      </tr>' +
		'      <tr>' +
		'        <td>店铺编号</td>' +
		'        <td>{{shopDO.shopNo}}</td>' +
		'      </tr>' +
		'      <tr>' +
		'        <td>店铺类型</td>' +
		'        <td>{{shopDO.shopTypeName}}</td>' +
		'      </tr>' +
		'      <tr>' +
		'        <td>详细地址</td>' +
		'        <td>{{shopDO.shopAddress}}（<a>{{shopDO.areaName}}</a>） </td>' +
		'      </tr>' +
		'      <tr>' +
		'        <td>上报地址</td>' +
		'        <td>' +
		'           {{#if shopDO.upLoadAddress}}' +
		'           <a>{{shopDO.upLoadAddress}}</a>' +
		'           {{else}}' +
		'           <span class="am-text-danger">暂未添加设备</span>' +
		'           {{/if}}' +
		'         </td>' +
		'      </tr>' +
		'      <tr>' +
		'        <td>服务状态</td>' +
		'        <td>' +
		'          {{shopDO.shopPackageDO.packageName}} ({{shopDO.shopPackageDO.packageFree}}元/{{shopDO.shopPackageDO.serviceTime}}个月)<br>' +
		'         {{#if shopDO.shopPackageDO.startDate}}' +
		'          {{shopDO.shopPackageDO.startDate}} 至 {{shopDO.shopPackageDO.endDate}} <br>' +
		'          {{shopDO.shopPackageDO.packageState}}' +
		'         {{else}}' +
		'           <span class="am-text-danger">服务暂未启用<span>' +
		'         {{/if}}' +
		'        </td>' +
		'      </tr>' +
		'    </table>' +
		'   </form>' +
		'   </div>'),

	tpl_baseFunc = Handlebars.compile(
		'   <div class="am-margin-horizontal-sm am-margin-vertical-sm am-cf">' +
		'     <div class="am-u-sm-6">' +
		'       <button class="am-btn am-btn-block am-btn-default am-btn-sm" id="baseInfoBtn"><span class="am-icon-edit"></span>信息修改</button>' +
		'     </div>' +
		'     <div class="am-u-sm-6">' +
		'       <button class="am-btn am-btn-block am-btn-default am-btn-sm" id="rightUpdate"><span class="am-icon-exchange"></span>所有权变更</button>' +
		'     </div>' +
		'   </div>'),

	tpl_device = Handlebars.compile(
		' <div class="am-u-sm-3 am-text-center am-u-end">' +
		'   <a href="shop-device.html?shopId={{shopId}}"><img src="image/sbxx.png"><p>设备信息</p></a>' +
		' </div>'),
	tpl_channel = Handlebars.compile(' <div class="am-u-sm-3 am-text-center am-u-end">' +
		'   <a href="shop-channel.html?shopId={{shopId}}"><img src="image/fqgl.png"><p>防区管理</p></a>' +
		' </div>'),
	tpl_time = Handlebars.compile(' <div class="am-u-sm-3 am-text-center am-u-end">' +
		'   <a href="shop-time.html?shopId={{shopId}}"><img src="image/bfsj.png"><p>布撤防时间</p></a>' +
		' </div>'),
	tpl_package = Handlebars.compile(' <div class="am-u-sm-3 am-text-center am-u-end">' +
		'   <a href="shop-package.html?shopId={{shopId}}"><img src="image/tcgl.png"><p>套餐管理</p></a>' +
		' </div>'),
	tpl_teardown = Handlebars.compile(' <div class="am-u-sm-3 am-text-center am-u-end">' +
		'   <a href="javascript:void(0)" id="teardownTag"><img src="image/bjcj.png"><p>标记为拆机</p></a>' +
		' </div>'),
	tpl_clothRemoval = Handlebars.compile(' <div class="am-u-sm-3 am-text-center am-u-end">' +
		'   <a href="shop-clothRemoval.html?shopId={{shopId}}"><img src="image/bcfjl.png"><p>布撤防记录</p></a>' +
		' </div>'),
	tpl_warning = Handlebars.compile(' <div class="am-u-sm-3 am-text-center am-u-end">' + 
		'   <a href="shop-warning.html?shopId={{shopId}}"><img src="image/lsjq.png"><p>历史警情</p></a>' +
		' </div>'),
	tpl_warningdo = Handlebars.compile(' <div class="am-u-sm-3 am-text-center am-u-end">' + 
		'   <a href="shop-warningdo.html?shopId={{shopId}}"><img src="image/lspj.png"><p>历史派警</p></a>' +
		' </div>'),
	tpl_patrol = Handlebars.compile(' <div class="am-u-sm-3 am-text-center am-u-end">' +
		'   <a href="shop-patrol.html?shopId={{shopId}}"><img src="image/xljl.png"><p>巡逻记录</p></a>' +
		' </div>'),
	/*tpl_claim = Handlebars.compile(' <div class="am-u-sm-3 am-text-center am-u-end">' +
		'   <a href="message-claim-list.html?shopId={{shopId}}"><img src="image/spjl.png"><p>索赔记录</p></a>' +
		' </div>'),*/
	tpl_repairs = Handlebars.compile(' <div class="am-u-sm-3 am-text-center am-u-end">' +
		'   <a href="shop-repair-list.html?shopId={{shopId}}"><img src="image/wxjl.png"><p>维修记录</p></a>' +
		' </div>'),
	/*tpl_feedback = Handlebars.compile(' <div class="am-u-sm-3 am-text-center am-u-end">' +
		'   <a href="message-feedback-list.html?shopId={{shopId}}"><img src="image/fkjl.png"><p>反馈记录</p></a>' +
		' </div>'),*/
	tpl_update = Handlebars.compile(' <div class="am-u-sm-3 am-text-center am-u-end">' +
		'   <a href="shop-business-add.html?shopId={{shopId}}"><img src="image/ywbg.png"><p>业务变更</p></a>' +
		' </div>'),

	tpl_finish = Handlebars.compile('<div class="am-navbar btn-box">' +
		'    <button class="am-btn am-btn-block am-btn-default" id="finish"><span class="am-icon-check"></span>结束任务</button>' +
		'</div>'),
		
	cw = plus.webview.currentWebview(),

	shopId = cw.shopId || o2o.getUrlParam('shopId'),
	baseInfo = $('#baseInfo'),
	serviceId = cw.serviceId || o2o.getUrlParam('serviceId') || "",
	serviceState = cw.serviceState || o2o.getUrlParam('serviceState') || "",
	shopDetailFunc = $('#shopDetailFunc'),
	shopDO = {},

	//拆机退费
	teardown = function() {
		$('#teardownTag').on('click', function() {
			if ($.trim(shopDO)) {
				o2o.request({
					url: o2o.path.shopQueryRecedeServiceFee,
					data: {
						eTime: shopDO.shopPackageDO.endDate,
						packageFree: shopDO.shopPackageDO.packageFree,
						serviceTime: shopDO.shopPackageDO.serviceTime
					},
					success: function(respones) {
						o2o.confirm('确定标记拆机？\n套餐余额：' + respones.recedeFee + '元', function(msg) {
							if (msg == "yes") {
								o2o.request({
									url: o2o.path.shopQueryCreateEmployeeCharge,
									data: {
										shopId: shopId,
										money: respones.recedeFee
									},
									success: function(respones) {
										o2o.prompt('操作成功', function() {
											location.reload();
										});
									},

									fail: function(code, error) {
										o2o.prompt(error);
									}
								});
							}
						});
					},

					fail: function(code, error) {
						o2o.prompt(error);
					}
				});
			}
		});
	},
	
	//信息修改 所有权变更  
	installFunc = function() {
		$('#baseInfoBtn').on('click', function() {
			var url = "shop-info-edit.html?shopId=" + shopId;
			if ($.trim(serviceId)) {
				url += "&serviceId=" + serviceId;
			}
			window.location.href = url;
		});
		$('#rightUpdate').on('click', function() {
			window.location.href = "shop-changeLeader.html?shopId="+shopId;
		});

	},

	//结束店铺任务
	finishInstall = function() {
		$('body').append(tpl_finish());
		$('#finish').on('click', function() {
			o2o.confirm('确认结束', function(msg) {
				if (msg == "yes") {
					o2o.request({
						url: o2o.path.shopFinishService,
						data: {
							serviceId: serviceId,
							shopId: shopId
						},
						success: function(respones) {
							o2o.prompt('操作成功', function() {
								mui.back();
							});
						},

						fail: function(code, error) {
							if (code == 101) {
								o2o.confirm(error, function(msg) {
									if (msg == "yes") {
										o2o.request({
											url: o2o.path.shopComfirmFinishService,
											data: {
												serviceId: serviceId,
												shopId: shopId
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
								o2o.prompt(error);
							}
						}
					});
				}
			});

		});
	},

	getFunc = function(roleIds) {
		shopDetailFunc.empty();
		var roles = roleIds,

			roleBox = {
				0: false,
				1: false,
				2: false,
				3: false,
				4: false,
				5: false,
				6: true,
				7: true,
				8: true,
				9: true,
				10: true,
				/*11: true,*/
				12: false
			};
		$(roles).each(function() {
			var roleId = parseInt(this);
			//安装维护人员
			if (roleId == 2) {
				roleBox[1] = true;
				roleBox[2] = true;
				roleBox[3] = true;
				roleBox[4] = true;
				if ($.trim(serviceState) && serviceState == 4) {
					roleBox[5] = true;
				}
				if ($.trim(serviceId)) {
					finishInstall();
				}
			} else if (roleId == 1) {
				//业务人员
				roleBox[0] = true;
				roleBox[12] = true;
			} else if (roleId == 0 || roleId == 6 || roleId == 9) {
				//管理人员 或者其他
				roleBox[1] = true;
				roleBox[2] = true;
				roleBox[3] = true;
				roleBox[4] = true;
				if ($.trim(serviceState) && serviceState == 4) {
					roleBox[5] = true;
				}
				if ($.trim(serviceId)) {
					finishInstall();
				}
				roleBox[0] = true;
				roleBox[12] = true;

			}
		});
		if (!shopDO.shopPackageDO.startDate || shopDO.shopPackageDO.startDate.length < 1) {
			roleBox[4] = false;
		}
		$.each(roleBox, function(i) {
			var key = i,
			value = roleBox[i];
			if (value == true || value == "true") {
				switch (parseInt(key)) {
					case 0:
						baseInfo.append(tpl_baseFunc({
							shopId: shopId
						}));
						installFunc();
						break;
					case 1:
						shopDetailFunc.append(tpl_device({
							shopId: shopId
						}));
						break;
					case 2:
						shopDetailFunc.append(tpl_channel({
							shopId: shopId
						}));
						break;
					case 3:
						shopDetailFunc.append(tpl_time({
							shopId: shopId
						}));
						break;
					case 4:
						shopDetailFunc.append(tpl_package({
							shopId: shopId
						}));
						break;
					case 5:
						shopDetailFunc.append(tpl_teardown({
							shopId: shopId
						}));
						break;
					case 6:
						shopDetailFunc.append(tpl_clothRemoval({
							shopId: shopId
						}));
						break;
					case 7:
						shopDetailFunc.append(tpl_warning({
							shopId: shopId
						}));
						break;
					case 8:
						shopDetailFunc.append(tpl_warningdo({
							shopId: shopId
						}));
						break;
					case 9:
						shopDetailFunc.append(tpl_patrol({
							shopId: shopId
						}));
						break;
					case 10:
						shopDetailFunc.append(tpl_repairs({
							shopId: shopId
						}));
						break;
						/*case 11:
							shopDetailFunc.append(tpl_feedback({
								shopId: shopId
							}));
							break;*/
					case 12:
						shopDetailFunc.append(tpl_update({
							shopId: shopId
						}));
						break;
					case 13:
						shopDetailFunc.append(tpl_warningdo({
							shopId: shopId
						}));
						break;

				}
			}
		});
		teardown();
	};

	var getLeader = function(leader){
		o2o.request({
			url: o2o.path.shopLeaderList,
			data: {
				shopId: shopId
			},
			success: function(respones) {
				var html = '';
				if(respones.list&&respones.list.length>0){
					$(respones.list).each(function(){
						html += this.nickName +  "（" +this.phone + "）<br>"
					});
				}else{
					if(leader && leader.length > 0){
						var person = JSON.parse(leader);
						if( $.trim(person.firstName) || $.trim(person.firstPhone) ){
							html += person.firstName +  "（" +person.firstPhone + "）<br>"
						}
						if( $.trim(person.secondName) || $.trim(person.secondPhone) ){
							html += person.secondName +  "（" +person.secondPhone + "）<br>"
						}
						if( !$.trim(person.firstName) && !$.trim(person.firstPhone) && !$.trim(person.secondName) && !$.trim(person.secondPhone) ){
							html = '<span class="am-text-danger">暂无联系人！</span>';
						}
					}else{
						html = '<span class="am-text-danger">暂无联系人！</span>';
					}
				}
				html = '<tr>' +
				'        <td>备注</td>' +
				'        <td>' + html +'         </td>' +
				'      </tr>';
				$('#shopInfo').append(html);
			},
	
			fail: function(code, error) {
				o2o.prompt(error);
			}
		});
	};
	o2o.request({
		url: o2o.path.customerViewShopDetails,
		data: {
			shopId: shopId
		},
		success: function(respones) {
			shopDO = respones.shopDO;
			if (respones.shopDO.shopPackageDO) {
				if (respones.shopDO.shopPackageDO.startDate && $.trim(respones.shopDO.shopPackageDO.startDate)) {
					respones.shopDO.shopPackageDO.startDate = new Date(respones.shopDO.shopPackageDO.startDate).Format('yyyy-MM-dd');
				}
				if (respones.shopDO.shopPackageDO.endDate && $.trim(respones.shopDO.shopPackageDO.endDate)) {
					respones.shopDO.shopPackageDO.endDate = new Date(respones.shopDO.shopPackageDO.endDate).Format('yyyy-MM-dd');
				}
				if (shopDO.shopPackageDO.packageState) {
					var state = shopDO.shopPackageDO.packageState;
					if (state == "正常") {
						shopDO.shopPackageDO.packageState = new Handlebars.SafeString('<span class="am-text-success">' + shopDO.shopPackageDO.packageState + '</span>');
					} else {
						shopDO.shopPackageDO.packageState = new Handlebars.SafeString('<span class="am-text-danger">' + shopDO.shopPackageDO.packageState + '</span>');
					}
				}
			}
			respones.shopState0 = 0;
			respones.shopState1 = 1;
			respones.shopState2 = -1;
			baseInfo.html(tpl_baseInfo(respones));
			getLeader(respones.shopDO.shopContactPerson);
			getFunc(respones.shopDO.roleIds);
		},

		fail: function(code, error) {
			o2o.prompt(error);
		}
	});
	
	$('#getCode').on('click', function(){
		mui.openWindow({
			url:"qrcode.html",
			extras:{
				shopId : shopId
			}
		})
	});
}, false);