document.addEventListener('plusready', function() {	
	var writeHTML = function() {

		var type = $('input[name=type]:checked').val(),
	
		alarmData = {},
	
		content = $('#customerPlace'),
	
		renderMenu = function(menu, parent) {
			var el = $(
				'          <div class="am-cf am-margin-left-lg am-margin-right-sm">' +
				'            <label class="am-fl"><span class="am-icon am-icon-minus-square"></span>' + menu.text + '</label>' +
				'<table class="am-table am-fr data-tr" id="alarm'+menu.id+'">' +
				'</table>' +
				'          </div>' +
				'			');
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
		
		itemEvent = function(){
			$('#customerPlace .am-panel-bd label>span.am-icon').on('click', function(){
				var pareninfo = $(this).parent().parent().next();
				if( pareninfo.length > 0 ){
					pareninfo.slideToggle();
					$(this).hasClass('am-icon-plus-square')?$(this).removeClass('am-icon-plus-square').addClass('am-icon-minus-square'):$(this).removeClass('am-icon-minus-square').addClass('am-icon-plus-square');
				}
			});
		};
	
		o2o.request({
			url: o2o.path.customerQueryAreas,
			noWin: true,
			data: {
				type: type
			},
			success: function(respones) {
				var data = [],
					list = respones.list;
				for (var i = 0; i < list.length; i++) {
					var tree = {};
					if (!$.trim(list[i].parentId)) {
						tree.pid = 0;
					} else {
						tree.pid = list[i].parentId;
					}
					tree.id = list[i].areaId;
					tree.text = list[i].areaName;
					data.push(tree);
					//areas[list[i].areaId] = list[i].parentId;
				}
	
				var treedata = o2o.getTree(data, respones.areaId),
					$div = $('<div></div>');
				$(treedata).each(function() {
					var $panel = $('<div class="am-panel am-panel-default"></div>'),
						$hd = $('<div class="am-panel-hd am-cf">' +
							'<label class="am-fl"><span class="am-icon am-icon-minus-square"></span>' + this.text + '</label>' +
							'<table class="am-table am-fr data-tr" id="alarm'+this.id+'">' +
							'</table>' +
							'</div>'),
						$bd = $('<div class="am-panel-bd"></div>'),
						$ul = $('<ul></ul>');
					$(this.children).each(function() {
						var treehtml = render(this);
						$ul.append(treehtml);
					});
					$bd.append($ul);
					$panel.append($hd);
					$panel.append($bd);
					$div.append($panel);
				});
				content.html($div);
				itemEvent();
				getData(); 
			},
	
			fail: function(code, error) {
				o2o.prompt(error);
			}
		});
	},

	tpl = Handlebars.compile(
		
		'<tr>' +
		'<td><span style="color:#666;">警情小计</span>（<span class="am-text-danger">{{allAlarm}}</span>）</td>' +
		'<td>布撤防（<span class="am-text-warning">{{defenceAlarm}}</span>）</td>' +
		'<td>警告（<span class="am-text-warning">{{exceptionAlarm}}</span>）</td>' +
		'</tr>' +
		'<tr>' +
		'<td></td>' +
		'<td>离线（<span class="am-text-warning">{{unlineAlarm}}</span>）</td>' +
		'<td>警情（<span class="am-text-warning">{{baseAlarm}}</span>）</td>' +
		'</tr>' +
		'<tr>' +
		'<td></td>' +
		'<td>旁路（<span class="am-text-warning">{{bypassAlarm}}</span>）</td>' +
		'<td></td>' +
		'</tr>' +
		'<tr>' +
		'<td><span style="color:#666;">处警小计</span>（<span class="am-text-danger">{{sendAlarm}}</span>）</td>' +
		'<td>误报（<span class="am-text-warning">{{misAlarm}}</span>）</td>' +
		'<td>真实（<span class="am-text-warning">{{normalAlarm}}</span>）</td>' +
		'</tr>' 
	),
		
	getData = function(){
		o2o.request({
			url: o2o.path.dataQueryAlarmStatistics,
			data:{
				searchType:$('input[name=type]:checked').val()
			},
			success: function(respones) {
				$(respones.alarmCount).each(function(){
					$('#alarm'+this.areaId).html(tpl(this));
				});
			},
	
			fail: function(code, error) {
				o2o.prompt(error);
			}
		});
	},
	
	init = function() {
		writeHTML();
		$('input[name=type]').on('change', function() {
			getData();
		});
	}();
}, false);