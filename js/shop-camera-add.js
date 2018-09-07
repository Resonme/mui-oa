document.addEventListener('plusready', function() {	
	var deviceBtn = $('#deviceBtn'),
	cw = plus.webview.currentWebview(),
	shopId = cw.shopId,

	deviceChannelId = cw.deviceChannelId;

	/*var downselectIPS = [];*/
	//视频设备防区
	deviceBtn.on('click', function() {
		var data = $('#deviceForm').serialize()+"&deviceChannelId=" + deviceChannelId;
		o2o.request({
			url: o2o.path.shopModifyDeviceChannel,
			data: data,
			validator: "#deviceForm",
			success: function(respones) {
				var opener = cw.opener();
				mui.fire(opener, 'getDeviceList');
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
				$('input[name=channelIndex]').val(channel.channelIndex);
			},
			fail: function(code, error) {
				o2o.prompt(error);
			}
		});
	}
}, false);