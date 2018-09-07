document.addEventListener('plusready', function() {
	plus.navigator.setStatusBarBackground("#00bcd4");
	plus.nativeUI.closeWaiting();
	plus.key.removeEventListener("backbutton", function(){});
	plus.key.addEventListener("backbutton", function() {
		mui.back();
	}); 
}, false);

var path = {
	//请求主机ip
	local: "http://139.196.248.89:8001", //本 地139.196.248.89 jxo2o.51icare.cn
	//登录
	login: "/account/accountManager/login.json", 
	/*根据店铺编号查询*/
	shopQueryShopList: "/company/shopManage/queryShopListByShopNo.do",
	//客户查询
	shopQueryCustomerBasic: "/customer/customerManage/queryCustomerBasic.do",
	//详情
	customerViewCustomerDetails: "/customer/customerManage/viewCustomerDetails.do",
	//客户列表
	customerQueryCustomers: "/customer/customerManage/queryCustomers.do",
	//查询客户
	customerQueryCustomerByName: "/customer/customerManage/queryCustomerByName.do",
	//列表
	customerQueryPackages: "/company/packageManage/queryPackages.do",
	//设备查询
	customerViewQueryDevices: "/customer/deviceManage/queryDevices.do",
	//发起安装
	customerCreateInstallationTask: "/company/serviceManage/createService.do",
	//区域列表查询
	customerQueryAreas: "/company/areaManage/queryAreas.do",
	//店铺类型
	queryShopTypes: "/company/shopManage/queryShopTypes.do",
	//安装详情查询
	messageInstallInfo: "/company/serviceManage/getServiceById.do",
	//安装审批
	messageInstallCheck: "/company/serviceManage/checkService.do",
	//安装列表查询
	messageInstallList: "/company/serviceManage/queryShopServiceList.do",
	//安装列表搜索查询
	queryShopServiceListByApp: "/company/serviceManage/queryShopServiceListByApp.do",
	//手机号查询客户信息
	customerQueryCustomerByPhone: "/customer/customerManage/queryCustomerByPhone.do",
	//设置账号
	customerCreateShopAndAccount: "/company/shopAccountManage/createShopAndAccount.do",
	//注销
	logout: "/account/accountManager/logout.do",
	//拆机确认退费
	shopQueryCreateEmployeeCharge: "/company/serviceManage/createEmployeeCharge.do",
	//结束任务
	shopFinishService: "/company/serviceManage/finishService.do",
	//确认结束
	shopComfirmFinishService: "/company/serviceManage/comfirmFinishService.do",
	//店铺详情查询
	customerViewShopDetails: "/customer/customerManage/viewShopDetails.do",
	//sim状态店铺
	queryShopListBySimState: "/company/shopManage/queryShopListBySimState.do",
	//在线状态列表
	dataQueryShopList: "/company/shopManage/queryShopListByState.do",
	//服务状态统计
	queryShopListByShopTimeState: "/company/shopManage/queryShopListByShopTimeState.do",
	//查询安装任务
	customerQueryInstallationTaskdue: "/company/shopManage/queryShops.do",
	//店铺类型统计
	queryShopListByShopStyle: "/company/shopManage/queryShopListByShopStyle.do",
	//区域详情查询
	customerViewAreaDetails: "/company/areaManage/viewAreaDetails.do",
	//区域添加
	customerCreateArea: "/company/areaManage/createArea.do",
	//区域修改
	customerModifyArea: "/company/areaManage/modifyArea.do",
	//修改密码
	fixPassword: "/account/accountManager/changePassword.do",
	//获取验证码
	getCode: "/account/accountManager/getCode.json",
	//忘记密码
	forgetPassword: "/account/accountManager/forgetPassword.json",
	//消息
	messageQueryNotices: "/company/noticeManage/queryNotice.do",
	//修改
	customerModifyPackage: "/company/packageManage/modifyPackage.do",
	//新增
	customerCreatePackage: "/company/packageManage/createPackage.do",
	//查询
	customerViewPackageDetails: "/company/packageManage/viewPackageDetails.do",
	//任务状态统计
	dataQueryServiceCountByState: "/company/shopManage/queryShopStateStatistics.do",
	//服务状态统计
	dataQueryServiceCountByTime: "/company/shopManage/queryShopTimeStatistics.do",
	//更改套餐 差价计算
	shopQueryQueryPackageChangeFee: "/company/serviceManage/queryPackageChangeFee.do",
	//修改客户套餐
	customerModifyShopPackage: "/customer/customerManage/modifyShopPackage.do",
	//店铺修改
	shopInfoModify: "/customer/customerManage/modifyShop.do",
	//维修列表
	messageQueryRepairByCompanyId: "/company/repairManage/queryRepairByCompanyId.do",
	//维修列表搜索
	queryRepairListByApp: "/company/repairManage/queryRepairListByApp.do",
	//维修详情查询
	messageGetRepair: "/company/repairManage/getRepair.do",
	//员工列表
	customerQueryEmployees: "/company/employeeManage/queryEmployees.do",
	//员工查询
	customerViewEmployeeDetails: "/company/employeeManage/viewEmployeeDetails.do",
	//员工新增
	customerEmpCreateAccount: "/company/employeeManage/createEmployee.do",
	//员工修改
	customerModifyEmployee: "/company/employeeManage/modifyEmployee.do",
	//通过电话号码检索用户名
	customerGetAccountName: "/account/accountManager/getAccountName.do",
	//人员列表
	moneyChargeList: "/company/chargeManage/chargeList.do",
	//确认收费
	moneyAffirmEmployeeCharge: "/company/chargeManage/affirmCharge.do",
	//费用详情
	moneyEmployeeChargeList: "/company/chargeManage/viewCharge.do",
	//警情统计
	dataQueryAlarmStatistics: "/company/alarmManage/queryAlarmCountStatistics.do",
	//通知列表
	customerQueryNotices: "/company/noticeManage/queryNotices.do",
	//公告详情
	customerViewNoticeDetails: "/company/noticeManage/viewNoticeDetails.do",
	//新增公告
	customerCreateNotice: "/company/noticeManage/createNotice.do",
	//修改公告
	customerModifyNotice: "/company/noticeManage/modifyNotice.do",
	//巡逻轨迹
	shopQueryPatrolPath: "/guard/patrol/queryPatrolPath.do",
	//sim统计数量
	queryShopSimStatistics: "/company/shopManage/queryShopSimStatistics.do",
	//查询维修类型
	queryRepairType: "/company/repairManage/queryRepairType.do",
	//添加维修类型
	createRepairType: "/company/repairManage/createRepairType.do",
	//修改维修类型
	modifyRepairType: "/company/repairManage/modifyRepairType.do",
	//修改维修
	modifyRepair: "/company/repairManage/modifyRepair.do",
	//维修类型详情
	getRepairTypeById: "/company/repairManage/getRepairTypeById.do",
	//布撤防统计
	queryDeviceCountByDefenceState: "/customer/deviceManage/queryDeviceCountByDefenceState.do",
	//在线离线统计
	queryDeviceCountByOnlineState: "/customer/deviceManage/queryDeviceCountByOnlineState.do",
	//店铺类型数量
	queryShopStyleCount: "/company/shopManage/queryShopStyleCount.do",
	//店铺类型统计
	modifyShopType: "/company/shopManage/modifyShopType.do",
	//店铺类型统计
	createShopType: "/company/shopManage/createShopType.do",
	//店铺类型统计
	getShopTypeById: "/company/shopManage/getShopTypeById.do",
	//店铺警情
	shopAlarmList: "/company/alarmManage/queryAlarmByShopIdApp.do",
	//历史警情
	queryAlarmSendByShopId: "/company/alarmManage/queryAlarmSendByShopId.do",
	//店铺布撤防记录
	shopDefenceList: "/customer/customerManage/defenceList.do",
	//店铺巡逻记录
	shopInspectionRecordsList: "/guard/patrol/queryPatrolRecords.do",
	//本店套餐
	shopPackage: "/customer/businessManage/shopPackage.do",
	//更改套餐
	shopModifyShopPackage: "/customer/customerManage/modifyShopPackage.do",
	//查询套餐
	queryPackagesByUsing: "/company/packageManage/queryPackagesByUsing.do", 
	//删除设备
	shopModifyShopDevice: "/customer/deviceManage/modifyShopDevice.do",
	//添加设备
	shopCreateShopDevice: "/customer/deviceManage/createShopDevice.do",
	//安装出库
	messageInstallAddDevice: "/customer/deviceManage/modifyDevice.do",
	//基本信息修改
	modifyBaseDevice: "/customer/deviceManage/modifyBaseDevice.do",

	//通道详情
	shopQueryChannelDetails: "/company/installationTaskManage/queryChannelDetails.do",
	//防区通道修改
	shopModifyDeviceChannel: "/company/installationTaskManage/modifyDeviceChannel.do",
	//所有权变更
	shopModifyAccountShop: "/customer/customerManage/modifyAccountShop.do",
	//业务变更发起
	shopCreateService: "/company/serviceManage/createShopService.do",
	//拆机费用查询
	shopQueryRecedeServiceFee: "/company/serviceManage/queryRecedeServiceFee.do",
	//查询任务
	shopQueryServiceById: "/company/serviceManage/queryServiceById.do",
	//修改任务
	shopModifyService: "/company/serviceManage/modifyService.do",
	//店铺新增维修
	shopCreateRepair: "/customer/businessManage/createRepair.do",
	//报警主机列表
	messageInstallDeviceChannelAlarm: "/company/installationTaskManage/queryShopDeviceChannelAlarm.do",
	//视频设备列表
	messageInstallDeviceChannelCamera: "/company/installationTaskManage/queryShopDeviceChannelCamera.do",
	//安装新增布撤放时间
	messageInstallCreateShopDeployed: "/company/installationTaskManage/createShopDeployed.do",
	//安装布撤放时间列表
	messageInstallQueryShopDeployed: "/company/installationTaskManage/queryShopDeployed.do",
	//店铺联系人
	shopLeaderList: "/customer/businessManage/shopLeaderList.do",
	//安装查询店铺标号
	queryShopNoByAreaId: "/company/shopManage/queryShopNoByAreaId.do",
	
	getQiniuUrl: "/web/cloudManage/getQiniuUrl.do"
};
//日期转换
Date.prototype.Format = function(fmt) { //author: meizz
	var o = {
		"M+": this.getMonth() + 1, //月份
		"d+": this.getDate(), //日
		"h+": this.getHours(), //小时
		"m+": this.getMinutes(), //分
		"s+": this.getSeconds(), //秒
		"q+": Math.floor((this.getMonth() + 3) / 3), //季度
		"S": this.getMilliseconds() //毫秒
	};
	if (/(y+)/.test(fmt))
		fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
	for (var k in o)
		if (new RegExp("(" + k + ")").test(fmt))
			fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
	return fmt;
};

