document.addEventListener('plusready', function() {	
	var tpl = Handlebars.compile(
			'{{#each list}}' +
			'    <li onclick="window.location.href=\'customer-info-detail.html?accountId={{accountId}}\'">' +
			'       <div class="li-tnt am-cf">' +
			'          <div class="am-u-sm-6 line-active am-text-center">' +
			'            <span>{{name}}<br>({{phone}})</span>' +
			'          </div>' +
			'          <div class="am-u-sm-5 am-text-right">' +
			'            <div>店铺：<span class="am-text-success">{{shopCount}}</span>家</div>' +
			'          </div>' +
			'          <div class="am-u-sm-1 am-text-right">' +
			'            <span class="am-icon-chevron-circle-right"></span>' +
			'          </div>' +
			'       </div>' +
			'    </li>' +
			'{{/each}}'),

		list = $('#list'),
		
		meNo = null,

		init = (function() {
			var page = 1;
			$('#customerInfoList').dropload({
			    scrollArea: window,
			    loadDownFn: function(me) {
			    	meNo = me;
			        o2o.request({
						url: o2o.path.customerQueryCustomers,
						noWin:true,
						data:{
			                pageSize: 10,
			                pageIndex: page
						},
						success: function(respones) {
							if (!respones.list || respones.list.length <= 0) {
								console.log('no');
			                    me.lock();
			                    me.noData();
			                }
							list.append(tpl(respones));
							me.resetload();
						},

						fail: function(code, error) {
							me.lock();
    						me.noData();
							me.resetload();
						}
					});
			        page++;
			    }
			});
			$('form').on('submit', function(){
				getList();
				$('#customerName').blur();
			});
		}()),

		getList = function() {
			var name = $('#customerName').val();
			if(name=="%"||name=="_"||name=="&"){
				o2o.prompt('搜索条件格式有误！');
				return;
			}
			if(!$.trim(name)){
				//window.location.reload();
				
				meNo.lock();
				meNo.noData();
				meNo.resetload();
				o2o.request({
					url: o2o.path.customerQueryCustomers,
					success: function(respones) {
						list.html(tpl(respones));
					},
					fail: function(code, error) {
						o2o.prompt(error);
					}
				});
				return;
			}
			o2o.request({
				url: o2o.path.customerQueryCustomerByName,
				data: {
					name: name
				},
				success: function(respones) {
					$('.dropload-down').hide();
					if (!respones.list || respones.list == 0) {
						o2o.prompt('没有查询到数据');
					}
					list.html(tpl(respones));
				},

				fail: function(code, error) {
					o2o.prompt(error);
				}
			});
		};
}, false);