document.addEventListener('plusready', function() {	
	var cw = plus.webview.currentWebview();
	var content = $('#empAdd'),
	areaId = cw.areaId,
	employeeId = cw.employeeId || "",
	parentId = cw.parentId,
	isManager = cw.isManager, 
	submitBtn = $('#submit'),
	topnav = $('h1.mui-title'), 
	roleIds = JSON.parse(localStorage.loginInfo).employeeRoles;
	var queryArea = function(areas){
		o2o.request({ 
			url: o2o.path.customerQueryAreas,
			noWin: true,
			success: function(respones) {
				if(areas&&areas.length>0){
					$(respones.list).each(function(){
						var areaP = this;
						var b = 0;
						$(areas).each(function(){
							var areaC = this;
							if(areaP.areaId==areaC.areaId){
								b=1;
								$('#areaIdsStr').append('<option value="'+this.areaId+'" selected>'+this.areaName+'</option>');
							}
						});
						if(b == 0){
							$('#areaIdsStr').append('<option value="'+this.areaId+'">'+this.areaName+'</option>');
						}
					});
					
				}else{
					$(respones.list).each(function(){
						var areaP = this;
						$('#areaIdsStr').append('<option value="'+this.areaId+'">'+this.areaName+'</option>');
					});
				}
				
			},
		
			fail: function(code, error) {
				o2o.prompt(error);
			}
		});
	};
	$('#roleName').on('click', function(){
		mui.openWindow({
			id:"select-emptype.html",
			url:"select-emptype.html",
			extras:{
				parentId:parentId,
				typeId:$('input[name=roleIds]').val()
			}
		});
	});
	window.addEventListener('emptype', function(event){
		var typeName = event.detail.typeName;
		var typeId = event.detail.typeId;
		$('#roleName').val(typeName);
		$('input[name=roleIds]').val(typeId);
		if(typeId == 11){
			$('#selectArea').removeClass('mui-hidden');
		}else{
			$('#selectArea').addClass('mui-hidden');
		}
	});
	
	o2o.request({
		url: o2o.path.customerViewAreaDetails,
		data: {areaId:areaId},
		noWin: true,
		success: function(respones) {
			$('input[name=areaId]').val(respones.areaDO.areaId);
			$('#areaName').val(respones.areaDO.areaName);
		},
		fail: function(code, error) {
			o2o.prompt(error);
		}
	});
	

	var url = o2o.path.customerEmpCreateAccount,
	message = "添加成功";

	if (employeeId && $.trim(employeeId)) {
		topnav.html('修改资料');
		url = o2o.path.customerModifyEmployee;
		message = "修改成功";
		o2o.request({
			url: o2o.path.customerViewEmployeeDetails,
			noWin:true,
			data: {
				employeeId: employeeId,
				areaId: areaId,
				isManager: isManager
			},
			success: function(respones) {
				var emp = respones.employeeDO;
				var typeName = "", typeId = "";
				$('input[name=employeeName]').val(emp.employeeName);
				$('input[name=phone]').val(emp.employeePhone).attr('readonly', true); 
				if(emp.employeeRoleDOs&&emp.employeeRoleDOs.length>0){
					$(emp.employeeRoleDOs).each(function(){
						typeName += this.roleName+",";
						typeId += this.roleId+",";
					});
				}
				typeName = typeName.substring(0,typeName.length-1);
				typeId = typeId.substring(0,typeId.length-1);
				console.log(typeId);
				$('#roleName').val(typeName);
				$('input[name=roleIds]').val(typeId);
				if(parentId == 0 ){
					//queryArea(emp.areaDOs);
					var areas = "", areaIds="";
					$(emp.areaDOs).each(function(){
						areaIds += this.areaId + ",";
						areas += this.areaName + ",";
					});
					areas = areas.substring(0, areas.length-1);
					areaIds = areaIds.substring(0, areaIds.length-1);
					$('#areaIdsName').val(areas);
					$('#areaIdsStr').val(areaIds);
					if(typeId == 11){
						$('#selectArea').removeClass('mui-hidden');
					}else{
						$('#selectArea').addClass('mui-hidden');
					}
				}
				$('input[value=' + emp.isManager + ']').attr('checked', true);
			},

			fail: function(code, error) {
				o2o.prompt(error);
			}
		});
	} else {
		topnav.html('新增员工');
		//queryArea();
	}
	
	$('#areaIdsName').on('click', function(){
		var areaIds = $('#areaIdsStr').val();
		mui.openWindow({
			url:"select-area.html",
			extras:{
				checkType:"checkbox",
				areaIds:areaIds
			}
		});
	});
	window.addEventListener('getArea', function(e){
		var areaName = e.detail.areaName;
		var areaIds = e.detail.areaIds;
		console.log(areaName,areaIds);
		$('#areaIdsStr').val(areaIds.toString());
		$('#areaIdsName').val(areaName.toString());
	});
	submitBtn.on('click', function() {
		if (employeeId && $.trim(employeeId) && areaId == $('input[name=areaId]').val()) {
			$('input[name=areaId]').val("");
		}
		var data = $('#empAdd').serialize();
		if (employeeId && $.trim(employeeId)) {
			data += "&employeeId=" + employeeId;
		}
		if ( $('input[name=roleIds]').val() == 11) {
			if( $.trim($('#areaIdsStr').val()) ){
				data += "&areaIdsStr=" + $('#areaIdsStr').val().toString();
			}else{
				o2o.prompt('请选择负责区域！');
				return;
			}
		}
		o2o.request({
			url: url,
			data: data,
			validator: "#empAdd",
			success: function(respones) {
				o2o.prompt(message, function() {
					var opener = plus.webview.currentWebview().opener();
					mui.fire(opener, 'listRefresh');
					mui.back();
				});
			},

			fail: function(code, error) {
				o2o.prompt(error);
			}
		});
	});
	
}, false);