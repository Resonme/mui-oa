document.addEventListener('plusready', function() {	
	var tpl = Handlebars.compile(
		'<ul class="am-list am-list-static"> '+
		'{{#each count}}'+
	      '<li onclick="window.location.href=\'customer-business-list.html?shopStyle={{type}}\'"> '+
	        '{{typeName}} <span class="am-text-warning" id="state0"> '+
	         '({{count}}) '+
	         '</span> '+
	        '<span class="am-icon-chevron-circle-right am-fr am-text-primary"></span> '+
	      '</li> '+
	      '{{/each}}'+
	    '</ul>'
	),
	
	list = $('#list'); 
	o2o.request({
		url: o2o.path.queryShopStyleCount,
		success: function(respones) {
			list.html(tpl(respones));
		},
		fail: function(code, error) { 
			o2o.prompt(error);
		}
	});
}, false);