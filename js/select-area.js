var downhtml = $('<div></div>'),

downselectHtml = $('<div id="customerSchedulingArea"></div>'),

formhtml = "",

areaSelect = "", 

renderMenu = function(menu, parent) {
	var el = $(
		'          <div class="am-cf am-margin-left-lg am-margin-right-sm">' +
		'            <input id="radio' + menu.id + '" type="radio" name="r" value="' + menu.id + '"><label for="radio' + menu.id + '" class="am-fl">' + menu.text + '</label>' +
		'          </div>');
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
};

//获取树形节点
o2o.request({
	url: o2o.path.customerQueryAreas,
	noWin: true,
	success: function(respones) {
		var data = [],
			list = respones.list;
		$(respones.list).each(function(){
			$('#areaIdsStr').append('<option value="'+this.areaId+'">'+this.areaName+'</option>');
			areaSelect += '<div class="li-tnt">' +
				'    <input id="' + this.areaId + '" name="areaselect" type="checkbox" value="' + this.areaId + '" data-name="' + this.areaName + '">' +
				'    <label for="' + this.areaId + '">' + this.areaName + '</label>' +
				'</div>';
		
			if (areaId == this.areaId) {
				$('#node').val(this.areaName);
			}
			var tree = {};
			if (!$.trim(this.parentId)) {
				tree.pid = 0;
			} else {
				tree.pid = this.parentId;
			}
			tree.id = this.areaId;
			tree.text = this.areaName;
			data.push(tree);
		});
		var treedata = o2o.getTree(data, respones.areaId);
		$(treedata).each(function() {
			var $panel = $('<div class="am-panel am-panel-default"></div>'),
				$hd = $('<div class="am-panel-hd am-cf">' +
					'<input id="radio' + this.id + '" type="radio" name="r" value="' + this.id + '"><label for="radio' + this.id + '" class="am-fl">' + this.text + '</label>' +
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
			downselectHtml.append($panel);
		});
		downhtml.append(downselectHtml);
		formhtml = downhtml.html();

		var b = false;
		$(employee.employeeRoleDOs).each(function() {
			if (6 == parseInt(this.roleId) || 9 == parseInt(this.roleId)) {
				b = true;
			}
		});
		if (b) {
			$('#node').removeClass('input-select');
			return;
		}
		$('#node').downselect({
			data: formhtml,
			confirm: function() {
				var selectNode = $('input[name=r]:checked');
				$('#node').val(selectNode.next().html());
				$('input[name=areaId]').val(selectNode.val());
			}
		});
		$('#areaNamesStr').downselect({
			data: areaSelect,
			confirm: function() {
				var areaIdsStr="",areaNamesStr="";
				console.log($('input[name=areaselect]:checked').length);
				$('input[name=areaselect]:checked').each(function(){
					areaIdsStr += $(this).val()+",";
					areaNamesStr += $(this).next().text()+",";
				});
				if (areaIdsStr.length > 0) {
					areaIdsStr = areaIdsStr.substring(0, areaIdsStr.length - 1);
				}
				if (areaNamesStr.length > 0) {
					areaNamesStr = areaNamesStr.substring(0, areaNamesStr.length - 1);
				}
				$('#areaNamesStr').val(areaNamesStr);
				$('#areaIdsStr').val(areaIdsStr);
			}
		});

	},

	fail: function(code, error) {
		o2o.prompt(error);
	}
});