document.addEventListener('plusready', function() {	
	$('#showPassword').on('click', function() {
		if ($(this).is(':checked')) {
			$('input[type=password]').attr("type", "text");
		} else {
			$('input[type=text]').attr("type", "password");
		}
	});
	$('#submit').on('click', function() {
		var reg = /^\d{9,16}$|^(?!\d+$)\w{6,16}$/;
		if (!$('input[name=resetPassword]').val().match(reg)) {
			o2o.prompt('新密码格式有误');
			return;
		}
		if ($.trim($('#newPassword').val()) == $.trim($('input[name=initialPassword]').val())) {
			o2o.prompt('新密码和旧密码相同');
			return;
		}
		if ($.trim($('#newPassword').val()) != $.trim($('#confirmPassword').val())) {
			o2o.prompt('确认密码和新密码不相同');
			return;
		}
		o2o.request({
			url: o2o.path.fixPassword,
			data: {
				password: hex_md5($('input[name=initialPassword]').val()),
				newPassword: hex_md5($('input[name=resetPassword]').val())
			},
			//加密hex_md5()
			validator: "#addForm",
			success: function(respones) {
				o2o.prompt('密码修改成功, 请重新登录！', function() {
					localStorage.remember = 0;
					localStorage.initialPassword = "";
					setTimeout(function(){plus.runtime.restart();}, 1000);
					/*Request({
						url: o2o.path.logout,
						success: function(respones) {
							localStorage.loginOut = true;
							plus.runtime.restart();
						},
						fail: function(code, error) {
							o2o.prompt(error);
						}
					});*/
				});
			},
			fail: function(code, error) {
				o2o.prompt(error);
			}
		});
	});
}, false);