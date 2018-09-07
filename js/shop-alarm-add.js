document.addEventListener('plusready', function() {	
	var hostBtn = $('#hostBtn'),
	cw = plus.webview.currentWebview(),
	shopId = cw.shopId,
	deviceChannelId = cw.deviceChannelId;

	//主机防区
	hostBtn.on('click', function() {
		var data = $('#hostForm').serialize() + "&shopId=" + shopId + "&deviceChannelId=" + deviceChannelId;;
		o2o.request({
			url: o2o.path.shopModifyDeviceChannel,
			data: data,
			validator: "#hostForm",
			success: function(respones) {
				var opener = cw.opener();
				mui.fire(opener, 'getHostList');
				o2o.prompt('修改成功');
				mui.back();
			},
			fail: function(code, error) {
				o2o.prompt(error);
			}
		});
	});

	if ($.trim(deviceChannelId)) {
		o2o.request({
			url: o2o.path.shopQueryChannelDetails,
			noWin:true,
			data: {
				deviceChannelId: deviceChannelId
			},
			success: function(respones) {
				var channel = respones.shopDeviceChannel.module;
				$('input[name=installationSite]').val(channel.installationSite);
				$('input[name=channelIndex]').val(channel.channelIndex) /*.attr('disabled', true)*/ ;
			},
			fail: function(code, error) {
				o2o.prompt(error);
			}
		});
	}
}, false);