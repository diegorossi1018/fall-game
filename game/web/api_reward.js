/*

api_reward.js

本ファイルをお使いのゲームで読み込む
ゲーム内で(SU_Api.)adsReward()を呼ぶ

Jquery、IMG画像が別途必要

*/

const DEBUG_MODE = false;
const DIV_HONTAI = "adview";

const PATH_IMG_SOUND1 = "../web/img/sound_on_btn.png";
const PATH_IMG_SOUND2 = "../web/img/sound_off_btn.png";
const PATH_IMG_CLOSE1 = "../web/img/ads_reward_back_01.png";
const PATH_IMG_CLOSE2 = "../web/img/ads_reward_back_02.png";
const PATH_IMG_BATSU1 = "../web/img/btn_close.png";
const PATH_IMG_BATSU2 = "../web/img/btn_close_1.png";

var sugotoku = parent.location.href.indexOf("https://sugotoku");
const URL_ACCELIA_REQUEST = -1 != sugotoku ? 
	//"https://acceliaad.durasite.net/A-affiliate2/mobile?site=91&keyword=h5games_1&ctype=application/json" : 	//STG
	//"https://acceliaad.durasite.net/A-affiliate2/mobile?site=91&keyword=h5games_prd01&ctype=application/json";	//本番
	"https://acceliaad.durasite.net/A-affiliate2/mobile?site=91&keyword=yahoo_game_test&ctype=application/json" :
	"https://acceliaad.durasite.net/A-affiliate2/mobile?site=91&keyword=yahoo_game_test&ctype=application/json";
var URL_ACCELIA_RES_CONTENT = "";
var URL_ACCELIA_RES_START = "";
var URL_ACCELIA_RES_END = "";
var URL_ACCELIA_RES_LPCLICK = "";
var URL_ACCELIA_RES_LPIMAGE = "";

var WINDOW_WIDTH = 480;
var WINDOW_HEIGHT = 600;
var SCREEN_WIDTH = 480;
var SCREEN_HEIGHT = 320;
var callback_success = null;
var callback_error = null;

var isLpImageClick = false;
var isMute = 0;	//0:ミュートではない 1:ミュート

//アクセリア様のAPI①：動画URLをリクエストする
function requestAd()
{
	console.log("-- requestAd --");
	$.ajax({
		type : "get",
		url : URL_ACCELIA_REQUEST,
	//	dataType: 'text',
		async : true,
		success : function(jsondata) {
			console.log(jsondata);
			URL_ACCELIA_RES_CONTENT = jsondata.contentUrl;
			URL_ACCELIA_RES_START = jsondata.playStartUrl;
			URL_ACCELIA_RES_END = jsondata.playEndUrl;
			URL_ACCELIA_RES_LPCLICK = jsondata.lpClickUrl;
			URL_ACCELIA_RES_LPIMAGE = jsondata.lpImageUrl;
			
			document.getElementById("ad_movie_div_a").href = URL_ACCELIA_RES_LPCLICK;
			document.getElementById("ad_movie_div_img").src = URL_ACCELIA_RES_LPIMAGE;
			adsRewardLoad();
		},
		error : function(a,b,c) {
			console.log("ERROR - AJAX REQUEST AD");
			document.getElementById("reward_ad").style.display = "none";
			if( callback_success != null ) callback_success();
			console.log(a,b,c);
		},
		complete : function() {
			console.log("--complete requestAd --");
		}
	});
}

//アクセリア様のAPI④：動画再生時に呼ぶ
function startAd()
{
	console.log("--startAd --");
	$.ajax({
		type : "get",
		url : URL_ACCELIA_RES_START,
		async : true,
		success : function(jsondata) {
			console.log(jsondata);
		},
		error : function(a,b,c) {
			console.log(a,b,c);
		},
		complete : function() {
			console.log("--complete startAd --");
		}
	});
}

//アクセリア様のAPI⑤：動画終了時に呼ぶ
function endAd()
{
	console.log("-- endAd --");
	$.ajax({
		type : "get",
		url : URL_ACCELIA_RES_END,
		async : true,
		success : function(jsondata) {
			console.log(jsondata);
		},
		error : function(a,b,c) {
			console.log(a,b,c);
		},
		complete : function() {
			console.log("--complete endAd --");
		}
	});
}

