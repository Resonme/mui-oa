document.addEventListener('plusready', function() {	
	var submitBtn = $('#submit'),
	shopDeployedId = o2o.getUrlParam('shopDeployedId'),
	shopId = o2o.getUrlParam('shopId'),
	submitBtn.on('click', function() {
		var data = {
				shopId: shopId,
			},
			weekdays = $('#weekday').text().split(','),
			timestart = $('#timestart').text() + ":00",
			timeend = $('#timeend').text() + ":00";
		if(timestart == timeend){
			o2o.prompt('请选择不相同的布撤防时间！');
			return;
		}
		if ($.trim(shopDeployedId)) {
			data.shopDeployedId = shopDeployedId;
		}
		$(weekdays).each(function() {
			if (this == "周一") {
				data.monDeployedDate = timestart;
				data.monRemovalDate = timeend;
			}
			if (this == "周二") {
				data.tuesDeployedDate = timestart;
				data.tuesRemovalDate = timeend;
			}
			if (this == "周三") {
				data.wedDeployedDate = timestart;
				data.wedRemovalDate = timeend;
			}
			if (this == "周四") {
				data.thurDeployedDate = timestart;
				data.thurRemovalDate = timeend;
			}
			if (this == "周五") {
				data.friDeployedDate = timestart;
				data.friRemovalDate = timeend;
			}
			if (this == "周六") {
				data.satDeployedDate = timestart;
				data.satRemovalDate = timeend;
			}
			if (this == "周日") {
				data.sunDeployedDate = timestart;
				data.sunRemovalDate = timeend;
			}
			if (this == "每天") {
				data.monDeployedDate = timestart;
				data.monRemovalDate = timeend;
				data.tuesDeployedDate = timestart;
				data.tuesRemovalDate = timeend;
				data.wedDeployedDate = timestart;
				data.wedRemovalDate = timeend;
				data.thurDeployedDate = timestart;
				data.thurRemovalDate = timeend;
				data.friDeployedDate = timestart;
				data.friRemovalDate = timeend;
				data.satDeployedDate = timestart;
				data.satRemovalDate = timeend;
				data.sunDeployedDate = timestart;
				data.sunRemovalDate = timeend;
			}
		});
		o2o.confirm('确认修改布防时间？', function(msg) {
			if (msg == "yes") {
				o2o.request({
					url: o2o.path.messageInstallCreateShopDeployed,
					data: data,
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
	});	
	
	$('#startLabel').off('click').on('click', function(){
		var _self = $('#date1');
		var time = "";
		console.log(new Date().getFullYear());
		if($.trim(_self.val()) ){
			time = new Date().getFullYear()+"/"+new Date().getMonth()+"/"+ new Date().getDay() + " " + _self.val();
			console.log(1,time);
			time = new Date(time).Format('yyyy-MM-dd hh:mm');
		}else{
			time = new Date().Format('yyyy-MM-dd hh:mm');
			console.log(2,time);
		}
		console.log(3,time);
		var picker = new mui.DtPicker({
			type: "time",
			value: time
		});
		picker.show(function(rs) {
			$('#timestart').text(rs.text);
			_self.val(rs.text);
			picker.dispose();
		});
	});
	$('#endLabel').off('click').on('click', function(){
		var _self = $('#date2');
		var time;
		if($.trim(_self.val()) ){
			time = new Date().getFullYear()+"/"+new Date().getMonth()+"/"+ new Date().getDay() + " " + _self.val();
			time = new Date(time).Format('yyyy-MM-dd hh:mm');
		}else{
			time = new Date().Format('yyyy-MM-dd hh:mm');
		}
		var picker = new mui.DtPicker({
			type: "time",
			value: time
		});
		picker.show(function(rs) {
			$('#timeend').text(rs.text);
			_self.val(rs.text);
			picker.dispose();
		});
	});
}, false);