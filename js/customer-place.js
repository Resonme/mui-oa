document.addEventListener('plusready', function() {
	var content = $('#customerPlace'),

		renderMenu = function(menu, parent) {
			if( !menu.no || !$.trim(menu.no)){
				menu.no = '-';
			}
			var el = $(
				'<div class="am-cf am-margin-left-lg am-margin-right-sm">' +
				'   <label class="am-fl">(' + menu.no + ') ' + menu.text + '</label>' +
				'   <a class="am-fr mui-btn mui-btn-sm mui-btn-primary placeEdit" href="customer-place-add.html?areaId=' + menu.id + '">编辑</a>' +
				'</div>');
			//'<a href="' + menu.link  +'">' + menu.name + '</a>'
			if(!menu.children || menu.children.length == 0) {
				el = $(
					'<div class="am-cf am-margin-left-lg am-margin-right-sm">' +
					'   <label class="am-fl">(' + menu.no + ') ' + menu.text + '</label>' +
					'   <a class="am-fr mui-btn mui-btn-sm mui-btn-primary placeEdit" href="customer-place-add.html?areaId=' + menu.id + '">编辑</a>' +
					'   <button class="am-fr mui-btn mui-btn-sm mui-btn-danger placeRemove" style="margin-right:10px;" data-id="' + menu.id + '">删除</button>' +
					'</div>');
				$(parent).append(el);
				return parent;
			}
			$(parent).append(el);
			var ul = $('<ul/>');
			for(var i = 0; i < menu.children.length; ++i) {
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

		removeBtn = function() {
			$('button.placeRemove').on('click', function() {
				var areaId = $(this).data('id');
				o2o.confirm('确认删除该区域？', function(msg) {
					if(msg == "yes") {
						o2o.request({
							url: o2o.path.customerModifyArea,
							data: {
								areaId: areaId,
								isDelete: 1
							},
							success: function() {
								o2o.prompt('删除成功', function() {
									window.location.reload();
								});
							},
							fail: function(code, error) {
								o2o.prompt(error);
							}
						});
					}
				});
			});
		},

		getTree = function(data, areaId) {
			var pos = {};
			var tree = [];
			var i = 0;

			var renderMenu = function(menu) {
				if(!menu.children || menu.children.length == 0) {
					return parent;
				}
				for(var i = 0; i < menu.children.length; ++i) {
					if(areaId == menu.children[i].id) {
						tree = menu.children[i];
						break;
					} else {
						renderMenu(menu.children[i]);
					}
				}
			};
			while(data.length != 0) {
				if(data[i].id == parseInt(JSON.parse(localStorage.loginInfo).areaId)) {
					tree.push({
						id: data[i].id,
						text: data[i].text,
						no: data[i].no,
						children: []
					});
					pos[data[i].id] = [tree.length - 1];
					data.splice(i, 1);
					i--;
				} else {
					var posArr = pos[data[i].pid];
					if(posArr != undefined) {

						var obj = tree[posArr[0]];
						for(var j = 1; j < posArr.length; j++) {
							obj = obj.children[posArr[j]];
						}

						obj.children.push({
							id: data[i].id,
							text: data[i].text,
							no: data[i].no,
							children: []
						});
						pos[data[i].id] = posArr.concat([obj.children.length - 1]);
						data.splice(i, 1);
						i--;
					}
				}
				i++;
				if(i > data.length - 1) {
					i = 0;
				}
			}

			if($.trim(areaId)) {
				for(var i = 0; i < tree.length; i++) {
					var areas = renderMenu(tree[i]);
					if($.trim(areas) && areas.length > 0) {
						tree = areas;
						break;
					}
				}
			}
			return tree;
		};

	o2o.request({
		url: o2o.path.customerQueryAreas,
		success: function(respones) {
			var data = [],
				list = respones.list;
			for(var i = 0; i < list.length; i++) {
				var tree = {};
				if(!$.trim(list[i].parentId)) {
					tree.pid = 0;
				} else {
					tree.pid = list[i].parentId;
				}
				tree.id = list[i].areaId;
				tree.text = list[i].areaName;
				tree.no = list[i].areaNo || "";
				data.push(tree);
			}
			var treedata = getTree(data, respones.areaId),
				$div = $('<div></div>');
			console.log(treedata);
			$(treedata).each(function() {
				if( !this.no || !$.trim(this.no)){
					this.no = '-';
				}
				var $panel = $('<div class="am-panel am-panel-default"></div>'),
					$hd = $('<div class="am-panel-hd am-cf">' +
						'<label class="am-fl">(' + this.no + ') ' + this.text + '</label>' +
						'            <a class="am-fr mui-btn mui-btn-sm mui-btn-primary placeEdit" href="customer-place-add.html?areaId=' + this.id + '">编辑</a>' +
						'</div>'),
					$bd = $('<div class="am-panel-bd"></div>'),
					$ul = $('<ul></ul>');
				if(!this.children || this.children.length == 0) {
					$hd = $('<div class="am-panel-hd am-cf">' +
						'<label class="am-fl">(' + this.no + ') ' + this.text + '</label>' +
						'            <a class="am-fr mui-btn mui-btn-sm mui-btn-primary placeEdit" href="customer-place-add.html?areaId=' + this.id + '">编辑</a>' +
						'            <button class="am-fr mui-btn mui-btn-sm mui-btn-danger placeRemove" style="margin-right:10px;" data-id="' + this.id + '">删除</button>' +
						'</div>');
				}
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
			removeBtn();
		},

		fail: function(code, error) {
			o2o.prompt(error);
		}
	});
}, false);