//リワード広告のための諸準備
function initReward() {
	
	var hontai = document.getElementById( DIV_HONTAI );
	
	//リワード広告要素
	var element = document.createElement('div');
	element.id  = "reward_ad";
	element.style.width  = WINDOW_WIDTH+"px";
	element.style.height = WINDOW_HEIGHT+"px";
	element.style.backgroundColor = "#000000";
	element.style.position = "absolute";
	element.style.display = "none";
	
	element.style.userSelect = "none"; /* CSS3 */
	element.style.mozUserSelect = "none"; /* Firefox */
	element.style.webkitUserSelect = "none"; /* Safari、Chromeなど */
	element.style.msUserSelect = "none"; /* IE10かららしい */

	//動画部分
	var ad_movie = document.createElement('div');
	ad_movie.id  = "ad_movie";
	ad_movie.style.width  = SCREEN_WIDTH+"px";
	ad_movie.style.height = SCREEN_HEIGHT+"px";
	ad_movie.style.position = "absolute";
	ad_movie.style.top = 30+"px";
	ad_movie.style.pointerEvents = "none";	//操作無効
	
	//動画本体(yPlayer)
	var ad_movie_hontai = document.createElement('div');
	ad_movie_hontai.id  = "ad_movie_hontai";
	ad_movie_hontai.style.position = "absolute";
	
	//クリック用バナー
	var ad_movie_div = document.createElement('div');
	ad_movie_div.id  = "ad_movie_div";
	ad_movie_div.style.width  = SCREEN_WIDTH+"px";
	ad_movie_div.style.height = 120+"px";
	ad_movie_div.style.position = "absolute";
	ad_movie_div.style.top = (30+SCREEN_HEIGHT)+"px";
	ad_movie_div.style.cursor = "pointer";
	
	//aタグ
	var ad_movie_div_a = document.createElement('a');
	ad_movie_div_a.id  = "ad_movie_div_a";
	ad_movie_div_a.target = "_blank";
	ad_movie_div_a.style.width = "100%";
	ad_movie_div_a.style.height = "100%";
	ad_movie_div_a.style.display = "flex";
	ad_movie_div_a.style.alignItems = "center";
	ad_movie_div_a.style.justifyContent = "center";
	
	//imgタグ
	var ad_movie_div_img = document.createElement('img');
	ad_movie_div_img.id  = "ad_movie_div_img";
	//ad_movie_div_img.style.width = "auto";
	//ad_movie_div_img.style.height = "auto";
	ad_movie_div_img.style.width = SCREEN_WIDTH+"px";
	ad_movie_div_img.style.height = 120+"px";
	ad_movie_div_img.setAttribute("draggable","false");
	
	//動画タイマー
	var ad_timer = document.createElement('div');
	ad_timer.id  = "ad_timer";
	ad_timer.innerHTML  = "1:23:45";
	ad_timer.style.position = "absolute";
	ad_timer.style.textAlign = "center";
	ad_timer.style.width  = "100%";
	ad_timer.style.color  = "white";
	ad_timer.style.top = 85+"%";
	ad_timer.style.display = "none";
	
	//ミュート
	var ad_mute = document.createElement('div');
	ad_mute.id  = "ad_mute";
	ad_mute.style.position = "absolute";
	ad_mute.style.textAlign = "center";
	ad_mute.style.bottom = "20px";
	ad_mute.style.right = "20px";
	ad_mute.style.cursor = "pointer";
	
	var ad_mute_img = document.createElement('img');
	ad_mute_img.id = "ad_mute_img";
	ad_mute_img.src = PATH_IMG_SOUND1;
	ad_mute_img.style.width = "50px";
	ad_mute_img.style.height = "50px";
	ad_mute_img.setAttribute("draggable","false");
	
	
	//ボタン部分(閉じる）
	var ad_close = document.createElement('div');
	ad_close.id  = "ad_close";
	ad_close.style.position = "absolute";
	ad_close.style.textAlign = "center";
	ad_close.style.width  = "100%";
	ad_close.style.top = 80+"%";
	
	var ad_close_img = document.createElement('img');
	ad_close_img.id = "ad_close_img";
	ad_close_img.src = PATH_IMG_CLOSE1;
	ad_close_img.style.width = "auto";
	ad_close_img.style.height = "auto";
	ad_close_img.style.cursor = "pointer";
	ad_close_img.setAttribute("draggable","false");
	
	
	//ボタン部分(バツ）
	var ad_batsu = document.createElement('div');
	ad_batsu.id  = "ad_batsu";
	ad_batsu.style.position = "absolute";
	ad_batsu.style.top = 0+"%";
	ad_batsu.style.left = 93+"%";
	
	var ad_batsu_img = document.createElement('img');
	ad_batsu_img.id = "ad_batsu_img";
	ad_batsu_img.src = PATH_IMG_BATSU1;
	ad_batsu_img.style.width = "30px";
	ad_batsu_img.style.height = "30px";
	ad_batsu_img.style.cursor = "pointer";
	ad_batsu_img.setAttribute("draggable","false");
	ad_batsu_img.onmousedown = function(){ //範囲内を押した
		ad_batsu_img.src = PATH_IMG_BATSU2;
	};
	ad_batsu_img.onmouseout = function(){ //範囲外に出た
		ad_batsu_img.src = PATH_IMG_BATSU1;
	};
	
	
	element.appendChild(ad_movie);
		ad_movie.appendChild(ad_movie_hontai);
	element.appendChild(ad_movie_div);
		ad_movie_div.appendChild(ad_movie_div_a);
		ad_movie_div_a.appendChild(ad_movie_div_img);
	element.appendChild(ad_timer);
	element.appendChild(ad_mute);
		ad_mute.appendChild(ad_mute_img);
	element.appendChild(ad_close);
		ad_close.appendChild(ad_close_img);
	element.appendChild(ad_batsu);
		ad_batsu.appendChild(ad_batsu_img);
	
	hontai.appendChild(element);
	
	
	$('#ad_movie_div').click(function() {
		isLpImageClick = true;
	});
	
	$('#ad_mute').click(function() {
		isMute = (isMute+1)%2;
		document.getElementById("ad_mute_img").src = [PATH_IMG_SOUND1,PATH_IMG_SOUND2][isMute];
		if( isMute == 1 ){
			ytPlayer.mute();
		}
		else{
			ytPlayer.unMute();
		}
		
	});
	
	$('#ad_close_img').click(function() {
		ytPlayer.pauseVideo();
		document.getElementById("reward_ad").style.display = "none";
		if( callback_success != null ) callback_success();
		
		if( isLpImageClick == false ){
			endAd();
		}
	});
	
	ad_close_img.onmousedown = function(){ //範囲内を押した
		ad_close_img.src = PATH_IMG_CLOSE2;
	};
	ad_close_img.onmouseout = function(){ //範囲外に出た
		ad_close_img.src = PATH_IMG_CLOSE1;
	};
	
	$('#ad_batsu_img').click(function() {
		ytPlayer.pauseVideo();
		document.getElementById("reward_ad").style.display = "none";
		if( callback_error != null ) callback_error();
	});
	
	initYoutube();
	
	api_reward_update();
	
}

