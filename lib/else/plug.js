var DownselectEvent = {
    init: function(callback){
        setTimeout(function(){
        	$('[data-downselect]').off('click').on('click', function(){
	            var _self = $(this),
	                type = _self.data('downselect-type') || "select",
	                tagName = this.tagName;
	                data = eval(""+_self.data('downselect')+"") || [],
	                multiple = _self.attr('multiple'),
	                options = {},
	                rel = _self.data('result-id'),
	                relName = _self.data('result-name'),
	                tpl = Handlebars.compile(
	                	
	                '<div class="downselect" id="downselect">'+
	                '  <div class="panel" style="display:none;">'+
	                '    <div class="panel-body">'+
                    '    {{#each data}}'+
                    '        <div class="li-tnt">'+
                    '           <input id="{{id}}" name="downselect" type="{{type}}" value="{{id}}">'+
                    '           <label for="{{id}}">{{label}}</label>'+
                    '        </div>'+
                    '    {{/each}}'+
	                '    </div>'+
	                '    <div class="panel-footer am-text-center">'+
	                '      <a class="am-btn am-btn-default cancel">取消</a>'+
	                '      <a class="am-btn am-btn-default am-margin-left-lg confirm">确认</a>'+
	                '    </div>'+
	                '  </div>'+
	                '</div>'
	                );
	
	
	            if(type == 'radio' || type == 'select'){
	                for (var i = 0; i < data.length; i++) {
	                    data[i].type="radio";
	                };
	            }
	            if(type == "checkbox"){
	                for (var i = 0; i < data.length; i++) {
	                    data[i].type="checkbox";
	                };
	            }
	
	            if($('#downselect')){
	                $('#downselect').remove();
	            }
	            options.data = data;
	            $('body').append(tpl(options));
            	$('#downselect>.panel').fadeIn();
	            $('#downselect>.panel>.panel-footer>.cancel').on('click', function(){
	                $('#downselect').remove();
	            });
	            $('#downselect>.panel>.panel-footer>.confirm').off('click').on('click', function(){
	                var str ="",
	                    labelStr = "";
	                $('input[name=downselect]:checked').each(function(){
	                    str += $(this).val()+",";
	                    labelStr += $(this).next().html()+",";
	                });
	                if($.trim(str)){
	                    str = str.substring(0, str.length-1);
	                }
	                if($.trim(labelStr)){
	                    labelStr = labelStr.substring(0, labelStr.length-1);
	                }
	                if( !$.trim(relName) && tagName=="INPUT" ){
	                    _self.val(labelStr);
	                }else{
	                    $(relName).html(labelStr);
	                }
	
	                $(rel).val(str);
	                if(callback){
	                    callback();
	                }
	                $('#downselect').remove();
	            });
	        });
        }, 200);
        
    }
};
$(function(){
    DownselectEvent.init();
});
$.fn.extend({
    downselect:function(options){
        $(this).off('click').on('click',function(){
            if($('#downselect')){
                $('#downselect').remove();
            }
            var modal = '<div class="downselect" id="downselect">'+
                '  <div class="panel" style="display:none;">'+
                '    <div class="panel-body">'+options.data+'</div>'+
                '    <div class="panel-footer am-text-center">'+
                '      <a class="am-btn am-btn-default cancel">取消</a>'+
                '      <a class="am-btn am-btn-default am-margin-left-lg confirm">确认</a>'+
                '    </div>'+
                '  </div>'+
                '</div>';

            $('body').append(modal);
            $('#downselect>.panel').fadeIn();
            if(options.init){
                options.init();
            }
            $('#downselect>.panel>.panel-footer>.cancel').on('click', function(){
                $('#downselect').remove();
            });
            $('#downselect>.panel>.panel-footer>.confirm').off('click').on('click', function(){
                if(options.confirm){
                    options.confirm();
                }
                $('#downselect').remove();
            });
        });
    },

    showDownselect:function(options){
        if($('#downselect')){
                $('#downselect').remove();
            }
        var modal = '<div class="downselect" id="downselect">'+
            '  <div class="panel" style="display:none;">'+
            '    <div class="panel-body">'+options.data+'</div>'+
            '    <div class="panel-footer am-text-center">'+
                '      <a class="am-btn am-btn-default cancel">取消</a>'+
                '      <a class="am-btn am-btn-default am-margin-left-lg confirm">确认</a>'+
            '    </div>'+
            '  </div>'+
            '</div>';

        $('body').append(modal);
    	$('#downselect>.panel').fadeIn(400);
        if(options.init){
            options.init();
        }
        $('#downselect>.panel>.panel-footer>.cancel').on('click', function(){
            $('#downselect').remove();
        });
        $('#downselect>.panel>.panel-footer>.confirm').off('click').on('click', function(){
            if(options.confirm){
                options.confirm();
            }
            $('#downselect').remove();
        });
    }
});

$.extend({
    downselectInit:function(callback){
        DownselectEvent.init(function(){
            if(callback){
                callback();
            }
        });
    }
});