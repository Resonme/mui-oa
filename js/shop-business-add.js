document.addEventListener('plusready', function() {	
	var tpl = Handlebars.compile(
		'    <form class="mui-input-group" id="addForm">' +
		'      {{#if serviceId}}<div class="mui-input-row">' +
		'        <label>店铺名称：</label>' +
		'        <input type="text" value="{{shopName}}" readonly="readonly"/><i></i>' + 
		'      </div>' +
		'		{{/if}}' +
		'      <div class="mui-input-row mui-radio" style="height:auto;">' +
		'        <label>任务类型：</label>' +
		'			<div class="mui-input-row mui-radio mui-left">'+
		'	          <label>新增/变更（设备）</label> '+
		'	          <input type="radio" name="serviceType" value="2" checked> '+
		'			</div>'+
		'			<div class="mui-input-row mui-radio mui-left">'+
		'	          <label>移机</label> '+
		'	          <input type="radio" name="serviceType" value="3"> '+
		'			</div>'+
		'			<div class="mui-input-row mui-radio mui-left">'+
		'	          <label>拆机</label> '+
		'	          <input type="radio" name="serviceType" value="4"> '+
		'			</div>'+
		'			<div class="mui-input-row mui-radio mui-left">'+
		'	          <label>变更套餐</label> '+
		'	          <input type="radio" name="serviceType" value="5"> '+
		'			</div>'+
		'			{{#if serviceId}}{{else}}'+
		'			<div class="mui-input-row mui-radio mui-left">'+
		'	          <label>维修</label> '+
		'	          <input type="radio" name="serviceType" value="6"> '+
		'			</div>'+
		'		   {{/if}}' +
		'      </div>' +
		'	<div id="typeBox">' +
		'      <div class="mui-input-row" style="height:auto">' +
		'        <label>任务备注：</label>' +
		'          <textarea rows="4" class="form-control" name="serviceContent" placeholder="请输入任务描述"  data-validator-notNull="请输入任务描述" data-validator-input="任务描述长度最多为100位" data-validator-length="100">{{serviceContent}}</textarea>' +
		'      </div>' +
		'	</div>' +
		'    </form>'),

	tpl_task =
	'      <div class="mui-input-row" style="height:auto">' +
	'        <label>任务备注：</label>' +
	'          <textarea rows="4" class="form-control" name="serviceContent" placeholder="请输入任务描述" data-validator-notNull="请输入任务描述" data-validator-input="任务备注长度最多为100位" data-validator-length="100"></textarea>' +
	'        </div>',

	tpl_repair =
	'      <div class="mui-input-row">' +
	'        <label>维修类型：</label>' +
	'          <select class="form-control" name="problemDescription" data-validator-notNull="请选择维修类型">'+
	'				<option value="">请选择维修类型</option>'+
	'			</select>' +
	'			<a class="mui-navigate-right"></a>'+
	'		</div>' +
	'      <div class="mui-input-row" style="height:auto">' +
	'        <label>问题描述：</label>' +
	'          <textarea rows="4" class="form-control" placeholder="请输入问题描述" name="problemSupplementary" data-validator-notNull="请输入问题描述" data-validator-input="问题描述长度最多为100位" data-validator-length="100"></textarea>' +
	'        </div>',

	content = $('#businessAdd'),

	shopId = o2o.getUrlParam('shopId'),

	serviceId = o2o.getUrlParam('serviceId') || "",

	formSubmit = function() {
		$('#submit').on('click', function() {
			var url = o2o.path.shopCreateService,
				data = $('#addForm').serialize(),
				type = $('input[name=serviceType]:checked').val();
			console.log(type);
			data += "&shopId=" + shopId;
			if ($.trim(serviceId)) {
				url = o2o.path.shopModifyService;
				data += "&examineState=0&serviceId=" + serviceId;
			} else if (type == 6) {
				url = o2o.path.shopCreateRepair;
			}
			o2o.request({
				url: url,
				data: data,
				validator: '#addForm',
				success: function(respones) {
					o2o.prompt('操作成功', function() {
						mui.back();
					});
				},

				fail: function(code, error) {
					o2o.prompt(error);
				}
			});
		});

		$('input[name=serviceType]').on('change', function() {
			var type = $(this).val(),
				box = $('#typeBox');
			if (type == 6) {
				box.html(tpl_repair);
				o2o.request({
					url: o2o.path.queryRepairType,
					success: function(respones) {
						$(respones.list).each(function() {
							$('select[name=problemDescription]').append(
								'<option value="' + this.repairName + '">' + this.repairName + '</option>'
							);
						});
					},

					fail: function(code, error) {
						o2o.prompt(error);
					}
				});
			} else {
				box.html(tpl_task);
			}
		});
	};

	if ($.trim(serviceId)) {
		o2o.request({
			url: o2o.path.shopQueryServiceById,
			data: {
				serviceId: serviceId
			},
			success: function(respones) {
				content.html(tpl(respones.serviceDO));
				$('input[name=serviceType][value=' + respones.serviceDO.serviceType + ']').attr('checked', true);

				formSubmit();
			},

			fail: function(code, error) {
				o2o.prompt(error);
			}
		});
	} else {
		content.html(tpl());
		formSubmit();
	}
}, false);