// IFrame Player API の読み込み
function initYoutube() {
	var tag = document.createElement('script');
	tag.src = "https://www.youtube.com/iframe_api";
	var firstScriptTag = document.getElementsByTagName('script')[0];
	firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
}

// API読込後自動実行。YouTubeの埋め込み
function onYouTubeIframeAPIReady() {
	ytPlayer = new YT.Player(
		'ad_movie_hontai', // 埋め込む場所の指定
		{
			width: SCREEN_WIDTH, // プレーヤーの幅
			height: SCREEN_HEIGHT, // プレーヤーの高さ
			//videoId: 'MoWDgckQ_bk', // YouTubeのID(とりあえず適当に指定)
			videoId: '9Z0tRJ0TZCk', // YouTubeのID(とりあえず適当に指定)
			events: {
				'onReady': onPlayerReady, // プレーヤーの準備ができたときに実行
				'onStateChange': onPlayerStateChange // プレーヤーの状態が変更されたときに実行
			},/*
			playerVars: {
				'html5': 1
			},*/
			playerVars: {
				html5: 1,
				autoplay : 0,
				rel: 0, // 再生終了後に関連動画を表示するかどうか設定
				start : 0, //開始位置
				showinfo : 0,	//タイトル非表示
				autohide : 1,
				playsinline : 1,
				iv_load_policy : 3,	//アノテーション非表示
				controls : 0 //再生バーの表示有無
			}
		}
	);
}

function onPlayerReady(event) {
	// 動画再生
	console.log('準備完了');
	event.target.playVideo();
	event.target.pauseVideo();
}

// プレーヤーの状態が変更されたとき
function onPlayerStateChange(event) {
	// 現在のプレーヤーの状態を取得
	var ytStatus = event.data;
	// 再生終了したとき
	if (ytStatus == YT.PlayerState.ENDED) {
		console.log('再生終了');
		document.getElementById("ad_close").style.display = "block";
		document.getElementById("ad_batsu").style.display = "none";
		document.getElementById("ad_timer").style.display = "none";
		document.getElementById("ad_mute").style.display = "none";
	}
	// 再生中のとき
	if (ytStatus == YT.PlayerState.PLAYING) {
		console.log('再生中');
		document.getElementById("ad_movie").style.display = "block";
		document.getElementById("ad_movie_div").style.display = "block";
		document.getElementById("ad_timer").style.display = "block";
		document.getElementById("ad_mute").style.display = "block";
		if( document.getElementById("ad_close").style.display == "none" ){
			document.getElementById("ad_batsu").style.display = "block";
		}
	}
	// 停止中のとき
	if (ytStatus == YT.PlayerState.PAUSED) {
		console.log('停止中');
	}
	// バッファリング中のとき
	if (ytStatus == YT.PlayerState.BUFFERING) {
		console.log('バッファリング中');
	}
	// 頭出し済みのとき
	if (ytStatus == YT.PlayerState.CUED) {
		console.log('頭出し済み');
		ytPlayer.playVideo();
	}
}

