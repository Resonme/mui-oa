document.addEventListener('plusready', function() {	
	o2o.request({
		url: o2o.path.dataQueryServiceCountByState,
		success: function(respones) {
			$('#state0').html(' ( '+ respones.count.installCount +' ) ');
			$('#state2').html(' ( '+ respones.count.changCount +' ) ');
			$('#state3').html(' ( '+ respones.count.moveCount +' ) ');
			$('#state4').html(' ( '+ respones.count.strikeCount +' ) ');
			$('#state5').html(' ( '+ respones.count.packageCount +' ) ');
		},
		fail: function(code, error) {
			o2o.prompt(error);
		}
	});
}, false);