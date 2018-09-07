	var getShowPage = function() {
		var pageIndex = o2o.getUrlParam('tab') || 0;
		var title = "";
		switch (parseInt(pageIndex)){
			case 0:
				title = "消息跟踪";
				break;
			case 1:
				title = "业务相关";
				break;
			case 2:
				title = "数据统计";
				break;
			case 3:
				title = "个人设置";
				break;
		}
		//获取显示菜单页面
		$('body>header>h1').text(title);
		$($('.am-navbar-nav li')[pageIndex]).addClass('active').siblings().removeClass('active');
		$($('#index>.am-page')[pageIndex]).addClass('show').siblings().removeClass('show');
	};
	getShowPage();
	
	if (localStorage.loginOut == "true") {
		plus.runtime.restart();
	}
	var tpl = Handlebars.compile(
			'{{#each list}}' +
			'<li data-rel="{{resourceUrl}}">' +
			'    <span class="{{resourceDescription}}"></span>{{resourceName}}' +
			'    <span class="am-icon-chevron-circle-right am-fr"></span>' +
			'</li>' +
			'{{/each}}'),
	
	messageMenu = $('#messageMenu'),
	
	customerMenu1 = $('#customerMenu1'),
	
	customerMenu2 = $('#customerMenu2'),
	
	customerMenu3 = $('#customerMenu3'),
	
	dataTabs = $('#dataTabs'),
	
	loginInfo = localStorage.loginInfo || "",
	
	readLoginInfo = function() {
		console.log(localStorage.loginMenu);
		var menu = JSON.parse(localStorage.loginMenu),
		loginInfo = JSON.parse(localStorage.loginInfo);
		//console.log(loginInfo);
		messageMenu.html(tpl(menu.menu1));
		customerMenu1.html(tpl(menu.menu2.list1));
		customerMenu2.html(tpl(menu.menu2.list2));
		customerMenu3.html(tpl(menu.menu2.list3));
		dataTabs.html(tpl(menu.menu3));
		
		$('#loginName').html(loginInfo.account.name);
		$('#loginPhone').html(loginInfo.account.phone);
		$('#loginCompanyName').html(loginInfo.companyName);
		$('#loginAreaName').html(loginInfo.areaName);
		//列表事件注册
		mui("#index").off("tap",".menu>li");
		mui("#index").on("tap",".menu>li", function(){
			var rel = $(this).data('rel');
			/*if (rel == "customer-money-items") {
				mui.openWindow({
					url:rel + ".html"
				});
				return;
			}*/
			mui.openWindow({
				url:rel + ".html"
			});
		});
		/*$('#index .menu>li').off('click').on('click', function() {
			var rel = $(this).data('rel');
			if (rel == "customer-money-items") {
				window.location.href = rel + ".html";
				return;
			}
			window.location.href = rel + ".html";
		});*/
	};
	
	$('#loginOut').on('click', function() {
		o2o.confirm('确定退出？', function(msg) {
			if (msg == "yes") {
				plus.runtime.restart();
				/*o2o.request({
					url: o2o.path.logout,
					data: {
						type: 1,
						appType : 0
					},
					success: function(respones) {
						o2o.prompt('退出成功', function() {
							localStorage.loginOut = true;
							plus.runtime.restart();
						});
					},
					fail: function(code, error) {
						o2o.prompt(error, function() {
							localStorage.loginOut = true;
							plus.runtime.restart();
						});
					}
				});*/
			}
		});
	});
	readLoginInfo();
	$('#editPassword').on('click', function(){
		mui.openWindow({url:'setting-passwordEdit.html'});
	});

