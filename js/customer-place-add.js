document.addEventListener('plusready', function() {
	var tpl = Handlebars.compile('<form class="mui-input-group" id="form">' +
		'      <div class="mui-input-row {{hideParent}}">' +
		'        <label>上级区域：</label>' +
		'        <input type="hidden" name="parentId" value="{{parentId}}" data-validator-notNull="请选择上级区域"><input type="text" class="input-select" id="node" value="{{parentName}}" placeholder="请选择上级区域" readonly>' +
		'		 <a class="mui-navigate-right"></a>'+
		'      </div>' +
		'      <div class="mui-input-row">' +
		'        <label>区域编号：</label>' +
		'        <input type="number" id="areaNo" maxlength="2"  onkeyup="this.value=this.value.replace(/\\D/g,\'\').substring(0,2)" placeholder="编号为2位数字"  value="{{areaNo}}">' +
		'      </div>' +
		'      <div class="mui-input-row">' +
		'        <label>区域名称：</label>' +
		'        <input type="hidden" name="areaId"  value="{{areaId}}">' +
		'        <input type="text" name="areaName" data-validator-notNull="请输入区域名称" placeholder="2-10位中文"  value="{{areaName}}">' +
		'      </div>' +
		'	   <div class="mui-input-row" style="height: auto;">' +
		'			<label>VIP区域：</label>' +
		'			<div class="mui-input-row mui-radio mui-pull-left mui-left" style="clear:none;margin-left: -20px;">' +
		'				<label>是</label>' +
		'				<input name="areaType" type="radio" value="1">' +
		'			</div>' +
		'			<div class="mui-input-row mui-radio mui-pull-left mui-left" style="clear:none;">' +
		'				<label>否</label>' +
		'				<input name="areaType" type="radio" value="0"checked>' +
		'			</div>' +
		'	   </div>' +
		'      <div class="mui-input-row" style="height:auto;">' +
		'	   		<label>非自动派警：</label>'+
		'           <input type="text" name="startTime" value="{{startTime}}" placeholder="选择开始时间"  readonly><a class="mui-navigate-right starttime"></a>' +
		'           <input type="text" name="endTime" value="{{endTime}}" placeholder="选择结束时间" readonly><a class="mui-navigate-right endtime"></a>' +
		'      </div>' +
		'      <div class="mui-input-row" style="height:auto;">' +
		'        <label>巡逻定位有效距离(米)：</label>' +
		'        <input type="number" id="patrolGps" data-validator-notNull="请输入巡逻定位有效距离" min="50" max="2000" data-validator-num = "有效距离必须在50-2000米之间，请重新设置" placeholder="巡逻定位有效距离"  value="{{patrolGps}}">' +
		'      </div>' +
		'    </form>'),

	content = $('#content'),
	submitBtn = $('#submit'),
	areaNo = "",
	patrolGps = "",
	cw = plus.webview.currentWebview(),
	areaId = cw.areaId || o2o.getUrlParam('areaId'),

	renderMenu = function(menu, parent) {
		var el = $(
			'          <div class="am-cf am-margin-left-lg am-margin-right-sm">' +
			'            <input id="radio' + menu.id + '" type="radio" name="r" value="' + menu.id + '"><label for="radio' + menu.id + '" class="am-fl">' + menu.text + '</label>' +
			'          </div>');
		//'<a href="' + menu.link  +'">' + menu.name + '</a>'
		$(parent).append(el);
		if (!menu.children || menu.children.length == 0) {
			return parent;
		}
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
	},

	getTreeHTML = function() {
		$('#node').on('click', function() {
			var areaIds = $('input[name=parentId]').val();
			mui.openWindow({
				url:"select-area.html",
				extras:{
					checkType:"radio",
					areaIds:areaIds
				}
			});
		});
		
		$('input[name=startTime], input[name=endTime]').on('click', function(){
			var _self = $(this);
			var time;
			if($.trim(_self.val()) ){
				time = new Date().getFullYear()+"-"+new Date().getMonth()+"-"+ new Date().getDay() + " " + _self.val();
				time = new Date(time).Format('yyyy-MM-dd hh:mm');
			}else{
				time = new Date().Format('yyyy-MM-dd hh:mm');
			}
			
			console.log(time);
			var picker = new mui.DtPicker({
				type: "time",
				value: time
			});
			picker.show(function(rs) {
				_self.val(rs.text);
				picker.dispose();
			});
		});
	};
	
	window.addEventListener('getArea', function(e){
		var areaName = e.detail.areaName;
		var areaIds = e.detail.areaIds;
		console.log(areaName,areaIds);
		$('input[name=parentId]').val(areaIds.toString());
		$('#node').val(areaName.toString());
	});
	
	var url = o2o.path.customerCreateArea,
		message = "添加成功";
	if ($.trim(areaId)) {
		url = o2o.path.customerModifyArea;
		message = "修改成功";
	}
	
	submitBtn.on('click', function() {
		var reg = /^[\u4e00-\u9fa5]{2,10}?/;
		var reg_no = /^\d{2}?/;
		var data = $('#form').serialize();
		if( $.trim($('#areaNo').val()) ){
			if(!$('#areaNo').val().match(reg_no) || $('#areaNo').val().length != 2){
				o2o.prompt('区域编号为两位数字，也可为空');
				return;
			}
		}
		if (!$('input[name=areaName]').val().match(reg)) {
			o2o.prompt('区域名称为2-10位中文');
			return;
		}
		if( ($.trim($('input[name=startTime]').val()) && $.trim($('input[name=endTime]').val())) || (!$.trim($('input[name=startTime]').val()) && !$.trim($('input[name=endTime]').val())) ){
		}else{
			o2o.prompt('非自动派警时间不能只选择其中一个！');
			return;
		}
		if( ($.trim(areaId) && areaNo != $("#areaNo").val()) ||  !$.trim(areaId)){
			data += "&areaNo=" + $("#areaNo").val();
		}
		if( ($.trim(areaId) && patrolGps != $("#patrolGps").val()) ||  !$.trim(areaId)){
			data += "&patrolGps=" + $("#patrolGps").val();
		}
		o2o.request({
			url: url,
			data: data,
			validator: "#form",
			success: function(respones) {
				mui.back();
				o2o.prompt(message);
			},

			fail: function(code, error) {
				o2o.prompt(error);
			}
		});
	});
	if ($.trim(areaId)) {
		$('h1.am-header-title').html('修改区域');
		o2o.request({
			url: o2o.path.customerViewAreaDetails,
			data: {
				areaId: areaId
			},
			success: function(respones) {
				respones.areaDO.hideParent = "am-hide";
				content.html(tpl(respones.areaDO));
				getTreeHTML();
				areaNo = respones.areaDO.areaNo;
				patrolGps = respones.areaDO.patrolGps;
			},

			fail: function(code, error) {
				o2o.prompt(error);
			}
		});
	} else {
		content.html(tpl());
		getTreeHTML();
	}
});
