mui.plusReady(function() {	
	var tpl = Handlebars.compile(
		'		<div class="mui-input-row">'+
		'			<label>店铺名称</label>'+
		'           <input type="hidden" name="shopId" value="{{shopId}}">' +
		'          <input type="text" name="shopName" data-validator-notNull="店铺名称不能为空" value="{{shopName}}">' +
		'		</div>'+
		'		<div class="mui-input-row">'+
		'			<label>店铺类型</label>'+
		'			<select name="shopStyle"></select><a class="mui-navigate-right"></a>'+
		'		</div>'+
		'		<div class="mui-input-row" style="height:auto;">'+
		'			<label>店铺地址</label>'+
		'			<span style="width:8%;float:right;margin-top:10px;" class="mui-icon mui-icon-location" id="map"></span>'+
		'			<textarea style="width:57%;padding-right:5px;" id="shopAddress" rows="4" name="shopAddress" data-validator-notNull="店铺地址不能为空">{{shopAddress}}</textarea>' +
		'           <input type="hidden" name="longitude" id="longitude" data-validator-notNull="请选择地图位置" value="{{longitude}}">' +
		'           <input type="hidden" name="latitude" id="latitude" data-validator-notNull="请选择地图位置" value="{{latitude}}">' +
		'		</div>'),

	content = $('#form'),
	submit = $('#submit'),
	shopId = o2o.getUrlParam('shopId'),
	serviceId = o2o.getUrlParam('serviceId'),
	formSubmit = function(shop) {
		submit.on('click', function() {
			
			var data = $('#form').serialize();
			o2o.request({
				url: o2o.path.shopInfoModify,
				data: data,
				validator: '#form',
				success: function(respones) {
					o2o.prompt('修改成功', function() {
						mui.back();
					});
				},

				fail: function(code, error) {
					o2o.prompt(error);
				}
			});
		});
		o2o.request({
			url: o2o.path.queryShopTypes,
			noWin:true,
			success: function(respones) {
				$(respones.list).each(function(){
					if(shop.shopStyle == this.type){
						$('select[name=shopStyle]').append('<option value="'+this.type+'" selected>'+this.typeName+'</option>');
					}else{
						$('select[name=shopStyle]').append('<option value="'+this.type+'">'+this.typeName+'</option>');
					}
				});
			},
	
			fail: function(code, error) {
				o2o.prompt(error);
			}
		});
	};
	
	var setpos = function(){
		$('#map').on('click', function(){
			var arg = [];
			if( $.trim($('#longitude').val()) && $.trim($('#latitude').val())){
				arg.push($('#longitude').val());
				arg.push($('#latitude').val());
			}
			mui.openWindow({
				id:"map.html",
				url:"map.html",
				extras:{
					pos : arg
				}
			});
		});
	};
	
	window.addEventListener('returnPOS', function(event){
		var address = event.detail.address;
		var pos = event.detail.pos;
		$('#shopAddress').val(address);
		$('#longitude').val(pos[0]);
		$('#latitude').val(pos[1]);
	});
	o2o.request({
		url: o2o.path.customerViewShopDetails,
		data: {
			shopId: shopId
		},
		success: function(respones) {
			content.html(tpl(respones.shopDO));
			setpos();
			formSubmit(respones.shopDO);
		},

		fail: function(code, error) {
			o2o.prompt(error);
		}
	});
	
});