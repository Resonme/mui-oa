document.addEventListener('plusready', function() {	
	var marker,
		lineArr = [],
		alarmGuid = o2o.getUrlParam('alarmGuid');
	
	var map = new AMap.Map("container", {
		resizeEnable: true,
		zoom: 17
	});
	map.on("complete", completeEventHandler);
	// 地图图块加载完毕后执行函数
	function completeEventHandler() {
		o2o.request({
			url: o2o.path.shopQueryPatrolPath,
			data: {
				alarmGuid: alarmGuid
			},
			success: function(respones) {
				var markers = respones.list;
				marker = new AMap.Marker({
					map: map,
					position: [markers[0].latitude, markers[0].longitude],
					icon: "assets/i/car.png",
					offset: new AMap.Pixel(-40, -30),
					autoRotation: true
				});
				var latY = markers[0].longitude,
					lngX = markers[0].latitude;
				for (var i = 0; i < markers.length; i++) {
					lineArr.push([markers[i].latitude, markers[i].longitude]);
					/*//构建信息窗体中显示的内容
			        var info = [];
			        info.push("时间:"+ new Date(markers[i].createDate).Format('hh:mm:ss')  );
	
			        infoWindow = new AMap.InfoWindow({
			            content: info.join("<br/>")  //使用默认信息窗体框样式，显示信息内容
			        });
			        infoWindow.open(map, [markers[i].latitude, markers[i].longitude]);*/
				}
				// 绘制轨迹
				var polyline = new AMap.Polyline({
					map: map,
					path: lineArr,
					strokeColor: "#e4a191", //线颜色
					strokeOpacity: 1, //线透明度
					strokeWeight: 5, //线宽
					strokeStyle: "solid" //线样式
				});
				map.setFitView();
				marker.moveAlong(lineArr, 3000);
			},
	
			fail: function(code, error) {
				o2o.prompt(error);
			}
		});
	}
}, false);