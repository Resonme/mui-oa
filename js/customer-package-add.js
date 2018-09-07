document.addEventListener('plusready', function() {	
	var tpl = Handlebars.compile(
			'      <div class="mui-input-row">' +
			'        <label>套餐名称</label>' +
			'        <input type="text" id="packageName" placeholder="请输入套餐名称" value="{{packageName}}" data-validator-notNull="请输入套餐名称" data-validator-input="套餐名称不能超出20位" data-validator-length="20">' +
			'      </div>' +
			'      <div class="mui-input-row">' +
			'        <label>服务周期/月</label>' +
			'        <input type="number" pattern="\d*" placeholder="请输入服务周期" onkeyup="this.value=this.value.replace(/\D/g,\'\').substring(0,3)" name="packageServiceTime" data-validator-notNull="请输入服务周期" data-validator-num="服务周期必须1-120之间的整数" min="1" max="120" value="{{packageServiceTime}}"><i></i>' +
			'      </div>' +
			'      <div class="mui-input-row">' +
			'        <label>有效期限/月</label>' +
			'        <input type="number" placeholder="请输入有效期限" name="validityTime" onkeyup="this.value=this.value.replace(/\D/g,\'\').substring(0,3)"  data-validator-notNull="请输入有效期限" data-validator-num="有效期限必须大于1的整数" min="1" value="{{validityTime}}"><i></i>' +
			'      </div>' +
			'      <div class="mui-input-row">' +
			'        <label>服务费用/元</label>' +
			'        <input type="number" placeholder="请输入服务费用" onkeyup="this.value=this.value.replace(/\D/g,\'\').substring(0,6)" data-validator-notNull="请输入服务费用" data-validator-num="服务费用为0-100000之间的整数" min="0" max="100000" name="packageServiceFee" value="{{packageServiceFee}}"><i></i>' +
			'      </div>' +
			'      <div class="mui-input-row" style="height:auto;">' +
			'        <label>套餐描述</label>' +
			'        <textarea rows="3" name="packageContent" data-validator-notNull="请输入套餐描述" onkeyup="this.value.substring(0,200)" data-validator-input="套餐描述不能超出200位" data-validator-length="200" placeholder="最多输入200字...">{{packageContent}}</textarea>' +
			'	   </div>'),

		content = $('#addForm'),
		
		cw = plus.webview.currentWebview();
	
		packageId = cw.packageId,
		
		packageName = "",

		submitBtn = $('#submit'),

		topnav = $('h1.mui-title'),

		formEnvent = function() {

			var url = o2o.path.customerCreatePackage,
				message = "添加成功";

			//判断新增修改
			if (packageId && $.trim(packageId)) {
				url = o2o.path.customerModifyPackage;
				message = "修改成功";
			}
			submitBtn.on('click', function() {
				var data = $('#addForm').serialize();
				if (packageId && $.trim(packageId)) {
					data += "&packageId=" + packageId;
				}
				if( $.trim($('#packageName').val()) ){
					if($('#packageName').val() != packageName){
						data += "&&packageName=" + $('#packageName').val();
					}
				}else{
					o2o.prompt('请输入套餐名称！');
					return;
				}
				o2o.request({
					url: url,
					data: data,
					validator: "#addForm",
					success: function(respones) {
						//获得列表界面的webview
						var list = plus.webview.currentWebview().opener();
						//触发列表界面的自定义事件（refresh）,从而进行数据刷新
						mui.fire(list,'refresh');
						o2o.prompt(message);
						mui.back();
					},

					fail: function(code, error) {
						o2o.prompt(error);
					}
				});
			});

		};

	if (packageId && $.trim(packageId)) {
		topnav.html('修改套餐');
		o2o.request({
			url: o2o.path.customerViewPackageDetails,
			noWin:true,
			data: {
				packageId: packageId
			},
			success: function(respones) {
				content.html(tpl(respones.packageDO));
				packageName = respones.packageDO.packageName;
				$('input[name=packageServiceTime], input[name=validityTime], input[name=packageServiceFee]').attr('readonly', true);
				formEnvent();
			},

			fail: function(code, error) {
				o2o.prompt(error);
			}
		});
	} else {
		topnav.html('新增套餐');
		content.html(tpl());
		formEnvent();
	}
}, false);