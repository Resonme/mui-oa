document.addEventListener('plusready', function() {	
	var tpl = Handlebars.compile(
			'  <input type="hidden" name="shopId" value="{{shopDO.shopId}}">' +
			'    <form class="mui-input-group" id="devicebaseForm" data-form="modifyBaseDevice">' +
			'      <div class="mui-input-row">' +
			'        <label>NFC标签号：</label>' +
			'        <input type="text" name="shopNfc" placeholder="请输入NFC标签号" value="{{shopDO.shopNfc}}"><i></i>' +
			'      </div>' +
			'      <div class="mui-input-row">' +
			'        <label>SIM卡号：</label>' +
			'          <input type="number" name="simCard" onkeyup="this.value=this.value.replace(/\D/g,\'\').substring(0,20)" placeholder="请输入SIM卡号" value="{{shopDO.simCard}}"><i></i>' +
			'      </div>' +
			'      <div class="mui-input-row">' +
			'        <label>开始时间：</label>' +
			'           <input type="text" name="sTime" id="sTime" placeholder="请选择开始时间" value="{{shopDO.simStartTime}}" readonly><i class="right-sm"></i>' +
			'			<a class="mui-navigate-right"></a>'+
			'      </div>' +
			'      <div class="mui-input-row">' +
			'        <label>结束时间：</label>' +
			'          <input type="text" name="eTime" id="eTime" placeholder="请选择结束时间" value="{{shopDO.simEndTime}}" readonly><i class="right-sm"></i>' +
			'			<a class="mui-navigate-right"></a>'+
			'      </div>' +
			'      <div class="mui-input-row">' +
			'          <button type="button" class="mui-btn mui-btn-success deviceSubmit" disabled>保存</button>' +
			'          <button type="button" class="mui-btn mui-btn-primary deviceEdit">编辑</button>' +
			'        </div>' +
			'      </div>' +
			'    </form>' +
			'{{#each alarmDeviceDOs}}' +
			' <div class="content-bg am-margin-top-sm device" id="hostDeviceIndex">' +
			'    <form class="mui-input-group" id="device{{deviceModelId}}" data-form="messageInstallAddDevice">' +
			'          <input type="hidden" name="hostId" value="{{hostId}}">' +
			'          <input type="hidden" name="shopDeviceId" value="{{shopDeviceId}}">' +
			'      <div class="mui-input-row">' +
			'        <label>主机名称：</label>' +
			'          <div style="line-height:1.1;padding: 11px 15px;">{{deviceName}}（{{deviceModel}}）</div>' +
			'      </div>' +
			'	{{#if hostSerial}}' +
			'      <div class="mui-input-row">' +
			'        <label>报警主机序列号：</label>' +
			'          <input type="text" name="hostSerial" placeholder="请输入报警主机序列号" value="{{hostSerial}}" data-validator-notNull="请输入报警主机序列号"><i></i>' +
			'      </div>' +
			'	{{/if}}' +
			'	{{#if hostIp}}' +
			'        <div class="mui-input-row">' +
			'        <label>主机IP：</label>' +
			'          <input type="number" name="hostIp" placeholder="请输入主机IP" value="{{hostIp}}"><i></i>' +
			'        </div>' +
			'	{{/if}}' +
			'	{{#if hostPort}}' +
			'        <div class="mui-input-row">' +
			'        <label>端 口 号：</label>' +
			'          <input type="number" name="hostPort" placeholder="请输入端口号" value="{{hostPort}}"><i></i>' +
			'        </div>' +
			'	{{/if}}' +
			'	{{#if deviceUsername}}' +
			'        <div class="mui-input-row">' +
			'        <label>登录账号：</label>' +
			'          <input type="text" name="deviceUsername" placeholder="请输入登录账号" value="{{deviceUsername}}" data-validator-notNull="请输入登录账号"><i></i>' +
			'        </div>' +
			'	{{/if}}' +
			'	{{#if devicePassword}}' +
			'        <div class="mui-input-row">' +
			'        	<label>登录密码：</label>' +
			'           <input type="password" name="devicePassword" placeholder="请输入登陆密码" value="{{devicePassword}}" data-validator-notNull="请输入登陆密码"><i></i>' +
			'        </div>' +
			'	{{/if}}' +
			'      <div class="mui-input-row">' +
			'          <button type="button" class="mui-btn mui-btn-success deviceSubmit" disabled>保存</button>' +
			'          <button type="button" class="mui-btn mui-btn-primary deviceEdit">编辑</button>' +
			'      <button type="button" class="mui-btn mui-btn-danger deviceRemove" data-id={{shopDeviceId}} data-hostid="{{hostId}}">删除</button>' +
			'        </div>' +
			'      </div>' +
			'    </form>' +
			'  </div>' +
			'{{/each}}' +

			'{{#each cameraDeviceDOs}}' +
			'  <div class="content-bg am-margin-top-sm device">' +
			'    <form class="mui-input-group" id="device{{deviceModelId}}" data-form="messageInstallAddDevice">' +
			'          <input type="hidden" name="hostId" value="{{hostId}}">' +
			'          <input type="hidden" name="shopDeviceId" value="{{shopDeviceId}}">' +
			'      <div class="installDeviece">' +
			'	{{#if deviceName}}' +
			'        <div class="mui-input-row">' +
			'        <label>设备名称：</label>' +
			'        <div style="line-height:1.1;padding: 11px 15px;">{{deviceName}}（{{deviceModel}}）</div>' +
			'        </div>' +
			'	{{/if}}' +
			'	{{#if hostSerial}}' +
			'        <div class="mui-input-row">' +
			'        <label>视频设备序列号：</label>' +
			'          <input type="text" name="hostSerial" value="{{hostSerial}}"><i></i>' +
			'        </div>' +
			'	{{/if}}' +
			'	{{#if hostIp}}' +
			'        <div class="mui-input-row">' +
			'        	<label>主机IP：</label>' +
			'          <input type="number" name="hostIp" value="{{hostIp}}"><i></i>' +
			'        </div>' +
			'	{{/if}}' +
			'	{{#if hostPort}}' +
			'        <div class="mui-input-row">' +
			'        <label>端 口 号：</label>' +
			'          <input type="number" name="hostPort" value="{{hostPort}}"><i></i>' +
			'        </div>' +
			'	{{/if}}' +
			'	{{#if deviceUsername}}' +
			'        <div class="mui-input-row">' +
			'        <label>登录账号：</label>' +
			'          <input type="text" name="deviceUsername" value="{{deviceUsername}}" data-validator-notNull="请输入登录账号"><i></i>' +
			'        </div>' +
			'	{{/if}}' +
			'	{{#if devicePassword}}' +
			'        <div class="mui-input-row">' +
			'        <label>登录密码：</label>' +
			'          <input type="password" name="devicePassword" value="{{devicePassword}}" data-validator-notNull="请输入登陆密码"><i></i>' +
			'        </div>' +
			'	{{/if}}' +
			'      </div>' +
			'      <div class="mui-input-row">' +
			'          <button type="button" class="mui-btn mui-btn-success deviceSubmit" disabled>保存</button>' +
			'          <button type="button" class="mui-btn mui-btn-primary deviceEdit">编辑</button>' +
			'      <button type="button" class="mui-btn mui-btn-danger deviceRemove" data-id={{shopDeviceId}} data-hostid="{{hostId}}">删除</button>' +
			'        </div>' +
			'  </div>' +
			'    </form>' +
			'      </div>' +
			'{{/each}}' +
			'  {{#if shopDO.serviceDO}}' +
			/*'	<h5 style="margin:30px 15px 5px;">任务备注：</h5>'+*/
			'  <div class="mui-card" style="padding:10px;margin:30px 15px 5px;"> ' +
			'    <p class="am-margin-left-sm am-text-left">{{shopDO.serviceDO.serviceContent}}</p>' +
			'   </div>' +
			'  {{/if}}' +
			'   '),

	list = $('#deviceInfo'),

	shopId = o2o.getUrlParam('shopId'),

	editBack = o2o.getUrlParam('editBack') || "",

	formEnvent = function() {
		var currYear = (new Date()).getFullYear();
		
		$('#sTime,#eTime').on('click', function(){
			if( !$.trim($('input[name=simCard]').val()) ){
				o2o.prompt('请输入SIM卡号！');
				return;
			}
			var _self = $(this);
			var picker = new mui.DtPicker({
				type: "date",
				value: $(this).val()
			});
			picker.show(function(rs) {
				_self.val(rs.text);
				if(_self.attr('id')=="sTime"){
					var etime =new Date(_self.val());
					etime.setFullYear(etime.getFullYear()+1);
					$('input[name=eTime]').val(etime.Format('yyyy-MM-dd'));
				}
				picker.dispose();
				
			});
		});

		$('.device .deviceRemove').off('click').on('click', function() {
			var hostId = $(this).data('hostid'),
				shopDeviceId = $(this).data('id')
			data = {
				shopDeviceId: shopDeviceId,
				isDelete: 1
			};
			if ($.trim(hostId)) {
				data.hostId = hostId;
			}
			o2o.confirm('确定删除该设备？', function(msg) {
				if (msg == "yes") {
					o2o.request({
						url: o2o.path.shopModifyShopDevice,
						data: data,
						success: function(respones) {
							o2o.prompt('操作成功', function() {
								window.location.reload();
							});
						},
						fail: function(code, error) {
							o2o.prompt(error);
						}
					});
				}
			});
		});
		$('button.deviceEdit').off('click').on('click', function() {
			var form = $(this).parent().parent();
			$(this).attr('disabled', true);
			$(this).siblings('.deviceSubmit').attr('disabled', false);
			$(form).find('input[type=text],input[type=number],input[type=password]').attr('disabled', false);
		});
		$('button.deviceSubmit').off('click').on('click', function() {
			var form = $(this).parent().parent();
			if( form.attr('id') == "devicebaseForm" ){
				if ($.trim($('input[name=simCard]').val())) {
					var regexp = /^\d{11,}$/;
					if (!$('input[name=simCard]').val().match(regexp)) {
						o2o.prompt('SIM卡号格式有误');
						return;
					}
					if (!$.trim($('input[name=sTime]').val())) {
						o2o.prompt('请输入开始时间');
						return;
					}
					if (!$.trim($('input[name=eTime]').val())) {
						o2o.prompt('请输入结束时间');
						return;
					}
					if (new Date($('input[name=eTime]').val()).getTime() < new Date($('input[name=sTime]').val()).getTime() ) {
						o2o.prompt('开始时间不能大于结束时间');
						return;
					}
				} else {
					if ($.trim($('input[name=eTime]').val()) || $.trim($('input[name=sTime]').val())) {
						o2o.prompt('请输入SIM卡号');
						return;
					}
				}
			}
			
			o2o.confirm('是否确认修改？', function(msg) {
				console.log(form);
				if ("yes" == msg) {
					var data = $(form).serialize() + '&shopId=' + $('input[name=shopId]').val(),

						formId = $(form).attr('id'),

						url = o2o.path[$(form).data('form')];

					o2o.request({
						url: url,
						data: data,
						validator: '#' + formId,
						success: function(respones) {
							o2o.prompt('操作成功', function() {
								init();
							});
						},
						fail: function(code, error) {
							o2o.prompt(error);
						}
					});
				}
			});
		});
	};
	
	var init = function(){
		o2o.request({
			url: o2o.path.customerViewShopDetails,
			noWin: true,
			data: {
				shopId: shopId,
				style: 2
			},
			success: function(respones) {
				respones.alarmDeviceDOs = [];
				respones.cameraDeviceDOs = [];
				$(respones.shopDO.shopDevices).each(function() {
					if (this.deviceStyle == 3 || this.deviceStyle == 4) {
						respones.alarmDeviceDOs.push(this);
					}
					if (this.deviceStyle == 0) {
						respones.cameraDeviceDOs.push(this);
					}
				});
				if (respones.shopDO.serviceDO) {
					var index = respones.shopDO.serviceDO.serviceContent.indexOf('##'),
						length = respones.shopDO.serviceDO.serviceContent.length,
						str = respones.shopDO.serviceDO.serviceContent;
					if (index > -1) {
						str = '设备列表：<br>'+respones.shopDO.serviceDO.serviceContent.substring(0, index) + '<br><br>备注：<br><span class="mui-badge mui-badge-inverted">' + respones.shopDO.serviceDO.serviceContent.substring(index, length) + '</span>';
					}
					respones.shopDO.serviceDO.serviceContent = new Handlebars.SafeString(str.replace(/\n/g, "<br>"));
				}
				if($.trim(respones.shopDO.simStartTime)){
					respones.shopDO.simStartTime = new Date(respones.shopDO.simStartTime).Format('yyyy-MM-dd');
				}
				if($.trim(respones.shopDO.simEndTime)){
				respones.shopDO.simEndTime = new Date(respones.shopDO.simEndTime).Format('yyyy-MM-dd');
				}
				list.html(tpl(respones));
				formEnvent();
				$('input[type=text],input[type=number],input[type=password]').attr('disabled', true);
			},
			fail: function(code, error) {
				o2o.prompt(error);
			}
		});
	};
	
	init();
	$('#shopDeviceAdd').on('click', function() {
		var deviceStyle = "";
		if ($('#hostDeviceIndex') && $('#hostDeviceIndex').length > 0) {
			deviceStyle = 8;
		}
		mui.openWindow({
			url:"shop-device-add.html",
			extras:{
				shopId:shopId,
				deviceStyle:deviceStyle
			}
		})
	});
	
	window.addEventListener('deviceInit', function(){
		init();
	});
}, false);