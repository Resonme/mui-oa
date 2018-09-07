document.addEventListener('plusready', function() {	
	o2o.request({
		url: o2o.path.queryDeviceCountByOnlineState,
		success: function(respones) {
			$('#state3').html(' ( '+respones.count.onLineCount+' ) ');
			$('#state4').html(' ( '+respones.count.unLineCount+' ) ');
			
			$('#state8').html(' ( '+respones.count.unLineCountDay+' ) ');
			$('#state9').html(' ( '+respones.count.unLineCountWeek+' ) ');
		},
		fail: function(code, error) {
			o2o.prompt(error);
		}
	});
}, false);