document.addEventListener('plusready', function() {	
	var content = $('#customerSchedulingArea');

	submitBtn = $('#next'),

	formhtml = "",

	renderMenu = function(menu, parent) {
		var el = $('<input id="radio' + menu.id + '" type="radio" name="r" value="' + menu.id + '"><label for="radio' + menu.id + '">' + menu.text + '</label>');
		$(parent).append(el);
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
	submitCheckEvent = function() {
		submitBtn.on('click', function() {
			var areaId = $('input[name=r]:checked').val(),
				areaName = $('input[name=r]:checked').next().html();
			if (!$.trim(areaId)) {
				o2o.prompt('请选择区域');
				return;
			}
			localStorage.empareaId = areaId;
			window.location.href = "customer-emp-list.html?areaId=" + areaId + "&&parentId=" + areas[areaId];
		});
	},
	getCheckedHistory = function() {
		$('input[value=' + localStorage.empareaId + ']').attr('checked', true);
	},

	areas = [];


	o2o.request({
		url: o2o.path.customerQueryAreas,
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
				areas[list[i].areaId] = list[i].parentId;
			}
			var treedata = o2o.getTree(data, respones.areaId),
				root = $('<div></div>');
			$(treedata).each(function() {
				var $panel = $('<div class="am-panel am-panel-default"></div>'),
					$hd = $('<div class="am-panel-hd">' +
						'<input id="radio' + this.id + '" type="radio" name="r" value="' + this.id + '"><label for="radio' + this.id + '">' + this.text + '</label>' +
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
				root.append($panel);
			});
			content.html(root.html());
			getCheckedHistory();
			submitCheckEvent();
		},

		fail: function(code, error) {
			o2o.prompt(error);
		}
	});

}, false);