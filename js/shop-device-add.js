document.addEventListener('plusready', function() {	
	var tpl_sn = Handlebars.compile('<div class="mui-input-row">' +
		'          <label>序 &nbsp;列 &nbsp;号：</label>' +
		'            <input type="text" placeholder="请输入主机序列号" name="hostSerial" data-validator-notNull="请输入主机序列号" >' +
		'        </div>'),

	tpl_ip = Handlebars.compile('        <div class="mui-input-row">' +
		'          <label>主机IP：</label>' +
		'            <input type="number" placeholder="请输入主机IP" name="hostIp" data-validator-notNull="请输入主机IP">' +
		'        </div>'),

	tpl_port = Handlebars.compile('        <div class="mui-input-row">' +
		'          <label>主机端口：</label>' +
		'            <input type="number" placeholder="请输入主机端口" name="hostPort" data-validator-notNull="请输入主机端口">' +
		'        </div>'),

	tpl_username = Handlebars.compile('<div class="mui-input-row">' +
		'          <label>用 &nbsp;户 &nbsp;名：</label>' +
		'            <input type="text" placeholder="请输入用户名" name="deviceUsername" data-validator-notNull="请输入用户名">' +
		'        </div>'),

	tpl_password = Handlebars.compile('        <div class="mui-input-row">' +
		'          <label>密 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;码：</label>' +
		'            <input type="password" placeholder="请输入密码" name="devicePassword" data-validator-notNull="请输入密码">' +
		'        </div>'),

	submitBtn = $('#submit'),
	cw = plus.webview.currentWebview(),
	shopId = cw.shopId,
	selectModel = $('#selectModel'),
	deviceStyle = cw.deviceStyle,
	devices = {};

	getModel = function(id) {
		var device = devices[id];
		selectModel.html("");
		if (device.mustSN == 1 || device.mustSN == 2) {
			selectModel.append(tpl_sn());
			if (device.mustSN == 2) {
				$('input[name=hostSerial]').removeAttr('data-validator-notNull');
			}
		}
		if (device.mustIP == 1 || device.mustIP == 2) {
			selectModel.append(tpl_ip());
			if (device.mustIP == 2) {
				$('input[name=hostIp]').removeAttr('data-validator-notNull');
			}
		}
		if (device.mustPort == 1 || device.mustPort == 2) {
			selectModel.append(tpl_port());
			if (device.mustPort == 2) {
				$('input[name=hostPort]').removeAttr('data-validator-notNull');
			}
		}
		if (device.mustUsername == 1 || device.mustUsername == 2) {
			selectModel.append(tpl_username());
			if (device.mustUsername == 2) {
				$('input[name=deviceUsername]').removeAttr('data-validator-notNull');
			}
		}
		if (device.mustPassword == 1 || device.mustPassword == 2) {
			selectModel.append(tpl_password());
			if (device.mustPassword == 2) {
				$('input[name=devicePassword]').removeAttr('data-validator-notNull');
			}
		}
	},

	setDeviceData = function(list) {
		var form = "";
		$(list).each(function() {
			form += '<div class="li-tnt">' +
				'    <input id="' + this.deviceModelId + '"  name="downselect" type="radio" value="' + this.deviceModelId + '">' +
				'    <label for="' + this.deviceModelId + '">' + this.deviceType + '（' + this.deviceModel + '）</label>' +
				'</div>';
		});
		$('#deviceModel').downselect({
			data: form,
			confirm: function() {
				var $device = $('input[name=downselect]:checked'),
					id = $device.attr('id');
				$('input[name=deviceModelId]').val($device.val());
				$('#deviceModel').val($device.next('label').html());
				getModel(id);
			}
		});

	},

	submitForm = function() {
		submitBtn.on('click', function() {
			var data = $('#addForm').serialize() + "&shopId=" + shopId;
			o2o.request({
				url: o2o.path.shopCreateShopDevice,
				data: data,
				validator: '#shopDeviceAdd',
				success: function(respones) {
					o2o.prompt('添加成功');
					var opener = cw.opener();
					mui.fire(opener, 'deviceInit');
					mui.back();
				},

				fail: function(code, error) {
					o2o.prompt(error);
				}
			});

		});
	};

	var data = {
		searchType: 1
	};
	if ($.trim(deviceStyle)) {
		data.deviceStyle = deviceStyle;
	}
	o2o.request({
		url: o2o.path.customerViewQueryDevices,
		data: data,
		success: function(respones) {
			setDeviceData(respones.list);
			if (respones.list && respones.list.length > 0) {
				$.each(respones.list, function() {
					devices[this.deviceModelId] = this;
				});
			}
		},

		fail: function(code, error) {
			o2o.prompt(error);
		}
	});
	submitForm();
}, false);