document.addEventListener('plusready', function() {
	//工具栏事件注册
	mui('.am-navbar-nav li').on('tap', 'a', function(){ 
		var _self = $(this).parent(),
			index = _self.parent().children().index(_self);
	
		//window.location.href = "index.html?tab="+index;
		history.pushState({}, "page", "index.html?tab=" + index);
		getShowPage();
	});
	plus.nativeUI.closeWaiting();
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
	
	var getVersion = function(wgtVer){
		// 下载wgt文件
		//var wgtUrl = o2o.path.local+"/resources/oa/unpackage/release/H5837A109.wgt";//192.168.20.14:8001
		var downWgt = function (wgtUrl) {
			if(!$.trim(wgtUrl)){
				o2o.prompt('下载地址有误!');
				return;
			}
			plus.nativeUI.showWaiting("正在下载更新...");
			plus.downloader.createDownload(wgtUrl, {
				filename: "_doc/update/"
			}, function(d, status) {  
				if (status == 200) {
					console.log("下载wgt成功：" + d.filename);
					installWgt(d.filename); // 安装wgt包
				} else {
					console.log("下载wgt失败！");
					plus.nativeUI.alert("下载wgt失败！");
				}
				plus.nativeUI.closeWaiting();
			}).start();
		};
	
		// 更新应用资源
		var installWgt = function (path) {
			plus.nativeUI.showWaiting("安装更新...");
			plus.runtime.install(path, {}, function() {
				plus.nativeUI.closeWaiting();
				plus.nativeUI.alert("自动更新完成, 重启应用生效！", function() {
					plus.runtime.restart();
				});
			}, function(e) {
				plus.nativeUI.closeWaiting();
				plus.nativeUI.alert("安装wgt文件失败, 请到app商店重新下载！");
			});
		};
		
		var allUpdate = function(downUrl){
			var u = navigator.userAgent; 
			var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1;
			var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
			if(isiOS){
				var url='https://itunes.apple.com/cn/app/zhen-zong-guan/id1118851422?mt=8';// HelloH5应用在appstore的地址
				plus.runtime.openURL(url);
			}else if(isAndroid){
				plus.nativeUI.showWaiting("正在下载更新...");
				var dtask = plus.downloader.createDownload( downUrl, {}, function ( d, status ) {
					plus.nativeUI.closeWaiting();
				    if ( status == 200 ) { // 下载成功
				    	console.log('下载成功');
				        var path = d.filename;
				        plus.runtime.install(path); 
				        console.log(d.filename);
				    } else {//下载失败
						plus.nativeUI.alert("下载失败, 请到app商店重新下载！");
				    }  
				});
				dtask.start();
			}
		};
	
		// 检测更新
		var checkUrl = "/version/versionManager/queryVersion.do";
		
		console.log(sessionStorage.checkupdate);
		var addressType = 1;
		if(sessionStorage.checkupdate && sessionStorage.checkupdate == 1){
			return;
		}
		if(o2o.path.local.indexOf("jxo2o.51icare.cn") > -1 ){
			addressType = 2;
		}
		o2o.request({
			url: checkUrl,
			noWin: true,
			data: {
				addressType: addressType,
				appType:1
			},
			success: function(respones) {
				sessionStorage.checkupdate = 1;
				var newVer = respones.version.version;
				var versionName = respones.version.versionName;
				var content = respones.version.content;
				console.log($.trim(wgtVer)+"##"+$.trim(newVer));
				if ($.trim(wgtVer) && $.trim(newVer) && ($.trim(wgtVer) != $.trim(newVer))) {
					if(respones.version.versionType==2){
						console.log('配置升级');
						plus.nativeUI.confirm(content, function(e) {
							if (e.index == 0) { 
								allUpdate(respones.version.downUrl);
							}
						}, versionName, ['去下载']); 
					}else{
						console.log(content);
						content = content.replace(/\\n/g, '\n').replace(/ /g, ""); 
						plus.nativeUI.confirm(content, function(e) {
							if (e.index == 0) { 
								console.log(respones.version.downUrl);
								downWgt(respones.version.downUrl); // 下载升级包 
							}
						}, versionName, ['升级']); 	
					}
				} else {
					console.log('无新版本可更新');
				} 
			},
			fail: function(code, error) {
				console.log(error); 
			}
		}); 
	};
	/*检测更新*/
	plus.runtime.getProperty(plus.runtime.appid, function(inf) {
		$('#version').html(inf.description);
		getVersion(inf.version);
	});
	
	o2o.request({
		url: o2o.path.customerQueryAreas,
		noWin: true,
		data: {
			areaType:0
		},
		success: function(respones) {
			localStorage.areas = JSON.stringify(respones.list);
		},
		fail: function(code, error) {
			o2o.prompt(error);
		}
	}); 
}, false);
	