mui.plusReady(function(){
	console.log(localStorage.loginInfo);
	var menu = JSON.parse(localStorage.loginInfo).menu,
	data = {
		list: []
	},
	tpl = Handlebars.compile(
		'<li onclick="javascript:location.href=\'{{resourceUrl}}.html\'">' +
		'        <span class="{{resourceDescription}}"></span>{{resourceName}}' +
		'        <span class="am-icon-chevron-circle-right am-fr"></span>' +
		'      </li>' ),
	
	list = $('#menulist');
	$(menu).each(function() {
		switch (parseInt(this.resourceId)) {
			case 26:
				list.append(tpl(this));
				break;
			case 28:
				list.append(tpl(this));
				break;
			case 36:
				list.append(tpl(this));
				break;
			case 37:
				list.append(tpl(this));
				break;
			case 38:
				list.append(tpl(this));
				break;
			case 39:
				list.append(tpl(this));
				break;
		}
	});
	$('form').on('submit', function(){
		var shopNo = $('#shopNo').val();
		var reg = /^[\u4E00-\u9FA5A-Za-z0-9]{0,20}$/;
		if(!shopNo.match(reg)){
			o2o.prompt('搜索条件格式有误！');
			return;
		}
		if ($.trim(shopNo)) {
			//console.log(decodeURI(encodeURI(shopNo)));
			location.href = "customer-business-list.html?shopNo=" + encodeURI(encodeURI(shopNo));
		}else{
			o2o.prompt('请输入搜索内容！');
		}
		$('#shopNo').blur();
	});
	
	$('#toInstall').on('click', function(){
		mui.openWindow({
			url:"customer-info-new-install.html"
		});
	});
});