//動画リワード広告を出力する {引数は連想配列}
//第一引数 : btnString1	String		ボタン押下前
//第二引数 : btnString2	String		ボタン押下後
//第三引数 : callback_s	Callback	閉じるボタン押下時実行される
//第四引数 : callback_e	Callback	バツボタン押下時実行される
//第五引数 : ismuted	Boolean		true を引数に渡すと消音
function adsReward( _option ) {
	
	if( typeof(ytPlayer.cueVideoById) == "undefined" ){
		console.log("ytPlayer undefined, try after.");
		return;
	}
	
	callback_success = _option.callback_s;
	callback_error   = _option.callback_e;
	isLpImageClick = false;
	
	if(_option.btnString1 != null){
		var ad_close_img = document.getElementById("ad_close_img");
		ad_close_img.src = _option.btnString1;
		
		ad_close_img.onmousedown = function(){ //範囲内を押した
			ad_close_img.src = _option.btnString2;
		};
		ad_close_img.onmouseout = function(){ //範囲外に出た
			ad_close_img.src = _option.btnString1;
		};
	}
	
	//var userAgent = navigator.userAgent;
	//if (userAgent.indexOf('msie') !== -1 || userAgent.indexOf('trident') !== -1) {
	//	//IEの場合はhtml5モードが1だとmuteが機能しないらしい
	//}else{
		if( isMute == 1 ){
			ytPlayer.mute();
		}
		else{
			ytPlayer.unMute();
		}
	//}
	
	//動画URLを要求し、通信完了後のコールバックでadsRewardLoad()を実行
	requestAd();
	
	//各要素の表示非表示
	document.getElementById("reward_ad").style.display = "block";
	document.getElementById("ad_movie").style.display = "none";
	document.getElementById("ad_movie_div").style.display = "none";
	document.getElementById("ad_timer").style.display = "none";
	document.getElementById("ad_mute").style.display = "none";
	document.getElementById("ad_close").style.display = "none";
	document.getElementById("ad_batsu").style.display = "none";
	
}

//requestAd() のコールバック内で実行。youtube動画を読み込む
function adsRewardLoad() {
	
	startAd();
	
	var videoId = function(){
		var mozi = URL_ACCELIA_RES_CONTENT;
		return mozi.substr(mozi.indexOf("?v=")+3);
	}();
	
	ytPlayer.cueVideoById({
		'html5': 1,
		'videoId': videoId
	});
	
}

//ご使用の端末を確認
function deviceCheck() {
	var ua = navigator.userAgent;
	if(ua.indexOf('iPhone') > 0 || ua.indexOf('iPod') > 0 || ua.indexOf('Android') > 0 && ua.indexOf('Mobile') > 0){
		return 'SmartPhone';
	}else if(ua.indexOf('iPad') > 0 || ua.indexOf('Android') > 0){
		return 'Tablet';
	}else{
		return 'PC';
	}
}

//動画再生タイマーを更新
function ad_timer_update() {
	if( typeof(ytPlayer) != "undefined" && 
		typeof(ytPlayer.getPlayerState) != "undefined" && 
		typeof(ytPlayer.getDuration) != "undefined" && 
		ytPlayer.getPlayerState() == YT.PlayerState.PLAYING ) {
		
		function zeroPadding(number) {
			return ("0" + number).slice(-2)
		}
		
		var timeDuration = ytPlayer.getDuration();
		var timeCurrent  = ytPlayer.getCurrentTime();
		var timeText = 
			zeroPadding(Math.floor(timeCurrent  / 60)) + ":" + zeroPadding(Math.floor(timeCurrent  % 60)) +" / " +
			zeroPadding(Math.floor(timeDuration / 60)) + ":" + zeroPadding(Math.floor(timeDuration % 60)) ;
		
		document.getElementById("ad_timer").innerHTML = timeText;
	}
}

//毎フレーム行う処理
function api_reward_update() {
	
	ad_timer_update();
	
	requestAnimationFrame(api_reward_update);
	
}

WINDOW_WIDTH  = deviceCheck()=="PC" ? 480 : window.screen.width;
WINDOW_HEIGHT = deviceCheck()=="PC" ? 600 : WINDOW_WIDTH * 1.25;
SCREEN_WIDTH  = deviceCheck()=="PC" ? 480 : window.screen.width;
SCREEN_HEIGHT = deviceCheck()=="PC" ? 320 : SCREEN_WIDTH * 0.75;
console.log( "device : "+deviceCheck() );

initReward();

