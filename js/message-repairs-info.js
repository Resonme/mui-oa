document.addEventListener('plusready', function() {	
	var tpl = Handlebars.compile(
			'<div class="mui-input-group">' +
			'    <div class="mui-input-row" id="toShop" style="height:auto">' +
			'        <label>店铺名称：</label>' +
			'		 <a class="mui-navigate-right">'+
			'        <div style="padding:11px 15px 11px 0;line-height:1.1;">{{repairDO.shopName}}</div>' +
			'		 </a>'+
			'    </div>' +
			'</div>'+
			'<div class="mui-input-group" style="margin: 10px 0 0;">' +
			'    <div class="mui-input-row">' +
			'        <label>店铺编号：</label>' +
			'        <div style="padding:11px 15px 11px 0;line-height:1.1;">{{repairDO.shopNo}}</div>' +
			'    </div>' +
			'    <div class="mui-input-row" style="margin-top:-15px;">' +
			'        <label>店铺类型：</label>' +
			'        <div style="padding:11px 15px 11px 0;line-height:1.1;">{{repairDO.shopTypeName}}</div>' +
			'    </div>' +
			'    <div class="mui-input-row" style="margin-top:-15px;">' +
			'        <label>所属区域：</label>' +
			'        <div style="padding:11px 15px 11px 0;line-height:1.1;">{{repairDO.areaName}}</div>' +
			'    </div>' +
			'    <div class="mui-input-row" style="margin-top:-15px;">' +
			'        <label>负&nbsp;&nbsp;责&nbsp;&nbsp;人：</label>' +
			'        <div style="padding:11px 15px 11px 0;line-height:1.1;">{{repairDO.leaderName}}</div>' +
			'    </div>' +
			'    <div class="mui-input-row" style="margin-top:-15px;">' +
			'        <label>电&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;话：</label>' +
			'        <div style="padding:11px 15px 11px 0;line-height:1.1;">{{repairDO.leaderPhone}}</div>' +
			'    </div>' +
			'    <div class="mui-input-row" style="height:auto;margin-top:-15px;">' +
			'        <label>地&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;址：</label>' +
			'        <div class="mui-pull-right" style="padding:11px 15px 11px 0;line-height:1.1;width:65%;">{{repairDO.shopAddress}}</div>' +
			'    </div>' +
			'</div>'+
			
			
			'<div class="mui-input-group" style="margin: -1px 0 0;">'+
			'      <div class="mui-input-row">' +
			'        <label>维修单号：</label>' +
			'        <div style="padding:11px 15px 11px 0;line-height:1.1;">{{repairDO.repairNO}}</div>' +
			'      </div>' +
			'    <div class="mui-input-row" style="margin-top:-15px;">' +
			'        <label>维修类型：</label>' +
			'        <div style="padding:11px 15px 11px 0;line-height:1.1;">{{repairDO.problemDescription}}</div>' +
			'    </div>' +
			'    <div class="mui-input-row" style="margin-top:-15px;height:auto;">' +
			'        <label>问题描述：</label>' +
			'        <div style="padding:11px 15px 11px 0;line-height:1.1;float:right;width:65%;">{{repairDO.problemSupplementary}}</div>' +
			'    </div>' +
			'    <div class="mui-input-row" style="margin-top:-15px;">' +
			'        <label>申请时间：</label>' +
			'        <div style="padding:11px 15px 11px 0;line-height:1.1;">{{repairDO.createDate}}</div>' +
			'    </div>' +
			'      <div class="mui-input-row" style="height:auto;margin-top:-15px;">' +
			'        	<label style="padding:11px 15px 5px;">设备列表：</label>' +
			'			<div style="margin:0 15px 15px">'+
			'          <table class="mui-table">' +
			'            <thead class="head">' +
			'              <tr>' +
			'                <th>设备类型</th>' +
			'                <th width="120">设备型号</th>' +
			'              </tr>' +
			'            </thead>' +
			'           {{#if shopDevice}}' +
			'           {{#each shopDevice}}' +
			'            <tr>' +
			'              <td>{{deviceName}}</td>' +
			'              <td>{{deviceModel}}</td>' +
			'            </tr>' +
			'           {{/each}}' +
			'			{{else}}'+
			'            <tr>' +
			'              <td colspan="2">暂无设备！</td>' +
			'            </tr>' +
			'           {{/if}}' +
			'          </table>' +
			'		 </div>'+
			'      </div>' +
			'</div>'+
			'{{#if employees}}' +
			'	<div class="mui-input-group" style="margin: 10px 0 0;">'+
			'      <div class="mui-input-row" style="margin-bottom:50px;">' +
			'        <label>维修人员：</label><input type="hidden" id="employeeId">' +
			'        <input type="text" id="employeeName" value="请选择维修人员" readonly><a class="mui-navigate-right"></a>' +
			'      </div>' +
			'  </div>'+
			'{{/if }}'+
			'{{#if repairDO.employeeName}}' +
			'	<div class="mui-input-group" style="margin: 10px 0 0;">'+
			'      <div class="mui-input-row">' +
			'        <label>维修人员：</label>' +
			'        <div style="padding:11px 15px 11px 0;line-height:1.1;">{{repairDO.employeeName}}</div>' +
			'      </div>' +
			'  </div>'+
			'{{/if }}'+
			'<ul class="mui-table-view mui-clearfix" style="margin: 10px 0 0;">'+
			'      {{#if repairDO.image}}'+
			'		<li class="mui-table-view-divider" style="margin-top:-1px;">现场取证：</li>'+
			'      <li class="mui-table-view-cell" style="padding:0;">' +
			'			<ul style="width:100%;overflow:hidden;" class="mui-table-view mui-grid-view mui-text-left"" id="images">' +
		    '			</ul>' +
			'      </li>' +
			'	   {{/if}}' +
			'      {{#if repairDO.repairResult}}' +
			'		<li class="mui-table-view-divider" style="margin-top:-1px;">处理结果：</li>'+
			'      <li class="mui-table-view-cell">' +
			'        {{repairDO.repairResult}}' +
			'      </li>' +
			'	   {{/if}}' +
			'</ul>'),

		tpl_button = '  <button id="check" class="mui-btn mui-btn-block mui-btn-active examine" data-state="3"><span class="am-icon-check"></span>现场处理</button>',

		tpl_button2 = '  <button id="submit" class="mui-btn mui-btn-block mui-btn-active examine" data-state="3"><span class="am-icon-check"></span>确定</button>',
		
		cw = plus.webview.currentWebview(),
		repairId = cw.repairId || "",
		content = $('#messageRepairInfo'),
		shopId = cw.shopId,
		cardGps, 
		longitude,
		latitude;
	var userPicker = new mui.PopPicker();
	
	var init = function(){
		o2o.request({
			url: o2o.path.messageGetRepair,
			data: {
				repairId: repairId
			},
			success: function(respones) {
				respones.repairDO.createDate = new Date(respones.repairDO.createDate).Format('yyyy-MM-dd hh:mm:ss');
				if(respones.repairDO.repairState == 1){
					respones.repairDO.employeeName = '';
				}
				content.html(tpl(respones));
				var users = [];
				$(respones.employees).each(function(){
					users.push({
						text:this.employeeName,
						value:this.accountId
					})
				});
				userPicker.setData(users);
				latitude = respones.repairDO.latitude;
				longitude = respones.repairDO.longitude;
				cardGps = respones.cardGps;
				if($('#go')){
					$('#go').remove()
				};
				$('#footer').html('');
				if (respones.repairDO.repairState == 1 ) {
					$('#footer').html(tpl_button);
					$('#check').on('click', function(){
						mui.openWindow({
							url:'shop-repair-do.html',
							extras:{
								shopId:shopId,
								repairId:repairId,
								longitude:longitude,
								latitude:latitude,
								cardGps:cardGps
							}
						})
					});
				}else if(respones.repairDO.repairState == 0){
					$('#employeeName').on('click', function(){
						userPicker.show(function(items) {
							$('#employeeName').val(items[0].text); 
							$('#employeeId').val(items[0].value); 
							//返回 false 可以阻止选择框的关闭
							//return false;
						});
					});
					$('#footer').html(tpl_button2);
					$('#submit').on('click', function(){
						if( !$.trim( $('#employeeId').val() ) ){
							o2o.prompt('请选择维修人员！');
							return;
						}
						o2o.request({
							url: o2o.path.modifyRepair,
							data: {
								repairId: repairId,
								repairState:1,
								employeeId:$('#employeeId').val()
							},
							success: function(respones) {
								var opener = plus.webview.currentWebview().opener();
								mui.fire(opener,'listRefresh',{
									repairId:repairId
								});
								o2o.prompt('指派成功');
								mui.back();
							},
							fail: function(code, error) {
								o2o.prompt(error);
							}
						});
					});
				}
				
				if(respones.repairDO.image && respones.repairDO.image.length > 0){
					o2o.request({
						url : o2o.path.getQiniuUrl,
						data : {
							url:respones.repairDO.image
						},
						success: function(respones) {
							$(respones.downloadUrl.split(',')).each(function(){
								if($.trim(this)){
									$('#images').append(
										'  <li class="mui-table-view-cell mui-media mui-col-xs-3">' +
									    '       <a>' +
									    '         <img class="mui-media-object" data-preview-src="" data-preview-group="1" src="'+this+'"/>' +
									    '  		</a>' +
									    '  </li>' 
					        			);
								}
							});
							$('#images .mui-table-view-cell>a>img').css('height', $('#images .mui-table-view-cell>a>img').width()+"px");
						},
						fail: function(code, error) {
							o2o.prompt(error);
						}
					});
				}
				
			},
	
			fail: function(code, error) {
				o2o.prompt(error);
			}
		});
	};
	init();
	
	window.addEventListener('changeState', function(){
		init();
	});
	
}, false);