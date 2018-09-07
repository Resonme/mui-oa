document.addEventListener('plusready', function() {	
	var numCheck = function() {
		localStorage.indexNum--;
		$('#send').html(localStorage.indexNum);
		if (localStorage.indexNum > 0) {
			setTimeout(numCheck, 1000);
		} else {
			$('#send').html('获取').attr('disabled', false);
		}
	};

	$('#send').on('click', function() {
		var accountNo = $.trim($('#phone').val()),
			regexp = /^1\d{10}$/;
		if (!accountNo) {
			o2o.prompt('请输入手机号码');
			return;
		}
		if (!accountNo.match(regexp)) {
			o2o.prompt('手机号码格式有误');
			return;
		}
		o2o.request({
			url: o2o.path.getCode,
			data: {
				phone: accountNo,
				type: 1,
				accountType: 1
			},
			success: function(respones) {
				localStorage.indexNum = 60;
				$('#send').attr('disabled', true).html(localStorage.indexNum);
				numCheck();
				o2o.prompt('发送成功');
			},
			fail: function(code, error) {
				o2o.prompt(error);
			}
		});
	});

	$('#submit').on('click', function() {
		var reg = /^(?![0-9]{1,8}$)[\S]{6,16}$/;
		if (!$('input[name=resetPassword]').val().match(reg)) {
			o2o.prompt('新密码格式有误');
			return;
		}
		o2o.request({
			url: o2o.path.forgetPassword,
			data: {
				type: 1,
				phone: $('input[name=phone]').val(),
				code: $('input[name=code]').val(),
				newPassword: hex_md5($('input[name=resetPassword]').val())
			},
			validator: "#addForm",
			success: function(respones) {
				o2o.prompt('密码修改成功');
				mui.back();
			},
			fail: function(code, error) {
				o2o.prompt(error);
			}
		});
	});
}, false);