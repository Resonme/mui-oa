var shopRepairDo = (function(){
	var NfcAdapter;
    var NdefRecord;
    var NdefMessage;
	var shopId;
    var repairId;
    var waiting ;
    var longitude = o2o.getUrlParam('longitude');
	var latitude = o2o.getUrlParam('latitude');
	var cardGps = o2o.getUrlParam('cardGps') || 50;
    var readyRead = false;
    var isNfc = 0;
    function listenNFCStatus() {
    	var cw = plus.webview.currentWebview();
    	shopId = cw.shopId;
    	repairId = cw.repairId;
    	longitude = cw.longitude;
		latitude = cw.latitude;
		cardGps = cw.cardGps || 100;
		var u = navigator.userAgent; 
		var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
    	if(isiOS){
			showToast("设备不支持NFC！");
			isNfc = 1;
			return;
		}
        try{
            var main = plus.android.runtimeMainActivity();
            var Intent = plus.android.importClass('android.content.Intent');
            var Activity = plus.android.importClass('android.app.Activity');
            var PendingIntent = plus.android.importClass('android.app.PendingIntent');
            var IntentFilter = plus.android.importClass('android.content.IntentFilter');
            NfcAdapter = plus.android.importClass('android.nfc.NfcAdapter');
            var nfcAdapter = NfcAdapter.getDefaultAdapter(main);
            var intent = new Intent(main, main.getClass());
            intent.addFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP);
            var pendingIntent = PendingIntent.getActivity(main, 0, intent, 0);
            var ndef = new IntentFilter("android.nfc.action.TECH_DISCOVERED");
            ndef.addDataType("*/*");
            var intentFiltersArray = [ndef];
            var techListsArray = [
                ["android.nfc.tech.IsoDep"],
                ["android.nfc.tech.NfcA"],
                ["android.nfc.tech.NfcB"],
                ["android.nfc.tech.NfcF"],
                ["android.nfc.tech.Nfcf"],
                ["android.nfc.tech.NfcV"],
                ["android.nfc.tech.NdefFormatable"],
                ["android.nfc.tech.MifareClassi"],
                ["android.nfc.tech.MifareUltralight"]
            ];
            
            var nfcAdapter = NfcAdapter.getDefaultAdapter(main);
			if(nfcAdapter == null){
				showToast("设备不支持NFC！"); 
				isNfc = 1;
				return;
			}
			if (!nfcAdapter.isEnabled()) {
				showToast("请在系统设置中先启用NFC功能！");
				isNfc = 2;
				return;
			}
			
            document.addEventListener("newintent",
                function() {
                    setTimeout(handle_nfc_data1, 1000);
                }, false);
            document.addEventListener("pause", function(e) {
                if (nfcAdapter) {
                    nfcAdapter.disableForegroundDispatch(main);
                }
            }, false);
            document.addEventListener("resume", function(e) {
                if (nfcAdapter) {
                    nfcAdapter.enableForegroundDispatch(main, pendingIntent, intentFiltersArray, techListsArray);
                }
            }, false);
            nfcAdapter.enableForegroundDispatch(main, pendingIntent, intentFiltersArray, techListsArray);
        }catch(e){
            console.error(e);
        }
    }

    function handle_nfc_data1()
    {
        NdefRecord = plus.android.importClass("android.nfc.NdefRecord");
        NdefMessage = plus.android.importClass("android.nfc.NdefMessage");
        var main = plus.android.runtimeMainActivity();
        var intent = main.getIntent();
        console.log("action type:" + intent.getAction());
        if("android.nfc.action.TECH_DISCOVERED" == intent.getAction()){
            if(readyRead){
                __read(intent);
                readyRead = false;
            }
        }
    }
    function showToast(msg){
        plus.nativeUI.toast(msg);
    }

    function __read(intent){
        waiting.setTitle('请勿移开标签\n正在读取数据...');
        var Parcelable = plus.android.importClass("android.os.Parcelable");
        var rawmsgs = intent.getParcelableArrayExtra("android.nfc.extra.NDEF_MESSAGES");
        records = rawmsgs[0].getRecords();
        var result = records[0].getPayload();
        var s = plus.android.newObject("java.lang.String",result).replace(/en/g, '');
        console.log(s);
        //document.getElementById('content').textContent = s;
        waiting.close();
        
        if(shopId == s){
	    	location.href = "shop-repair-doing.html?shopId="+shopId+"&repairId="+repairId+"&cardType=1";
        }else{
        	o2o.prompt('店铺信息有误！');
        }
    }
    document.addEventListener('plusready',listenNFCStatus,false);

    function readData(){
        readyRead = true;
        waiting = plus.nativeUI.showWaiting("请将NFC标签靠近！");
    }

	
	var gps = function(){
		
		var handleLocationError = function(error) {
		    console.log(error);
			waiting.close();
		    switch(error.code){
		        case 0:
		          o2o.prompt("获取位置信息出错！");
		          break;
		        case 1:
		          o2o.prompt("您设置了阻止该页面获取位置信息！");
		          break;
		        case 2:
		          o2o.prompt("浏览器无法确定您的位置！");
		          break;
		        case 3:
		          o2o.prompt("获取位置信息超时！");
		          break;
		        default:
		          o2o.prompt('不明原因');
		          break;
		    }
		}
		
		if($.trim(longitude) && $.trim(latitude)){
			plus.geolocation.getCurrentPosition( function ( p ) {
				var newP = GPS.gcj_encrypt(p.coords.latitude, p.coords.longitude);
			    var lnglat = new AMap.LngLat(longitude, latitude);
			    var num = lnglat.distance([newP.lon, newP.lat]);
			    waiting.close();
			    if(num <= cardGps){ 
			    	//location.href = "shop-repair-doing.html?shopId="+shopId+"&repairId="+repairId+"&cardType=2";
			    	mui.openWindow({
			    		url:'shop-repair-doing.html',
			    		extras:{
			    			shopId:shopId,
			    			repairId:repairId,
			    			cardType:2
			    		}
			    	});
			    }else{
			    	o2o.prompt('请在店铺'+cardGps+'米范围内进行该操作，当前距离'+ Math.round(num) +'米');
			    }
			}, handleLocationError);
		}else{
			waiting.close();
			o2o.prompt('该店铺没有位置信息， 请添加后再进行此操作！');
		}
	};

	$('.nfc>img').off('click').on('click', function(){
		if(isNfc==1){
			o2o.prompt('设备不支持NFC！');
			return;
		}else if(isNfc==2){
			o2o.prompt('请在系统设置中先启用NFC功能！');
			return;
		}
		readData();
	});
	$('.gps>img').on('click', function(){
		waiting = plus.nativeUI.showWaiting("正在获取位置信息！");
		setTimeout(function(){
			gps();
		}, 2000);
	});
	setTimeout(function(){
		$('.gps>img').off('click').on('click', function(){
			waiting = plus.nativeUI.showWaiting("正在获取位置信息！");
			gps(); 
		});
	}, 2000);
	
	
}());
