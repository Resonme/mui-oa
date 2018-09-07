document.addEventListener('plusready', function() {	
	var tpl = Handlebars.compile(
	'{{#each list}}' +
	'<li class="mui-table-view-cell" id="{{employeeId}}">'+
	'	{{employeeName}} （<span style="display:inline-block;color:#00bcd4;">{{employeePhone}}</span>）<br>'+
	'	{{#each employeeRoleDOs}} <span style="display:inline-block;background:#ddd;border-radius:8px;line-height:1.2;padding:2px 8px;">{{roleName}}</span> {{/each}}'+
	'	<button class="mui-btn mui-btn-sm mui-btn-primary empEdit" style="margin-right:45px;"  data-id="{{employeeId}}" data-ismanager="{{isManager}}">编辑</button>'+
	'	<button class="mui-btn mui-btn-sm mui-btn-danger empRemove" data-id="{{employeeId}}" data-employeetype="{{isManager}}">删除</button>'+
	'</li>'+
	'{{/each}}'),

	list = $('#customerEmpList'),
	cw = plus.webview.currentWebview(),
	areaId = cw.areaId || o2o.getUrlParam('areaId'),
	parentId = cw.parentId || o2o.getUrlParam('parentId'),
	addBtn = $('#add'),

	getList = function() {
		var name = $('#search').val();
		var data = {
			areaId: areaId
		};
		if($.trim(name)){
			data.employeeName = name;
		}else{
			data.pageIndex = page;
			data.pageSize = 20;
		}
		o2o.request({
			url: o2o.path.customerQueryEmployees,
			noWin:true,
			data: data,
			success: function(respones) {
				if (respones.list && respones.list.length > 0) {
					for (var i = 0; i < respones.list.length; i++) {
						respones.list[i].parentId = parentId;
					}
					if(respones.list.length <20){
      					mui('#pullup-container').pullRefresh().disablePullupToRefresh();
					}else{
						mui('#pullup-container').pullRefresh().refresh(true);
      					mui('#pullup-container').pullRefresh().enablePullupToRefresh();
						mui('#pullup-container').pullRefresh().endPullupToRefresh(false);
					}
        			page++;
				} else {
					mui('#pullup-container').pullRefresh().endPullupToRefresh(true);
				}
				if(page <= 2){
					list.html(tpl(respones));
				}else{
					list.append(tpl(respones));
				}
				btnEvent();
			},
			fail: function(code, error) {
				o2o.prompt(error);
				mui('#pullup-container').pullRefresh().endPullupToRefresh(true);
			}
		});
	},

	btnEvent = function() {
		$('.empRemove').off('click').on('click', function() {
			var employeeId = $(this).data('id'),
				employeeType = $(this).data('employeetype');
			o2o.confirm('确定删除该员工信息', function(msg) {
				if (msg == "yes") {
					o2o.request({
						url: o2o.path.customerModifyEmployee,
						data: {
							employeeId: employeeId,
							employeeType: employeeType,
							isDelete: 1
						},
						success: function(respones) {
							o2o.prompt('删除成功');
							$('#'+employeeId).remove();
						},

						fail: function(code, error) {
							o2o.prompt(error);
						}
					});
				}
			});
		});
		$('.empEdit').off('click').on('click', function() {
			var employeeId = $(this).data('id'),
			isManager = $(this).data('ismanager');
			mui.openWindow({
				url:'customer-emp-add.html',
				extras:{
					areaId:areaId,
					parentId:parentId,
					employeeId:employeeId,
					isManager:isManager
				}
			});
			//location.href = "customer-emp-add.html?areaId=" + areaId + "&&parentId=" + parentId + "&&employeeId=" + employeeId + "&&isManager=" + isManager ;
		});
	};
	
	//添加
	addBtn.on('click', function() {
		//window.location.href = "customer-emp-add.html?areaId=" + areaId + "&&parentId=" + parentId;
		mui.openWindow({
			url:'customer-emp-add.html',
			extras:{
				areaId:areaId,
				parentId:parentId
			}
		});
	});
	
	var page =1;
	mui.init({
	  pullRefresh : {
	    container:'#pullup-container',//待刷新区域标识，querySelector能定位的css选择器均可，比如：id、.class等
	    up : {
	      height:30,//可选.默认50.触发上拉加载拖动距离
	      auto:true,//可选,默认false.自动上拉加载一次
	      contentrefresh : "正在加载...",//可选，正在加载状态时，上拉加载控件上显示的标题内容
	      contentnomore:'没有更多数据了',//可选，请求完毕若没有更多数据时显示的提醒内容；
	      callback : function(){
	      	getList(); 
	      }
	    }
	  }
	});
	
	$('form').on('submit', function(){
		page = 1;
		list.html("");
		getList();
		$('#search').blur();
	});
	
	window.addEventListener('listRefresh', function(){
		page = 1;
		getList();
	});
}, false);