document.addEventListener('plusready', function() {
	//plus.navigator.setFullscreen(false);
	plus.navigator.setStatusBarBackground("#030303"); 
	plus.navigator.setStatusBarStyle('UIStatusBarStyleBlackOpaque');
	var backButtonPress = 0;
	plus.key.removeEventListener("backbutton", function(){});
	plus.key.addEventListener("backbutton", function() {
		backButtonPress++;
		if (backButtonPress > 1) {
			plus.runtime.quit();
		} else {
			plus.nativeUI.toast("再按一次退出应用程序！");
		}
		setTimeout(function() {
			backButtonPress = 0;
		}, 1000);
	}, false); 
	var remember = $('#r1'),
		name = $('input[name=accountNo]'),
		password = $('input[name=initialPassword]'); 
	
	name.val(localStorage.accountNo);
	if ($.trim(localStorage.initialPassword)) {
		password.val(localStorage.initialPassword);
	} else {
		$('input[name=initialPassword]').val("");
	}
	var setLoginMenu = function(list){
		var menu = {
			menu1:{
				list: []
			},
			menu2:{
				list1: {
					list: []
				},
				list2: {
					list: []
				},
				list3: {
					list: []
				}
			},
			menu3:{
				list: []
			}
		};
		
		$(list.menu).each(function() {
			if (this.resourceType == 1) {
				menu.menu1.list.push(this);
			} else if (this.resourceType == 2) {
				switch (parseInt(this.parentId)) {
					case 1:
						menu.menu2.list1.list.push(this);
						break;
					case 2:
						menu.menu2.list2.list.push(this);
						break;
					case 3:
						menu.menu2.list3.list.push(this);
						break;
				}
			} else if (this.resourceType == 3) {
				menu.menu3.list.push(this);
			}
		});
		localStorage.loginMenu = JSON.stringify(menu);
	};
	/*--登录--*/
	$('#loginSubmit').on('click', function() {
		$('input').blur();
		setTimeout(function(){
			o2o.request({
				url: o2o.path.login,
				validator: "#loginForm",
				data: {
					loginType: 1,
					appType : 0,
					phone: $('input[name=accountNo]').val(),
					password: hex_md5(password.val())
				},
				//hex_md5(password.val()) 加密
				success: function(respones) {
					if (remember.is(':checked')) {
						localStorage.remember = 1; 
						localStorage.initialPassword = $.trim(password.val());
					} else {
						localStorage.remember = 0;
						localStorage.initialPassword = "";
					}
					localStorage.accountNo = $.trim(name.val());
					setLoginMenu(respones);
					//respones.menu = null;
					
					//
					localStorage.loginInfo = JSON.stringify(respones);
					localStorage.loginOut = false;
					
					//plus.navigator.setFullscreen(false);
					window.location.href = "index.html";
				},
				fail: function(code, error) {
					o2o.prompt(error);
				}
			});
		}, 200);
	});
	if (localStorage.remember == 1) {
		remember.attr('checked', true);
	}
}, false);