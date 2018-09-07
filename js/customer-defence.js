document.addEventListener('plusready', function() {	
	o2o.request({
		url: o2o.path.queryDeviceCountByDefenceState,
		success: function(respones) {
			$('#state1').html(' ( '+respones.count.defenceCount+' ) ');
			$('#state2').html(' ( '+respones.count.unDefenceCount+' ) ');
			$('#state5').html(' ( '+respones.count.unKnowCount+' ) ');
			
			$('#state6').html(' ( '+respones.count.defenceExCount+' ) ');
			$('#state7').html(' ( '+respones.count.undefenceExCount+' ) ');
			$('#state10').html(' ( '+respones.count.unKnowCountDay+' ) ');
		},
		fail: function(code, error) {
			o2o.prompt(error);
		}
	});
}, false);