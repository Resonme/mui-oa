mui.plusReady(function() {	
	
	var userPicker = new mui.PopPicker();
	var content = $('#form-install'), shopTypes, packages,
	downhtml = $('<div></div>'),
	cw = plus.webview.currentWebview(),
	serviceId = cw.serviceId || o2o.getUrlParam('serviceId'),
	shopId = cw.shopId || o2o.getUrlParam('shopId');
	renderMenu = function(menu, parent) {
		var el = $(
			'          <div class="am-cf am-margin-left-lg am-margin-right-sm">' +
			'            <input id="radio' + menu.id + '" type="radio" name="r" value="' + menu.id + '"><label for="radio' + menu.id + '" class="am-fl">' + menu.text + '</label>' +
			'          </div>');
		$(parent).append(el);
		var ul = $('<ul/>');
		for (var i = 0; i < menu.children.length; ++i) {
			var li = $('<li/>');
			renderMenu(menu.children[i], li);
			ul.append(li);
		}

		$(parent).append(ul);
		return parent;
	},

	render = function(json) {
		var div = $('<li></li>');
		return renderMenu(json, div);
	}/*,

	getDevicelist = function(list) {
		var form = '<table class="am-table content-bg" id="selectEquipment">';
		if (list && list.length > 0) {
			for (var i = 0; i < list.length; i++) {
				var deviceModels = list[i].deviceModels,
					options = "";
				$(deviceModels).each(function() {
					options += '<option value="' + this.deviceModelId + '">' + this.deviceModel + '</option>';
				});
				form +=
					'  <tr>' +
					'    <td><span class="dvicename">' + list[i].deviceType + '</span>（<span class="deviceModelName">' + list[i].deviceModel + '</span>）</td>' +
					'    <td>' +
					'      <input type="number"  maxlength="2"  onkeyup="this.value=this.value.replace(/\\D/g,\'\').substring(0,3);" class="deviceAmount" value="0" min="0">' +
					'    </td>' +
					'    <td>' +
					'      <input class="devicelist" id="' + list[i].deviceModelId + '" value="' + list[i].deviceModelId + '" type="checkbox">' +
					'      <label for="' + list[i].deviceModelId + '"></label>' +
					'    </td>' +
					'  </tr>';
			}

			form += '</table>';
		}

		$('#equipmentAdd').showDownselect({
			data: form,
			init: function() {
				$('.devicelist').on('click', function() {
					var num = $(this).parent().parent().find('.deviceAmount');
					if ($(this).is(':checked')) {
						if (parseInt(num.val()) < 1) {
							num.val(1);
						}
					} else {
						num.val(0);
					}
				});
			},
			confirm: function() {
				var names = "", b = 0;
				$('input.devicelist:checked').each(function() {
					var deviceModelName = $(this).parent().parent().find('.deviceModelName').html(),
						deviceAmount = $(this).parent().parent().find('input.deviceAmount').val(),
						dvicename = $(this).parent().parent().find('.dvicename').html();
					if (parseInt(deviceAmount) > 0 && parseInt(deviceAmount) <= 999) {
						names += '<span class="mui-badge">'+dvicename + '（' + deviceModelName + 'x' + deviceAmount + '）</span>';
					} else {
						o2o.prompt('设备数量为1-999的整数');
						b = 1;
					}
				});
				if(b == 1){
					return;
				}
				$('#deviceBox').html(names);
				$('#deviceModels').val(names);
			}
		});

	}*/;

	//var mapHTML = '<iframe id="mapIframe" src="http://m.amap.com/picker/?keywords=小区,道路,店&key=608d75903d29ad471362f8c58c550daf" style="position:fixed;top:0;left:0;width:100%;height:100%;z-index:9999;background:#fff;"></iframe>';
	
	var setpos = function(){
		$('#map').off('click').on('click', function(){
			var arg = [];
			if( $.trim($('#longitude').val()) && $.trim($('#latitude').val())){
				arg.push($('#longitude').val());
				arg.push($('#latitude').val());
			}
			$('input,textarea').blur();
			setTimeout(function(){
				mui.openWindow({
					id:"map.html",
					url:"map.html",
					extras:{
						pos : arg
					}
				});
			}, 200);
		});
	};
	
	window.addEventListener('returnPOS', function(event){
		console.log('returnPOS', event);
		var address = event.detail.address;
		var pos = event.detail.pos;
		$('#shopAddress').val(address).attr('readonly', false); 
		$('#longitude').val(pos[0]);
		$('#latitude').val(pos[1]);
	});
	
	o2o.request({
		url: o2o.path.queryPackagesByUsing,
		success: function(respones) {
			var data = [];
			if(respones.list && respones.list.length>0){
				$(respones.list).each(function(){
					data.push({
						text: this.packageName + '（' + this.packageServiceFee + '元/' + this.packageServiceTime + '个月）',
						value:'['+this.packageId+', '+this.packageServiceFee+']'
					})
				});
				packages = data;
			}
		},
		fail: function(code, error) {
			o2o.prompt(error);
		}
	});
	
	$('#check').on('click', function() {
		console.log($('#shopTypes').val(),$('#packageId').val());
		var data = $('#installAddForm').serialize(),
			serviceContent = $('#deviceBox').html();
		if ($.trim($('#serviceContent').val())) {
			serviceContent += "##" + $('#serviceContent').val() + "##"
		}
		data += "&serviceContent=" + serviceContent;
		var serviceMoney = $('input[name="serviceMoney"]').val();
		var regexp = /^\d{6,10}$/;
		var shopNo = $('#areaNo').text() + $('#shopNo').val();
		console.log(shopNo);
		if(!$.trim($('#shopName').val())){
			o2o.prompt('请输入店铺名称！');
			return; 
		}
		if(!$.trim($('#areaId').val())){
			o2o.prompt('请选择区域！');
			return; 
		}
		if(!shopNo.match(regexp) ){
			o2o.prompt('店铺编号格式有误！'); 
			return;
		}
		if(!$.trim($('#shopTypes').val())){
			o2o.prompt('请选择店铺类型！');
			return; 
		}
		if(!$.trim($('#deviceModels').val())){
			o2o.prompt('请选择安装设备！');
			return; 
		}
		if(!$.trim($('#packageId').val())){
			o2o.prompt('请选择店铺类型！');
			return; 
		}
		if(!$.trim(serviceMoney)){
			o2o.prompt('请输入已收定金！');
			return; 
		}
		if (parseInt(serviceMoney) > parseInt($('#packageFee').val())) {
			o2o.prompt('定金不能大于套餐金额');
			return;
		}
		var serviceId = $('#serviceId').val();
		var msg = "添加成功!";
		if($.trim(serviceId)){
			msg = "修改成功!";
		}
		data += "&shopDO.shopNo=" + shopNo;
		o2o.request({
			url: o2o.path.customerCreateInstallationTask,
			data: data,
			validator:"#installAddForm",
			success: function(respones) {
				o2o.prompt(msg, function() { 
					mui.back();
				});
			},
			fail: function(code, error) {
				o2o.prompt(error);
			}
		});
	});
	
	var getShopNO = function(areaId, areaType){
		var hidePanel = function(){
			if( !$('#shopNoPanel').hasClass('mui-hidden') ){
				$('#shopNoPanel').addClass('mui-hidden');
			}
			$('#shopNo').val("");
			$('#areaNo').html("");
		}
		if(!$.trim(areaId)){
			$('#shopNo').val("");
			hidePanel();
			return;
		}
		o2o.request({
			url: o2o.path.queryShopNoByAreaId,
			noWin:true,
			data:{areaId:areaId},
			success: function(respones) {
				if( areaType && areaType==1 ){
					$('#shopNoPanel').removeClass('mui-hidden');
					$('#areaNo').html(respones.shopNo.substring(0, 2));
					if(!$.trim($('#areaId').val())){
						$('#shopNo').val(respones.shopNo.substring(2, respones.shopNo.length));
					}
				}else{
					$('#shopNoPanel').removeClass('mui-hidden');
					$('#shopNo').val(respones.shopNo.substring(2, respones.shopNo.length));
					if(!$.trim($('#vipAreaId').val())){
						$('#areaNo').html(respones.shopNo.substring(0, 2));
					}
				}
			},
	
			fail: function(code, error) {
				hidePanel();
				o2o.prompt(error);
			} 
		});
	};
	
	window.addEventListener('getArea', function(e){
		var areaName = e.detail.areaName;
		var areaIds = e.detail.areaIds;
		if( e.detail.areaType == 1 ){
			$('#vipAreaId').val(areaIds.toString());
			$('#vipAreaName').val(areaName.toString());
			if( $.trim($('#vipAreaId').val()) ){
				getShopNO($('#vipAreaId').val(), 1);
			}else{
				getShopNO($('#areaId').val());
			}
		}else{
			$('#areaId').val(areaIds.toString());
			$('#node').val(areaName.toString());
			getShopNO($('#areaId').val());
			if( $.trim($('#areaId').val()) ){
				getShopNO($('#areaId').val());
			}else{
				getShopNO($('#vipAreaId').val(), 1);
			}
		}
	});
	
	$('#vipAreaName').on('click', function() {
		var areaIds = $('#vipAreaId').val();
		console.log(areaIds);
		mui.openWindow({
			url:"select-area.html",
			extras:{
				checkType:"radio",
				areaIds:areaIds,
				areaType: 1 
			}
		});
	});
	$('#node').on('click', function() {
		var areaIds = $('#areaId').val();
		mui.openWindow({
			url:"select-area.html",
			extras:{
				checkType:"radio",
				areaIds:areaIds,
				areaType: 0
			}
		});
	});
	
	window.addEventListener('deviceChange', function(e){
		var devices = e.detail.devices;
		var $html = "";
		$(devices).each(function(){
			$html += '<span class="mui-badge">'+this.deviceName + 'x' + this.deviceAmount + '</span>';
		});
		$('#deviceBox').html($html);
		if(devices){
			$('#deviceModels').val(JSON.stringify(devices));
		}else{
			$('#deviceModels').val("");
		}
	});
	$('#equipmentAdd').on('click', function() {
		o2o.request({
			url: o2o.path.customerViewQueryDevices,
			noWin:true,
			data: {
				searchType: 1
			},
			success: function(respones) {
				//getDevicelist(respones.list);
				mui.openWindow({
					url:"select-device.html",
					extras:{
						devices:respones.list,
						checkeds: $('#deviceModels').val()
					}
				})
			},

			fail: function(code, error) {
				o2o.prompt(error);
			}
		});
	});
	
	$('#shopTypesName').on('click', function(){
		userPicker.setData(shopTypes);
		userPicker.show(function(items) {
			$('#shopTypesName').val(items[0].text); 
			$('#shopTypes').val(items[0].value); 
			//返回 false 可以阻止选择框的关闭
			//return false;
		});
	});
	$('#packageName').on('click', function(){
		userPicker.setData(packages);
		userPicker.show(function(items) {
			$('#packageName').val(items[0].text); 
			$('#packageId').val( JSON.parse(items[0].value)[0] ); 
			$('#packageFee').val( JSON.parse(items[0].value)[1] );
			//返回 false 可以阻止选择框的关闭
			//return false;
		});
	});
	o2o.request({
		url: o2o.path.queryShopTypes,
		noWin:true,
		success: function(respones) {
			var data = [];
			$(respones.list).each(function(){
				var type = {
					text : this.typeName,
					value : this.type 
				};
				data.push(type);
			});
			shopTypes = data;
			//$('#shopTypes').attr('data-downselect', JSON.stringify(data).replace(/\"/g, "'"));
		},

		fail: function(code, error) {
			o2o.prompt(error);
		}
	});

	var serviceInstall = function(DO){
		var serviceContent = DO.serviceDO.serviceContent;
		var packageDO = DO.packageDO;
		$('#shopName').val(DO.shopDO.shopName);
		$('#shopId').val(DO.shopDO.shopId);
		$('#serviceId').val(DO.serviceDO.serviceId);
		$('#shopNo').val(DO.shopDO.shopNo);
		$('#areaId').val(DO.shopDO.areaId);
		$('#node').val(DO.shopDO.areaName);
		$('#shopAddress').val(DO.shopDO.shopAddress);
		$('#shopStyle').val(DO.shopDO.shopStyle);
		$('#longitude').val(DO.shopDO.longitude);
		$('#latitude').val(DO.shopDO.latitude);
		$('#packageId').val(DO.packageDO.packageId);
		$('#shopTypes').val(DO.shopDO.shopTypeName);
		$('#deviceModels').val(1);
		$('#deviceBox').html(serviceContent.substring(0,serviceContent.indexOf('##')));
		$('#packageInfo').html(packageDO.packageName+'（'+packageDO.packageServiceFee+'/'+packageDO.packageServiceTime+'个月）');
		$('input[name=serviceMoney]').val(DO.serviceDO.serviceMoney).attr('readonly', true);
		$('#serviceContent').val(
			serviceContent.substring(serviceContent.indexOf('##'), serviceContent.length).replace(/##/g,'')+
			' （打回原因：'+DO.serviceDO.examineContent+'）'
		);
		$('#shopNoPanel').removeClass('am-hide');
	};

	if($.trim(serviceId)){
		$('.am-header-title').html('安装信息修改');
		o2o.request({
			url: o2o.path.messageInstallInfo,
			noWin:true,
			data: {serviceId:serviceId,shopId:shopId},
			success: function(respones) {
				serviceInstall(respones);
			},

			fail: function(code, error) {
				o2o.prompt(error);
			}
		});
	}
	setpos();
});