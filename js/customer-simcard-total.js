document.addEventListener('plusready', function() {	
	
	o2o.request({
		url: o2o.path.queryShopSimStatistics,
		success: function(respones) {
			$('#state0').html('( ' + respones.count.overCount + ' ) ');
			$('#state1').html('( ' + respones.count.threeDayCount + ' ) ');
			$('#state2').html('( ' + respones.count.weekCount + ' ) ');
			$('#state3').html('( ' + respones.count.fifCount + ' ) ');
			$('#state4').html('( ' + respones.count.monthCount + ' ) ');
			$('#state5').html('( ' + respones.count.unkonwCount + ' ) ');
		},
	
		fail: function(code, error) {
			o2o.prompt(error);
		}
	});
}, false);