var o2o = {
	path: path,
	//确认删除
	confirm : function(msg, callback, scope) {
		plus.nativeUI.confirm(msg, function(e) {
			if (e.index == 1) {
				callback.call(scope, 'no');
			} else if (e.index == 0) {
				callback.call(scope, 'yes');
			}
		}, '系统提示', ['确认', '取消']);
	},
	//操作提示
	prompt : function(msg, callback) {
		plus.nativeUI.toast(msg);
		if (callback) {
			callback();
		}
	},

	/*日期算法*/
	addDays : function(date, num) {
		var time = date.getTime() + (1000 * 60 * 60 * 24 * num),
			newDate = new Date(time),
			year = newDate.getFullYear(),
			month = newDate.getMonth() + 1,
			day = newDate.getDate();
		if (month < 10) {
			month = "0" + month;
		}
		if (day < 10) {
			day = "0" + day;
		}
		datestr = year + "-" + month + "-" + day;

		return datestr;
	},

	//获取地址栏参数
	getUrlParam : function(name) {
		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
		var r = window.location.search.substr(1).match(reg);
		if (r != null) return unescape(r[2]);
		return null;
	},

	//返回树数据
	getTree : function(data, areaId) {
		var pos = {};
		var tree = [];
		var i = 0;

		var renderMenu = function(menu) {
			if (!menu.children || menu.children.length == 0) {
				return parent;
			}
			for (var i = 0; i < menu.children.length; ++i) {
				if (areaId == menu.children[i].id) {
					tree = menu.children[i];
					break;
				} else {
					renderMenu(menu.children[i]);
				}
			}
		};
		while (data.length != 0) {
			if (data[i].id == parseInt(JSON.parse(localStorage.loginInfo).areaId)) {
				tree.push({
					id: data[i].id,
					text: data[i].text,
					children: []
				});
				pos[data[i].id] = [tree.length - 1];
				data.splice(i, 1);
				i--;
			} else {
				var posArr = pos[data[i].pid];
				if (posArr != undefined) {

					var obj = tree[posArr[0]];
					for (var j = 1; j < posArr.length; j++) {
						obj = obj.children[posArr[j]];
					}

					obj.children.push({
						id: data[i].id,
						text: data[i].text,
						children: []
					});
					pos[data[i].id] = posArr.concat([obj.children.length - 1]);
					data.splice(i, 1);
					i--;
				}
			}
			i++;
			if (i > data.length - 1) {
				i = 0;
			}
		}

		if ($.trim(areaId)) {
			for (var i = 0; i < tree.length; i++) {
				var areas = renderMenu(tree[i]);
				if ($.trim(areas) && areas.length > 0) {
					tree = areas;
					break;
				}
			}
		}
		return tree;
	},
	/*异步请求*/
	request: function(options) {
		var checkFormValidator = function(opt) {
			var form = $(opt);
			var foreachReturn = false;
			if (form.find('[data-validator-notNull]') && form.find('[data-validator-notNull]').length > 0) {
				form.find('[data-validator-notNull]').each(function() {
					var content = $(this).val(),
						message = $(this).attr('data-validator-notNull') || "不能为空";
						console.log(content);
					if (!$.trim(content)) {
						o2o.prompt(message);
						foreachReturn = true;
						return false;
					}
				});
			}
			if (foreachReturn) {
				return;
			}
			if( form.find('[data-validator-input]') && form.find('[data-validator-input]').length>0 ){
				form.find('[data-validator-input]').each(function(){
					var content = $(this).val() || $(this).html(),
							message = $(this).attr('data-validator-input') || "字段长度超出",
							infoLength =  $(this).attr('data-validator-length') || 100;
					if( $.trim(content) && content.length > parseInt(infoLength) ){
						o2o.prompt(message);
						foreachReturn = true;
						return false;
					}
				});
			}
			if(foreachReturn){
				return;
			}
			if (form.find('[data-validator-num]') && form.find('[data-validator-num]').length > 0) {
				form.find('[data-validator-num]').each(function() {
					var content = $(this).val() || $(this).html(),
						message = $(this).attr('data-validator-num') || "数字类型格式有误",
						regexp = /^[0-9]+$//*\.{0,1}[0-9]{0,2}*/,
						min = $(this).attr('min'),
						max = $(this).attr('max');
					if (!content.match(regexp)) {
						o2o.prompt(message);
						foreachReturn = true;
						return false;
					}
					if($.trim(min) && parseInt(content) < parseInt(min)){
						o2o.prompt(message);
						foreachReturn = true;
						return false;
					}
					if($.trim(max) && parseInt(content) > parseInt(max)){
						o2o.prompt(message);
						foreachReturn = true;
						return false;
					}
				});
			}
			if (foreachReturn) {
				return;
			}
			if (form.find('[data-validator-phone]') && form.find('[data-validator-phone]').length > 0) {
				form.find('[data-validator-phone]').each(function() {
					var content = $(this).val() || $(this).html(),
						message = $(this).attr('data-validator-phone') || "手机号码格式有误",
						regexp = /^1[3,5,7,8]\d{9}$/;
					if (!content.match(regexp)) {
						o2o.prompt(message);
						foreachReturn = true;
						return false;
					}
				});
			}
			if (foreachReturn) {
				return;
			}
			if (form.find('[data-validator-password]') && form.find('[data-validator-password]').length > 0) {
				form.find('[data-validator-password]').each(function() {
					var content = $(this).val() || $(this).html(),
						message = $(this).attr('data-validator-password') || "密码格式有误",
						regexp = /^\w{6,12}$/;
					if (!content.match(regexp)) {
						o2o.prompt(message);
						foreachReturn = true;
						return false;
					}
				});
			}
			if (foreachReturn) {
				return;
			} else {
				return true;
			}
	
		};
		var xhr = null;
		//表单验证
		if (options.validator && !checkFormValidator(options.validator)) {
			return;
		}
		if (xhr) {
			return;
		}
		xhr = new plus.net.XMLHttpRequest();
		xhr.onloadstart = function(e) {
			if (options.noWin != true) {
				plus.nativeUI.showWaiting("正在载入...");
			}
		};
		xhr.ontimeout = function(){
			plus.nativeUI.closeWaiting();
			options.fail(-1, '请求超时！');
		};
		xhr.onload = function(e) {
			plus.nativeUI.closeWaiting();
			if(xhr.status==200){
				var respones = JSON.parse(xhr.responseText);
				if (respones.code == 0) {
					setTimeout(function() {
						options.success(respones);
					}, 20);
				} else {
					if (respones.code == 300 || respones.code == 301) {
						plus.runtime.restart();
					}
					options.fail(respones.code, respones.error);
				}
			}else{
				options.fail(-1, '请求出错了！');
			}
			
		};
		xhr.onerror = function(e) {
			plus.nativeUI.closeWaiting();
			options.fail(-1, '服务连接异常！');
		};
		console.log(path.local + options.url);
		xhr.open("POST", path.local + options.url);
		xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		var data = "a=" + Math.random();
		if (options.data) {
			if (JSON.stringify(options.data).match("^\{(.+:.+,*){1,}\}$")) {
				$.each(options.data, function(key, value) {
					data += "&" + key + "=" + value;
				});
				//data = data.replace(/  /g, '');
			} else {
				data = options.data;//.replace(/\++/g,'')
			}
		}
		console.log(data);
		xhr.send(data);
	}
};
