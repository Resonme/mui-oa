document.addEventListener('plusready', function() {	
	var tpl = Handlebars.compile(
		'{{#each list}}' +
		'<div class="am-panel am-panel-default">' +
		'    <div class="am-panel-hd">' +
		'      <input id="{{packageId}}" data-fee="{{packageServiceFee}}" type="radio" name="package" value="{{packageId}}">' +
		'      <label for="{{packageId}}">{{packageName}}</label>' +
		'    </div>' +
		'    <div class="am-panel-bd panel">' +
		'      <p>{{packageContent}}</p>' +
		'      <hr data-am-widget="divider" style="" class="am-divider am-divider-default" />' +
		'      <p><label>服务费用：</label>{{packageServiceFee}}元</p>' +
		'      <hr data-am-widget="divider" style="" class="am-divider am-divider-default" />' +
		'      <p><label>服务周期：</label>{{packageServiceTime}}个月</p>' +
		'    </div>' +
		'  </div>' +
		' {{/each}}' +
		' <div class="panel content-bg">' +
		'   <label>所需补充费用：</label>' +
		'   <input type="text" class="am-form-field" id="fee" value="0" readonly>' +
		' </div>'),

	content = $('#customerBusinessWhether'),
	check = $('#check'),
	cw = plus.webview.currentWebview(),
	shopId = cw.shopId || o2o.getUrlParam('shopId'),
	packageId = cw.packageId || o2o.getUrlParam('packageId'),
	accountId = cw.accountId || o2o.getUrlParam('accountId'),
	shopPackageId = "",

	//更改套餐差价
	changePackage = function() {
		$('input[name=package]').on('change', function() {
			var selected = $('input[name=package]:checked').val();
			o2o.request({
				url: o2o.path.shopQueryQueryPackageChangeFee,
				data: {
					shopPackageId: shopPackageId,
					packageId: selected
				},
				success: function(respones) {
					$('#fee').val(respones.newFee);
				},

				fail: function(code, error) {
					o2o.prompt(error);
				}
			});
		});
	},

	getInfo = function() {
		o2o.request({
			url: o2o.path.customerViewShopDetails,
			data: {
				shopId: shopId
			},
			success: function(respones) {
				/*$('h1.am-header-title').html(respones.shopDO.shopName + "店铺续费");*/
				shopPackageId = respones.shopDO.shopPackageDO.shopPackageId;
				o2o.request({
					url: o2o.path.shopQueryQueryPackageChangeFee,
					data: {
						shopPackageId: shopPackageId,
						packageId: packageId
					},
					success: function(respones) {
						$('#fee').val(respones.newFee);
					},

					fail: function(code, error) {
						o2o.prompt(error);
					}
				});
			},

			fail: function(code, error) {
				o2o.prompt(error);
			}
		});
	};
	o2o.request({
		url: o2o.path.queryPackagesByUsing,
		success: function(respones) {
			$(respones.list).each(function(){
				this.packageContent = new Handlebars.SafeString(this.packageContent.replace(/\n/g, '<br>'));
			});
			content.html(tpl(respones));
			$('input[value=' + packageId + ']').attr('checked', true);
			changePackage();
			getInfo();
		},

		fail: function(code, error) {
			o2o.prompt(error);
		}
	});

	check.on('click', function() {
		if ($('input[name=package]:checked').length == 0) {
			o2o.prompt("请选择续费套餐");
			return;
		}
		var selected = $('input[name=package]:checked').val();
		o2o.confirm('确认更改', function(msg) {
			if (msg == "yes") {
				o2o.request({
					url: o2o.path.customerModifyShopPackage,
					data: {
						packageId: selected,
						shopPackageId: shopPackageId,
						packageFree: $('#fee').val()
					},
					success: function(respones) {
						o2o.prompt('操作成功', function() {
							mui.back();
						});
					},

					fail: function(code, error) {
						o2o.prompt(error);
					}
				});
			}
		});

	});
}, false);